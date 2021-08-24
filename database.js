var sql = require('mysql');
var dbconfig = require('.sqlconfig.json')
var info = {
    host: dbconfig.host,
    port: 3306,
    user: dbconfig.user,
    password: dbconfig.password,
}
var db = sql.createConnection(info);
db.connect();
module.exports = db;