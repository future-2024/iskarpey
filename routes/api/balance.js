const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const AccBalance = require('../../models/AccBalance');
const AccBalanceTemp = require('../../models/AccBalanceTemp');
const Logs = require('../../models/Logs');

// @route    GET api/balance
// @desc     Get balance by user
// @access   Private
router.get('/:id', async (req, res) => {
  AccBalance.findById(req.params.id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while finding user."
      });
    else res.send(data);
  });
});

// @route    POST api/balance/updatetempbalance
// @desc     Authenticate user & update temp token for confirmation
// @access   Public
router.post(
  '/updatetempbalance',
  auth,
  async (req, res) => {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    const { newvalue, currentvalue, token, hash } = req.body;

    let newtempbalance = new AccBalanceTemp({
      account_id: req.user.id,
      token: 'YMIR',
      value: newvalue,
      hash: hash
    })

    AccBalanceTemp.create(newtempbalance, (err, data) => {});

    AccBalance.update({value: currentvalue + newvalue}, {account_id: req.user.id, token}, (err, data) => {
      return res.json(true)
    });
  }
);

router.post(
  '/updatebalance',
  auth,
  async (req, res) => {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    const { newvalue, token, hash, message } = req.body;

    AccBalance.update({value: newvalue}, {account_id: req.user.id, token}, (err, data) => {
      if(data == true) {
        Logs.create({
          account_id: req.user.id,
          message, hash,
          date: date+' '+time
        }, async (err, newlog) => {
          return res.json(true)
        })
      }
    });
  }
);

module.exports = router;
