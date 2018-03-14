var express = require('express');
var config = require('../config/config.json');
var mysql = require('mysql');


var app = express();
var env = global.orgENV;

/*
var connection = mysql.createConnection({
	  host     :  config[env]['mysql']['url'],
	  user     :  config[env]['mysql']['user'],
	  password :  config[env]['mysql']['password'],
	  database :  config[env]['mysql']['database']
});
connection.connect();
*/

function connection(resu) {
		this.resu = resu;
	};	
	
module.exports = connection;


//*******连接程序错误， 后期修复

//连接数据库， dbname:数据库名  ,  mysqlConf:数据库主机信息
 connection.conn =  function conn(mysqlConf,dbname){
   mysqlConf.database = dbname;

   console.log(mysqlConf);
   var conntemp = mysql.createConnection(mysqlConf);
   conntemp.connect();

   return conntemp;
}




//执行SQL,有callback
connection.toSQL =  function toSQL(sqlstr, callback){
	connection.query(sqlstr, function(err, doc) {
		//console.log(doc);
        return callback(err,doc);
   });

}

//执行SQL,无callback
connection.toSQL_noback =  function toSQL_noback(sqlstr){
	connection.query(sqlstr, function(err, doc) {
		if(err) console.log("MySql :toSQL_noback err:" + err);
   });
}



