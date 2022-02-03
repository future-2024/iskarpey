const mariaDB = require("./DB.js");

const AccBalance = function(wallet) {
  this.account_id = wallet.account_id;
  this.token = wallet.token;
  this.value = 0;
}

AccBalance.findById = (account_id, result) => {
  mariaDB.query(`SELECT * FROM acc_balance WHERE account_id = '${account_id}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length > 0) {
      console.log("found balance: ", res[0]);
      result(null, res[0]);
      return;
    } else {
      console.log("not found balance: ", false);
      result(null, false);
      return;
    }
  });
};

AccBalance.create = (newbalance, result) => {
  let keys = Object.keys(newbalance)
  let insertkey = '(';
  let insertvalue = '(';

  for (var i = 0; i < keys.length; i++) {
    insertkey += keys[i];
    insertvalue += "'"+newbalance[keys[i]]+"'";

    if(i < keys.length - 1){
      insertkey += ', ';
      insertvalue += ', ';
    }
  }

  insertkey += ')';
  insertvalue += ')';
  mariaDB.query(`INSERT INTO acc_balance${insertkey} values${insertvalue}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...newbalance });
  });
}

AccBalance.update = (updatebalance, searchdata, result) => {
  let updatevalue = '';
  let keys = Object.keys(updatebalance)

  for (var i = 0; i < keys.length; i++) {
    updatevalue += keys[i] + '=' + "'" + updatebalance[keys[i]] + "'";

    if(i < keys.length - 1){
      updatevalue += ', ';
    }
  }

  let search = Object.keys(searchdata);

  let searchkey = '';

  for (var i = 0; i < search.length; i++) {
    searchkey += search[i] + " = '" + searchdata[search[i]] + "'";

    if(i < search.length - 1) {
      searchkey += ' and ';
    }
  }

  mariaDB.query(`UPDATE acc_balance SET ${updatevalue} WHERE ${searchkey}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("updated user: ", { id: res.insertId });
    result(null, true);
  });
};

module.exports = AccBalance;