const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
var crypto = require('crypto');

const User = require('../../models/User');
const Wallet = require('../../models/Wallet');
const Verify = require('../../models/Verify');

const nodemailerHost = config.get('nodemailer.host')
const nodemailerPort = config.get('nodemailer.port')
const nodemailerUser = config.get('nodemailer.user')
const nodemailerPass = config.get('nodemailer.pass')

const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  host: nodemailerHost,
  port: nodemailerPort,
  secure: true,
  auth: {
    user: nodemailerUser,
    pass: nodemailerPass
  }
});

// @route    GET api/auth
// @desc     Get user by token
// @access   Private
router.get('/', auth, async (req, res) => {
  User.findById(req.user.id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while finding user."
      });
    else res.send(data);
  });
});

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post(
  '/',
  check('password', 'Password is required').exists(),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      User.findOne({ email }, async (err, user) => {

        if (!user) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        var hash = crypto.createHash('md5').update(password).digest('hex');

        if (hash !== user.user_pass) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        const payload = {
          user: {
            id: user.account_id
          }
        };

        jwt.sign(
          payload,
          config.get('jwtSecret'),
          { expiresIn: '5 days' },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route    GET api/auth/Verify/:wallet
// @desc     Get user by wallet address
// @access   Public
router.get('/wallet/:wallet', async (req, res) => {
  Wallet.findByWallet(req.params.wallet, (err, data) => {
    if (err)
      res.status(500).json({
        errors: [{ msg: err.message || "Some error occurred while creating the User." }]
      });
    else {
      if(data) {
        User.findOne({ account_id: data.masteraccount }, async (err, user) => {

          if(user) {
            const payload = {
              user: {
                id: user.account_id
              }
            };

            jwt.sign(
              payload,
              config.get('jwtSecret'),
              { expiresIn: '5 days' },
              (err, token) => {
                if (err) throw err;
                res.json({ token });
              }
            );
          } else {
            res.json(false);
          }
        })
      } else {
        res.json(false);
      }
    };
  });
});

// @route    GET api/auth/resendcode
// @desc     Recreate varification code
// @access   Private
router.get('/resendcode', auth, async (req, res) => {
  User.findOne({ account_id: req.user.id }, async (err, user) => {

    let verifycode = Math.floor(Math.random()*900000)+100000;

    Verify.create({email: user.email, code: verifycode}, async (err, newcode) => {
      if (err)
        return res.status(500).json({
          errors: [{ msg: err.message || "Some error occurred while creating the User." }]
        });

      var emailContentToClient = {
        from: nodemailerUser,
        to: user.email,
        subject: 'Welcome to Our site!',
        html: `
        <html>
          <body>
            <div class="container" style="text-align: center;">
              <div class="row" style="margin: 20px 0px;">
                <div class="col-md-12">
                  <div class="text-center">
                    Thank you. Please confirm ${verifycode}
                  </div>
                </div>
              </div>
            </div>
          </body>
        </html>`
      }

      transporter.sendMail(emailContentToClient, function (error, body) {
        if(body) {
          res.json({
            success: true
          })
        } else {
          return res.status(500).json({
            errors: [{ msg: "Something was wrong. Try again." }]
          });
        }
      })
    })
  })
});

// @route    POST api/auth/verifyemail
// @desc     Compare verification code
// @access   Private
router.post('/verifyemail', auth, async (req, res) => {
  let { code } = req.body;

  User.findOne({ account_id: req.user.id }, async (err, user) => {
    Verify.compare(user.email, code, async (err, verifycode) => {
      if (err || !verifycode)
        return res.status(500).json({
          errors: [{ msg: "Verification was faild. Try again." }]
        });

      if(verifycode) {
        User.update({verify: 1}, user.account_id, (err, data) => {
          if(data == true) {
            console.log()
            return res.json(true)
          }
        })
      }
    })
  })
});

// @route    POST api/auth/updateuser
// @desc    Change userid
// @access   Private
router.post('/updateuser', auth, async (req, res) => {
  User.update({...req.body}, req.user.id, (err, data) => {
    if (err)
      return res.status(500).json({
        errors: [{ msg: "Change failed. Try again." }]
      });

    if(data == true) {
      return res.json(true)
    }
  })
});

// @route    POST api/auth/email
// @desc    Change email
// @access   Private
router.post('/email', auth, async (req, res) => {
  let { email } = req.body;

  User.update({email, verify: 0}, req.user.id, (err, data) => {
    if (err)
      return res.status(500).json({
        errors: [{ msg: "Email wasn't changed. Try again." }]
      });

    let verifycode = Math.floor(Math.random()*900000)+100000;

    Verify.create({email: email, code: verifycode}, async (err, newcode) => {
      if (err)
        return res.status(500).json({
          errors: [{ msg: err.message || "Some error occurred while creating the User." }]
        });

      var emailContentToClient = {
        from: nodemailerUser,
        to: user.email,
        subject: 'Welcome to Our site!',
        html: `
        <html>
          <body>
            <div class="container" style="text-align: center;">
              <div class="row" style="margin: 20px 0px;">
                <div class="col-md-12">
                  <div class="text-center">
                    Thank you. Please confirm ${verifycode}
                  </div>
                </div>
              </div>
            </div>
          </body>
        </html>`
      }

      transporter.sendMail(emailContentToClient, function (error, body) {
        console.log(body)
      })

      return res.json({success: true})
    })
  })
});

// @route    POST api/auth/changePassword
// @desc    Change password
// @access   Private
router.post('/changePassword', auth, async (req, res) => {
  var { password, currentpassword, account_id } = req.body;

  User.findOne({ account_id }, async (err, user) => {
    var hash = crypto.createHash('md5').update(currentpassword).digest('hex');

    if (hash !== user.user_pass) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    var newhash = crypto.createHash('md5').update(password).digest('hex');

    User.update({user_pass: newhash}, account_id, (err, data) => {
      if (err)
        return res.status(500).json({
          errors: [{ msg: "Change failed. Try again." }]
        });

      if(data == true) {
        return res.json(true)
      }
    })
  })
});

// @route    POST api/auth/password
// @desc    Change password
// @access   Private
router.post('/forgotpassword', async (req, res) => {
  var searchkey = req.body;

  User.findOne(searchkey, async (err, user) => {
    User.findOne({account_id: user.master}, async (err, master) => {
      let newpass = (Math.floor(Math.random()*900000)+100000).toString();
      var hash = crypto.createHash('md5').update(newpass).digest('hex');

      User.update({user_pass: hash}, user.account_id, (err, data) => {
        if (err)
          return res.status(500).json({
            errors: [{ msg: "Change failed. Try again." }]
          });

        var emailContentToClient = {
          from: nodemailerUser,
          to: user.email ? user.email : master.email,
          subject: 'New password',
          html: `
          <html>
            <body>
              <div class="container" style="text-align: center;">
                <div class="row" style="margin: 20px 0px;">
                  <div class="col-md-12">
                    <div class="text-center">
                      ${user.email ? user.email : master.email}
                      Thank you. This is new Password for ${user.userid}
                      ${newpass}
                    </div>
                  </div>
                </div>
              </div>
            </body>
          </html>`
        }

        transporter.sendMail(emailContentToClient, function (error, body) {
          console.log(body)
        })

        res.json({
          success: true
        })
      })
    })
  })
});

module.exports = router;
