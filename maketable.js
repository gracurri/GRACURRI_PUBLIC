var db = require('./database')
const graduation_unit = 133; //졸업학점
const graduation_major_basic = 18; //전공기초
const graduation_major_must = 15; //전공필수
const graduation_etc_must = 14; //교양필수
const graduation_etc_selection = 20; //교양선택
const graduation_major_without_basic = 66; //전공기초 제외 전공 요학점
const graduation_christ = 4;
exports.storestatus = function(req) {
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
    db.query('UPDATE users SET unit_attended=?,major_basic=?,major_must=?,major_select=?,etc_must=?,etc_select=?,ethics=?,language=?,humanities=?,socialstudy=?;', [user.current, user.current_major_basic, user.current_major_must, user.curr_major_select, user.curr_etc_must, user.curr_etc_select, user.ethics, user.humanities, user.socialstudy],
        function(error, results, fileds) {
            if (error) {
                console.log('error occurred during unit pushing'); //error detecting
            }
        }
    );


}
exports.makeplan = function(req) { //학기들 계획짜는 함수
    var attended = [];
    db.query('USE gracurri_user;');
    db.query('SELECT classcodes from users_classes_attended WHERE EMAIL=?', [req.body.id])

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
    constructor(attended) {
        db.query('USE subjects;');
        for (var i = 0; i < length(attended); i++) {
            db.query('SELECT division,unit,etc_div,targetstudent from subject where id=?', [attended[i]], function(error, results, fields) {
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
            })
        }

    }
}