function getLoginInfo(){

    var url = new URL("http://localhost:3000/sign_in")

    const config = {
        headers : { 
            'Accept': 'application/json'
        }
    }

    fetch(url, config)
    .then(res => {
        // response 처리
        console.log(res);
        // 응답을 JSON 형태로 파싱
        return res.json();
        })

        .then(data => {
        // json 출력
        console.log(data.id)
        document.cookie = "cookie1 = " + data.id + ";"
        })
        .catch(err => {
        // error 처리
        console.log('Fetch Error', err);
    });

    readCookie();
}


function readCookie(){
    var txt = "";
    var ans = "";
    if (document.cookie != ""){
        txt = document.cookie.split(";"); // ';'를 기준으로 split
        for(i in txt){
            // name과 value 모두 있는 쿠키만 ans에 넣어준다.
            if (txt[i][txt[i].length - 1] != "=") { 
                ans += txt[i];
            }
        }
    }
        // 쿠키가 존재하지 않았을 경우
    if (ans == "")
        alert("쿠키가 없습니다.");
    // 쿠키가 존재할 경우 alert(ans); 
    else
        document.getElementById('loginDone').innerText = ans + "님";
        document.getElementById('btn3').style.display = "none";
        document.getElementById('btn4').style.display = "none";
    //여기에 톱바에 로그인 정보 띄우기
        
}