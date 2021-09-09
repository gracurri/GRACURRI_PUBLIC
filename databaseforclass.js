var sql = require('mysql');
var dbconfig = require('./sqlconfig.json')
const db = sql.createPool({
    host: dbconfig.host,
    port: 3306,
    user: dbconfig.user,
    password: dbconfig.password
});
module.exports = db;