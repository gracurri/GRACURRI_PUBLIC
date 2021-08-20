window.onload = function(){

    var doc = document;
    const login = doc.getElementById('loginBtn');

    const signIn = async()=>{
        
        const userid = doc.getElementById('userId').value;
        const userpass = doc.getElementById('userPass').value;

        if (!userid){
            alert('아이디를 입력하세요.');
            doc.getElementById('userId').focus();
            return;
        }
    
        if (!userpass){
            alert('비밀번호를 입력하세요.');
            doc.getElementById('userPass').focus();
            return;
        }

        const resultSignUp = [userid, userpass]
        

        //서버 맞춰서 수정해야함
        fetch("http://localhost:3000/sign_in", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                    id: resultSignUp[0],
                    PW: resultSignUp[1],
                }),
        })

        .then((res) => res.json())
        .then((res) => {
            console.log(res)
            //location.replace('../grade_sub.html')
        })
        .catch(err => {
            // error 처리
            console.log('Fetch Error', err);
            
        });
    }

    const click =()=>{
        alert('click')
        console.log('click')
    }

    login.addEventListener('click', click);
}