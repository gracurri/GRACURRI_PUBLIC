//회원가입 함수
window.onload = function(){

    var doc = document;
    const make = doc.getElementById('maketable');

    var name;
    var time;
    var day;

    const sem = async()=>{
        // GET
        fetch("http://localhost:3000/timetable")
        .then((res) => res.json())
        .then((res) => {
            console.log(res)
            if(res.code === 200){

            }
        })
        .catch(err => {
            console.log('Fetch Error', err);
        });
    }

    make.addEventListener('click', sem);
}

