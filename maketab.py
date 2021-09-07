import pymysql
import json
with open('sqlconfig.json') as f:
    dbdata=json.load(f)
db=pymysql.connect(
    user=dbdata["user"],
    host=dbdata["host"],
    passwd=dbdata["password"],
    port=3306
)
cursor=db.cursor()
graduation_unit = 133 #졸업학점
graduation_major = 51
graduation_major_basic = 18 #전공기초
graduation_major_must = 15 #전공필수
graduation_etc_must = 14 #교양필수
graduation_etc_selection = 20 #교양선택
graduation_major_without_basic = 66 #전공기초 제외 전공 요학점
graduation_christ = 4
def maketable(EMAIL):
    attended_names=[]
    toatt=[[]for col in range(0,9)]
    cursor.execute('use subjects;')
    user={"major_must": 0,"major_basic":0,"major_select":0,"etc_must":0,"etc_select":0,
          "ethics":0,"language":0,"humanities":0,"socialstudy":0,"christian":0,"semester":0,"attended":[],"major":
          ''}
    cursor.execute("SELECT unit_attended,major_basic,major_must,etc_must,etc_select,ethics,humanities,socialstudy,semester from users where EMAIL=%s"
                   ,(EMAIL))
    results=cursor.fetchall()
    for e in results:
        user[]
