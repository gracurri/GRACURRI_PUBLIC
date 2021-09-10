const e = require("express");
const db = require("./database")
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
exports.status = function(email, classcodearr) { //현재 이수상태 저장

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
        db.query('SELECT division,etc_div,targetstudent from subject_1 where id=?', classcodearr[i],
            function(error, result) {
                if (!error) {
                    if (result.length > 0) {
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
                                socialstudy += 1
                            } else if (result[0].etc_div.includes('국제어문')) {
                                language += 1;
                            } else if (result[0].etc_iv.includes('인문학')) {
                                humanities += 1;
                            } else if (result[0].etc_div.includes('숭실품성')) {
                                ethics += 1;
                            } else if (result[0].etc_div.includes('기독교')) {
                                christian += 1;
                            }
                            curr_etc_select += result[0].unit;
                        }
                        if (result[0].targetstudent.includes('1학년')) {

                            if (semester < 1) {
                                semester = 1;

                            } else if (result[0].targetstudent.includes('2학년')) {
                                if (semester < 3) {
                                    semester = 3;

                                }
                            } else if (result[0].targetstudent.includes('3학년')) {

                                if (semester < 5) {
                                    semester = 5;
                                }

                            }

                        }
                    } else {
                        db.query('SELECT division,etc_div from subject where id=?', classcodearr[i],
                            function(errors, result_2) {
                                if (!errors) {
                                    if (result_2.length > 0) {
                                        current += parseInt(result_2[0].unit);
                                        //전공 및 교양 필수/선택 체크
                                        if (result_2[0].division.includes("전기")) {
                                            current_major_basic += result_2[0].unit;
                                        } else if (result_2[0].division.includes("전필")) {
                                            current_major_must += result_2[0].unit;
                                        } else if (result_2[0].division.includes("전선")) {
                                            curr_major_select += result_2[0].unit;
                                        } else if (result_2[0].division.includes("교필")) {
                                            curr_etc_must += result_2[0].unit;
                                        } else if (result_2[0].division.includes("교선")) {
                                            //교선 분야 확인
                                            if (result_2[0].etc_div.includes('사회과학')) {
                                                socialstudy += 1
                                            } else if (result_2[0].etc_div.includes('국제어문')) {
                                                language += 1;
                                            } else if (result_2[0].etc_div.includes('인문학')) {
                                                humanities += 1;
                                            } else if (result_2[0].etc_div.includes('숭실품성')) {
                                                ethics += 1;
                                            } else if (result_2[0].etc_div.includes('기독교')) {
                                                christian += 1;
                                            }
                                            curr_etc_select += result_2[0].unit;
                                        }
                                        if (result_2[0].targetstudent.includes('1학년')) {

                                            if (semester < 2) {
                                                semester = 2;

                                            } else if (result_2[0].targetstudent.includes('2학년')) {
                                                if (semester < 4) {
                                                    semester = 4;

                                                }
                                            } else if (result_2[0].targetstudent.includes('3학년')) {

                                                if (semester < 6) {
                                                    semester = 6;
                                                }

                                            }

                                        }
                                    }
                                }
                            });
                    }
                }


            }
        )
    }
    return ([current, current_major_basic, current_major_must, curr_major_select, curr_etc_must, curr_etc_select, ethics, language, humanities, socialstudy, semester])

}


