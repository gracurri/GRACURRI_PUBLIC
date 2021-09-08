//users_classes_attended,semesters관련 함수들
var db = require('./database');

var classcoderecv = function(body) {
    return new Promise(function(resolve, reject) {
        let classstring = '';
        for (var i = 0; i < body.classcodes.length; i++) {
            classcodestring += body.classcodes[i]
            classcodesstring += '|'
        }
        resolve(classcodestring);
    })
}
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
var semeseterset = function(semester, results) {
    return new Promise(function(resolve, reject) {
        let sem = semester;
        let codestring = '';
        if (semester === "one") {
            codestring = results.one;
        } else if (semester === 'two') {
            codestring = results.two;
        } else if (semester === 'three') {
            codestring = results.three;
        } else if (semester === 'four') {
            codestring = results.four;
        } else if (semester === 'five') {
            codestring = results.five;
        } else if (semester === 'six') {
            codestring = results.six;
        } else if (semester === 'seven') {
            codestring = results.seven;
        } else {
            codestring = results.eight;
        }
        resolve(codestring)
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
                semeseterset(query.semester, results).then(function(code) {
                    for (var i = 0; i < code.length; i += 10) {
                        var temp = code.slice(i, i + 10);
                        db.query('USE subjects;');
                        db.query('SELECT name from subject where id=?', [temp],
                            function(error, result) {
                                if (result.length > 0) {
                                    names.push(result[0].name);
                                } else {
                                    db.query('SELECT name from subject_1 where id=?', [temp],
                                        function(error, result) {
                                            if (!error && result.length > 0) {
                                                names.push(result[0].name);
                                            }
                                        })
                                }
                            });
                    }
                    return (1);
                }).then(function(num) {
                    res.send({
                        "code": 200,
                        "result": names
                    })
                });

            }
        })
}