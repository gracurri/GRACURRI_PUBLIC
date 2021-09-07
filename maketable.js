var db = require('./database')
const graduation_unit = 133; //졸업학점
const graduation_major = 51;
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
    db.query('SELECT major from users where EMAIL=?', [req.body.id], function(error, results) {
        if (results.length > 0) {
            if (results[0].major === 'computer') {
                user.major = '컴퓨터';
            } else if (results[0].major === 'globalMedia') {
                user.major = '글로벌미디어';
            }
        }
    });
    return user;
}
var subjectssearch = function(req, res) { //들을 과목을 들은과목들과 비교, 들은 과목은 제외하고 다른 과목을 듣도록함.

}
exports.makeplan = function(req, res) { //학기들 계획짜는 함수

    var attended_names = []
    db.query('USE subjects;');
    var needed = {
        "major_must": graduation_major_must - user.current_major_must,
        "major_basic": graduation_major_basic - user.current_major_basic,
        "major_select": graduation_major - user.curr_major_select,
        "etc_must": graduation_etc_must - user.curr_etc_must,
        "etc_select": graduation_etc_selection - user.curr_etc_select
    };
    let user = storestatus(req);
    db.query('use gracurri_user;');
    for (var i = 0; i < user.attended.length; i++) {
        db.query('SELECT name from subject where id=?', [user.attended[i]], function(error, results, fields) {
            attended_names.push(results[0].name);
        });
    } //들은 과목들 이름을 불러옴(들은과목 넣어주는 것 방지위해)
    let currsem = user.semester + 1; //알고리즘 진행과정에서의 현재 학기
    while (currsem < 9) { //GREEDY 알고리즘
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
        if (currsem % 2 == 1) { //1학기과목들
            db.query('SELECT id,name from subject_1 where division=전필-' + '?' + 'and targetstudent like' + db.escape('%' + toString(parseInt(currsem / 2)) + '학년' + user.major + '%'), [user.major],
                function(error, results, fields) {

                })
        }
    }
}
class userstatus {
    current; //현재 이수학점
    current_major_basic; //현재 이수 전공기초학점
    current_major_must; //현재 이수 전공필수학점
    curr_major_select; //현재 이수 전공선택학점
    curr_etc_must; //현재 이수 필수교양학점
    curr_etc_select; //현재 이수 선택교양학점
    ethics; //품성교양
    language; //언어교양
    humanities; //인문학교양
    socialstudy; //사회과학교양
    christion; //기독교과목
    semester;
    attended = [];
    major = '';
    constructor(attended) {
        this.attended = attended;
        db.query('USE subjects;');
        for (var i = 0; i < length(attended); i++) {
            var search = false;
            //2학기과목
            db.query('SELECT division,unit,etc_div,targetstudent from subject,subject_1 where id=?', [attended[i]],
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
                })
        }

    }

}