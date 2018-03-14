var config = require('../config/config.json');
var mysql = require('mysql');

var env = global.orgENV;

console.log('mysql ENV:', env, config[env]['mysql']['url']);

console.log(config[env]);

var connection = mysql.createConnection({
	  host     :  config[env]['OC_mysql']['url'],
	  user     :  config[env]['OC_mysql']['user'],
	  password :  config[env]['OC_mysql']['password'],
	  database :  config[env]['OC_mysql']['database'],
	  connectTimeout : 864000
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





