//회원가입 함수
window.onload = function(){

    var doc = document;
    const make = doc.getElementById('maketable');

    const sem = async()=>{



        fetch("http://localhost:3000/timetable")
        .then((res) => res.json())
        .then((res) => {
            console.log(res)
            if(res.code === ){

            }
        })
        .catch(err => {
            console.log('Fetch Error', err);
        });
    }
}

}