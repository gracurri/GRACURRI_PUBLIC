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
app.get('cr_timetable', function(req, res) {
    app.use(express.static('./views/brownMainImg'));
    res.sendFile(__dirname + '/views/brownMainImg/cr_timetable.html');
})

//routing ends
app.get('/search_class', function(req, res) { //과목검색
    console.log("search!");
    console.log(req.query);
    sdhandling.search(req.query.key, res);
})
app.get('/to_attend', async(query, res, next) => {
    let stringcode = ''
    let semreturn = '';
    if (query.semester === 'one') {
        semreturn = '1-1';
    } else if (query.semester === 'two') {
        semreturn = '1-2';
    } else if (query.semester === 'three') {
        semreturn = '2-1';
    } else if (query.semester === 'four') {
        semreturn = '2-2';
    } else if (query.semester === 'five') {
        semreturn = '3-1';
    } else if (query.semester === 'six') {
        semreturn = '3-2';
    } else if (query.semester === 'seven') {
        semreturn = '3-1';
    } else if (query.semester === 'eight') {
        semreturn = '3-2';
    }
    const names = [];
    const codestringquery = 'SELECT *from semesters WHERE EMAIL=sallybig@naver.com';
    try {
        let getResult = await performQuery(codestringquery)
        getResult.forEach((codes) => {
            /*if (query.semester === "one") {
                stringcode = codes.one;
            } else if (query.semester === "two") {
                stringcode = codes.two;
            } else if (query.semester === "three") {
                stringcode = codes.three;
            } else if (query.semester === "four") {
                stringcode = codes.four;
            } else if (query.semester === "five") {
                stringcode = codes.five;
            } else if (query.semester === "six") {
                stringcode = codes.six;
            } else if (query.semester === "seven") {
                stringcode = codes.seven;
            } else {
                stringcode = codes.eight;
            }*/
            res.send(codes);
            /*for (var i = 0; i < stringcode.length; i += 10) {
                var temp = stringcode.slice(i, i + 10);
                const mynamequery = "SELECT name from subject_1 WHERE id=" + temp;
                let getname = performQuery(mynamequery);
                names.push(getname[0].name);
                if (i >= stringcode.length - 1) {
                    res.send({
                        "code": 200,
                        "result": names,
                        "semester": semreturn
                    });
                }
            }*/

        })
    } catch (err) {
        res.send('ERROR');
    }
})
app.get('/time_set', function(req, res) {
        //cdhandling.getclasses(req.query, res);
        res.send({
            "code": 200,
            "result": ["테스트"],
            "timeandloc": ["월 09:00-10:15 (-)"]
        })
    })
    //post utility handling

app.post('/info_input', function(req, res) {
    cdhandling.storestatus(req, res).then(
        function(result) {
            let statres
            if (result) {
                tablemake.status(req.body.email, result).then(function(returns) {
                    statres = returns;
                });
            }
            return (statres);
        }
    ).then(function(result) {
        db.query('USE gracurri_user;');
        db.query('UPDATE users SET unit_attended=?,major_basic=?,major_must=?,major_select=?,etc_must=?,etc_select=?,ethics=?,language=?,humanities=?,socialstudy=?,semester=?', [result[0], result[1], result[2], result[3], result[4], result[5], result[6], result[7], result[8], result[9], result[10], result[11], result[12]]);
        return (req.body.email)
    }).then(tablemake.planmake(get).then(
        function(respond) {
            res.send(respond);
        }
    ));
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