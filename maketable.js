var db = require('./database')
const graduation_unit = 133; //졸업학점
const graduation_major_basic = 18; //전공기초
const graduation_major_must = 15; //전공필수
const graduation_etc_must = 14; //교양필수
const graduation_etc_selection = 20; //교양선택
const graduation_major_without_basic = 66; //전공기초 제외 전공 요학점
const graduation_chapel = 6;
const graduation_christ = 4;
exports.makeplan = function(req, res) {
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
                let user = new userstatus(attended);
            }
        })
}
class userstatus {
    current = 0; //현재 이수학점
    current_major_basic = 0; //현재 이수 전공기초학점
    current_major_must = 0; //현재 이수 전공필수학점
    curr_etc_must = 0; //현재 이수 필수교양학점
    curr_etc_select = 0; //현재 이수 선택교양학점
    ethics = false; //품성교양
    language = false; //언어교양
    humanities = false; //인문학교양
    socialstudy = false; //사회과학교양
    christion = 0; //기독교과목
    constructor(attended) {
        db.query('USE subjects;');
        for (var i = 0; i < length(attended); i++) {
            db.query('SELECT division,unit,etc_div from subject where id=?', [attended[i]], function(error, results, fields) {
                current += parseInt(results[0].unit);
                //전공 및 교양 필수/선택 체크
                if (results[0].division.includes("전기")) {
                    current_major_basic += results[0].unit;
                } else if (results[0].division.includes("전필")) {
                    current_major_must += results[0].unit;
                } else if (results[0].division.includes("교필")) {
                    curr_etc_must += results[0].unit;
                } else if (results[0].division.includes("교선")) {
                    //교선 분야 확인
                    if (results[0].etc_div.includes('사회과학')) {
                        this.socialstudy = true;
                    }
                    curr_etc_select += results[0].unit;
                }
            })
        }

    }
}