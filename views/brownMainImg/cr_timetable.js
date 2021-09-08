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

    const sem = async()=>{
        // GET
        fetch("http://localhost:3000/time_set?id=" + userCookieId)
        .then((res) => res.json())
        .then((res) => {
            console.log(res)
            if(res.code === 200){
                location.assign('http://localhost:3000/cr_timetable');
                const countSubject = Object.keys(res.result).length;
                const time = doc.querySelector('.time');

                for(i = 0; i < countSubject; i++){
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

