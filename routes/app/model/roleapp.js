var MySql = require('../mysql/mysql.js');
//var roleAppDept = require('./roleAppDept'); 
//var examQuestion = require('./examQuestion');

//var EventProxy = require('eventproxy');
//var ep = new EventProxy();
//var roleapp = require('./roleapp');
var async = require("async");

function roleApp(resu) {
		this.resu = resu;
	};	
	
module.exports = roleApp;


//执行SQL
roleApp.toSQL =  function toSQL(sqlstr, callback){
	MySql.query(sqlstr, function(err, doc) {
		//console.log(doc);
        return callback(err,doc);
   });

}



roleApp.orgRoleApp_init = function (orgID ,callback){
	var sqlstr = "CALL m_org_roleapp_init('" + orgID + "')";
	MySql.query(sqlstr, function(err, doc) {
		//console.log(doc);
        return callback(err,doc);
   });

}


//获取组织的被指派的app
roleApp.getorgRoleApp_ass = function  (orgID ,callback){


	   var sqlstr =  "select a.roleAppID , a.orgRoleID , a.appid , a.status , b.name from  bsd_roleapp as a,  bsd_app as b ,  bsd_orgrole as  c " + 
                 "where a.appid=b.appid and a.orgRoleID = c.orgRoleID and  a.isvalid = '1' and b.isvalid = '1' and c.isvalid = '1'  and b.ofadmin='0' " +
                 " and c.orgID = '" + orgID + "'  and  a.appid IN (select appid from  bsd_orgapp where ISVALID='1' and isassign = '1' and  orgID ='" + orgID + "' ) ";

	  console.log(sqlstr);

	MySql.query(sqlstr, function(err, doc) {
		//console.log(doc);
        return callback(err,doc);
   });

}



//插入数据
roleApp.insertData =  function insertData(data, callback){
	//console.log(data);
   MySql.query('INSERT INTO `bsd_roleapp`  SET ?', data  , function(err, doc) {
		 console.log(err);  console.log(doc);
		return callback(err,doc);
   });
}



//按Json格式更新数据
roleApp.updateData_Json = function updateData_Json(data,ID , callback ) {
 //console.log(data);
 var sql1 = "UPDATE `bsd_roleapp`  SET  ";
 var sql2 = " where `roleAppID` = '" + ID + "'";
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
	if(i == 0) {	return callback("roleApp.updateData_Json中Json数据为空");}
    else  //如果JSON中有数据
	{
	  sqlstr = sql1 + sql2;
	  console.log(sqlstr);
	  MySql.query(sqlstr, function(err, doc) {
			return    callback(err, doc);	    
	   });	
	}  //if end
}); //async.forEachOf end 


}




roleApp.getOrgRoleApp  = function getOrgRoleApp(orgID,callback) {
    var sqlstr = "select b.roleAppID ,  b.orgRoleID , b.appid , b.status  ,a.name  from bsd_orgrole as a, bsd_roleapp as b where a.orgRoleID = b.orgRoleID and a.ISVALID = '1' and b.ISVALID = '1' and a.orgID = '"+ orgID + "' ";
    console.log(sqlstr);
	//var res ={};
	var unapps = ['orgtop'];
    this.getOrgRole(orgID, function(err,res){
		//console.log('BBB',res);
		if(err)  console.log(err);
		if(res == null ) {  return callback(err,res);}  
		else  {

				MySql.query(sqlstr, function(err, docs) {
					console.log('bbb',docs);
                      
					if(docs.length <= 0 ) return callback(err,res);
					else if(docs.length > 0 )
						async.eachSeries(docs, function(doc, callback) { 
							if( unapps.indexOf(doc.appid) == -1)  res[doc.orgRoleID][doc.appid] = {'status' : doc.status , id : doc.roleAppID  } ;   
							//res[doc.orgRoleID]['name'] =  doc.name ; 
                           
							callback();
							
						}, function(err){
                            //console.log('fff',res);
							return callback(err,res);
						});  
			   }); //MySql.query end

	     } // else if end 
	}); // this.getOrgRole end


}






