var MySql = require('../../org/mysql/mysql.js');

//var EventProxy = require('eventproxy');
//var ep = new EventProxy();
var async = require("async");

function user(resu) {
		this.resu = resu;
	};	
	
module.exports = user;


//执行SQL
user.toSQL =  function toSQL(sqlstr, callback){
	MySql.toSQL(sqlstr, function(err, doc) {
		//console.log(doc);
        return callback(err,doc);
   });

}

//获取用户信息
user.getUserInfo =  function getUserInfo(username, callback){
	var sqlstr= "select * from `oc_users`  where isvalid = '1' and uid = '" + username +"' ";
	MySql.toSQL(sqlstr, function(err, doc) {
		//console.log(doc);
        return callback(err,doc);
   });

}

//获取用户信息
user.getUserInfo_ID =  function getUserInfo_ID(userID, callback){
	var sqlstr= "select * from `oc_users`  where isvalid = '1' and synid = '" + userID +"' ";
	MySql.toSQL(sqlstr, function(err, doc) {
		//console.log(doc);
        return callback(err,doc);
   });

}


//获取超管的功能数据
user.getAdminNavAndPersonal = function getAdminNavAndPersonal(callback) {
	var sqlstr = "CALL m_getAdminApp() ";
	MySql.toSQL(sqlstr, function(err, docs) {
		//console.log(doc);
		if(err )  return callback(err,docs);

		var i=-1 , appdocs = docs[0];
		var resdatas = {nav:[] , personal :[] };

		async.eachSeries(appdocs, function(doc, callback) { 
			i++;
			var appid = doc.appid;
			var sqlstr2 = "CALL m_getAppFuns('" + appid + "')";
			//console.log(sqlstr2);
			MySql.toSQL(sqlstr2, function(err, funs) {
                if(funs.length <=0) return callback();
				appdocs[i].funs = funs[0];

				if(doc.position == '0') {
					resdatas.nav[resdatas.nav.length] = appdocs[i]; callback();
				} else if(doc.position == '1') {
					resdatas.personal[resdatas.personal.length] = appdocs[i]; callback();
				}

				
			});  //MySql.toSQL end

		}, function(err){
			 //console.log('0000',resdatas);
			 return callback(err,resdatas);
		});  

       
   });

}






//获取超管的功能数据
user.getCompanyNavAndPersonal = function getCompanyNavAndPersonal(callback) {
	var sqlstr = "CALL m_getCompanyApp() ";
	MySql.toSQL(sqlstr, function(err, docs) {
		//console.log(doc);
		if(err )  return callback(err,docs);

		var i=-1 , appdocs = docs[0];
		var resdatas = {nav:[] , personal :[] };

		async.eachSeries(appdocs, function(doc, callback) { 
			i++;
			var appid = doc.appid;
			var sqlstr2 = "CALL m_getAppFuns('" + appid + "')";
			//console.log(sqlstr2);
			MySql.toSQL(sqlstr2, function(err, funs) {
				if(funs.length <=0) return callback();

				appdocs[i].funs = funs[0];

				if(doc.position == '0') {
					resdatas.nav[resdatas.nav.length] = appdocs[i]; callback();
				} else if(doc.position == '1') {
					resdatas.personal[resdatas.personal.length] = appdocs[i]; callback();
				}

				
			});  //MySql.toSQL end

		}, function(err){
			 //console.log('0000',resdatas);
			 return callback(err,resdatas);
		});  

       
   });

}




