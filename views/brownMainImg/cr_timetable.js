//회원가입 함수
window.onload = function(){

    var doc = document;
    const make = doc.getElementById('maketable');

    var getCookie = function(name) {
        var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return value? value[2] : null;
    };  

    let userCookieId = getCookie('userid');

    function mTalbe(data){
        var table = doc.getElementById('target');

        for(var i = 0; i < data.length; i++){
            var row = '<tr> <td>'
            row += i;
            row += '<td>';
            row += '<td>$(data[i].name</td> </tr>'

            table.innerHTML += row;
        }
    }

    function timetonum(str){    // 시간 교시로 바꾸는 함수
        switch(str){
            case "09:00-10:15":
                str = 1;
                break;
            case "10:30-11:45":
                str = 2;
                break;
            case "12:00-13:15":
                str = 3;
                break;
            case "13:30-14:45":
                str = 4;
                break;
            case "15:00-16:15":
                str = 5;
                break;
            case "16:30-17:45":
                str = 6;
                break;
            case "18:00-19:15":
                str = 7;
                break;
            case "19:30-20:45":
                str = 8;
                break;
            case "21:00-22:15":
                str = 9;
                break;
    }
    
    function daytime(arr){
        var day1 = arr[0];
        if(arr[1] == "월" || arr[1] == "화" || arr[1] == "수" || arr[1] == "목" || arr[1] == "금"){     // 일주일에 2번인 수업
            timetonum(arr[2]);
        }
        else{   // 바로 숫자 나오면 일주일에 한번인 수업, str = 시간
            timetonum(arr[1]);  // 교시로 바꿔주기
            if(arr[3] == arr[0]){     // 1교시 이상인 수업
                arr[3] = arr[1] + 1;
            }
    }
    

    const sem = async()=>{
        // GET
        fetch("http://localhost:3000/time_set?email=" + userCookieId)
        .then((res) => res.json())
        .then((res) => {
            console.log(res)
            if(res.code === 200){
                location.assign('http://localhost:3000/cr_timetable');
                const countSubject = Object.keys(res.result).length;
                var talarr = res.timeandloc;
                const time = doc.querySelector('.time');

                for(i = 0; i < countSubject; i++){

                    var arr = talarr[i].split(' ');

                    const subjectTr = doc.createElement('tr');
                    const subjectTd = doc.createElement('td');
                    const subjectTh = doc.createElement('th');
                    var day;
                    switch(day){
                        case "월":
                            subjectTd.appendChild(res.result[i].name);
                            subjectTd.appendChild("<td></td><td></td><td></td><td></td>");
                            break;
                        case "화":
                            subjectTd.appendChild("<td></td>");
                            subjectTd.appendChild(res.result[i].name);
                            subjectTd.appendChild("<td></td><td></td><td></td>");
                            break;
                        case "수":
                            subjectTd.appendChild("<td></td><td></td>");
                            subjectTd.appendChild(res.result[i].name);
                            subjectTd.appendChild("<td></td><td></td>");
                            break;
                        case "목":
                            subjectTd.appendChild("<td></td><td></td><td></td>");
                            subjectTd.appendChild(res.result[i].name);
                            subjectTd.appendChild("<td></td>");
                            break;
                        case "금":
                            subjectTd.appendChild("<td></td><td></td><td></td><td></td>");
                            subjectTd.appendChild(res.result[i].name);
                            break;
                    }

                }

            }
        })
        .catch(err => {
            console.log('Fetch Error', err);
        });
    }

    make.addEventListener('click', sem);
}
}
}

    