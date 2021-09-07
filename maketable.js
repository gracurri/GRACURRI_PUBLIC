var db = require('./database')
const graduation_unit = 133; //졸업학점
const graduation_major = 51;
const graduation_major_basic = 18; //전공기초
const graduation_major_must = 15; //전공필수
const graduation_etc_must = 14; //교양필수
const graduation_etc_selection = 20; //교양선택
const graduation_major_without_basic = 66; //전공기초 제외 전공 요학점
const graduation_christ = 4;

var subjectcompare = function(attended, searchresult) { //들을 과목을 들은과목들과 비교, 들은 과목은 제외하고 다른 과목을 듣도록함.

}
exports.makeplan = function(req, res) { //학기들 계획짜는 함수

    var attended_names = [];
    var toatt = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ];
    db.query('USE subjects;');
    let user = storestatus(req);
    setTimeout(function() {
        var needed = {
            "major_must": graduation_major_must - user.current_major_must,
            "major_basic": graduation_major_basic - user.current_major_basic,
            "major_select": graduation_major - user.curr_major_select,
            "etc_must": graduation_etc_must - user.curr_etc_must,
            "etc_select": graduation_etc_selection - user.curr_etc_select
        };
        db.query('use gracurri_user;');
        for (var i = 0; i < user.attended.length; i++) {
            db.query('SELECT name from subject where id=?', [user.attended[i]], function(error, results, fields) {
                attended_names.push(results[0].name);
            });
        } //들은 과목들 이름을 불러옴(들은과목 넣어주는 것 방지위해)
        setTimeout(function() {
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
                    db.query('SELECT id,name,unit from subject_1 where division=전필-' + '?' + 'and targetstudent like' + db.escape('%' + toString(parseInt(currsem / 2)) + '학년' + user.major + '%'), [user.major],
                        function(error, results, fields) {
                            if (!error) {
                                let classname = [];
                                var unitsum = 0;
                                for (var i = 0; i < results.length; i++) {
                                    if (results[i].name.indexOf('(') != -1) { //주로 ()가 과목명에 존재함. 그 앞이 주된 과목명이기에 (를 기준으로 하였음.
                                        var temp = results[i].name.substring(0, results[i].name.indexOf('('));
                                        if (!classname.includes(temp)) {
                                            classname.push(temp);
                                            unitsum += results[i].unit;
                                        } else //똑같은 수업이 있으면
                                        {
                                            results.splice(i, 1);
                                            i = i - 1;
                                        }
                                    } else {
                                        if (!classname.includes(results[i].name)) {
                                            classname.push(results[i].name);
                                            unitsum += results[i].unit;
                                        } else {
                                            results.splice(i, 1);
                                            i = i - 1;
                                        }
                                    }
                                }
                            }
                            for (var i = 0; i < results.length; i++) {
                                toatt[currsem].push(results[i]);
                            }
                            max -= unitsum;
                            major_must -= unitsum;
                            needed.major_must -= unitsum;
                        })
                    if (currsem == 1) {
                        db.query('SELECT id,name,unit from subject_1 where division=전기-' + '?' + 'and targetstudent like' + db.escape('%' + toString(parseInt(currsem / 2)) + '학년' + user.major + '%'), [user.major],
                            function(error, results, fields) {
                                if (!error) {
                                    let classname = [];
                                    var unitsum = 0;
                                    for (var i = 0; i < results.length; i++) {
                                        if (results[i].name.indexOf('(') != -1) { //주로 ()가 과목명에 존재함. 그 앞이 주된 과목명이기에 (를 기준으로 하였음.
                                            var temp = results[i].name.substring(0, results[i].name.indexOf('('));
                                            if (!classname.includes(temp)) {
                                                classname.push(temp);
                                                unitsum += results[i].unit;
                                            } else //똑같은 수업이 있으면
                                            {
                                                results.splice(i, 1);
                                                i = i - 1;
                                            }
                                        } else {
                                            if (!classname.includes(results[i].name)) {
                                                classname.push(results[i].name);
                                                unitsum += results[i].unit;
                                            } else {
                                                results.splice(i, 1);
                                                i = i - 1;
                                            }
                                        }
                                    }
                                }
                                for (var i = 0; i < results.length; i++) {
                                    toatt[currsem].push(results[i]);
                                }
                                max -= unitsum;
                                needed.major_basic -= unitsum;
                            })
                    }
                    setTimeout(function() {
                        db.query('SELECT id,name,unit from subject_1 where division=전선-' + '?' + 'and targetstudent like' + db.escape('%' + toString(parseInt(currsem / 2)) + '학년' + user.major + '%'), [user.major],
                            function(error, results, fields) {
                                if (!error) {
                                    let classname = [];
                                    var unitsum = 0;
                                    for (var i = 0; i < results.length; i++) {
                                        if (results[i].name.indexOf('(') != -1) { //주로 ()가 과목명에 존재함. 그 앞이 주된 과목명이기에 (를 기준으로 하였음.
                                            var temp = results[i].name.substring(0, results[i].name.indexOf('('));
                                            if (!classname.includes(temp)) {
                                                classname.push(temp);
                                                unitsum += results[i].unit;
                                            } else //똑같은 수업이 있으면
                                            {
                                                results.splice(i, 1);
                                                i = i - 1;
                                            }
                                        } else {
                                            if (!classname.includes(results[i].name)) {
                                                classname.push(results[i].name);
                                                unitsum += results[i].unit;
                                            } else {
                                                results.splice(i, 1);
                                                i = i - 1;
                                            }
                                        }
                                    }
                                }
                                //이 중 남는 학점만큼 넣어야함.

                                for (var i = 0; i < results.length; i++) {
                                    toatt[currsem].push(results[i]);
                                }
                                max -= unitsum;
                            })
                    }, 100)

                } else if (currsem % 2 == 0) {
                    db.query('SELECT id,name,unit from subject where division=전필-' + '?' + 'and targetstudent like' + db.escape('%' + toString(parseInt(currsem / 2)) + '학년' + user.major + '%'), [user.major],
                        function(error, results, fields) {
                            if (!error) {
                                let classname = [];
                                var unitsum = 0;
                                for (var i = 0; i < results.length; i++) {
                                    if (results[i].name.indexOf('(') != -1) { //주로 ()가 과목명에 존재함. 그 앞이 주된 과목명이기에 (를 기준으로 하였음.
                                        var temp = results[i].name.substring(0, results[i].name.indexOf('('));
                                        if (!classname.includes(temp)) {
                                            classname.push(temp);
                                            unitsum += results[i].unit;
                                        } else //똑같은 수업이 있으면
                                        {
                                            results.splice(i, 1);
                                            i = i - 1;
                                        }
                                    } else {
                                        if (!classname.includes(results[i].name)) {
                                            classname.push(results[i].name);
                                            unitsum += results[i].unit;
                                        } else {
                                            results.splice(i, 1);
                                            i = i - 1;
                                        }
                                    }
                                }
                            }
                            for (var i = 0; i < results.length; i++) {
                                toatt[currsem].push(results[i]);
                            }
                            max -= unitsum;
                            major_must -= unitsum;
                            needed.major_must -= unitsum;
                        })
                    if (currsem == 2) {
                        db.query('SELECT id,name,unit from subject where division=전기-' + '?' + 'and targetstudent like' + db.escape('%' + toString(parseInt(currsem / 2)) + '학년' + user.major + '%'), [user.major],
                            function(error, results, fields) {
                                if (!error) {
                                    let classname = [];
                                    var unitsum = 0;
                                    for (var i = 0; i < results.length; i++) {
                                        if (results[i].name.indexOf('(') != -1) { //주로 ()가 과목명에 존재함. 그 앞이 주된 과목명이기에 (를 기준으로 하였음.
                                            var temp = results[i].name.substring(0, results[i].name.indexOf('('));
                                            if (!classname.includes(temp)) {
                                                classname.push(temp);
                                                unitsum += results[i].unit;
                                            } else //똑같은 수업이 있으면
                                            {
                                                results.splice(i, 1);
                                                i = i - 1;
                                            }
                                        } else {
                                            if (!classname.includes(results[i].name)) {
                                                classname.push(results[i].name);
                                                unitsum += results[i].unit;
                                            } else {
                                                results.splice(i, 1);
                                                i = i - 1;
                                            }
                                        }
                                    }
                                }
                                for (var i = 0; i < results.length; i++) {
                                    toatt[currsem].push(results[i]);
                                }
                                max -= unitsum;
                                needed.major_must -= unitsum;
                            })
                    }
                }
            }
        }, 100)

    }, 600)
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
    christian; //기독교과목
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