roleApp.getOrgRoleApp_V2  = function getOrgRoleApp_V2(orgID,callback) {
    var sqlstr = "select b.roleAppID ,  b.orgRoleID , b.appid , b.status  ,a.name  from bsd_orgrole as a, bsd_roleapp as b where a.orgRoleID = b.orgRoleID and a.ISVALID = '1' and b.ISVALID = '1' and a.orgID = '"+ orgID + "' ";
    console.log(sqlstr);
    this.getOrgRole(orgID, function(err,res){
		//console.log('BBB',res);
		if(err)  console.log(err);
		if(res == null ) {  return callback(err,res);}  
		else  {

				MySql.query(sqlstr, function(err, docs) {
					console.log('bbb',docs);
                      
					if(docs.length <= 0 ) return callback(err,res);
					else if(docs.length > 0 )
						async.eachSeries(docs, function(doc, callback) { 
							 res[doc.orgRoleID][doc.appid] = {'status' : doc.status , id : doc.roleAppID  } ;   
							//res[doc.orgRoleID]['name'] =  doc.name ; 
                           
							callback();
							
						}, function(err){
                            //console.log('fff',res);
							return callback(err,res);
						});  
			   }); //MySql.query end

	     } // else if end 
	}); // this.getOrgRole end


}


  





roleApp.getOrgRole  = function getOrgRole(orgID,callback) {
    var sqlstr = "select orgRoleID ,  name  from bsd_orgrole  where ISVALID = '1' and orgID = '"+ orgID + "' ";
    console.log(sqlstr);
	var res ={};
	
	MySql.query(sqlstr, function(err, docs) {
		console.log('ccc',docs);

		if(docs.length <= 0 ) return callback(err,null);
		else if(docs.length > 0 )
			async.eachSeries(docs, function(doc, callback) { 
				//console.log(doc);
				 res[doc.orgRoleID] =  {name : doc.name}; 

				callback();
				 
			}, function(err){
                //console.log(res);
				return callback(err,res);
			});  
       
   });


}


roleApp.getRoleApps  = function getRoleApps(orgRoleID,callback) {
    var sqlstr = "select appid ,hre , blank from `bsd_roleapp`  where `ISVALID` = '1' and  `status` = '1' and `orgRoleID` = '"+ orgRoleID+ "' ";
    console.log(sqlstr);

	MySql.query(sqlstr, function(err, docs) {
		//console.log(docs);
		return callback(err,docs);     
   });


}







  //res[doc.orgRoleID][doc.appid] = {'status' : doc.status } ;   


roleApp.completedRoleApp = function completedRoleApp(step2_JSON,callback) {
	 var myself = require('./roleapp.js');
	 var roleappDocs_Json = step2_JSON.roleappDocs;
     var appdocs_Arry = step2_JSON.appdocs;
	 //console.log(roleappDocs_Json);

	async.forEachOf(roleappDocs_Json, function (value, key, callback) {
		var orgRoleID = key;
		//console.log(key, value);
		//遍历appdocs_Arry， 如果value[appdocs_Arry[i]] == undefined, 则创建
		myself.completedTheRoleApp(orgRoleID, value,appdocs_Arry,function(err){
			//var appTmp = value

			callback();
		});


	}	, function (err) {

		 return callback(err);

	}); //async.forEachOf end 
		


}





roleApp.completedTheRoleApp = function completedTheRoleApp(orgRoleID, value , appdocs_Arry , callback) {
    var myself = require('./roleapp.js');
	async.eachSeries(appdocs_Arry, function(doc, callback) { 
		//console.log(doc);
		var data={};
		data.orgRoleID = orgRoleID;
		if(value[doc.appid] == undefined) {
			data.appid = doc.appid;
			myself.insertData(data , function(err, insertDoc){
				if(err) console.log(err)
				callback();
			});
			
		} else  callback();
			
	}, function(err){
		//console.log(res);
		return callback(err);
	});

}


