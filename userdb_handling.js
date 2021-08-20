var userdb = require('./database');
var subdb = require('./subjectdbhandling');
exports.signup2 = function(info, res) {
    userdb.query('INSERT INTO users_classes_attended(EMAIL,id) VALUES(?,?);', [info.id, info.number]); //기존 들은 과목 db에 추가
    userdb.query('INSERT INTO semesters(EMAIL,id) VALUES(?,?);', [info.id, info.number]); //계획 DB에 추가
}
exports.signup = function(info, res) { //회원가입
    userdb.query('use gracurri_user;')
    userdb.query('INSERT INTO users (EMAIL,PW,username,id,major,hintanswer) VALUES(?,?,?,?,?,?); ', [info.id, info.password, info.name, info.number, info.department, info.passwordHint],
        function(error, result, fields) {
            if (error) {
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                })

            } else {
                res.send({
                    "code": 200,
                    "success": "signup successful"
                })
            }
        });
}
exports.emailcheck = function(body, res) { //email확인(회원가입시 )
    userdb.query('use gracurri_user;')
    userdb.query('SELECT EMAIL FROM users WHERE EMAIL=?', [body.id], function(error, result, fields) {
        if (error) {
            console.log("error!");
            res.send({
                "code": 400,
                "failed": "error"
            })
        } else {
            if (result.length > 0) {
                console.log("email is in DB");
                res.send({
                    "code": 200,
                    "result": "true",
                    "comment": "there is email"
                })
            } else {
                console.log("no email found");
                res.send({
                    "code": 200,
                    "result": "false",
                    "comment": "there isn't email in DB"
                })
            }
        }
    });
}

exports.signin = function(req, res) { //login
    userdb.query('use gracurri_user;')
    var username = req.body.id;
    var PW = req.body.PW;
    userdb.query('SELECT * FROM users WHERE EMAIL = ?', [username],
        function(error, results, fields) {
            if (error) {
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                })
            } else {
                if (results.length > 0) {
                    if (results[0].PW == PW) {
                        console.log("login successed");
                        res.send({
                            "code": 200,
                            "success": "login sucessfull"
                        });
                    } else {
                        res.send({
                            "code": 204,
                            "success": "username and password does not match"
                        });
                    }
                } else {
                    res.send({
                        "code": 204,
                        "success": "username does not exists"
                    });
                }
            }
        })
}
exports.question = function(reqbody, res) {
    userdb.query('use gracurri_user;')
    userdb.query('SELECT username,hintanswer,EMAIL from users WHERE id=?', [reqbody.number],
        function(error, results, fields) {
            if (error) {
                res.send({
                    "code": 400,
                    "failed": "search failed"
                })
            } else {
                if (results.length > 0) {
                    if (results[0].hintanswer === reqbody.passwordHint && results[0].username === reqbody.name && results[0].EMAIL === reqbody.id) {
                        res.send({
                            "code": 200,
                            "match": "answermatched",
                            "id": reqbody.EMAIL
                        })
                    } else {
                        res.send({
                            "code": 400,
                            "match": "answernotmatched"
                        })
                    }
                } else {
                    res.send({
                        "code": 400,
                        "match": "notfound"
                    })
                }
            }
        })
}
exports.modifypw = function(reqbody, res) {
    userdb.query('use gracurri_user;')
    var id = reqbody.id;
    var PW = reqbody.PW;
    var sql = 'UPDATE users SET PW=? WHERE id=?';
    conn.query(sql, [PW, id], function(err, result, fields) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log("password has been changed");
            //res.redirect('/user/'+id);
        }
    });
}