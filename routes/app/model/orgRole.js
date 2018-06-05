var MySql = require('../mysql/mysql.js');
//var orgRoleDept = require('./orgRoleDept'); 
//var examQuestion = require('./examQuestion');

//var EventProxy = require('eventproxy');
//var ep = new EventProxy();
var async = require("async");

function orgRole(resu) {
		this.resu = resu;
	};	
	
module.exports = orgRole;


//执行SQL
orgRole.toSQL =  function toSQL(sqlstr, callback){
	MySql.toSQL(sqlstr, function(err, doc) {
		//console.log(doc);
        return callback(err,doc);
   });

}




//插入数据
orgRole.insertData =  function insertData(data, callback){
	console.log(data);
   MySql.toSQL('INSERT INTO `bsd_orgrole`  SET ?', data  , function(err, doc) {
		// console.log(err);  console.log(doc);
		return callback(err,doc);
   });
}



//按Json格式更新数据
orgRole.updateData_Json = function updateData_Json(data,ID , callback ) {
 //console.log(data);
 var sql1 = "UPDATE `bsd_orgrole`  SET  ";
 var sql2 = " where `orgRoleID` = '" + ID + "'";
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
	if(i == 0) {	return callback("orgRole.updateData_Json中Json数据为空");}
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
orgRole.searchData_Json = function searchData_Json(data, callback ) {
 //console.log(data);
 var sqlstr = "select * from  `bsd_orgrole` where 1   ";

 var i=0;
 async.forEachOf(data, function (value, key, callback) {
	 i++;
     if(value != '' ) sqlstr = sqlstr + " and  `" + key + "` like '%" + value + "%' ";

    callback();
 }	, function (err) {
    if (err) console.error(err.message);
    // configs is now a map of JSON data
	if(i == 0) {console.log('AAAAA');	return callback("orgRole.searchData_Json中Json数据为空");}
    else  //如果JSON中有数据
	{
	  console.log(sqlstr);
	  MySql.toSQL(sqlstr, function(err, doc) {
			return    callback(err, doc);	    
	   });	
	}  //if end
 }); //async.forEachOf end 

}



//删除角色
orgRole.delRole =  function delRole(ID ,  callback ) {
	var sqlstr="DELETE FROM `bsd_orgrole`   WHERE `orgRoleID` = '" + ID + "'"; 
	console.log(sqlstr);
	MySql.toSQL(sqlstr, function(err, doc) {
		return    callback(err, doc); 
    });	

}




//删除角色
orgRole.delRole_V2 =  function delRole_V2(ID ,  callback ) {
  
  this.isLock(ID,  function(flag) {
		if( flag == true )  {return callback('角色已被锁定，无法删除。'); }
		else {
            this.delRole(ID,  function(err,doc) {
               return    callback(err, doc); 
			});  //this.delRole  end
		}   //if  end
  });  //this.isLock end


	//删除角色
	delRole =  function delRole(ID ,  callback ) {
		var sqlstr="DELETE FROM `bsd_orgrole`   WHERE `orgRoleID` = '" + ID + "'"; 
		console.log(sqlstr);
		MySql.toSQL(sqlstr, function(err, doc) {
			console.log(doc);
			return    callback(err, doc); 
		});	

    }




}




//角色是否锁定， 生效返回True, 否则返回false
orgRole.isLock = function isLock(ID,  callback) {
		//console.log('isOrgValid:' + ID  );
   var sql ="SELECT * FROM `bsd_orgrole` WHERE `orgRoleID` = '" + ID + "'";
   console.log(sql);
   MySql.toSQL(sql , function(err,docs) {
	   console.log(err);
	   //console.log(docs);
       // return  callback(err,results);
	  if(docs.length <= 0  || docs.length > 1  ) return callback(false);
	  else if(docs.length == 1 ) {
         var doc = docs[0];
		 if(doc.status == 2)  {  return  callback(true); }
		 else  return callback(false, doc);
	   }
   });

}






//删除组织
 function delRole_V3(ID){
	var sqlstr="DELETE FROM `bsd_orgrole`   WHERE `orgRoleID` = '" + ID + "'"; 
	console.log(sqlstr);
	MySql.toSQL(sqlstr, function(err, doc) {
		if(err)  console.log(err); 
    });	
}







//name是否存在
orgRole.isRoleExist_ForName =  function isRoleExist_ForName(name , callback){
   var sqlstr = "SELECT * FROM `bsd_orgrole` WHERE  `name`= '" + name + "'  and `ISVALID` = '1'";
   console.log(sqlstr);
   MySql.toSQL(sqlstr,  function(err,docs) {
	   //console.log(err, docs.length);
      if( err || docs.length <= 0  ) return callback(false);
	  else if(docs.length > 0 )   return callback(true);
    });
}


//name是否存在
orgRole.isRoleExist_ForName_V2 =  function isRoleExist_ForName_V2( orgID , name , callback){
   var sqlstr = "SELECT * FROM `bsd_orgrole` WHERE `ISVALID` = '1' and  `name`= '" + name + "'  and `orgID` = '" + orgID + "' ";
   console.log(sqlstr);
   MySql.toSQL(sqlstr,  function(err,docs) {
	   //console.log(err, docs.length);
      if( err || docs.length <= 0  ) return callback(false);
	  else if(docs.length > 0 )   return callback(true);
    });
}



//ID是否存在
orgRole.isRoleExist_ForID =  function isRoleExist_ForID(ID , callback){
   var sqlstr = "SELECT * FROM `bsd_orgrole` WHERE  `orgRoleID`= '" + ID + "'  ";
   console.log(sqlstr);
   MySql.toSQL(sqlstr,  function(err,docs) {
      if(docs.length <= 0  ) return callback(false);
	  else if(docs.length > 0 )   return callback(true);
    });
}








//查询数据
orgRole.searchData =  function searchData(sql, callback){
    sqlstr=sql;
	MySql.toSQL(sqlstr, function(err, doc) {
		//console.log(doc);
        return callback(err,doc);
   });

}

//更新数据
orgRole.updateData =  function updateData(sql, callback){
    sqlstr=sql;
    MySql.toSQL(sqlstr, function(err, doc) {
		return   callback(err, doc);	    
	 });	
}






