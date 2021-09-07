const { resolve } = require("path/posix");
const db = require("./database")

var dbsearchclass = function(code) {
    return new Promise(function(resolve, reject) {
        let result;
        db.query('USE subjects;');
        db.query('SELECT division,unit,etc_div,targetstudent from subject,subject_1 WHERE id=?;', [code],
            function(error, results, fields) {
                if (!error) {
                    result = results;
                }
            });
        resolve(result);
    })
}
var onetwo = function(code) {
    return new Promise(function(resolve, reject) {
        let returning;
        db.query('USE subejects;');
        db.query('SELECT name from subject_1 WHERE id=?;', [code],
            function(error, results) {
                if (!error) {
                    if (results.length > 0) {
                        returning = 1;
                    } else {
                        returning = 2;
                    }
                }
            })
        resolve(returning);
    })

}
exports.status = function(email, classcodearr) {
    return new Promise(function(resolve, reject) {
        var current = 0; //현재 이수학점
        var current_major_basic = 0; //현재 이수 전공기초학점
        var current_major_must = 0; //현재 이수 전공필수학점
        var curr_major_select = 0; //현재 이수 전공선택학점
        var curr_etc_must = 0; //현재 이수 필수교양학점
        var curr_etc_select = 0; //현재 이수 선택교양학점
        var ethics = 0; //품성교양
        var language = 0; //언어교양
        var humanities = 0; //인문학교양
        var socialstudy = 0; //사회과학교양
        var christian = 0; //기독교과목
        var semester = 0;
        for (var i = 0; i < classcodearr.length; i++) {
            dbsearchclass(classcodearr[i]).then(
                function(result) {
                    current += parseInt(result[0].unit);
                    //전공 및 교양 필수/선택 체크
                    if (result[0].division.includes("전기")) {
                        current_major_basic += result[0].unit;
                    } else if (result[0].division.includes("전필")) {
                        current_major_must += result[0].unit;
                    } else if (result[0].division.includes("전선")) {
                        curr_major_select += result[0].unit;
                    } else if (result[0].division.includes("교필")) {
                        curr_etc_must += result[0].unit;
                    } else if (result[0].division.includes("교선")) {
                        //교선 분야 확인
                        if (result[0].etc_div.includes('사회과학')) {
                            socialstudy = 1
                        } else if (result[0].etc_div.includes('국제어문')) {
                            language = 1;
                        } else if (result[0].etc_iv.includes('인문학')) {
                            humanities = 1;
                        } else if (result[0].etc_idv.includes('숭실품성')) {
                            ethics = 1;
                        }
                        curr_etc_select += result[0].unit;
                    }
                    return [classcodearr[i], result]
                }
            ).then(function(resresult) {
                onetwo(resresult[0]).then(
                    function(sem) {
                        if (resresult[1].targetstudent.includes('1학년')) {
                            if (sem === 1) {
                                if (semester < 1) {
                                    semester = 1;
                                }
                            } else if (semester < 2) {
                                semester = 2;
                            }
                        } else if (resresult[1].targetstudent.includes('2학년')) {
                            if (sem === 1) {
                                if (semester < 3) {
                                    semester = 3;
                                }
                            } else if (semester < 4) {
                                semester = 4;
                            }
                        } else if (result[1].targetstudent.includes('3학년')) {
                            if (sem === 1) {
                                if (semester < 5) {
                                    semester = 5;
                                }
                            } else if (semester < 6) {
                                semester = 6;
                            }
                        }
                    }
                );
            });
        }
        resolve([current, current_major_basic, current_major_must, curr_major_select, curr_etc_must, curr_etc_select, ethics, language, humanities, socialstudy, semester])
    });
}
exports.planmake = function() {

}