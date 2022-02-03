const mariaDB = require("./DB.js");

const Wallet = function(wallet) {
  this.address = wallet.address;
  this.masteraccount = wallet.masteraccount;
}

Wallet.findByWallet = (wallet, result) => {
  mariaDB.query(`SELECT * FROM wallet WHERE address = '${wallet}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length > 0) {
      console.log("found wallet: ", res[0]);
      result(null, res[0]);
      return;
    } else {
      console.log("not found wallet: ", false);
      result(null, false);
      return;
    }

    // not found Tutorial with the id
    result({ kind: "not_found" }, null);
  });
};

Wallet.create = (newwallet, result) => {
  let keys = Object.keys(newwallet)
  let insertkey = '(';
  let insertvalue = '(';

  for (var i = 0; i < keys.length; i++) {
    insertkey += keys[i];
    insertvalue += "'"+newwallet[keys[i]]+"'";

    if(i < keys.length - 1){
      insertkey += ', ';
      insertvalue += ', ';
    }
  }

  insertkey += ')';
  insertvalue += ')';
  mariaDB.query(`INSERT INTO wallet${insertkey} values${insertvalue}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created user: ", { id: res.insertId, ...newwallet });
    result(null, { id: res.insertId, ...newwallet });
  });
}

module.exports = Wallet;