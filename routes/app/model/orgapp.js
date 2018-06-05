var MySql = require('../../org/mysql/mysql.js');

//var EventProxy = require('eventproxy');
//var ep = new EventProxy();
var async = require("async");

function  bsd_orgapp(resu) {
		this.resu = resu;
	};	
	
module.exports =  bsd_orgapp;


//执行SQL
 bsd_orgapp.toSQL =  function toSQL(sqlstr, callback){
	MySql.toSQL(sqlstr, function(err, doc) {
		//console.log(doc);
        return callback(err,doc);
   });

}

//获取用户信息
 bsd_orgapp.getInfo =  function getInfo( bsd_orgappname, callback){
	var sqlstr= "select * from `bsd_orgapp`  where isvalid = '1' and orgappid = '" +  bsd_orgappname +"' ";
	MySql.toSQL(sqlstr, function(err, doc) {
		//console.log(doc);
        return callback(err,doc);
   });

}


//插入数据
 bsd_orgapp.insertData =  function insertData(data, callback){
	console.log(data);
   MySql.toSQL('INSERT INTO `bsd_orgapp`  SET ?', data  , function(err, doc) {
		// console.log(err);  console.log(doc);
		return callback(err,doc);
   });
}



//按Json格式更新数据
 bsd_orgapp.updateData_Json = function updateData_Json(data,ID , callback ) {
 //console.log(data);
 var sql1 = "UPDATE `bsd_orgapp`  SET  ";
 var sql2 = " where `orgappid` = '" + ID + "'";
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
	if(i == 0) {	return callback(" bsd_orgapp.updateData_Json中Json数据为空");}
    else  //如果JSON中有数据
	{
	  sqlstr = sql1 + sql2;
	  console.log(sqlstr);
	  MySql.toSQL(sqlstr, function(err, doc) {
			return    callback(err, doc);	    
	   });	
	}  //if end
}); //async.forEachOf end 


}



//按Json格式，查询符合条件的数据
 bsd_orgapp.searchData_Json = function searchData_Json(data, callback ) {
 //console.log(data);
 var sqlstr = "select * from  `bsd_orgapp` where isvalid = '1'     ";

 var i=0;
 async.forEachOf(data, function (value, key, callback) {
	 i++;
     if(value != '' ) sqlstr = sqlstr + " and  `" + key + "`  = '" + value + "' ";

    callback();
 }	, function (err) {
    if (err) console.error(err.message);
    // configs is now a map of JSON data
	if(i == 0) {console.log('AAAAA');	return callback(" bsd_orgapp.searchData_Json中Json数据为空");}
    else  //如果JSON中有数据
	{
	  console.log(sqlstr);
	  MySql.toSQL(sqlstr, function(err, doc) {
			return    callback(err, doc);	    
	   });	
	}  //if end
 }); //async.forEachOf end 

}



 bsd_orgapp.getOrgApp =  function getOrgApp( orgID, callback){
	var sqlstr= "select a.orgappid , a.appid , b.name ,a.isassign  from `bsd_orgapp` as a, `bsd_app` as b where a.appid = b.appid and  a.isvalid = '1' and  b.isvalid = '1' and a.orgID = '" +  orgID +"' ";
	MySql.toSQL(sqlstr, function(err, doc) {
		//console.log(doc);
        return callback(err,doc);
   });

}



