<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>유효성 검사 + ajax 아이디 중복 검사</title>
<style type="text/css">
	.input-group{margin-bottom: 10px;}
	.input-group label { 
		color: #424242; 
		font-size: 15px; 
		padding-right: 10px; 
	}
</style>
<script type="text/javascript" src="<%=request.getContextPath() %>/resource/js/jquery-3.4.1.min.js"></script>
<script type="text/javascript">
	/*
		제출실습1. '성명, 아이디, 패스워드, 패스워드 확인, 이메일, 성별' 을
		유효성 검사를 하는 코드를 작성하고, 아이디는 아이디 중복검사를 하도록하여라.
		(아이디 중복검사 ajax : 중복검사하는 jsp 페이지는 직접 만들고 작성하시오.)			
	*/
	$(function(){
		
		/************************************************
		아이디 중복 체크 함수
		작성자 : 홍길동
		작성일 : 2020-04-08
		'아이디 중복검사', '회원가입' 버튼클릭시 같은 코드로 
		확인하도록 하기위해서 함수로 별도 제작
		2곳에서 사용하고 비동기화로 체크가 동시에 불가능하여
		동기화로  ajax 통신하도록 설정
		*************************************************/		
		var userIdCheck = function(){
			
			var userId = $('[name="userId"]').val();
			var getCheckData;
			
			//ajax 동기화
			var request = $.ajax({
				url: "ajaxIdCheck.jsp", //통신할 url
				method: "POST", //통신할 메서드 타입
				data: { userId : userId }, //전송할 데이타
				dataType: "json",
				async : false //동기화시키기
			});	 
			request.done(function( data ) {
				if(data != undefined && data != ''){
					//동기화임으로 getCheckData에 결과값 받아
					//아래 코드에서 처리 가능
					getCheckData = data;
				}
			});	 
			request.fail(function( jqXHR, textStatus ) {
			  alert( "Request failed: " + textStatus );
			});
			
			//동기화 방식으로 하여 결과값을 받아 올수 있어
			//getCheckData 데이타 체크
			if(getCheckData == undefined || getCheckData.result == 'Y'){
				alert('사용할 수 없는 아이디 입니다.');
				$('[name="idCheck"]').val('N');
				return true;
			}else{
				$('[name="idCheck"]').val('Y');
			}
			return false;
		}
		
		/************************************************
		유효성 검사 함수
		작성자 : 홍길동
		작성일 : 2020-04-08
		반복되는 작업을 최소화 하기위해서 함수로 유효성 검사 제작
		함수 리턴값이 true 일경우 에러  
		!!객체에 담긴 키 정의 내역
		1) target : 체크 대상
		2) compareTarget : 체크 대상의 값과 비교 할 대상 - 값이 있을 경우 target과 비교
		3) lenTarget : 데이타 갯수 체크 대상 - 값이 존재할 경우 length가 0이면 안됨
		4) msg : 에러 발생시 출력할 문구
		*************************************************/			
		var valueChecks = function(checkObj){
				
			var target = checkObj.target; //값 체크 대상
			var compareTarget = checkObj.compareTarget; //값과 일치 비교 대상
			var lenTarget = checkObj.lenTarget; //데이타 갯수 
			var msg = checkObj.msg; //에러 발생시 문구
			var isCheck = false; //정상일 경우 false 에러일경우 true 반환
						
			if(target != undefined){
				if(compareTarget != undefined){
					if(target.val() != compareTarget.val()){						
						alert(msg);
						compareTarget.val('')
						compareTarget.focus();
						isCheck = true;
					}
				}else if(lenTarget != undefined){
					if(lenTarget.length == 0){
						alert(msg);
						target.eq(0).focus();
						isCheck = true;
					}
				}else{
					if(target.val() == ''){						
						alert(msg);
						target.focus();
						isCheck = true;
					}						
				}
			}else{
				isCheck = true;
			}
			
			return isCheck;
		}
		
		//회원가입 클릭 이벤트
		$('#joinBtn').click(function(){	
			if(valueChecks({target : $('[name="userName"]'), 	msg : '회원명을 입력해주세요.'})) return;
			if(valueChecks({target : $('[name="userId"]'), 		msg : '회원아이디를 입력해주세요.'})) return;						
			if(valueChecks({target : $('[name="userPw"]'), 		msg : '패스워드를 입력해주세요.'})) return;			
			if(valueChecks({target : $('[name="userPw"]'), 		msg : '패스워드가 틀립니다.', compareTarget : $('[name="userPwCheck"]')})) return;
			if(valueChecks({target : $('[name="userEmail"]'), 	msg : '이메일을 입력해주세요.'})) return;
			if(valueChecks({target : $('[name="userGender"]'), 	msg : '성별을 입력해주세요.', lenTarget : $('[name="userGender"]:checked')})) return;
			if(valueChecks({target : $('[name="idCheck"]'), 	msg : '아아디 중복검사를 실행 해주세요.'})) return;	
			if(userIdCheck()) return;	//아이디 중복 검사 한번더 실시		
			$('#joinFrom').submit();
			
		});
		//아이디 중복검사 클릭 이벤트
		$('#userIdCheck').click(function(){
			if(!userIdCheck()){
				alert('사용할 수 있는 아이디 입니다.');
			}
		});
				
	});
</script>
</head>
<body>
	<form id="joinFrom" action="./ajaxEx01.jsp" method="post">
	
		<input type="hidden" name="idCheck">
		
		<div class="input-group">
			<label>회원명 </label>
			<input type="text" name="userName">
		</div>
		<div class="input-group">
			<label>아이디 </label>
			<input type="text" name="userId">
			<button type="button" id="userIdCheck">아이디 중복 검사</button>
			<div id="userIdMsg"></div>
		</div>	
		<button type="button" id="joinBtn"> 회원가입 </button>
	</form>
</body>
</html>