const graduation_unit = 130; //졸업학점,채플제외
const graduation_major_select = 51;
const graduation_major_basic = 18; //전공기초
const graduation_major_must = 15; //전공필수
const graduation_etc_must = 14; //교양필수
const graduation_etc_selection = 23; //교양선택
const graduation_major_without_basic = 66; //전공기초 제외 전공 요학점
const graduation_christ = 4;
var filter_same_class = function(result) {
    let list = []
    let newresult = []
    for (var i = 0; i < result.length; i++) {
        if (list.indexOf(result[i].name.slice(0, 9)) == -1) {
            list.push(result[i].name.slice(0, 9));
            newresult.push(result[i]);
        }

    }
    return newresult;
}
exports.planmake = function(info, email) {
    var needed = {
        "unit_needed": graduation_unit - info.unit_attended,
        "major_must": graduation_major_must - info.current_major_must,
        "major_basic": graduation_major_basic - info.current_major_basic,
        "major_select": graduation_major_select - info.curr_major_select,
        "etc_must": graduation_etc_must - info.curr_etc_must,
        "etc_select": graduation_etc_selection - info.curr_etc_select
    };
    if (info.major === 'computer') {
        info.major = '컴퓨터';
    } else {
        info.major = '글로벌미디어'
    }
    let currsem = info.semester + 1;
    db.query('USE subjects;');
    var majormustandsel = [0, 0, 15, 15, 15, 15, 9, 6];
    var current = 0;
    for (var i = info.semester + 1; i < 9; i++) {
        current += majormustandsel[i];
    }
    if (needed['major_select'] + needed['major_select'] > current) {
        var left = needed['major_select'] + needed['major_select'] - current;
        for (var i = info.semester + 1; i < 9; i++) {
            if (i >= 3 && i <= 6) {
                majormustandsel[i] += 3;
                left -= 3;
            } else if (i == 7) {
                majormustandsel[i] += parseInt(left / 2);
                left -= parseInt(left / 2);
            } else if (i == 8) {
                majormustandsel[i] += left;
            }
        }
    }
    while (currsem < 9) {
        let codestring = '';
        var max = 19;
        var major_must = 0; //전공필수
        var etc_must = 0; //교양필수

        if (currsem == 1) { //1학년때
            max = 22;
            etc_must = 8; //1학년교필
        } else if (currsem == 2) {
            max = 22;
            etc_must = 7;
        } else if (currsem == 3) { //2학년 1학기
            etc_must = 2;
            major_must = 3;
        } else if (currsem === 4) {
            major_must = 6;
        } else if (currsem / 2 <= 6) { //3학년
            major_must = 3;
        }
        if (currsem % 2 === 1) { //1학기
            if (currsem === 1) {
                db.query('SELECT name,id from subject_1 WHERE division=전기-?', info.major,
                    function(error, result, fields) {
                        if (!error) {
                            if (result.length > 0) {
                                codestring = codeconnection(codestring, filter_same_class(result));
                            }
                        }
                    })
            } else {
                db.query('SELECT name,id from subject_1 WHERE division=전선-' + info.major, function(error, results) {
                    if (!error) {
                        if (results.length > 0) {
                            codestring = codeconnection(codestring, filter_same_class(results));
                        }
                    }
                })
            }
            db.query('SELECT name,id from subject_1 WHERE division=전필-? and targetstudent LIKE' + db.escape("%" + String(parseInt(currsem / 2)) + "%"),
                function(error, result, fields) {
                    if (!error) {
                        if (result.length > 0) {
                            codestring = codeconnection(codestring, filter_same_class(result))
                        }
                    }
                })

        } else {
            if (currsem === 2) {
                db.query('SELECT name,id from subject WHERE division=전기-?', info.major,
                    function(error, result, fields) {
                        if (!error) {
                            if (result.length > 0) {
                                codestring = codeconnection(codestring, filter_same_class(result));
                            }
                        }
                    })
            } else {
                db.query('SELECT name,id from subject WHERE division=전선-' + info.major, function(error, results) {
                    if (!error) {
                        if (results.length > 0) {
                            codestring = codeconnection(codestring, filter_same_class(results));
                        }
                    }
                })
            }
            db.query('SELECT name,id from subject WHERE division=전필-? and targetstudent LIKE' + db.escape("%" + String(parseInt(currsem / 2)) + "%"),
                function(error, result, fields) {
                    if (!error) {
                        if (result.length > 0) {
                            codestring = codeconnection(codestring, filter_same_class(result))
                        }
                    }
                })

        }
        if (currsem === 1) {
            db.query('UPDATE semesters SET one=? WHERE EMAIL=?', [codestring, email],
                function(error, result) {
                    if (!error) {
                        return (true);
                    }
                })
        } else if (currsem === 2) {
            db.query('UPDATE semesters SET two=? WHERE EMAIL=?', [codestring, email],
                function(error, result) {
                    if (!error) {
                        return (true);
                    }
                })

        } else if (currsem === 3) {
            db.query('UPDATE semesters SET three=? WHERE EMAIL=?', [codestring, email],
                function(error, result) {
                    if (!error) {
                        return (true);
                    }
                })

        } else if (currsem === 4) {
            db.query('UPDATE semesters SET four=? WHERE EMAIL=?', [codestring, email],
                function(error, result) {
                    if (!error) {
                        return (true);
                    }
                })

        } else if (currsem === 5) {
            db.query('UPDATE semesters SET five=? WHERE EMAIL=?', [codestring, email],
                function(error, result) {
                    if (!error) {
                        return (true);
                    }
                })

        } else if (currsem === 6) {
            db.query('UPDATE semesters SET six=? WHERE EMAIL=?', [codestring, email],
                function(error, result) {
                    if (!error) {
                        return (true);
                    }
                })

        } else if (currsem === 7) {
            db.query('UPDATE semesters SET seven=? WHERE EMAIL=?', [codestring, email],
                function(error, result) {
                    if (!error) {
                        return (true);
                    }
                })

        } else {
            db.query('UPDATE semesters SET eight=? WHERE EMAIL=?', [codestring, email],
                function(error, result) {
                    if (!error) {
                        return (true);
                    }
                })

        }
        currsem += 1;
    }
}

