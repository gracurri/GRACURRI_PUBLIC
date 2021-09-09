//npm , mysql , express , node,cors 다운받아야함.
var path = require('path');
var express = require('express');
var app = express()
var url = require('url')
var qs = require('querystring')
app.use(express.static('views'))
var udhandling = require('./userdb_handling')
var cdhandling = require('./classesdbhandling')
var sdhandling = require('./subjectdbhandling')
var tablemake = require('./tablemaker');
var db = require('./database');
const util = require('util');
var sql = require('mysql');
var dbconfig = require('./sqlconfig.json')
    //var cors = require('cors')
app.use(express.json());
//app.use(cors());
//routing

app.get('/', function(req, res) {
    app.use(express.static('views/signin_img'))
    res.sendFile(__dirname + "/views/signin_img/realmain.html")
})
app.get('/timetable', function(req, res) {
    app.use(express.static('views/brownMainImg'))
    res.sendFile(__dirname + "/views/brownMainImg/timetable.html")
})
app.get('/signup', function(req, res) {
    app.use(express.static('views/signup_img'))
    res.sendFile(__dirname + "/views/signup_img/sign_up.html")
})
app.get('/question', function(req, res) {
    app.use(express.static('views/question'))
    res.sendFile(__dirname + "/views/question/question.html")
})
app.get('/modify_pw', function(req, res) {
    app.use(express.static('views/modify_pw'))
    res.sendFile(__dirname + '/views/modify_pw/modify_pw.html')
})
app.get('/realmain', function(req, res) {
    app.use(express.static('views/signin_img'))
    res.sendFile(__dirname + '/views/signin_img/realmain.html')
})
app.get('/info_input', function(req, res) {
    app.use(express.static('views/info_input_img'))
    res.sendFile(__dirname + '/views/info_input_img/info_input.html')
})
app.get('/question', function(req, res) {
    app.use(express.static('views/question'));
    res.sendFile(__dirname + '/views/question/question.html');
})
app.get('/grade_sub', function(req, res) {
    app.use(express.static('views'));
    res.sendFile(__dirname + '/views/grade_sub.html');
})
app.get('/new_timetable', function(req, res) {
    app.use(express.static('./views/brownMainImg'));
    res.sendFile(__dirname + '/views/brownMainImg/new_timetable.html');
})

//routing ends
app.get('/search_class', function(req, res) { //과목검색
    console.log("search!");
    console.log(req.query);
    sdhandling.search(req.query.key, res);
})
app.get('/to_attend', function(req, res) { //gradesub
    cdhandling.gettoattend(req, res, req.query.email, req.query.semester);
})
app.get('/name', function(req, res) {
    cdhandling.getname(req, res);
})
app.get('/time_set', function(req, res) { //시간표
    //cdhandling.getclasses(req.query, res);
    res.send({
        "code": 200,
        "result": ["테스트", "테스트2"],
        "timeandloc": ["월 수 09:00-10:15 (-)", "목 12:00-13:15 (-)"]
    })
})

//post utility handling

app.post('/info_input', function(req, res, next) {
    db.query('USE gracurri_user;');
    db.query('UPDATE users_classes_attended SET classcodes=? WHERE EMAIL=?', [cdhandling.classcodeadd(req), req.body.email]);
    db.query('UPDATE user SET unit_attended=?,major_basic=?,major_must=?,major_select=?,etc_must=?,etc_select=?,ethics=?,language=?,humanities=?,socialstudy=?,semester=?', tablemake.status(req.body.email, req.body.classcodes))
    next();
}, function(req, res) {
    res.send({
        "code": 200
    })
    res.end();
});
app.post('/makeplan', function(req, res, next) {
    db.query('SELECT unit_attended,major_basic,major_must,major_select,etc_must,etc_select,ethics,language,humanities,socialstudy,semester,major from user where EMAIL=?', [req.body.email],
        function(error, result) {
            if (error) {
                res.send({
                    "code": 400,
                    "result": error.message
                })
            } else {
                if (result.length > 0) {
                    if (tablemake.planmake(result[0], req.body.email)) {
                        res.send({
                            "code": 200,
                            "result": "success"
                        })
                    } else {
                        res.send({
                            "code": 400,
                            "result": "fail"
                        })
                    }
                }
            }
        })
})
app.post('/signup', function(req, res) {
    console.log("회원가입 발생");
    udhandling.signup(req.body, res);
    udhandling.signup2(req.body, res);

})
app.post('/emailcheck', function(req, res) {
    console.log("email check");
    console.log(req.body);
    udhandling.emailcheck(req.body, res);
})
app.post('/sign_in', function(req, res) {
    console.log("signin");
    console.log(req.body.id);
    udhandling.signin(req, res);
})
app.post('/modify_pw', function(req, res) {
    console.log(req.body.number);
    console.log("modification accurred");
    udhandling.modifypw(req.body, res);
})
app.post('/question', function(req, res) {
    console.log("question!");
    console.log(req.body);
    udhandling.question(req.body, res);
})

app.listen(3000, function() {
    console.log('server is running');
});