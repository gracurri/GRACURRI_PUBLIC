window.onload=function(){

    var doc = document;

    const one1 = doc.getElementById('11');
    const one2 = doc.getElementById('12');
    const two1 = doc.getElementById('21');
    const two2 = doc.getElementById('22');
    const three1 = doc.getElementById('31');
    const three2 = doc.getElementById('32');
    const four1 = doc.getElementById('41');
    const four2 = doc.getElementById('42');

    
    let requestSem;

    var getCookie = function(name) {
        var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return value? value[2] : null;
    };  

    let userCookieId = getCookie('userid');

    const sem = async()=>{
        // 데이터 get
        fetch("http://localhost:3000/to_attend?semester=" + requestSem + "&email=" + userCookieId)
        .then((res) => res.json())
        .then((res) => {
            console.log(res)
            if(res.code === 200){
                location.assign('http://localhost:3000/grade_sub');
                let semester = doc.getElementById('semester');
                semester.innerText = grade + "의"
                //res.result는 서버 응답 맞춰서 수정해야함
                const countSubject = Object.keys(res.result).length
                const bread = doc.querySelector('.bread')

                for(i = 0; i < countSubject; i++){
                    const subjectDiv = doc.createElement('div');
                    const subjectP = doc.createElement('p');
                    //name은 나중애 서버 응답 맞춰서 수정해야함
                    const subjectName = doc.createTextNode(res.result[i].name)

                    subjectP.appendChild(subjectName)
                    subjectP.classList.add('subject')

                    subjectDiv.appendChild(subjectP)
                    subjectDiv.classList.add('list')

                    subjectResult.appendChild(bread);
                }
            }
        })
        .catch(err => {
            console.log('Fetch Error', err);
        });
    }

    one1.addEventListener('click', function(){
        requestSem = 'one';
        sem();
    });
    one2.addEventListener('click', function(){
        requestSem = 'two';
        sem();
    });
    two1.addEventListener('click', function(){
        requestSem = 'three';
        sem();
    });
    two2.addEventListener('click', function(){
        requestSem = 'four';
        sem();
    });
    three1.addEventListener('click', function(){
        requestSem = 'five';
        sem();
    });
    three2.addEventListener('click', function(){
        requestSem = 'six';
        sem();
    });
    four1.addEventListener('click', function(){
        requestSem = 'seven';
        sem();
    });
    four2.addEventListener('click', function(){
        requestSem = 'eight';
        sem();
    });
};

