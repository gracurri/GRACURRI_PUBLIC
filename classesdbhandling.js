var db = require('./database');
exports.postattendedclasses = function(body, res) {
    userdb.query('use gracurri_user;')
    db.query('UPDATE users_classes_attended SET classcodes=? WHERE EMAIL=?;', [body.classes, body.email], function(error, res) {
        if (error) {
            res.send({
                "code": 400,
                "result": "error occurred"
            })
        } else {
            res.send({
                "code": 200,
                "result": "successed"
            })
        }
    })
}