const { resolveCname } = require('dns');
let mysql = require('mysql');
const user_table = 'user_tbl'

let connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'wjs231100',
  database : 'workout_schedular'
});

connection.connect();

let mySql = {};
mySql.Utils = {};

mySql.Utils.showUserTable = function () {
  let query = "SHOW COLUMNS FROM " + user_table;
  return new Promise ( (resolve, reject) => {
    connection.query(query, (error, results, fields) => {
      if(error) {
        return reject(error);
      }
      resolve(results, fields);
    })
  })
}

// TODO : 암호화, 이미 가입되어있는지 확인, 이메일 인증
mySql.Utils.createUser = function (user_email, password) {
  user_email = '"' + user_email + '"'
  password = '"' + password + '"'
  let values = '(' + user_email + ', ' + password + ')';
  let query = "INSERT INTO " + user_table + " (user_email, password)" + " VALUES " + values;

  return new Promise ( (resolve, reject) => {
    connection.query(query,(error, results, fields) => {
      if (error) {
        return reject(error);
      }
      resolve(results, fields);
    })
  })
};

// SELECT * FROM user_tbl WHERE user_email = "whow1101@naver.com"  AND password = "1234" LIMIT 1
mySql.Utils.readUser = function (user_email, password) {
  user_email = '"' + user_email + '"'
  password = '"' + password + '"'
  let query = "SELECT * FROM " + user_table + " WHERE user_email = " + user_email + " AND password = "  + password + " LIMIT 1";
  return new Promise ( (resolve, reject) => {
    connection.query(query,(error, results, fields) => {
      if (error) {
        return reject(error);
      }
      resolve(results, fields);
    })
  })
}

// TODO : user가 검색 안될 때 처리
mySql.Utils.deleteUser = function (user_email) {
  user_email = '"' + user_email + '"';
  let query = "DELETE FROM " + user_table + " WHERE user_email = " + user_email;

  return new Promise ( (resolve, reject) => {
    connection.query(query,(error, results, fields) => {
      if (error) {
        return reject(error);
      }

      resolve(results);
    })
  })
}

// mySql.Utils.showUserTable().then( (results, fields) => {
//   console.log(results);
//   // console.log(fields);
// });

module.exports.Utils = mySql.Utils;