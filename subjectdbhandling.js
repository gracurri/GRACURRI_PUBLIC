var subjectdb = require('./database');
let resulthandle = function(error, results, fields, errorsdetected, resultlist) {
    if (error) {
        errorsdetected += 1;
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
                for (var i = 0; i < results.length; i++) {
                    resultlist.push(results[i]);
                }


            } else {
                resultlist.push(results[0]);
            }
        } else {
            this.searched = false;
        }
    }
}
exports.search = function(key, res) { //info_input과목검색
        console.log(key);
        subjectdb.query('use subjects;')
        let resultlist = [];
        var errorsdetected = 0
        let searched = false;
        subjectdb.query('SELECT name,id from subject WHERE name LIKE' + subjectdb.escape('%' + key + '%') + ';',
            function(error, results, fields) {
                if (error) {
                    errorsdetected += 1;
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
                                "code": 200,
                                "result": results
                            })


                        } else {
                            res.send({
                                "code": 200,
                                "result": results
                            })
                        }
                    } else {
                        subjectdb.query('SELECT name,id from subject_1 WHERE name LIKE' + subjectdb.escape('%' + key + '%') + ';',
                            function(error, results, fields) {
                                if (!error && results.length > 0) {
                                    if (results.length > 1) {
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
                                            "code": 200,
                                            "result": results
                                        });
                                    } else {
                                        res.send({
                                            "code": 200,
                                            "result": results
                                        });
                                    }
                                } else if (!error && results.length == 0) {
                                    res.send({
                                        "code": 400,
                                        "result": "not found"
                                    });
                                }
                            }
                        }
                    }

                });

        }