roleApp.getAppStr = function getAppStr(appdocs_Arry, callback) {
    var resStr = '';
	async.eachSeries(appdocs_Arry, function(doc, callback) { 
		//console.log(doc);
		resStr = resStr + "_|_" + doc.appid;

		callback();
			
	}, function(err){
		//console.log(res);
		return callback(err,resStr);
	});


}




//按Json格式，查询符合条件的数据
roleApp.searchData_Json = function searchData_Json(data, callback ) {
 //console.log(data);
 var sqlstr = "select * from  `bsd_roleapp` where `ISVALID` = '1'   ";

 var i=0;
 async.forEachOf(data, function (value, key, callback) {
	 i++;
     if(value != '' ) sqlstr = sqlstr + " and  `" + key + "` like '%" + value + "%' ";

    callback();
 }	, function (err) {
    if (err) console.error(err.message);
    // configs is now a map of JSON data
	if(i == 0) {console.log('AAAAA');	return callback("roleApp.searchData_Json中Json数据为空");}
    else  //如果JSON中有数据
	{
	  console.log(sqlstr);
	  MySql.query(sqlstr, function(err, doc) {
			return    callback(err, doc);	    
	   });	
	}  //if end
 }); //async.forEachOf end 

}




















//删除角色权限
roleApp.delRole =  function delRole(ID ,  callback ) {
	var sqlstr="DELETE FROM `bsd_roleapp`   WHERE `roleAppID` = '" + ID + "'"; 
	console.log(sqlstr);
	MySql.query(sqlstr, function(err, doc) {
		return    callback(err, doc); 
    });	

}




//删除角色权限
roleApp.delRole_V2 =  function delRole_V2(ID ,  callback ) {
  
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
		var sqlstr="DELETE FROM `bsd_roleapp`   WHERE `roleAppID` = '" + ID + "'"; 
		console.log(sqlstr);
		MySql.query(sqlstr, function(err, doc) {
			console.log(doc);
			return    callback(err, doc); 
		});	

    }




}














































//角色是否锁定， 生效返回True, 否则返回false
roleApp.isLock = function isLock(ID,  callback) {
		//console.log('isOrgValid:' + ID  );
   var sql ="SELECT * FROM `bsd_roleapp` WHERE `roleAppID` = '" + ID + "'";
   console.log(sql);
   MySql.query(sql , function(err,docs) {
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
	var sqlstr="DELETE FROM `bsd_roleapp`   WHERE `roleAppID` = '" + ID + "'"; 
	console.log(sqlstr);
	MySql.query(sqlstr, function(err, doc) {
		if(err)  console.log(err); 
    });	
}







//name是否存在
roleApp.isRoleExist_ForName =  function isRoleExist_ForName(name , callback){
   var sqlstr = "SELECT * FROM `bsd_roleapp` WHERE  `name`= '" + name + "'  and `ISVALID` = '1'";
   console.log(sqlstr);
   MySql.query(sqlstr,  function(err,docs) {
	   //console.log(err, docs.length);
      if( err || docs.length <= 0  ) return callback(false);
	  else if(docs.length > 0 )   return callback(true);
    });
}


//ID是否存在
roleApp.isRoleExist_ForID =  function isRoleExist_ForID(ID , callback){
   var sqlstr = "SELECT * FROM `bsd_roleapp` WHERE  `roleAppID`= '" + ID + "'  ";
   console.log(sqlstr);
   MySql.query(sqlstr,  function(err,docs) {
      if(docs.length <= 0  ) return callback(false);
	  else if(docs.length > 0 )   return callback(true);
    });
}








//查询数据
roleApp.searchData =  function searchData(sql, callback){
    sqlstr=sql;
	MySql.query(sqlstr, function(err, doc) {
		//console.log(doc);
        return callback(err,doc);
   });

}

//更新数据
roleApp.updateData =  function updateData(sql, callback){
    sqlstr=sql;
    MySql.query(sqlstr, function(err, doc) {
		return   callback(err, doc);	    
	 });	
}






