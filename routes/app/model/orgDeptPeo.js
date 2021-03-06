var MySql = require('../mysql/mysql.js');
var uuid =  require('node-uuid');
//var mySelf = require('./orgDeptPeo');

//var EventProxy = require('eventproxy');
//var ep = new EventProxy();
var async = require("async");

function bsd_orgDeptPeo(resu) {
		this.resu = resu;
	};	
	
module.exports = bsd_orgDeptPeo;


//执行SQL
bsd_orgDeptPeo.toSQL =  function toSQL(sqlstr, callback){
	MySql.query(sqlstr, function(err, doc) {
		//console.log(doc);
        return callback(err,doc);
   });

}


//插入多个用户
bsd_orgDeptPeo.insertData_arry = function insertData_arry(datas,creatorID, callback) {

	　var myself = require('./orgDeptPeo');
	 var moment = require("moment");
     
	 //var err = null;

	 async.eachSeries(datas, function(data, callback) {   
         data.DeptPeoID= uuid.v1();
	     data.ISVALID = 1;
         data.CREATORID = creatorID;
         data.CREATEDATE = moment().format("YYYY-MM-DD HH:mm:ss");
  
         myself.insertData(data , function(err, doc){
		  if(err) console.log(err);
           return callback();
	     });
      
	  }, function(err){

	   return callback(err);

	  }); //async.eachSeries END


}



//插入数据
bsd_orgDeptPeo.insertData =  function insertData(data, callback){

	MySql.query('INSERT INTO `bsd_orgdeptpeo`  SET ?', data  , function(err, doc) {
			// console.log(err);  console.log(doc);
			if(err)  console.log(err); 
			return callback(err,doc);
	});


}


//此机构是否已经存在这个用户
bsd_orgDeptPeo.isUserexist =  function isUserexist(data,callback) {
  var sqlstr = "SELECT * FROM `bsd_orgdeptpeo` WHERE  `deptID` = '" + data.deptID + "' and `synid` = '" + data.synid + "' ";
  //console.log(sqlstr);
   MySql.query(sqlstr  , function(err,results) {
	    if(results.length <= 0) return callback(false);
        else  return  callback(true);
    });

}



//按数组格式更新数据
bsd_orgDeptPeo.updateData_arry = function updateData_arry(datas , userID, callback ) {
    //console.log('A',datas);
	var myself = require('./orgDeptPeo');
	
    var sqlstr =''; 

	 var moment = require("moment");
	
	async.eachSeries(datas, function(doc, callback) {    
      doc.LSTUPDID = userID;
	  doc.LSTUPDDATE =  moment().format("YYYY-MM-DD HH:mm:ss");
      myself.updateData_Json_kendoUI(doc , doc.DeptPeoID , function(err, doc){
         //sqlstr = sqlstr + str;
         return callback();
	  });
      
	}, function(err){

    // console.log(sqlstr);

	 return callback(sqlstr);

	}); //async.eachSeries END

 }

//按数组格式删除用户
bsd_orgDeptPeo.delData_arry = function delData_arry(datas , callback ) {
    //console.log('A',datas);
	var myself = require('./orgDeptPeo');
	
    var sqlstr =''; 

	
	async.eachSeries(datas, function(doc, callback) {    

      myself.delDeptPeo_callback(doc.DeptPeoID ,  function(err, doc){
		  if(err) console.log(err);
        
		 return callback();
	  });
      
	}, function(err){

    // console.log(sqlstr);

	 return callback(sqlstr);

	}); //async.eachSeries END

 }


//物理删除指定用户，有返回
bsd_orgDeptPeo.delDeptPeo_callback  =  function delDeptPeo_callback(ID , callback) {
	var sqlstr="DELETE FROM `bsd_orgdeptpeo`   WHERE `DeptPeoID` = '" + ID + "'"; 
	console.log(sqlstr);
	MySql.query(sqlstr, function(err, doc) {
		return  callback(err,doc);
    });	
  }




