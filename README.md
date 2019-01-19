# server-prototype
Service:
 - API
  - login[GET, POST]
   - [GET]:{
     encode:BOOLEAN[0, 1] // default: 0
   }
   - [POST]:{
     account:STRING
     password:STRING
     captcha:INT[length:4]
   }
  - grade[GET]
    - [GET]:{
      year:INT[1~3] // default: 1
    }

modules:[
  express:[express-generator](https://expressjs.com/zh-tw/starter/generator.html),
  spider:[/modules/spider](https://github.com/night-kesshou/modules)
  request:/modules/generateCookie.js
]