/*exports.planmake = function(info, email) {


var needed = {
    "unit_needed": graduation_unit - data[stats].unit_attended,
    "major_must": graduation_major_must - data[stats].current_major_must,
    "major_basic": graduation_major_basic - data[stats].current_major_basic,
    "major_select": graduation_major_select - data[stats].curr_major_select,
    "etc_must": graduation_etc_must - data[stats].curr_etc_must,
    "etc_select": graduation_etc_selection - data[stats].curr_etc_select
};




let currsem = data[stats].semester + 1;
db.query('USE subjects;');
while (currsem < 9) {
    var max = 18;
    var major_must = 0; //전공필수
    var etc_must = 0; //교양필수
    if (currsem / 2 <= 1) { //1학년때
        max = 22;
        major_must = 9; //1학년전기,전필
        etc_must; //1학년교필
    } else if (currsem == 3) { //2학년 1학기
        etc_must = 2;
        major_must = 3;
    } else if (currsem === 4) {
        major_must = 6;
    } else if (currsem / 2 <= 6) { //3학년
        major_must = 3;
    }
    if (currsem % 2 === 1) { //1학기
        if (currsem === 1) {
            db.query('SELECT name,id from subject_1 WHERE division=전기-?', dats[stats].major,
                function(error, result, fields) {
                    if (!error) {
                        if (result.length > 0) {
                            codeconnection(result).then(function(resultstring) {
                                db.query('SELECT one from semesters WHERE EMAIL=?', email,
                                    function(error, results, fields) {
                                        if (!error) {
                                            if (results.length > 0) {
                                                resultstring += results[0].one;
                                            }
                                        }

                                    })
                                return (resultstring)
                            }).then(
                                function(resultstring) {
                                    db.query('USE gracurri_user;');
                                    db.query('UPDATE semesters SET one=? WHERE EMAIL=?', [resultstring, email]);
                                }
                            )
                        }
                    }
                })
        }
        db.query('SELECT name,id from subject_1 WHERE division=전필-? and targetstudent LIKE' + db.escape("%" + String(parseInt(currsem / 2)) + "%"),
            function(error, result, fields) {
                if (!error) {
                    if (result.length > 0) {
                        codeconnection(result).then(
                            function(resultstring) {
                                db.query("USE gracurri_user;");
                                if (currsem === 1) {
                                    SELECT
                                } else if (currsem === 3) {

                                } else if (currsem === 5) {

                                } else if (currsem === 7) {

                                }
                            }
                        )
                    }
                }
            })
    } else {
        if (currsem === 2) {
            db.query('SELECT name,id from subject WHERE division=전기-?', dats[stats].major,
                function(error, result, fields) {
                    if (!error) {
                        if (result.length > 0) {
                            codeconnection(result).then(
                                function(resultstring) {
                                    db.query('USE gracurri_user;');
                                    db.query('UPDATE semesters SET two=?', temcodes);
                                }
                            )
                        }
                    }
                })
        }

    }
    currsem += 1;
}
}
)
result = {
    "code": 200,
    "success": "successed"
}

}*/
var getinfofromusers = function(email) { //users에 저장되어있는 학점이수정보,들은 과목 정보 불러오기 =>planmake에서 씀
    return new Promise(function(resolve, reject) {
        let returningdata = {};
        db.query('USE gracurri_user;');
        db.query('SELECT unit_attended,major_basic,major_must,major_select,etc_must,etc_select,ethics,language,humanities,socialstudy,semester,major FROM users WHERE EMAIL=?', [email],
            function(error, results, fields) {
                if (!error) {
                    returningdata[stats] = results[0];
                    if (returningdata[stats].major === 'computer') {
                        returningdata[stats].major = '컴퓨터';
                    } else {
                        returningdata[stats].major = '글로벌미디어';
                    }
                }
            });
        db.query('SELECT classcodes FROM users_classes_attended WHERE EMAIL=?', [email],
            function(error, results, fields) {
                if (!error) {
                    let classcode = [];
                    if (results.length > 0) {
                        for (var i = 0; i < results[0].classcodes.length; i += 10) {
                            var temp = results[0].classcodes.slice(i, i + 10);
                            classcode.push(temp);
                        }
                    }
                    returningdata[codesattended] = classcode;
                }
            })
        resolve(email, returningdata);
    })
}
var codeconnection = function(string, result) { //과목번호들 이어붙여서 하나의 스트리으로 리턴
    for (var i = 0; i < result.length; i++) {
        string += result[i].name;
    }
    return string;
}