var express = require('express');
var router = express.Router();
var system = require('../modules/spider');

router.get('/', function(req, res, next) {
  if(req.session&&req.session.db&&req.session.db.login)
    res.send(`您已登入: <a href="/query">goto home page</a>`);
  else
    res.render('index');
});

router.get('/login', (req, res)=>{
  if(req.session.db&&req.session.db.login)
    return res.redirect(302, '/');

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

module.exports = router;