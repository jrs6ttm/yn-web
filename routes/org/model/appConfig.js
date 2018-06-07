var MySql = require('../mysql/mysql.js');
//var config = require('../../../config/config.json');
var config = require('../../../config.json');
//var appConfigDept = require('./appConfigDept'); 
//var examQuestion = require('./examQuestion');

//var EventProxy = require('eventproxy');
//var ep = new EventProxy();
var async = require("async");

function appConfig(resu) {
		this.resu = appConfig;
	};	
	
module.exports = appConfig;


//执行SQL
appConfig.toSQL =  function toSQL(sqlstr, callback){
	MySql.toSQL(sqlstr, function(err, doc) {
		//console.log(doc);
        return callback(err,doc);
   });

}


var env = global.orgENV;



//按Json格式，查询符合条件的数据
appConfig.searchData_Json = function searchData_Json(data, callback ) {
 //console.log(data);
 		var mysql = require('mysql');
		var mysqlConf=config[env]['OC_mysql'];
		mysqlConf.database = config[env]['OC_dataBase']['owncloud_dev3'];
		//console.log(mysqlConf);

		var connection = mysql.createConnection(mysqlConf);

		connection.connect();


		var sqlstr = "select * from  `oc_appconfig` where 1   ";

		var i=0;
		async.forEachOf(data, function (value, key, callback) {
			i++;
			if(value != '' ) sqlstr = sqlstr + " and  `" + key + "` = '" + value + "' ";

			callback();
		}	, function (err) {
			if (err) console.error(err.message);
			// configs is now a map of JSON data
			if(i == 0) {return callback("appConfig.searchData_Json中Json数据为空");}
			else  //如果JSON中有数据
			{
			console.log(sqlstr);
			connection.query(sqlstr, function(err,doc){
			//MySql.toSQL(sqlstr, function(err, doc) {
					return    callback(err, doc);	    
			});	
			}  //if end
		}); //async.forEachOf end 

}









