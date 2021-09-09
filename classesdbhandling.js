//users_classes_attended,semesters관련 함수들
const util = require('util');
var sql = require('mysql');
var dbconfig = require('./sqlconfig.json')
const cdb = sql.createPool({
    host: dbconfig.host,
    port: 3306,
    user: dbconfig.user,
    password: dbconfig.password
});
let performQuery = util.promisify(cdb.query).bind(cdb);
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
var namesearchandsem = function(codeandquery) {
    return new Promise(function(resolve, reject) {
        let namelist = [];
        for (var i = 0; i < codeandquery[0].length; i += 10) {
            var temp = codeandquery[0].slice(i, i + 10);
            db.query('USE subjects;')
            db.query('SELECT name from subject where id=?', [temp],
                function(error, result) {
                    if (result.length > 0) {
                        namelist.push(result[0].name);
                    } else {
                        db.query('SELECT name from subject_1 where id=?', temp,
                            function(errors, results) {
                                if (results.length > 0) {
                                    namelist.push(results[0].name);
                                }
                            });
                    }
                }
            );
        }
        let semreturn = '';
        if (codeandquery[1] === 'one') {
            semreturn = '1-1';
        } else if (codeandquery[1] === 'two') {
            semreturn = '1-2';
        } else if (codeandquery[1] === 'three') {
            semreturn = '2-1';
        } else if (codeandquery[1] === 'four') {
            semreturn = '2-2';
        } else if (codeandquery[1] === 'five') {
            semreturn = '3-1';
        } else if (codeandquery[1] === 'six') {
            semreturn = '3-2';
        } else if (codeandquery[1] === 'seven') {
            semreturn = '3-1';
        } else if (codeandquery[1] === 'eight') {
            semreturn = '3-2';
        }
        resolve([namelist, semreturn]);
    })
}
var semeseterset = function(semester, results) {
    return new Promise(function(resolve, reject) {
        if (semester === "one") {
            console.log(results.one);
            resolve(results.one);
        } else if (semester === 'two') {
            resolve(results.two);
        } else if (semester === 'three') {
            resolve(results.three);
        } else if (semester === 'four') {
            resolve(results.four);
        } else if (semester === 'five') {
            resolve(results.five);
        } else if (semester === 'six') {
            resolve(results.six);
        } else if (semester === 'seven') {
            resolve(results.seven);
        } else {
            resolve(results.eight);
        }
    })
}
exports.gettoattend = async function(query, res, next) {
    let stringcode = ''
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
    const names = [];
    const codestringquery = 'SELECT *from semesters WHERE EMAIL=sallybig@naver.com';
    try {
        let getResult = await performQuery(codestringquery)
        getResult.forEach((codes) => {
            /*if (query.semester === "one") {
                stringcode = codes.one;
            } else if (query.semester === "two") {
                stringcode = codes.two;
            } else if (query.semester === "three") {
                stringcode = codes.three;
            } else if (query.semester === "four") {
                stringcode = codes.four;
            } else if (query.semester === "five") {
                stringcode = codes.five;
            } else if (query.semester === "six") {
                stringcode = codes.six;
            } else if (query.semester === "seven") {
                stringcode = codes.seven;
            } else {
                stringcode = codes.eight;
            }*/
            res.send(codes);
            /*for (var i = 0; i < stringcode.length; i += 10) {
                var temp = stringcode.slice(i, i + 10);
                const mynamequery = "SELECT name from subject_1 WHERE id=" + temp;
                let getname = performQuery(mynamequery);
                names.push(getname[0].name);
                if (i >= stringcode.length - 1) {
                    res.send({
                        "code": 200,
                        "result": names,
                        "semester": semreturn
                    });
                }
            }*/

        })
    } catch (err) {
        res.send('ERROR');
    }
}

/*
db.query('USE subjects;');
                        db.query('SELECT name from subject_1 WHERE id=?', [temp],
                            function(error, name, fields) {
                                if (!error) {
                                    if (name.length > 0) {
                                        console.log(name);
                                        namelist.push(name[0].name);
                                    } else {
                                        db.query('SELECT name from subject WHERE id=?', [temp],
                                            function(error, name2, fields) {
                                                if (!error) {
                                                    if (name2.length > 0) {
                                                        namelist.push(name2[0].name);
                                                    }
                                                }
                                            })
                                    }
                                }
                            }
                        )
                        if (i >= stringcode.length - 1) {
                            res.send({
                                "code": 200,
                                "result": namelist,
                                "semester": semreturn
                            });
    
exports.gettoattend = function(query, res) {
        db.query('use gracurri_user;');
        db.query('SELECT * from semesters where EMAIL=?', [query.email],
            function(error, results, fields) {
                if (error) {
                    res.send({
                        "code": 400,
                        "result": "error!"
                    })
                } else {
                    if (results.length > 0) {
                        console.log(results.one);
                        semeseterset(query, results).then(function(string) {
                            let codestring = string;
                            console.log(string);
                            return codestring;
                        }).then(function(codestring) {
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
                            let namelist = [];
                            for (var i = 0; i < codestring.length; i += 10) {
                                var temp = codestring.slice(i, i + 10);
                                db.query('USE subjects;')
                                db.query('SELECT name from subject where id=?', [temp]).then(
                                    results => {
                                        if (results.length > 0) {
                                            namelist.push(results[0].name);
                                        }

                                    }
                                )
                                db.query('SELECT name from subject_1 where id=?', temp).then(
                                    results => {
                                        if (results.length > 0) {
                                            namelist.push(results[0].name);

                                        }
                                    }
                                )
                                if (i == codestring.length - 1) {
                                    res.send({
                                        "code": 200,
                                        "result": namelist,
                                        "semester": semreturn
                                    });
                                }
                            }
                        });
                    }

                }
            }

        );

    }*/
/*exports.gettoattend = async(req, res, next) => {
    db.query('use gracurri_user;');
    const result = await db.query('SELECT * from semesters where EMAIL=?', [query.email]);
    if (result.length > 0) {
        let codestring = '';
        if (query.semester === "one") {
            codestring = results.one;
        } else if (query.semester === 'two') {
            codestring = results.two;
        } else if (query.semester === 'three') {
            codestring = results.three;
        } else if (query.semester === 'four') {
            codestring = results.four;
        } else if (query.semester === 'five') {
            codestring = results.five
        } else if (query.semester === 'six') {
            codestring = results.six
        } else if (query.semester === 'seven') {
            codestring = results.seven
        } else {
            codestring = results.eight;
        }
    } else {
        res.send({
            "code": 400,
            "result": "error!"
        })
    }
    let namelist = [];
    for (var i = 0; i < codestring.length; i += 10) {
        var temp = codestring.slice(i, i + 10);
        db.query('USE subjects;');
        const result = await db.query('SELECT name from subject where id=?', [temp]);
    }
    /*
                         db.query('USE subjects;')
                         db.query('SELECT name from subject where id=?', [temp]).then(
                             results => {
                                 if (results.length > 0) {
                                     namelist.push(results[0].name);
                                 }

                             }
                         )
                         db.query('SELECT name from subject_1 where id=?', temp).then(
                             results => {
                                 if (results.length > 0) {
                                     namelist.push(results[0].name);

                                 }
                             }
                         )
                     }
                 })
                 let semreturn = '';
                 setTimeout(() => {
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
                 })
                 res.send({
                     "code": 200,
                     "result": namelist,
                     "semester": semreturn
                 });

    }

    }
    }

    );

}
*/

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
exports.getclasses = function(query, email) {
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