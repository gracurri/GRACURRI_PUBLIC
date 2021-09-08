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
        doc.cookie = doc.cookie + ";semester=" + requestSem;
        location.href = 'http://localhost:3000/grade_sub'
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

