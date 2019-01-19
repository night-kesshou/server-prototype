var express = require('express');
var router = express.Router();
var system = require('../modules/spider');
var generateCookie2Jar = require('../modules/generateCookie');

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', (req, res)=>{
  if(req.session.login)
    return res.redirect(302, '/');
  let errorCode = parseInt(req.query.status);
  let templateVal = {
    error:"",
    captcha:(req.session.captchadata||"")
  };
  if(req.session.captchadata)
    return res.render('login', templateVal);
  system.captcha(({error, captcha, cookie})=>{
    if(error){
      res.status(500);
      templateVal.error = error;
    }else{
      res.status(200);
      req.session.jar = cookie;
      req.session.captchadata = captcha;
      templateVal.captcha = captcha;
    }
    res.render('login', templateVal);
  },1);
});

router.post('/login', (req, res)=>{
  if(req.session.login)
    return res.redirect(302, '/');
  let jar = req.session.jar;
  let {account, password, captcha} = req.body;
  if(!jar)
    return res.render('login', {error:"找不到Cookie, 請啟用cookie或者重新登入", captcha:req.session.captchadata});
    // return res.redirect(302, '/login?status=1');
  if(!account||!password||!captcha)
    return res.render('login', {error:"錯誤的請求格式, 帳號密碼或者驗證碼為空或者資料遺失", captcha:req.session.captchadata});
    // return res.redirect(400, '/login?status=2');
  let form = {
    account:account,
    password:password,
    captcha:parseInt(captcha),
    cookie:generateCookie2Jar(jar._jar.cookies[0].key, jar._jar.cookies[0].value)
  };
  system.login(form, ({error})=>{
    if(error){
      res.status(500);
      return res.render('login', {error:error, captcha:req.session.captchadata});
      // return res.redirect(302, '/login?status');
    }
    req.session.login = true;
    res.status(200).send('login success!');
  });
});

module.exports = router;
