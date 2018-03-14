var express = require('express');
var config = require('../../../config.json');
var mysql = require('mysql');

var env = global.orgENV;
//console.log(env);
var connection = mysql.createConnection({
	  host     :  config[env].mysql_engine.url,
	  user     :  config[env].mysql_engine.user,
	  password :  config[env].mysql_engine.password,
	  database :  config[env].mysql_engine.database
});
connection.connect();
module.exports = connection;
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





