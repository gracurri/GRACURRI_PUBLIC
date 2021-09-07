//users_classes_attended,semesters관련 함수들
var db = require('./database');
exports.storestatus = function(req, res) {
    return new Promise(function(resolve, reject) {
        classcoderecv(req.body).then(
            function(result) {
                db.query("USE gracurri_user;");
                db.query('UPDATE users_classes_attended set classcodes=? WHERE EMAIL=?', [result, req.body.email])
            }
        )
        resolve(req.body.classcodes);
    })

}
exports.gettoattend = function(query, res) {
    db.query('use gracurri_user;');
    var names = [];
    db.query('SELECT ? from semesters where EMAIL=?', [query.semester, query.email],
        function(error, results, fields) {
            if (error) {
                res.send({
                    "code": 400,
                    "result": "error!"
                })
            } else {
                let sem = query.semester;
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
                for (var i = 0; i < codestring.length; i += 10) {
                    var temp = codestring.slice(i, i + 10);
                    db.query('SELECT name from subject,subject_1 where id=?', [temp],
                        function(error, results) {
                            names.push(results[0].name);
                        })
                }
                //이름 찾아서 보내야함.
                res.send({
                    "code": 200,
                    "result": names
                })
            }
        })
}