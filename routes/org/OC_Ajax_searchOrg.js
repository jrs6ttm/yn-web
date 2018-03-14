var express = require('express');
var router = express.Router();
//var config = require('../../config/config.json');
var config = require('../../config.json');
var uuid =  require('node-uuid');

var orgInfo = require('./model/orgInfo');
//var examPage = require('./model/examPage'); 
//var examQuestion = require('./model/examQuestion');

/* GET home page. */
router.post('/', function(req, res, next) {
    headers();

  //获取session user
  var userID = req.session.userData.id;
  console.log('USERid:' + userID );
  var data = {};
  var moment = require("moment");


 data.orgCode = req.body['orgCode'];
 data.orgFullDes = req.body['orgFullDes'];
 data.orgShortDes = req.body['orgShortDes'];
 data.REMARK = req.body['remark'];


 orgInfo.searchData_Json(data, function(err,docs){
   //console.log(doc);
    if(err) { console.log(err); res.send({des:err ,  status : '404'});  } 
    else
      {  res.send({docData:docs , status : '200'}); }
 });
 


function headers(){
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");

}


});

module.exports = router;
