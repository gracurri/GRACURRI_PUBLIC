window.onload = function(){

    var doc = document;

    const questionPW = doc.getElementById('continue');
    const userinfo = async()=>{

        const username = doc.getElementById('userName').value;
        const userid = doc.getElementById('userId').value;
        const userschool = doc.getElementById('userSchool').value;
        const userhint = doc.getElementById('userHint').value;


        if (!username){
            alert('이름을 입력하세요.');
            doc.getElementById('userName').focus();
            return;
        }

        if (!userid){
            alert('아이디를 입력하세요.');
            doc.getElementById('userId').focus();
            return;
        }

        if (!userschool){
            alert('학번을 입력하세요.');
            doc.getElementById('userSchool').focus();
            return;
        }

        if (!userhint){
            alert('비밀번호 힌트를 입력하세요.');
            doc.getElementById('userHint').focus();
            return;
        }
        
        const resultQuestion = [username, userid, userschool, userhint]

        alert(resultQuestion)
    
    
        //서버 맞춰서 수정해야함
        fetch("http://localhost:3000/question", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: resultQuestion[0],
                id: resultQuestion[1],
                number: resultQuestion[2],
                passwordHint: resultQuestion[3],
            }),
        })
    
        .then((res) => res.json())
        .then((res) => {
            console.log(res)
            if(res.code === 200){
                console.log(res)
                alert('회원정보가 확인되었습니다.')
                location.href="../modify_pw"
            }
        })
        .catch(err => {
            // error 처리
            console.log('Fetch Error', err);
            location.replace('../grade_sub')
        });
    }

    questionPW.addEventListener('click', userinfo);

}