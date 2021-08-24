window.onload=function(){
    new Swiper('.swiper-container')

    var doc = document;

    const one1 = doc.getElementById('11');
    const one2 = doc.getElementById('12');
    const two1 = doc.getElementById('21');
    const two2 = doc.getElementById('22');
    const three1 = doc.getElementById('31');
    const three2 = doc.getElementById('32');
    const four1 = doc.getElementById('41');
    const four2 = doc.getElementById('42');

    const sem = async()=>{
        // 데이터 get
        fetch("http://localhost:3000/to_attend")
        .then((res) => res.json())
        .then((res) => {
            console.log(res)
            if(res.code === 200){
                const userid = res.id;
                const grade = res.semester;
            }
        })
        .catch(err => {
            console.log('Fetch Error', err);
        });
    }

    one1.addEventListener('click', sem);
    one2.addEventListener('click', sem);
    two1.addEventListener('click', sem);
    two2.addEventListener('click', sem);
    three1.addEventListener('click', sem);
    three2.addEventListener('click', sem);
    four1.addEventListener('click', sem);
    four2.addEventListener('click', sem);
};
