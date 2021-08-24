var sql = require('mysql');
var dbconfig = require('.sqlconfig.json')
var info = {
    host: dbconfig.host, //host바꿔야함
    port: 3600, //port도 마찬가지로 적절하게 바꿔주어야함.
    user: dbconfig.user,
    password: dbconfig.password,
}
var db = sql.createConnection(info);
db.connect();
module.exports = db;