var express = require('express');
var router = express.Router();
var { query } = require('../modules/spider');
var generateCookie2Jar = require('../modules/generateCookie');

router.get('/', function(req, res, next) {
  res.send('testing');
});

router.get('/grade', (req, res)=>{
  let {jar} = req.session;
  let year = parseInt(req.query.year)||1;
  if(year<1||year>3){
    res.status(400);
    return res.json({error:"年次錯誤"});
  }
  if(!jar){
    res.status(302);
    return res.json({error:'your cookie is not defined'});
  }
  let form = {
    year:year,
    cookie:generateCookie2Jar(jar._jar.cookies[0].key, jar._jar.cookies[0].value)
  }
  query.grade(form, ({error, result})=>{
    if(error){
      res.status(500);
      return res.json({error:error});
    }
    res.json({grade:result});
    //res.render('grade');
  });
});

router.get('/performance', (req, res)=>{
  let {jar} = req.session;
  if(!jar){
    res.status(302);
    return res.json({error:'your cookie is not defined'});
  }
  let cookie = generateCookie2Jar(jar._jar.cookies[0].key, jar._jar.cookies[0].value);
  query.performance({cookie:cookie}, ({error, result})=>{
    if(error){
      res.status(500);
      return res.json({error:error});
    }
    res.json({performance:result});
  });
});

module.exports = router;
