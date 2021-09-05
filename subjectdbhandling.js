var subjectdb = require('./database');
exports.search = function(key, res) { //info_input과목검색
    console.log(key);
    subjectdb.query('use subjects;')
    var error = 0
    var searched;
    subjectdb.query('SELECT name,id from subject WHERE name LIKE' + subjectdb.escape('%' + key + '%') + ';',
        function(error, results, fields) {
            if (error) {
                error = 1;
            } else {
                if (results.length > 0) {
                    searched = true;
                    if (results.length > 1) { //똑같은 수업 중복되는것 막기
                        let classname = [];
                        for (var i = 0; i < results.length; i++) {
                            if (results[i].name.indexOf('(') != -1) { //주로 ()가 과목명에 존재함. 그 앞이 주된 과목명이기에 (를 기준으로 하였음.
                                var temp = results[i].name.substring(0, results[i].name.indexOf('('));
                                if (!classname.includes(temp)) {
                                    classname.push(temp);
                                } else //똑같은 수업이 있으면
                                {
                                    results.splice(i, 1);
                                    i = i - 1;
                                }
                            } else {
                                if (!classname.includes(results[i].name)) {
                                    classname.push(results[i].name);
                                } else {
                                    results.splice(i, 1);
                                    i = i - 1;
                                }
                            }
                        }
                        res.send({
                            "result": results
                        });


                    } else {
                        res.send({
                            "result": results
                        });
                    }
                } else {
                    searched = false;
                }
            }
        });
    if (searched === false) {
        subjectdb.query('SELECT name,id from subject_1 WHERE name LIKE' + subjectdb.escape('%' + key + '%') + ';',
            function(error, results, fields) {
                if (error) {
                    error = 1;
                } else {
                    if (results.length > 0) {
                        searched = true;
                        if (results.length > 1) { //똑같은 수업 중복되는것 막기
                            let classname = [];
                            for (var i = 0; i < results.length; i++) {
                                if (results[i].name.indexOf('(') != -1) { //주로 ()가 과목명에 존재함. 그 앞이 주된 과목명이기에 (를 기준으로 하였음.
                                    var temp = results[i].name.substring(0, results[i].name.indexOf('('));
                                    if (!classname.includes(temp)) {
                                        classname.push(temp);
                                    } else //똑같은 수업이 있으면
                                    {
                                        results.splice(i, 1);
                                        i = i - 1;
                                    }
                                } else {
                                    if (!classname.includes(results[i].name)) {
                                        classname.push(results[i].name);
                                    } else {
                                        results.splice(i, 1);
                                        i = i - 1;
                                    }
                                }
                            }
                            res.send({
                                "result": results
                            });


                        } else {
                            res.send({
                                "result": results
                            });
                        }
                    }
                }
            });
    }
    if (error == 1) {
        res.send({
            "code": 400,
            "error": "error in search"
        });
    }
    if (searched === false) {
        res.send({
            "code": 200,
            "result": "not found"
        })
    }
}