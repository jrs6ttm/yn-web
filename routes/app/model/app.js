var MySql = require('../../org/mysql/mysql.js');

//var EventProxy = require('eventproxy');
//var ep = new EventProxy();
var async = require("async");

function  bsd_app(resu) {
		this.resu = resu;
	};	
	
module.exports =  bsd_app;


//执行SQL
 bsd_app.toSQL =  function toSQL(sqlstr, callback){
	MySql.toSQL(sqlstr, function(err, doc) {
		//console.log(doc);
        return callback(err,doc);
   });

}

//获取用户信息
 bsd_app.getInfo =  function getInfo( bsd_appname, callback){
	var sqlstr= "select * from `bsd_app`  where isvalid = '1' and appid = '" +  bsd_appname +"' ";
	MySql.toSQL(sqlstr, function(err, doc) {
		//console.log(doc);
        return callback(err,doc);
   });

}


//插入数据
 bsd_app.insertData =  function insertData(data, callback){
	console.log(data);
   MySql.toSQL('INSERT INTO `bsd_app`  SET ?', data  , function(err, doc) {
		// console.log(err);  console.log(doc);
		return callback(err,doc);
   });
}



//按Json格式更新数据
 bsd_app.updateData_Json = function updateData_Json(data,ID , callback ) {
 //console.log(data);
 var sql1 = "UPDATE `bsd_app`  SET  ";
 var sql2 = " where `appid` = '" + ID + "'";
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
	if(i == 0) {	return callback(" bsd_app.updateData_Json中Json数据为空");}
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
 bsd_app.searchData_Json = function searchData_Json(data, callback ) {
 //console.log(data);
 var sqlstr = "select * from  `bsd_app` where isvalid = '1'     ";

 var i=0;
 async.forEachOf(data, function (value, key, callback) {
	 i++;
     if(value != '' ) sqlstr = sqlstr + " and  `" + key + "`  = '" + value + "' ";

    callback();
 }	, function (err) {
    if (err) console.error(err.message);
    // configs is now a map of JSON data
	if(i == 0) {console.log('AAAAA');	return callback(" bsd_app.searchData_Json中Json数据为空");}
    else  //如果JSON中有数据
	{
	  console.log(sqlstr);
	  MySql.toSQL(sqlstr, function(err, doc) {
			return    callback(err, doc);	    
	   });	
	}  //if end
 }); //async.forEachOf end 

}





//删除用户
 function delOrg_V1(ID){
	var sqlstr="DELETE FROM `bsd_app`   WHERE `appid` = '" + ID + "'     "; 
	console.log(sqlstr);
	MySql.toSQL(sqlstr, function(err, doc) {
		if(err)  console.log(err); 
    });	
}




//组织是否生效， 生效返回True, 否则返回false
 bsd_app.isValid = function isValid(ID,  callback) {
		//console.log('isOrgValid:' + orgID  );
   var sql ="SELECT * FROM `bsd_app` WHERE isvalid = '1' and  `appid` = '" + ID + "' ";
   console.log(sql);
   MySql.toSQL(sql , function(err,docs) {
	   console.log(err);
	   console.log(docs);
       // return  callback(err,results);
	  if(docs.length <= 0  || docs.length > 1  ) return callback(true);
	  else if(docs.length == 1 ) {
         var doc = docs[0];
		 if(doc.ISVALID == 1)  {  return  callback(true); }
		 else  return callback(false, doc);
	   }
   });

}








//ID是否存在
 bsd_app.isIDexist =  function isIDexist(ID,callback) {

   MySql.toSQL("SELECT * FROM `bsd_app` WHERE isvalid = '1' and   appid = ?", [ID]  , function(err,results) {
        return  callback(err,results);
    });
}





 bsd_app.seachForm =  function seachForm(data, callback){
   MySql.toSQL('SELECT ?? FROM `bsd_app` WHERE ?? = ?', data  , function(err,results) {
		// console.log(err);  
		return callback(err,results);
   });
}



//查询数据
 bsd_app.searchData =  function searchData(sql, callback){
    sqlstr=sql;
	MySql.toSQL(sqlstr, function(err, doc) {
		//console.log(doc);
        return callback(err,doc);
   });

}

//更新数据
 bsd_app.updateData =  function updateData(sql, callback){
    sqlstr=sql;
    MySql.toSQL(sqlstr, function(err, doc) {
		return   callback(err, doc);	    
	 });	
}

