//회원가입 함수
window.onload = function(){

    var doc = document;
    const make = doc.getElementById('maketable');

    var name;
    var time;
    var day;

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
                location.assign('http://localhost:3000/grade_sub');
                const countSubject = Object.keys(res.result).length;
                const time = doc.querySelector('.time');

                for(i = 0; i < countSubject; i++){
                    const subjectTr = doc.createElement('tr');
                    const subjectTd = doc.createElement('td');
                    const subjectTh = doc.createElement('th');
                for(t = 1; t <= 9; t++){     // 9교시까지 존재해서
    
                        subjectTh.appendChild(t);
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