//获取超管的功能数据
user.getUserNavAndPersonal = function getUserNavAndPersonal(data, callback) {
	var roleID = data.roleID , orgID = data.orgID , depID = data.depID;

	var sqlstr = " select a.appid , a.name , a.hre as `url` , a.blank , a.position  , a.`svg` from bsd_app as a ,  bsd_roleapp as b " + 
	" where a.appid = b.appid and a.ISVALID = '1' and  b.ISVALID = '1' and a.ofadmin ='0' and  b.status = '1'   and  b.orgRoleID = '" + roleID + "' and a.appid IN " + 
	"( select appid from bsd_orgapp where ISVALID = '1' and  isassign = '1'  and  orgID = '" + orgID + "') ";

	console.log('sqlstr:' ,sqlstr );

	MySql.toSQL(sqlstr, function(err, docs) {
		//console.log('docs:' , docs );
		if(err ) {console.log(err ); return callback(err,docs);}  

		var i=-1 , appdocs = docs;
		var resdatas = {nav:[] , personal :[] };

		async.eachSeries(docs, function(doc, callback) { 
			i++;
			var appid = doc.appid;
			var sqlstr2 = "CALL m_getAppFuns('" + appid + "')";
			console.log(sqlstr2);
			MySql.toSQL(sqlstr2, function(err, funs) {
				if(err) console.log(err);
				if(!funs || funs.length <=0) return callback();
				appdocs[i].funs = funs[0];

				if(doc.position == '0') {
					resdatas.nav[resdatas.nav.length] = appdocs[i]; callback();
				} else if(doc.position == '1') {
					resdatas.personal[resdatas.personal.length] = appdocs[i]; callback();
				}
				
			});  //MySql.toSQL end

		}, function(err){
			 //console.log('0000',resdatas);
			 return callback(err,resdatas);
		});  

       
   });

}







//插入数据
user.insertData =  function insertData(data, callback){
	//console.log(data);
   var sqlStr ="insert into oc_users(uid, password, synid,isadmin,isvalid,email) values('"+data.uid+"', '"+data.password+"', '"+data.synid+ "', '" + data.isadmin + "' , '1' , '"  + data.email + "')";
   MySql.toSQL(sqlStr , function(err, doc) {

		// console.log(err);  console.log(doc);
		return callback(err,doc);
   });
}



//按Json格式更新数据
user.updateData_Json = function updateData_Json(data,ID , callback ) {
 //console.log(data);
 var sql1 = "UPDATE `oc_users`  SET  ";
 var sql2 = " where `synid` = '" + ID + "'";
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
	if(i == 0) {	return callback("user.updateData_Json中Json数据为空");}
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
user.searchData_Json = function searchData_Json(data, callback ) {
 //console.log(data);
 var sqlstr = "select * from  `oc_users` where isvalid = '1'     ";

 var i=0;
 async.forEachOf(data, function (value, key, callback) {
	 i++;
     if(value != '' ) sqlstr = sqlstr + " and  `" + key + "`  = '" + value + "' ";

    callback();
 }	, function (err) {
    if (err) console.error(err.message);
    // configs is now a map of JSON data
	if(i == 0) {console.log('AAAAA');	return callback("user.searchData_Json中Json数据为空");}
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
	var sqlstr="DELETE FROM `oc_users`   WHERE `isadmin` = '0' and `synid` = '" + ID + "'     "; 
	console.log(sqlstr);
	MySql.toSQL(sqlstr, function(err, doc) {
		if(err)  console.log(err); 
    });	
}




//组织是否生效， 生效返回True, 否则返回false
user.isValid = function isValid(ID,  callback) {
		//console.log('isOrgValid:' + orgID  );
   var sql ="SELECT * FROM `oc_users` WHERE isvalid = '1' and  `synid` = '" + ID + "' ";
   console.log(sql);
   MySql.toSQL(sql , function(err,docs) {
	   console.log(err);
	   //console.log(docs);
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
user.isIDexist =  function isIDexist(ID,callback) {

   MySql.toSQL("SELECT * FROM `oc_users` WHERE isvalid = '1' and   synid = ?", [ID]  , function(err,results) {
        return  callback(err,results);
    });
}





user.seachForm =  function seachForm(data, callback){
   MySql.toSQL('SELECT ?? FROM `oc_users` WHERE ?? = ?', data  , function(err,results) {
		// console.log(err);  
		return callback(err,results);
   });
}



//查询数据
user.searchData =  function searchData(sql, callback){
    sqlstr=sql;
	MySql.toSQL(sqlstr, function(err, doc) {
		//console.log(doc);
        return callback(err,doc);
   });

}

//更新数据
user.updateData =  function updateData(sql, callback){
    sqlstr=sql;
    MySql.toSQL(sqlstr, function(err, doc) {
		return   callback(err, doc);	    
	 });	
}