//按arry格式更新数据


bsd_orgDeptPeo.arry_to_sql = function arry_to_sql(data ,  callback ) {
 //console.log(data);
 console.log('B');
 var sql1 = "UPDATE `bsd_orgdeptpeo`  SET  ";
 var sql2 = "  where 1 and  `synid`  = '" + data.synid + "'  ; ";
 var sqlstr = '';
 var i=0;
 async.forEachOf(data, function (value, key, callback) {
	 i++;

	 if(i==1)  sql1 = sql1 + " `" + key + "` = '" + value + "' "  ;
	 else  sql1 = sql1 + " , "  + " `" + key + "` = '" + value + "' ";

    callback();
 }	, function (err) {
    if (err) console.error(err.message);

	  sqlstr = sql1 + sql2;
	  //console.log(sqlstr);
	  MySql.query(sqlstr, function(err, doc) {
		    if(err) console.log(err);
			return   callback(sqlstr);    
	   });	
	  	
  }); //async.forEachOf end     

 }




//按Json格式更新数据
bsd_orgDeptPeo.updateData_Json = function updateData_Json(data,DeptPeoID , callback ) {
 //console.log(data);
 var sql1 = "UPDATE `bsd_orgdeptpeo`  SET  ";
 var sql2 = " where `DeptPeoID` = '" + DeptPeoID + "'";
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
	if(i == 0) {console.log('AAAAA');	return callback("bsd_orgDeptPeo.updateData_Json中Json数据为空");}
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





//按Json格式更新数据, kendoUI  专用： 不更新sex字段
bsd_orgDeptPeo.updateData_Json_kendoUI = function updateData_Json_kendoUI(data,DeptPeoID , callback ) {
 //console.log(data);
 var sql1 = "UPDATE `bsd_orgdeptpeo`  SET  ";
 var sql2 = " where `DeptPeoID` = '" + DeptPeoID + "'";
 var sqlstr = '';
 var i=0;
 async.forEachOf(data, function (value, key, callback) {
	 
     if( key != 'sex') {
		i++;
		if(i==1)  sql1 = sql1 + " `" + key + "` = '" + value + "' "  ;
		else  sql1 = sql1 + " , "  + " `" + key + "` = '" + value + "' ";
		callback();
		
	 } else {  callback(); }

    
 }	, function (err) {
    if (err) console.error(err.message);
    // configs is now a map of JSON data
	if(i == 0) {return callback("bsd_orgDeptPeo.updateData_Json中Json数据为空");}
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





//按Json格式，查询符合条件的数据
bsd_orgDeptPeo.searchData_Json_V2 = function searchData_Json_V2(data, callback ) {
 //console.log(data);
 var sqlstr = "select `synid` as  `userID`,  `name`, `sex`  from  `bsd_orgdeptpeo` where 1   ";

 var i=0;
 async.forEachOf(data, function (value, key, callback) {
	 i++;
     if(value != '' ) {
		 
		   sqlstr = sqlstr + " and  `" + key + "` like '%" + value + "%' ";
	 }

     callback();
 }	, function (err) {
    if (err) console.error(err.message);
    // configs is now a map of JSON data
	if(i == 0) {	return callback("bsd_orgDeptPeo.searchData_Json_V2中Json数据为空");}
    else  //如果JSON中有数据
	{
	  console.log(sqlstr);
	  MySql.query(sqlstr, function(err, doc) {
			return    callback(err, doc);	    
	   });	
	}  //if end
 }); //async.forEachOf end 

}


//按Json格式，查询符合条件的数据
bsd_orgDeptPeo.searchData_Json_V3 = function searchData_Json_V3(roletype ,data, callback ) {
 //console.log(data); DeptPeoID,   tel , address , nickname , , REMARK 
	var sqlstr = "select  synid ,  userID , name , sex  from  `bsd_orgdeptpeo` where 1 and  checkStatus = '1'  ";

	var i=0;
	async.forEachOf(data, function (value, key, callback) {
		i++;
		if(value != '' &&  value != 'undefined' ) sqlstr = sqlstr + " and  `" + key + "` = '" + value + "' ";

		callback();
	}	, function (err) {
		if (err) console.error(err.message);
		// configs is now a map of JSON data
		if(i == 0) {console.log('AAAAA');	return callback("bsd_orgDeptPeo.searchData_Json中Json数据为空");}
		else  //如果JSON中有数据
		{

		if(roletype != '')  sqlstr = sqlstr + " and `orgRoleID` IN (select `orgRoleID` from `bsd_orgrole` where  ISVALID = '1' and type = '" + roletype + "' ) ";

		console.log(sqlstr);
		MySql.query(sqlstr, function(err, doc) {
				return    callback(err, doc);	    
		});	
		}  //if end
	}); //async.forEachOf end 

}



//按Json格式，查询符合条件的数据
bsd_orgDeptPeo.searchData_Json = function searchData_Json(data, callback ) {
 //console.log(data);
 var sqlstr = "select DeptPeoID, synid ,  userID , tel , address , nickname , name , sex , REMARK  from  `bsd_orgdeptpeo` where 1   ";

 var i=0;
 async.forEachOf(data, function (value, key, callback) {
	 i++;
     if(value != '' &&  value != 'undefined' ) sqlstr = sqlstr + " and  `" + key + "` like '%" + value + "%' ";

    callback();
 }	, function (err) {
    if (err) console.error(err.message);
    // configs is now a map of JSON data
	if(i == 0) {console.log('AAAAA');	return callback("bsd_orgDeptPeo.searchData_Json中Json数据为空");}
    else  //如果JSON中有数据
	{
	  console.log(sqlstr);
	  MySql.query(sqlstr, function(err, doc) {
			return    callback(err, doc);	    
	   });	
	}  //if end
 }); //async.forEachOf end 

}



//按Json格式，查询符合条件的数据包  含角色数据
bsd_orgDeptPeo.searchData_Json_role = function searchData_Json_role(data, callback ) {
 //console.log(data);
 var sqlstr = "select a.DeptPeoID, a.synid , a.userID , a.tel , a.address , a.nickname , a.name , a.sex , a.checkStatus , a.isProxy , a.REMARK, b.orgRoleID , b.name as rolename  " +
  " from  `bsd_orgdeptpeo` a,  `bsd_orgrole` b where 1 and a.orgRoleID =b.orgRoleID   ";

 var i=0;
 async.forEachOf(data, function (value, key, callback) {
	 i++;
     if(value != '' &&  value != 'undefined' ) {

		 if(key == 'name' || key == 'userID') sqlstr = sqlstr + " and  a.`" + key + "` like '%" + value + "%' ";
		 else  sqlstr = sqlstr + " and  `" + key + "` like '%" + value + "%' ";
	 } 

    callback();
 }	, function (err) {
    if (err) console.error(err.message);
    // configs is now a map of JSON data
	if(i == 0) {console.log('AAAAA');	return callback("bsd_orgDeptPeo.searchData_Json中Json数据为空");}
    else  //如果JSON中有数据
	{
	  console.log(sqlstr);
	  MySql.query(sqlstr, function(err, doc) {
			return    callback(err, doc);	    
	   });	
	}  //if end
 }); //async.forEachOf end 

}


bsd_orgDeptPeo.getMyOrgDep =  function getMyOrgDep(userID, callback) {
  
   var sqlstr =" select a.orgID , a.orgFullDes  , b.deptID ,  b.deptDes , c.orgRoleID,c.DeptPeoID ,d.name as rolename  , c.isDefault   from bsd_orginfo as a , bsd_orginfodept as b , bsd_orgdeptpeo as c , bsd_orgrole  as d where a.orgID = b.orgID and b.deptID = c.deptID  and  c.orgRoleID = d.orgRoleID   and  b.ISVALID = '1' and  c.synid = '" + userID +"'  and c.ISVALID = '1'   ";
  
    //sqlstr = sqlstr + " 


	console.log(sqlstr);
	var myOrgList = "";

	var data = {};
	MySql.query(sqlstr, function(err, docs) {
		if(err) return callback(err);
		else {
			async.eachSeries(docs, function(doc, callback) {    
                var checkedstr = '' ;
				if(doc.isDefault == 1) checkedstr = 'checked';

                 myOrgList = myOrgList +     //" + doc.orgID  + "
				      "<tr id='tr_" + doc.DeptPeoID + "'> " + 
					  "  <td><label class='radio-inline'> <input type='radio' orgid='" + doc.orgID  + "'  name='define_'    dfid='" + doc.DeptPeoID  + "'  value='" + doc.DeptPeoID  + "'   onclick='updateDefine(this)'   " + checkedstr + ">设为默认</label></td> " +     
					  "  <td>" + doc.orgFullDes + " </td> " +    
					  "	 <td>" + doc.deptDes  + " </td> " + 
					  "	 <td>" + doc.rolename  + " </td> " +  
					  "	 <td> " +   
					  "	      <button id='button_del_" + doc.DeptPeoID + "' onclick='delMyOrg(this)' dpid='" + doc.DeptPeoID  + "' class='btn btn-warning' style='width: 80px;height:28px;'>  删除 </button>   " +   
					  "	 </td> " + 
					  "</tr>" ;
            
                 return callback();      
					
			}, function(err){
		  		//if(err)
				//console.log(myOrgList);
				bsd_orgDeptPeo.getMyOrgDep_V2(userID,function(err, data_V2){
                        myOrgList = myOrgList + data_V2.myOrgList;   
						if(err)  console.log(err);
						data.myOrgList = myOrgList;
						return callback(err,data);
				});     


			}); //async.eachSeries END

		} //if end 
			    
	});	  // MySql.query  end


}





bsd_orgDeptPeo.getMyOrgDep_V2 = function getMyOrgDep_V2(userID, callback) {
  
   //var sqlstr =" select a.orgID , a.orgFullDes  , b.deptID ,  b.deptDes , c.orgRoleID,c.DeptPeoID ,d.name as rolename   from bsd_orginfo as a , bsd_orginfodept as b , bsd_orgdeptpeo as c , bsd_orgrole  as d where a.orgID = b.orgID and b.deptID = c.deptID  and  c.orgRoleID = d.orgRoleID   and  b.ISVALID = '1' and  c.synid = '" + userID +"'  and c.ISVALID = '1'   ";
  

    var sqlstr =" select a.orgID , a.orgFullDes  , a.orgID as deptID , a.orgFullDes as deptDes , c.orgRoleID,c.DeptPeoID  ,d.name as rolename  , c.isDefault   from bsd_orginfo as a , bsd_orgdeptpeo as c , bsd_orgrole  as d where a.orgID = c.deptID  and  c.orgRoleID = d.orgRoleID   and  c.ISVALID = '1'   and  c.synid = '" + userID +"'  ";

    //sqlstr = sqlstr + " 

	console.log(sqlstr);
	var myOrgList = "";

	var data = {};
	MySql.query(sqlstr, function(err, docs) {
		if(err) return callback(err);
		else {
			async.eachSeries(docs, function(doc, callback) {    
                var checkedstr = '' ;
				if(doc.isDefault == 1) checkedstr = 'checked';


                 myOrgList = myOrgList +  
				      "<tr id='tr_" + doc.DeptPeoID + "'> " + 
					  "  <td><label class='radio-inline'> <input type='radio'  name='define_"   + "'  orgid='" + doc.orgID  + "'   dfid='" + doc.DeptPeoID  + "'  value='" + doc.DeptPeoID  + "'   onclick='updateDefine(this)'  " + checkedstr + ">设为默认</label></td> " +     
					  "  <td>" + doc.orgFullDes + " </td> " +    
					  "	 <td>" + doc.deptDes  + " </td> " + 
					  "	 <td>" + doc.rolename  + " </td> " +  
					  "	 <td> " +   
					  "	      <button id='button_del_" + doc.DeptPeoID + "' onclick='delMyOrg(this)' dpid='" + doc.DeptPeoID  + "' class='btn btn-warning' style='width: 80px;height:28px;'>  删除 </button>   " +   
					  "	 </td> " + 
					  "</tr>" ;
            
                 return callback();
            

					
			}, function(err){

				data.myOrgList = myOrgList;
				
          		return callback(err,data);

			}); //async.eachSeries END

		} //if end 
			    
	});	  // MySql.query  end


}




bsd_orgDeptPeo.getMyrole = function getMyrole(userID, callback) {


    var sqlstr =" select *  from  bsd_orgdeptpeo   where ISVALID = '1' and checkStatus = '1'   and  synid = '" + userID +"' order by  isDefault DESC  ";

	var data = {};

	MySql.query(sqlstr, function(err, docs) {
		if(err) return callback(err);
		else if(docs.length <= 0  )  return callback(err, null);
		else if(docs.length >0)
		{   
			data = docs[0];
 			async.eachSeries(docs, function(doc, callback) {

				if(doc.isDefault == 1) data = doc;
                 return callback();
					
			}, function(err){

          		return callback(err,data);

			}); //async.eachSeries END

		} //if end 
			    
	});	  // MySql.query  end


}










//删除组织
bsd_orgDeptPeo.delOrg =  function delOrg(orgID ,  callback ) {
  
  this.isOrgValid(orgID,  function(flag) {
		if( flag == true )  {return callback('组织已经生效或已不存在，无法删除。'); }
		else {
			console.log('ttttttttttt');
			return callback('组织未生效');  
		}
  });

}

//组织是否生效， 生效返回True, 否则返回false
bsd_orgDeptPeo.isOrgValid = function isOrgValid(orgID,  callback) {
		//console.log('isOrgValid:' + orgID  );
   var sql ="SELECT * FROM `bsd_orgdeptpeo` WHERE `ISVALID` =1 AND `orgID` = '" + orgID + "'";
   MySql.query(sql , function(err,docs) {
	   //console.log(err);
	   //console.log(docs);
       // return  callback(err,results);
	  if(docs.length <= 0  || docs.length > 1  ) return callback(true);
	  else if(docs.length == 1 ) {
         var doc = docs[0];
		 if(doc.ISVALID == 1)  {  return  callback(true); }
		 else  return callback(false);
	   }
   });

}





//获取组织的树形结构
 bsd_orgDeptPeo.getOrgTree = function  getOrgTree(orgID ,   callback ) {
	 if(!orgID) return callback('ID为空');
	 else { //如果orgID不为空
         var sqlstr = "select  * from `bsd_orgdeptpeo` where `orgID` = '" + orgID + "'";
		 console.log(sqlstr);
		 MySql.query(sqlstr, function(err, docs) {
			 if(docs.length==0 )  return  callback('未查询到此ID数据');
			 else if(docs.length > 1 )  return  callback('ID数据不正确，此ID存在多条记录');
			 else {
				bsd_orgDeptPeoDept.getOrgTree_Child(orgID, function(err, depts) {  //console.log('AAA'); console.log(docs);
					//if(depts.length == 0)	 { return    callback(err, docs); }
					//else if(depts.length > 0) {  //合并docs, depts 
						//docs.concat(depts); 
						docs[0].parentId = null;
						Array.prototype.push.apply(docs, depts); 
						console.log(depts);
						console.log(docs);
						return    callback(err, docs);
					//}   
				     
				});
			 }  //if end
				    
	     });// MySql.query
	
     } //if end
 }







//ID是否存在
bsd_orgDeptPeo.isIDexist =  function isIDexist(orgID,callback) {

   MySql.query('SELECT * FROM `bsd_orgdeptpeo` WHERE  orgID = ?', [orgID]  , function(err,results) {
        return  callback(err,results);
    });

}

//是否存在有效ID
bsd_orgDeptPeo.isIDexist_V2 =  function isIDexist_V2(orgID,callback) {

   MySql.query('SELECT * FROM `bsd_orgdeptpeo` WHERE `ISVALID` =1 AND orgID = ?', [orgID]  , function(err,results) {
        return  callback(err,results);
    });

}



bsd_orgDeptPeo.seachForm =  function seachForm(data, callback){
   MySql.query('SELECT ?? FROM `bsd_orgdeptpeo` WHERE ?? = ?', data  , function(err,results) {
		// console.log(err);  
		return callback(err,results);
   });
}



//查询数据
bsd_orgDeptPeo.searchData =  function searchData(sql, callback){
    sqlstr=sql;
	MySql.query(sqlstr, function(err, doc) {
		//console.log(doc);
        return callback(err,doc);
   });

}

//更新数据
bsd_orgDeptPeo.updateData =  function updateData(sql, callback){
    sqlstr=sql;
    MySql.query(sqlstr, function(err, doc) {
		return   callback(err, doc);	    
	 });	
}

//
bsd_orgDeptPeo.savePage = function savePage(orgID, callback){
	 var sqlstr='UPDATE `bsd_orgdeptpeo`  SET  `ISVALID`  = 1 WHERE `orgID` = ' + orgID;
	 //console.log(sqlstr);
		MySql.query(sqlstr, function(err, doc) {
			return    callback(err, doc);	    
	   });	

}



bsd_orgDeptPeo.regainDefin = function regainDefin(data,callback) {   //and `orgID`  = '" + data.orgID + "'
	var sqlstr = "UPDATE `bsd_orgdeptpeo`  SET  `isDefault`  = 0 WHERE `synid` = '" + data.synid + "'    ";
	console.log(sqlstr);
	MySql.query(sqlstr, function(err, doc) {
		return    callback(err, doc);	    
    });	

}



//获取试卷头部信息
bsd_orgDeptPeo.getHeaderData = function getHeaderData(orgID, callback){
    datas = {};  
    examPage.getPagesHeader(orgID,function(err,pageData){
	  console.log(pageData);
      if(err) return callback(err);
	  examQuestion.getQuestionHeader(orgID, function(err,qusData){
         //console.log(qusData);
         datas.shitiCount=qusData.shitiCount , datas.shitIDs=qusData.shitIDs ;
	      datas.shiti_num=qusData.shiti_num , datas.shitiFromPage=qusData.shitiFromPage;

	     datas.pageCount=pageData.pageCount,  datas.pageIDs=pageData.pageIDs, datas.page_num=pageData.page_num;
		 datas.silders = qusData.silders;
		
		 if(err) return callback(err);  
		 else
		   callback(err,datas);

	  });  //examQuestion.getQuestionHeader end 

	}); // examPage.getPagesHeader


}  //bsd_orgDeptPeo.getHeaderData end





//获取试卷头部信息
bsd_orgDeptPeo.getHeaderData_V2 = function getHeaderData_V2(orgID, callback){
    datas = {};  
    examPage.getPagesFromorgID(orgID,function(err,pages){
	  //console.log(pageData);
      if(err) return callback(err);
	  
	  if(pages.length <= 0) return callback(err,'');
	  else
	    examQuestion.getQuestionHeader_V2(orgID, function(err,qusData){
          //console.log(qusData);
		  var page = pages[0];
		  datas.pageID=page.pageID;

          datas.shitiCount = qusData.shitiCount ;
		  datas.shitiIDs = qusData.shitiIDs ;
	      datas.shitiTypes = qusData.shitiTypes ;
		
		 if(err) return callback(err);  
		 else
		   callback(err,datas);

	  });  //examQuestion.getQuestionHeader end 

	}); // examPage.getPagesHeader


}  //bsd_orgDeptPeo.getHeaderData end











