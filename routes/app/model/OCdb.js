var MySql_other = require('../mysql_other/mysql_other.js');
//var OCDBDept = require('./OCDBDept'); 
//var examQuestion = require('./examQuestion');

//var EventProxy = require('eventproxy');
//var ep = new EventProxy();
var async = require("async");
var config = require('../config/config.json');

function OCDB(resu) {
		this.resu = resu;
	};	
	
module.exports = OCDB;

//连接数据库
var express = require('express');
var app = express();
var env = global.orgENV;

var mysqlConf=config[env]['OC_mysql'];
var dbname = config[env]['OC_dataBase']['owncloud_dev3'];
MySql_other.conn(mysqlConf,dbname);



//执行SQL
OCDB.toSQL =  function toSQL(sqlstr, callback){
    console.log('OOOOOOOOOO');
    console.log(sqlstr);
	MySql_other.query(sqlstr, function(err, doc) {
		console.log('999999999');
        return callback(err,doc);
   });

}


//插入数据
OCDB.insertData =  function insertData(data, callback){
	console.log(data);
   MySql_other.query('INSERT INTO `bsd_OCDB`  SET ?', data  , function(err, doc) {
		// console.log(err);  console.log(doc);
		return callback(err,doc);
   });
}



//按Json格式更新数据
OCDB.updateData_Json = function updateData_Json(data,orgID , callback ) {
 //console.log(data);
 var sql1 = "UPDATE `bsd_OCDB`  SET  ";
 var sql2 = " where `orgID` = '" + orgID + "'";
 var sqlstr = '';
 var i=0;
 async.forEachOf(data, function (value, key, callback) {
	 i++;

	 if(i==1)  sql1 = sql1 + " `" + key + "` = '" + value + "' "  ;
	 else  sql1 = sql1 + " , "  + " `" + key + "` = '" + value + "' ";

    callback();
}	, function (err) {
    if (err) console.error(err.message);
    // configs is now a map of JSON data
	if(i == 0) {console.log('AAAAA');	return callback("OCDB.updateData_Json中Json数据为空");}
    else  //如果JSON中有数据
	{
	  sqlstr = sql1 + sql2;
	  console.log(sqlstr);
	  MySql_other.query(sqlstr, function(err, doc) {
			return    callback(err, doc);	    
	   });	
	}  //if end
}); //async.forEachOf end 


}



//按Json格式，查询符合条件的数据
OCDB.searchData_Json = function searchData_Json(data, callback ) {
 //console.log(data);
 var sqlstr = "select * from  `bsd_OCDB` where 1   ";

 var i=0;
 async.forEachOf(data, function (value, key, callback) {
	 i++;
     if(value != '' ) sqlstr = sqlstr + " and  `" + key + "` like '%" + value + "%' ";

    callback();
 }	, function (err) {
    if (err) console.error(err.message);
    // configs is now a map of JSON data
	if(i == 0) {console.log('AAAAA');	return callback("OCDB.searchData_Json中Json数据为空");}
    else  //如果JSON中有数据
	{
	  console.log(sqlstr);
	  MySql_other.query(sqlstr, function(err, doc) {
			return    callback(err, doc);	    
	   });	
	}  //if end
 }); //async.forEachOf end 

}
