<script type="text/javascript">
    function search() {
        var f = document.myForm;
        //서버에 request 하고 response받는 부분 있어야할듯.
        if (!f.userId.value) {
            alert("답변을 입력하세요");
            f.userId.focus();
            return;
        }

        f.action = "<%=cp%>/join/searchPwd_ok.do";
        f.submit();
    }
</script>


<!-- https://chicken-tender-2019.tistory.com/126 참고 -->