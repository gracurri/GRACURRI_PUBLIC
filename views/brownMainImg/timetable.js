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

    var deleteCookie = function(name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
    }

    var setCookie = function(name, value, exp) {
        var date = new Date();
        date.setTime(date.getTime() + exp*24*60*60*1000);
        document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
    };

    const semFunc = async()=>{
        localStorage.setItem('semester', requestSem);
        console.log(doc.cookie);
        location.href = 'http://localhost:3000/grade_sub'
    }

    one1.addEventListener('click', function(){
        requestSem = 'one';
        semFunc();
    });
    one2.addEventListener('click', function(){
        requestSem = 'two';
        semFunc();
    });
    two1.addEventListener('click', function(){
        requestSem = 'three';
        semFunc();
    });
    two2.addEventListener('click', function(){
        requestSem = 'four';
        semFunc();
    });
    three1.addEventListener('click', function(){
        requestSem = 'five';
        semFunc();
    });
    three2.addEventListener('click', function(){
        requestSem = 'six';
        semFunc();
    });
    four1.addEventListener('click', function(){
        requestSem = 'seven';
        semFunc();
    });
    four2.addEventListener('click', function(){
        requestSem = 'eight';
        semFunc();
    });
};

