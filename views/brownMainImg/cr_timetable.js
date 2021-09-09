window.onload = function(){
    console.log('온로드')

    var doc = document;
    const make = doc.getElementById('maketable');

    var getCookie = function(name) {
        var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return value? value[2] : null;
    };  


    function timetonum(str){    // 시간 교시로 바꾸는 함수
        switch(str){
            case "09:00-10:15":
                str = 1;
                break;
            case "10:30-11:45":
                str = 2;
                break;
            case "12:00-13:15":
                str = 3;
                break;
            case "13:30-14:45":
                str = 4;
                break;
            case "15:00-16:15":
                str = 5;
                break;
            case "16:30-17:45":
                str = 6;
                break;
            case "18:00-19:15":
                str = 7;
                break;
            case "19:30-20:45":
                str = 8;
                break;
            case "21:00-22:15":
                str = 9;
                break;
        }
        return str;
    }
    
    function daytime(arr){
        if(arr[1] == "월" || arr[1] == "화" || arr[1] == "수" || arr[1] == "목" || arr[1] == "금"){     // 일주일에 2번인 수업
            arr[2] = timetonum(arr[2]);
            arr.push('two');
        }
        else{   // 바로 숫자 나오면 일주일에 한번인 수업, str = 시간
            arr[1] = timetonum(arr[1]);  // 교시로 바꿔주기
            if(arr[3] == arr[0]){     // 1교시 이상인 수업
                arr[3] = arr[1] + 1;
                arr.push('one2');
            }
            else{   // 1교시만 하는 수업
                arr.push('one1');
            }
        }
        return arr;
    }

    const sem =()=>{
        let userCookieId = getCookie('userid');
        console.log(userCookieId)
        
        // GET
        fetch("http://localhost:3000/time_set?email=" + userCookieId)
        .then((res) => res.json())
        .then((res) => {
            console.log(res)
            if(res.code === 200){
                const countSubject = Object.keys(res.result).length;
                var talarr = res.timeandloc;

                let Montd = doc.createElement('TD');
                let MonDiv = doc.createElement('div');
                let MonP = doc.createElement('p');
                let monTh = doc.querySelector('.monTh');

                let Tuetd = doc.createElement('td');
                let TueDiv = doc.createElement('div');
                let TueP = doc.createElement('p');
                let tueTh = doc.querySelector('.tueTh');

                let Wedtd = doc.createElement('td');
                let WedDiv = doc.createElement('div');
                let WedP = doc.createElement('p');
                let wedTh = doc.querySelector('.wedTh');

                let Thutd = doc.createElement('td');
                let ThuDiv = doc.createElement('div');
                let ThuP = doc.createElement('p');
                let thuTh = doc.querySelector('.thuTh');

                let Fritd = doc.createElement('td');
                let FriDiv = doc.createElement('div');
                let FriP = doc.createElement('p');
                let friTh = doc.querySelector('.friTh');

                Montd = doc.createElement('TD');

                for(i = 0; i < countSubject; i++){
                    const color = ['rgb(167, 90, 86)', 'rgb(86, 133, 89)', 'rgb(139, 88, 33)', 'rgb(255, 170, 0)', 'rgb(217, 103, 85)']
                    const selectedColor = color[Math.floor(Math.random() * color.length)]

                    let resultI = doc.createTextNode(res.result[i]);
                    var arr = talarr[i].split(' ');
                    arr = daytime(arr); 
                    console.log(arr);

                    // indexOf(" ")로 하면 일주일에 2번인것도 포함됨.
                    if(arr.indexOf('월') != -1){
                        console.log('월요일 시작')     
                        MonDiv = doc.createElement('div');
                        MonP = doc.createElement('p');
                        MonP.appendChild(resultI);
                        MonP.style.lineHeight = '20px';
                        MonP.style.marginBlockStart = '0';
                        MonP.style.marginBlockEnd = '0';
                        MonDiv.style.position = 'absolute';
                        MonDiv.style.height = '60px';

                        if(arr.indexOf('one2') != -1){  // 2교시 이면
                            MonDiv.style.height = '100px';
                            MonDiv.style.top = (30+ 60*(arr[2] - 1))+'px';
                        }

                        if(arr.indexOf('one1') != -1){
                            MonDiv.style.height = '60px';
                            MonDiv.style.top = (30+ 60*(arr[1] - 1))+'px';
                        }
                        if(arr.indexOf('two') != -1){
                            MonDiv.style.height = '60px';
                            MonDiv.style.top = (30+ 60*(arr[1] - 1))+'px';
                        }

                        MonDiv.style.width = '78px';
                        MonDiv.style.zIndex = 10;
                        MonDiv.style.backgroundColor = selectedColor;
                        MonDiv.style.textAlign = 'center';

                        MonDiv.appendChild(MonP);
                        monTh.appendChild(MonDiv);
                        
                        console.log(resultI)     
                    }
                    if(arr.indexOf('화') != -1){
                        TueDiv = doc.createElement('div');
                        TueP = doc.createElement('p');
                        
                        TueP.appendChild(resultI);
                        TueP.style.lineHeight = '20px';
                        TueP.style.marginBlockStart = '0';
                        TueP.style.marginBlockEnd = '0';
                        TueDiv.style.position = 'absolute';
                        if(arr.indexOf('one2') != -1){  // 2교시 이면
                            TueDiv.style.height = '100px';
                            TueDiv.style.top = (30+ 60*(arr[2] - 1))+'px';
                        }
                        if(arr.indexOf('one1') != -1){
                            TueDiv.style.top = (30+ 60*(arr[1] - 1))+'px';
                            TueDiv.style.height = '60px';
                        }
                        if(arr.indexOf('two') != -1){
                            TueDiv.style.height = '60px';
                            TueDiv.style.top = (30+ 60*(arr[1] - 1))+'px';
                        }

                        TueDiv.style.width = '78px';
                        TueDiv.style.zIndex = 10;
                        TueDiv.style.backgroundColor = selectedColor;
                        TueDiv.style.textAlign = 'center';
                
                        TueDiv.appendChild(TueP);
                        tueTh.appendChild(TueDiv);
                    }
                    if(arr.indexOf('수') != -1){
                        WedDiv = doc.createElement('div');
                        WedP = doc.createElement('p');
                        
                        WedP.appendChild(resultI);
                        WedP.style.lineHeight = '20px';
                        WedP.style.marginBlockStart = '0';
                        WedP.style.marginBlockEnd = '0';
                        WedDiv.style.position = 'absolute';
                        if(arr.indexOf('one2') != -1){  // 2교시 이면
                            WedDiv.style.height = '100px';
                            WedDiv.style.top = (30+ 60*(arr[2] - 1))+'px';
                        }
                        if(arr.indexOf('one1') != -1){
                            WedDiv.style.height = '60px';
                            WedDiv.style.top = (30+ 60*(arr[1] - 1))+'px';
                        }
                        if(arr.indexOf('two') != -1){
                            WedDiv.style.height = '60px';
                            WedDiv.style.top = (30+ 60*(arr[1] - 1))+'px';
                        }

                        WedDiv.style.width = '78px';
                        WedDiv.style.zIndex = 10;
                        WedDiv.style.backgroundColor = selectedColor;
                        WedDiv.style.textAlign = 'center';
                
                        WedDiv.appendChild(WedP);
                        wedTh.appendChild(WedDiv);
                    }
                    if(arr.indexOf('목') != -1){
                        ThuDiv = doc.createElement('div');
                        ThuP = doc.createElement('p');
                        
                        ThuP.appendChild(resultI);
                        ThuP.style.lineHeight = '20px';
                        ThuP.style.marginBlockStart = '0';
                        ThuP.style.marginBlockEnd = '0';
                        ThuDiv.style.position = 'absolute';
                        if(arr.indexOf('one2') != -1){  // 2교시 이면
                            ThuDiv.style.height = '100px';
                            ThuDiv.style.top = (30+ 60*(arr[2] - 1))+'px';
                        }
                        if(arr.indexOf('one1') != -1){
                            ThuDiv.style.height = '60px';
                            ThuDiv.style.top = (30+ 60*(arr[1] - 1))+'px';
                        }
                        if(arr.indexOf('two') != -1){
                            ThuDiv.style.height = '60px';
                            ThuDiv.style.top = (30+ 60*(arr[1] - 1))+'px';
                        }

                        ThuDiv.style.width = '78px';
                        ThuDiv.style.zIndex = 10;
                        ThuDiv.style.backgroundColor = selectedColor;
                        ThuDiv.style.textAlign = 'center';
                
                        ThuDiv.appendChild(ThuP);
                        thuTh.appendChild(ThuDiv);
                    }
                    if(arr.indexOf('금') != -1){
                        FriDiv = doc.createElement('div');
                        FriP = doc.createElement('p');
                        
                        FriP.appendChild(resultI);
                        FriP.style.lineHeight = '20px';
                        FriP.style.marginBlockStart = '0';
                        FriP.style.marginBlockEnd = '0';
                        FriDiv.style.position = 'absolute';
                        if(arr.indexOf('one2') != -1){  // 2교시 이면
                            FriDiv.style.height = '100px';
                            FriDiv.style.top = (30+ 60*(arr[2] - 1))+'px';
                        }
                        if(arr.indexOf('one1') != -1){
                            FriDiv.style.height = '60px';
                            FriDiv.style.top = (30+ 60*(arr[1] - 1))+'px';
                        }
                        if(arr.indexOf('two') != -1){
                            FriDiv.style.height = '60px';
                            FriDiv.style.top = (30+ 60*(arr[1] - 1))+'px';
                        }


                        FriDiv.style.width = '78px';
                        FriDiv.style.zIndex = 10;
                        FriDiv.style.backgroundColor = selectedColor;
                        FriDiv.style.textAlign = 'center';
                
                        FriDiv.appendChild(FriP);
                        friTh.appendChild(FriDiv);
                    }
                }

            }
        })
        .catch(err => {
            console.log('Fetch Error', err);
        });
    }

    // make.addEventListener('click', sem);
    sem();
}



    
