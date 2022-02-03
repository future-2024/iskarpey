const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');
var crypto = require('crypto');

const User = require('../../models/User');
const Wallet = require('../../models/Wallet');
const AccBalance = require('../../models/AccBalance');
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

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  '/',
  check('userid', 'Name is required').notEmpty(),
  // check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userid, email, password, wallet } = req.body;

    try {
      User.findOne({ email }, async (err, data) => {
        if (err)
          return res.status(500).json({
            errors: [{ msg: err.message || "Some error occurred while creating the Tutorial." }]
          });

        if(data) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'User already exists' }] });
        }

        let newuser;

        newuser = new User({
          userid,
          email,
          wallet,
        });

        // const salt = await bcrypt.genSalt(10);

        // newuser.user_pass = await bcrypt.hash(password, salt);

        var hash = crypto.createHash('md5').update(password).digest('hex');

        newuser.user_pass = hash;

        User.create(newuser, (err, createduser) => {
          let newwallet = new Wallet({
            address: wallet,
            masteraccount: createduser.id
          })

          Wallet.create(newwallet, (err, createdwallet) => {});

          let newbalance = new AccBalance({
            account_id: createduser.id,
            token: 'YMIR'
          })

          AccBalance.create(newbalance, (err, createdwallet) => {});

          if (err)
            return res.status(500).json({
              errors: [{ msg: err.message || "Some error occurred while creating the User." }]
            });

          let verifycode = Math.floor(Math.random()*900000)+100000;

          Verify.create({email: email, code: verifycode}, async (err, newcode) => {
            if (err)
              return res.status(500).json({
                errors: [{ msg: err.message || "Some error occurred while creating the User." }]
              });

            var emailContentToClient = {
              from: nodemailerUser,
              to: email,
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

            const payload = {
              user: {
                id: createduser.id
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
          })
        });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.post(
  '/subaccount',
  auth,
  check('userid', 'Name is required').notEmpty(),
  // check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userid, password, wallet } = req.body;

    try {
      User.findOne({ userid }, async (err, data) => {
        if (err)
          return res.status(500).json({
            errors: [{ msg: err.message || "Some error occurred while creating the Tutorial." }]
          });

        if(data) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'User already exists' }] });
        }

        let newuser = new User({
          userid,
          wallet,
          master: req.user.id,
        });

        // const salt = await bcrypt.genSalt(10);

        // newuser.user_pass = await bcrypt.hash(password, salt);

        var hash = crypto.createHash('md5').update(password).digest('hex');

        newuser.user_pass = hash;

        User.create(newuser, (err, createduser) => {
          if(createduser) {
            User.find({master: req.user.id}, (err, users) => {
              if (err)
                return res.status(500).json({
                  errors: [{ msg: err.message || "Some error occurred while creating the User." }]
                });
              res.json({ users });
            });
          } else {
            if (err)
              return res.status(500).json({
                errors: [{ msg: err.message || "Some error occurred while creating the User." }]
              });
          }
        })
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.get(
  '/subaccount',
  auth,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      User.find({master: req.user.id}, (err, users) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the User."
          });
        if(users === null) 
          res.json({ users: [] });
        else
          res.json({ users });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
