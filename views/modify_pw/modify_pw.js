// 비밀번호 조건 설정 함수
window.onload = function(){
    // 공동으로 사용
    var doc = document;

    // 비밀번호 변경
    const modify = doc.getElementById('submitbtn');
    const pwCheck = async()=>{

        var pw_passed = true; 
        
        const userpass = doc.getElementById('userPass').value;
        const userconfirm = doc.getElementById('userConfirm').value;
    
        var pattern1 = /[0-9]/;
        var pattern2 = /[a-zA-Z]/;
        var pattern3 = /[~!@\#$%<>^&*]/;
        var pw_msg = "";

        pw_passed = true;

        if (!userpass){
            alert('비밀번호를 입력하세요.');
            doc.getElementById('userPass').focus();
            return;
        }
        if (!userconfirm){
            alert('비밀번호를 입력하세요.');
            doc.getElementById('userPass').focus();
            return;
        }
        //비밀번호 확인
        if(userpass!=userconfirm){
            alert('비밀번호가 서로 다릅니다.');
            doc.getElementById('userPass').value='';
            doc.getElementById('userConfirm').value='';
            return;
        }

        if(!pattern1.test(userpass)||!pattern2.test(userpass)||!pattern3.test(userpass)||userpass.length<8||userpass.length>32){
            alert("영문+숫자+특수기호(~!@\#$%<>^&*) 8자리 이상으로 구성하여야 합니다.");
            return false;
        }    
        
        
        // question에서 데이터 가져오기
        fetch("http://localhost:3000/question")
        .then((res) => res.json())
        .then((res) => {
            console.log(res)
            if(res.code === 200){
                const userid = res.id;
            }
        })
        .catch(err => {
            console.log('Fetch Error', err);
            location.replace('../grade_sub')
        });

        const resultModify = [userpass, userid];
        alert(resultModify)
    
        //서버 맞춰서 수정해야함
        fetch("http://localhost:3000/modifypw", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                    password: resultModify[0],
                    id: resultModify[1],
                }),
        })
    
        .then((res) => res.json())
        .then((res) => {
            console.log(res)
            if(res.code === 500){   // error
                console.log('Fetch Error', err);
                location.replace('../grade_sub')
            }
            else{
                alert('비밀번호 변경이 완료되었습니다.')
                location.href = "../signup_img/realmain"
            }
        })
    }

    modify.addEventListener('click', pwCheck);

}