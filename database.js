var sql = require('mysql');
var info = {
    host: 'localhost', //host바꿔야함
    port: 3600, //port도 마찬가지로 적절하게 바꿔주어야함.
    user: 'GRCURR',
    password: 'grcurr2021!',
}
var db = sql.createConnection(info);
db.connect();
module.exports = db;