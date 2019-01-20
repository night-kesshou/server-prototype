var express = require('express');
var router = express.Router();
var { query } = require('../modules/spider');
var generateCookie2Jar = require('../modules/generateCookie');

router.get('/', function(req, res, next) {
  res.send('testing');
});

router.get('/grade', (req, res)=>{
  let {jar} = req.session;

  if(!jar){
    return res.status(403).send("請先登入");
  }
  res.send("ok!");
});

router.get('/performance', (req, res)=>{
  let {jar} = req.session;

  if(!jar){
    return res.status(403).send("請先登入");
  }
  res.send('ok!');
});

module.exports = router;