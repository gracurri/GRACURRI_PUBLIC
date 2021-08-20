//회원가입 함수
window.onload = function(){

    //자주 쓰는 것들
        var doc = document;
        const searchClass = doc.getElementById('search_class');
        const searchClassFunc = async()=>{
    
            //서버 맞춰서 수정해야함
            fetch("http://localhost:3000/search_class?key" + searchClass)
                
            .then((res) => res.json())
            .then((res) => {
                console.log(res)
            })
            .catch(err => {
                // error 처리
                console.log('Fetch Error', err);
            });
        }
        
        idCheck.addEventListener('click', emailCheckFunc);
        sign.addEventListener('click', signUpCondition);
    }