var express = require('express');
var router = express.Router();
var {query} = require('../../modules/spider');
var generateCookie2Jar = require('../../modules/generateCookie');

router.get('/grade', (req, res)=>{
  let {jar} = req.session;
  let year = parseInt(req.query.year)||1;
  if(year<1||year>3){
    res.status(400);
    return res.json({error:"年次錯誤"});
  }
  if(!jar){
    res.status(400);
    return res.json({error:'your cookie is not defined'});
  }
  if(req.session.db&&req.session.db.grade&&req.session.db.grade[year]!=undefined){
    return res.json(req.session.db.grade[year]);
  }
  let form = {
    year:year,
    cookie:generateCookie2Jar(jar._jar.cookies[0].key, jar._jar.cookies[0].value)
  }
  query.grade(form, ({error, result})=>{
    if(error){
      return res.json({error:error});
    }
    req.session.db.grade = new Object;
    req.session.db.grade[year] = result;
    res.json(req.session.db.grade[year]);
  });
});

router.get('/performance', (req, res)=>{
  let {jar} = req.session;
  if(!jar){
    res.status(400);
    return res.json({error:'your cookie is not defined'});
  }
  if(req.session.db&&req.session.db.performance!=undefined){
    return res.json(req.session.db.performance);
  }
  let cookie = generateCookie2Jar(jar._jar.cookies[0].key, jar._jar.cookies[0].value);
  query.performance({cookie:cookie}, ({error, result})=>{
    if(error){
      return res.json({error:error});
    }
    req.session.db.performance = result;
    res.json(result);
  });
});

module.exports = router;