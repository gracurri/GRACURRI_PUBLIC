//users_classes_attended,semesters관련 함수들
var db = require('./database');

var classcoderecv = function(body) {
    return new Promise(function(resolve, reject) {
        let classstring = '';
        for (var i = 0; i < body.classcodes.length; i++) {
            classcodestring += body.classcodes[i]
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
    db.query('SELECT ? from semesters where EMAIL=?', [query.semester, query.email],
        function(error, results, fields) {
            if (error) {
                res.send({
                    "code": 400,
                    "result": "error!"
                })
            } else {
                if (results.length > 0) {
                    semeseterset(query.semester, results[0]).then(function(code) {
                            var names = [];
                            for (var i = 0; i < code.length; i += 10) {
                                var temp = code.slice(i, i + 10);
                                db.query('USE subjects;');
                                db.query('SELECT name from subject where id=?', [temp],
                                    function(error, result) {
                                        if (result.length > 0) {
                                            names.push(result[0].name);
                                        } else {
                                            db.query('SELECT name from subject_1 where id=?', [temp],
                                                function(errors, results) {
                                                    if (!errors && results.length > 0) {
                                                        names.push(results[0].name);
                                                    }
                                                })
                                            ''
                                        }
                                    }
                                );
                            }
                            return names;
                        }

                    ).then(function(name) {
                        let semreturn = '';
                        if (query.semester === 'one') {
                            semreturn = '1-1';
                        } else if (query.semester === 'two') {
                            semreturn = '1-2';
                        } else if (query.semester === 'three') {
                            semreturn = '2-1';
                        } else if (query.semester === 'four') {
                            semreturn = '2-2';
                        } else if (query.semester === 'five') {
                            semreturn = '3-1';
                        } else if (query.semester === 'six') {
                            semreturn = '3-2';
                        } else if (query.semester === 'seven') {
                            semreturn = '3-1';
                        } else if (query.semester === 'eight') {
                            semreturn = '3-2';
                        }
                        return (name, semreturn);
                    }).then(function(name, sem) {
                        console.log(name);
                        res.send({
                            "code": 200,
                            "result": name,
                            "semester": sem
                        });
                    });
                }
            }
        }
    );

}
exports.tableshowsem = function(query, res) {
    return new Promise(function(resolve, reject) {
        db.query('use gracurri_user;');
        db.query('SELECT semester from users WHERE EMAIL=?', [query.email],
            function(error, results, fields) {
                currsem = results[0].semester;
                resolve(currsem, query.email);
            });
    })

}
exports.getclasses = function(currsem, email) {
    return new Promise(function(resolve, reject) {
        db.query('use gracurri_user;');
        db.query('SELECT ? from semesters where EMAIL=?', [query.semester, query.email],
            function(error, results, fields) {
                if (error) {
                    res.send({
                        "code": 400,
                        "result": "error!"
                    })
                } else {
                    semeseterset(query.semester, results).then(function(code) {
                        var names = [];
                        var timeandloc = [];
                        for (var i = 0; i < code.length; i += 10) {
                            var temp = code.slice(i, i + 10);
                            db.query('USE subjects;');
                            db.query('SELECT name,classtimeandlocation from subject where id=?', [temp],
                                function(error, result) {
                                    if (result.length > 0) {
                                        names.push(result[0].name);
                                        timeandloc.push(result[0].classtimeandlocation);
                                    } else {
                                        db.query('SELECT name,classtimeandlocation from subject_1 where id=?', [temp],
                                            function(errors, results) {
                                                if (!errors && results.length > 0) {
                                                    names.push(results[0].name);
                                                    timeandloc.push(results[0].classtimeandlocation);
                                                }
                                            })
                                    }
                                });

                        }
                        return (names, timeandloc);
                    }).then(function(names, timeandloc) {
                        res.send({
                            "code": 200,
                            "result": names,
                            "timeandloc": timeandloc
                        })
                    });

                }
            })
    })
}