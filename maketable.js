var db = require('./database')
const graduation_unit = 133; //졸업학점
const graduation_major_basic = 18; //전공기초
const graduation_major_must = 15; //전공필수
const graduation_etc_must = 14; //교양필수
const graduation_etc_selection = 20; //교양선택
const graduation_major_without_basic = 66; //전공기초 제외 전공 요학점
const graduation_christ = 4;
var storestatus = function(req) {
    var attended = []; //들은과목 배열
    db.query('USE gracurri_user;');
    db.query('SELECT classcodes from users_classes_attended WHERE EMAIL=?', [req.body.id],
        function(error, results, fields) {
            if (error) {
                console.log('error!');
            } else {
                for (var i = 0; i < results[0].classcodes.length; i += 10) {
                    attended.push(results[0].classcodes.slice(i, i + 10));
                }
            }
        })
    let user = new userstatus(attended);
    db.query('USE gracurri_user;')
    db.query('UPDATE users SET unit_attended=?,major_basic=?,major_must=?,major_select=?,etc_must=?,etc_select=?,ethics=?,language=?,humanities=?,socialstudy=?,semester=?;', [user.current, user.current_major_basic, user.current_major_must, user.curr_major_select, user.curr_etc_must, user.curr_etc_select, user.ethics, user.humanities, user.socialstudy, user.semester],
        function(error, results, fileds) {
            if (error) {
                console.log('error occurred during unit pushing'); //error detecting
            }
        }
    );
    return user;
}
exports.makeplan = function(req, res) { //학기들 계획짜는 함수
    var attended_names = []
    db.query('USE subjects;');
    let user = storestatus(req);
    db.query('use gracurri_user;');
    db.query('SELECT major from users where EMAIL=?', [req.body.id], function(error, results) {
        if (results.length > 0) {
            user.major = results[0].major;
        }
    });
    for (var i = 0; i < user.attended.length; i++) {
        db.query('SELECT name from subject where id=?', [user.attended[i]], function(error, results, fields) {
            attended_names.push(results[0].name);
        });
    } //들은 과목들 이름을 불러옴(들은과목 넣어주는 것 방지위해)
    let currsem = user.semester + 1; //알고리즘 진행과정에서의 현재 학기
    while (currsem < 9) {
        var max = 18;
        var major = 0;
        var etc = 0;
        if (currsem / 2 <= 1) { //1학년때
            var max = 22;
            let major = 9; //1학년전기,전필
            let etc = 8; //1학년교필
            if (currsem % 2 == 1) { //1학기
                db.query('SELECT id,name from subject')
            }
        } else if (currsem / 2 <= 4) { //2학년

        } else if (currsem / 2 <= 6) { //3학년

        } else if (currsem / 2 <= 8) { //4학년

        }
    }
}
class userstatus {
    current = 0; //현재 이수학점
    current_major_basic = 0; //현재 이수 전공기초학점
    current_major_must = 0; //현재 이수 전공필수학점
    curr_major_select = 0; //현재 이수 전공선택학점
    curr_etc_must = 0; //현재 이수 필수교양학점
    curr_etc_select = 0; //현재 이수 선택교양학점
    ethics = 0; //품성교양
    language = 0; //언어교양
    humanities = 0; //인문학교양
    socialstudy = 0; //사회과학교양
    christion = 0; //기독교과목
    semester = 0;
    attended = [];
    major = '';
    constructor(attended) {
        this.attended = attended;
        db.query('USE subjects;');
        for (var i = 0; i < length(attended); i++) {
            var search = false;
            //2학기과목
            db.query('SELECT division,unit,etc_div,targetstudent from subject where id=?', [attended[i]],
                    function(error, results, fields) {
                        if (results.length > 0) {
                            current += parseInt(results[0].unit);
                            //전공 및 교양 필수/선택 체크
                            if (results[0].division.includes("전기")) {
                                current_major_basic += results[0].unit;
                            } else if (results[0].division.includes("전필")) {
                                current_major_must += results[0].unit;
                            } else if (results[0].division.includes("전선")) {
                                curr_major_select += results[0].unit;
                            } else if (results[0].division.includes("교필")) {
                                curr_etc_must += results[0].unit;
                            } else if (results[0].division.includes("교선")) {
                                //교선 분야 확인
                                if (results[0].etc_div.includes('사회과학')) {
                                    this.socialstudy = 1
                                } else if (results[0].etc_div.includes('국제어문')) {
                                    this.language = 1;
                                } else if (results[0].etc_iv.inclues('인문학')) {
                                    this.humanities = 1;
                                } else if (results[0].etc_idv.includes('숭실품성')) {
                                    this.ethics = 1;
                                }
                                curr_etc_select += results[0].unit;
                            }
                            if (results[0].targetstudent.includes('1학년')) {
                                if (this.semester < 2) {
                                    this.semester = 2;
                                }
                            } else if (results[0].targetstudent.includes('2학년')) {
                                if (this.semester < 4) {
                                    this.semester = 4;
                                }
                            } else if (results[0].targetstudent.includes('3학년')) {
                                if (this.semester < 6) {
                                    this.semester = 6;
                                }
                            }
                        }
                        search = true;
                    })
                //1학기과목
            if (search == false) {
                db.query('SELECT division,unit,etc_div,targetstudent from subject_1 where id=?', [attended[i]],
                    function(error, results, fields) {
                        if (results.length > 0) {
                            current += parseInt(results[0].unit);
                            //전공 및 교양 필수/선택 체크
                            if (results[0].division.includes("전기")) {
                                current_major_basic += results[0].unit;
                            } else if (results[0].division.includes("전필")) {
                                current_major_must += results[0].unit;
                            } else if (results[0].division.includes("전선")) {
                                curr_major_select += results[0].unit;
                            } else if (results[0].division.includes("교필")) {
                                curr_etc_must += results[0].unit;
                            } else if (results[0].division.includes("교선")) {
                                //교선 분야 확인
                                if (results[0].etc_div.includes('사회과학')) {
                                    this.socialstudy = 1
                                } else if (results[0].etc_div.includes('국제어문')) {
                                    this.language = 1;
                                } else if (results[0].etc_iv.inclues('인문학')) {
                                    this.humanities = 1;
                                } else if (results[0].etc_idv.includes('숭실품성')) {
                                    this.ethics = 1;
                                }
                                curr_etc_select += results[0].unit;
                            }
                            if (results[0].targetstudent.includes('1학년')) {
                                if (this.semester < 1) {
                                    this.semester = 1;
                                }
                            } else if (results[0].targetstudent.includes('2학년')) {
                                if (this.semester < 3) {
                                    this.semester = 3;
                                }
                            } else if (results[0].targetstudent.includes('3학년')) {
                                if (this.semester < 5) {
                                    this.semester = 5;
                                }
                            }
                        } else {
                            console.log("error occurred");
                        }

                    })
            }

        }

    }
}