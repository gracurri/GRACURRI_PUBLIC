//users_classes_attended,semesters관련 함수들
var db = require('./database');
exports.postattendedclasses = function(body, res) {
    db.query('use gracurri_user;')
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
exports.gettoattend = function(query, res) {
    db.query('use gracurri_user;');
    db.query('SELECT ? from semesters where EMAIL=?', [query.semester, query.id],
        function(error, results, fields) {
            if (error) {
                res.send({
                    "code": 400,
                    "result": "error!"
                })
            } else {
                let sem = body.semester;
                let codestring;
                if (sem === "one") {
                    codestring = results.one;
                } else if (sem === 'two') {
                    codestring = results.two;
                } else if (sem === 'three') {
                    codestring = results.three;
                } else if (sem === 'four') {
                    codestring = results.four;
                } else if (sem === 'five') {
                    codestring = results.five;
                } else if (sem === 'six') {
                    codestring = results.six;
                } else if (sem === 'seven') {
                    codestring = results.seven;
                } else {
                    codestring = results.eight;
                }
                let codes = [];
                for (var i = 0; i < codestring.length; i += 10) {
                    codes.push(codestring.slice(i, i + 10));
                }
                res.send({
                    "code": 200,
                    "result": codes
                })
            }
        })
}