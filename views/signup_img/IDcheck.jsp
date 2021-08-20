<%@ page language="java" contentType="application/json; charset=UTF-8"
    pageEncoding="UTF-8" import = "member.* " %>
    <%@ page import="com.google.gson.Gson" %>
        <%@ page import="java.util.Map" %>
            <%@ page import="java.util.HashMap" %>

                <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN""http://www.w3.org/TR/html4/loose.dtd">
                <html>

                <head>
                    <meta http-equiv="Content-Type" content="text/html; charset=EUC-KR">
                    <title>Insert title here</title>
                </head>

                <body>
                    <%
    member.MemberDAO dao = new MemberDAO();
    MemberVO vo = new MemberVO(request.getParameter("id"),"");
    int result = dao.getMember(vo);
%>
                        <div id="isID">
                            <%=result %>
                        </div>
                        <div id="canID"></div>
                        <input type="button" id="close" value="닫기">
                        <script type="text/javascript">
                            window.onload = function() {
                                var result = document.getElementById("isID").innerHTML;
                                if (result == 3) {
                                    document.getElementById("canID").innerHTML = "아이디 사용가능합니다.";
                                } else {
                                    document.getElementById("canID").innerHTML = "아이디 중복가입되어 있습니다.";
                                }

                                document.getElementById("close").onclick = function() {
                                    //나의 부모창 id=here영역에 출력
                                    window.opener.document.getElementById("here").innerHTML = document.getElementById("canID").innerHTML;
                                    close();
                                }
                            }
                        </script>
                </body>

                </html>

                <!-- <%
	/*
		데이타 베이스에서 조회하였다는 가정하에
		아래 데이타 나열.
		나열된 데이타는 이미 존재하는 아이디
		id001, id002, id003
	*/	
	String userId = request.getParameter("userId");
	//Gson 인스턴스화(객체화)
	Gson gson = new Gson();		
	//Map을 객체화 하기
	Map map = new HashMap();
	if(
		   "id001".equals(userId) 
		|| "id002".equals(userId) 
		|| "id003".equals(userId)
		|| "".equals(userId)
		|| userId == null
	){		
		map.put("result", "Y");
	}else{
		map.put("result", "N");
	}
	String result = gson.toJson(map);
	out.print(result);
%> -->




                <!-- https://study6-6.tistory.com/38
    https://blog.naver.com/PostView.nhn?isHttpsRedirect=true&blogId=myeongdms55&logNo=220946120801
 -->