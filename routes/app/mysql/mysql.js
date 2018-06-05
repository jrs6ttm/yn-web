var config = require('../config/config.json');
//var config = require('../../../config.json');
var mysql = require('mysql');

var env = global.orgENV;

/*
//console.log('mysql ENV:', env, config[env]['mysql']['url']);

var connection = mysql.createConnection({
	  host     :  config[env]['mysql']['url'],
	  user     :  config[env]['mysql']['user'],
	  password :  config[env]['mysql']['password'],
	  database :  config[env]['mysql']['database'],
	  connectTimeout : 60000
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
*/

var pool = mysql.createPool({
	host     :  config[env]['mysql']['url'],
	user     :  config[env]['mysql']['user'],
	password :  config[env]['mysql']['password'],
	database :  config[env]['mysql']['database'],
	port     : 3306
});

var query = {
	toSQL : function toSQL(sqlstr, callback){
		pool.getConnection(function(err, conn){
			if(err){
				callback(err, null);
			}else{
				console.log("connect pool created.");
				conn.query(sqlstr, [], function(err,results){
					if(err) console.log("MySql :toSQL err:" + err);
					//释放连接
					conn.release();
					//事件驱动回调
					callback(err,results);
				});
			}
		});
	},

	toSQL_noback :  function toSQL_noback(sqlstr){
		connection.query(sqlstr, function(err, doc) {
			if(err) console.log("MySql :toSQL_noback err:" + err);
		});
		pool.getConnection(function(err, conn){
			if(err){
				console.log("MySql :toSQL_noback err:" + err);
			}else{
				conn.query(sqlstr, [], function(err,results){
					if(err) console.log("MySql :toSQL_noback err:" + err);
					//释放连接
					conn.release();
				});
			}
		});
	}
};

module.exports = query;




