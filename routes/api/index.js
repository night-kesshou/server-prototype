var express = require('express');
var router = express.Router();
const system = require('../../modules/spider');
const generateCookie2Jar = require('../../modules/generateCookie');
const query = require('./query');

router.get('/login', (req, res)=>{
  if(req.session.db&&req.session.db.login)
    return res.json({error:'已登入'});

  let encode = (req.query.encode==="1");
  system.captcha(({error, captcha, cookie})=>{
    if(error){
      return res.json({error:error});
    }
    req.session.jar = cookie;
    res.json({captcha:captcha});
  }, encode);
});

router.post('/login', (req, res)=>{
  if(req.session.db&&req.session.db.login)
    return res.json({error:'已登入'});

  let {jar} = req.session;
  let {account, password, captcha} = req.body;
  if(!account||!password||!captcha){
    res.status(400);
    return res.json({error:"登入資訊不完整"});
  }
  if(!jar){
    res.status(400);
    return res.json({error:"your cookie is not defined"});
  }
  let form = {
    account:account,
    password:password,
    captcha:captcha,
    cookie:generateCookie2Jar(jar._jar.cookies[0].key, jar._jar.cookies[0].value)
  };
  system.login(form, ({error})=>{
    if(error){
      return res.json({error:error});
    }
    req.session.db = {login:true};
    res.json({msg:'login success'});
  });
});

router.use('/query', query);

module.exports = router;
