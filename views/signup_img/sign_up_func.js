//회원가입 함수
window.onload = function(){

    //자주 쓰는 것들
        var doc = document;
        const sign = doc.getElementById('signUp');
        const idCheck = doc.getElementById('id_request');
    
    //회원가입 함수
        const signUpCondition = async()=>{
            // 비밀번호 조건
            var pw_passed = true; 
            
            const userid = doc.getElementById('userId').value;
            const userpass = doc.getElementById('userPass').value;
            const userconfirm = doc.getElementById('userConfirm').value;
            const username = doc.getElementById('userName').value;
            const userschool = doc.getElementById('userSchool').value;
            const userhint = doc.getElementById('userHint').value;
    
            //https://velog.io/@___/javascripthtml-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%ED%8E%98%EC%9D%B4%EC%A7%80-%EA%B5%AC%ED%98%84
            //회원가입 조건 추가하기 (비밀번호, 이메일 조건)
            //모든 빈칸에 대한 확인
    
            var pattern1 = /[0-9]/;
            var pattern2 = /[a-zA-Z]/;
            var pattern3 = /[~!@\#$%<>^&*]/;     // 원하는 특수문자 추가 제거
            var pw_msg = "";
    
            pw_passed = true;
    
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
    
                doc.getElementById('userPass').focus();
                return;
            }
            if(!pattern1.test(userpass)||!pattern2.test(userpass)||!pattern3.test(userpass)||userpass.length<8||userpass.length>32){
                alert("영문+숫자+특수기호 8자리 이상으로 구성하여야 합니다.");
                return false;
            }          
    
            if (!userhint){
                alert('비밀번호 힌트를 입력하세요.');
                doc.getElementById('userHint').focus();
                return;
            }
    
            if (!username){
                alert('이름을 입력하세요.');
                doc.getElementById('userName').focus();
                return;
            }
    
            if (!userschool){
                alert('학번을 입력하세요.');
                doc.getElementById('userSchool').focus();
                return;
            }
    
    
            //학과 선택 여부 확인
            var selectedDepartment = ["globalMedia", "computer"];
            var radioButton;
            var checkedDP; //정보 담긴 것
    
            for(var i = 0; i < 2; i++){
                radioButton = doc.getElementById(selectedDepartment[i]);
                if (radioButton.checked == true){
                    checkedDP = selectedDepartment[i];
                }
            }
            if (checkedDP == null){
                alert("학과를 선택하세요.");
                return;
            }
    
            const resultSignUp = [userid, userpass, userhint, username, userschool, checkedDP]
            
            alert(resultSignUp)
    
            //서버 맞춰서 수정해야함
            fetch("http://localhost:3000/signup", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                        id: resultSignUp[0],
                        password: resultSignUp[1],
                        passwordHint: resultSignUp[2],
                        name: resultSignUp[3],
                        number: resultSignUp[4],
                        department: resultSignUp[5],
                    }),
            })
            .then((res) => res.json())
            .then((res) => {
                if(res.code === 200){
                    console.log(res)
                    alert('회원가입을 축하드립니다!')
                    doc.cookie = "userid=" + resultSignUp[0]
                    alert(doc.cookie)
                    location.replace('http://localhost:3000/info_input')
                }
            })
            .catch(err => {
                // error 처리
                console.log('Fetch Error', err);
                location.replace('../grade_sub.html')
            });
        }
        
        // 이메일 중복확인
        const emailCheckFunc =()=> {
            const userid = doc.getElementById('userId').value;
            
                        // 서버 주소
            fetch("http://localhost:3000/emailcheck", {
                method: 'POST',
                body: JSON.stringify({ id: userid }),
                headers: {
                    "Content-Type": "application/json"
                },
            })
            
            .then((res) => res.json())
            .then((res) => {
                console.log(res)
                if(res.code === 200){
                    if (res.result === "true") {       // 중복 O
                        alert("이미 존재하는 아이디입니다.");
                        userid = "";    // 입력값 지우기
                        document.getElementById('signupbtn').disabled = true; // 가입하기 버튼 비활성화
                    } 
                    else{                          // 중복 X
                        alert("사용가능한 아이디입니다.");
                    }
                }
            }
            )
            .catch(err => {
                // error 처리
                console.log('Fetch Error', err);
            });
        }
        
        idCheck.addEventListener('click', emailCheckFunc);
        sign.addEventListener('click', signUpCondition);
        // postSignUp();
    }