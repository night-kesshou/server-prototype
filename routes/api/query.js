var express = require('express');
var router = express.Router();
const {query} = require('../../modules/spider');
const generateCookie2Jar = require('../../modules/generateCookie');

router.get('/grade', (req, res)=>{
  let {jar} = req.session;
  let year = parseInt(req.query.year)||1;
  if(year<1||year>3)
    return res.json({error:"年次錯誤"});
  if(!jar)
    return res.json({error:'your cookie is not defined'});
  let form = {
    year:year,
    cookie:generateCookie2Jar(jar._jar.cookies[0].key, jar._jar.cookies[0].value)
  }
  query.grade(form, ({error, grade})=>{
    if(error)
      return res.json({error:error});
    res.json({grade:grade});
  });
});

module.exports = router;
