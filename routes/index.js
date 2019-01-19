var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', (req, res)=>{
  let errorCode = req.query.status;
  let templateVal = {
    error:"",
    captcha:""
  };
  if(errorCode!=undefined){
    switch(errorCode){
      case 1:
        templateVal.error = "找不到Cookie, 請啟用cookie或者重新登入";
      case 2:
        templateVal.error = "錯誤的請求格式"
    }
    return res.render('login', templateVal);
  }
  system.captcha(({error, captcha, cookie})=>{
    if(error){
      res.status(500);
      templateVal.error = error;
    }else{
      res.status(200);
      req.session.jar = cookie;
      templateVal.captcha = captcha;
    }
    res.render('login', templateVal);
  },1);
});

router.post('/login', (req, res)=>{
  let jar = req.session.jar;
  let {account, password, captcha} = req.body;
  if(!jar)
    return res.redirect(302, '/login?status=1');
  if(!account||!password||!captcha)
    return res.redirect(400, '/login?status=2');
});

module.exports = router;
