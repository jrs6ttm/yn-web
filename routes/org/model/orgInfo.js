var MySql = require('../mysql/mysql.js');
var orgInfoDept = require('./orgInfoDept'); 
//var examQuestion = require('./examQuestion');

//var EventProxy = require('eventproxy');
//var ep = new EventProxy();
var async = require("async");

function orgInfo(resu) {
		this.resu = resu;
	};	
	
module.exports = orgInfo;


//执行SQL
orgInfo.toSQL =  function toSQL(sqlstr, callback){
	MySql.toSQL(sqlstr, function(err, doc) {
		//console.log(doc);
        return callback(err,doc);
   });

}


//插入数据
orgInfo.insertData =  function insertData(data, callback){
	console.log(data);
   MySql.toSQL('INSERT INTO `bsd_orginfo`  SET ?', data  , function(err, doc) {
		// console.log(err);  console.log(doc);
		return callback(err,doc);
   });
}



//按Json格式更新数据
orgInfo.updateData_Json = function updateData_Json(data,orgID , callback ) {
 //console.log(data);
 var sql1 = "UPDATE `bsd_orginfo`  SET  ";
 var sql2 = " where `orgID` = '" + orgID + "'";
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
	if(i == 0) {console.log('AAAAA');	return callback("orgInfo.updateData_Json中Json数据为空");}
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
orgInfo.searchData_Json = function searchData_Json(data, callback ) {
 //console.log(data);
 var sqlstr = "select * from  `bsd_orginfo` where 1   ";

 var i=0;
 async.forEachOf(data, function (value, key, callback) {
	 i++;
     if(value != '' ) sqlstr = sqlstr + " and  `" + key + "` like '%" + value + "%' ";

    callback();
 }	, function (err) {
    if (err) console.error(err.message);
    // configs is now a map of JSON data
	if(i == 0) {console.log('AAAAA');	return callback("orgInfo.searchData_Json中Json数据为空");}
    else  //如果JSON中有数据
	{
	  console.log(sqlstr);
	  MySql.toSQL(sqlstr, function(err, doc) {
			return    callback(err, doc);	    
	   });	
	}  //if end
 }); //async.forEachOf end 

}

//删除组织
orgInfo.delOrg =  function delOrg(orgID ,  callback ) {
  
  this.isOrgValid(orgID,  function(flag) {
		if( flag == true )  {return callback('组织已经生效或已不存在，无法删除。'); }
		else {
			delOrg_V1(orgID);  //删除组织
			delDeptPeo(orgID); //删除组织下的人员
            orgInfoDept.delDept_All(orgID);  //删除组织下的机构和人员

			console.log('ttttttttttt');
			return callback(null);  
		}
  });

}



//删除组织
 function delOrg_V1(orgID){
	var sqlstr="DELETE FROM `bsd_orginfo`   WHERE `orgID` = '" + orgID + "'"; 
	console.log(sqlstr);
	MySql.toSQL(sqlstr, function(err, doc) {
		if(err)  console.log(err); 
    });	
}


//物理删除机构结点下的所有用户，无返回
 function delDeptPeo(ID) {
	var sqlstr="DELETE FROM `bsd_orgdeptpeo`   WHERE `deptID` = '" + ID + "'"; 
	console.log(sqlstr);
	MySql.toSQL(sqlstr, function(err, doc) {
		if(err)  console.log(err); 
    });	
  }



//组织是否生效， 生效返回True, 否则返回false
orgInfo.isOrgValid = function isOrgValid(orgID,  callback) {
		//console.log('isOrgValid:' + orgID  );
   var sql ="SELECT * FROM `bsd_orginfo` WHERE `orgID` = '" + orgID + "'";
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





//获取组织的树形结构
 orgInfo.getOrgTree = function  getOrgTree(orgID ,   callback ) {
	 if(!orgID) return callback('ID为空');
	 else { //如果orgID不为空
         var sqlstr = "select  * from `bsd_orginfo` where `orgID` = '" + orgID + "'";
		 console.log(sqlstr);
		 MySql.toSQL(sqlstr, function(err, docs) {
			 if(docs.length==0 )  return  callback('未查询到此ID数据');
			 else if(docs.length > 1 )  return  callback('ID数据不正确，此ID存在多条记录');
			 else {
				orgInfoDept.getOrgTree_Child(orgID, function(err, depts) {  //console.log('AAA'); console.log(docs);
					//if(depts.length == 0)	 { return    callback(err, docs); }
					//else if(depts.length > 0) {  //合并docs, depts 
						//docs.concat(depts); 
						docs[0].parentId = null;
						docs[0].leve = 0;
						Array.prototype.push.apply(docs, depts); 
						//console.log(depts);
						//console.log(docs);
						return    callback(err, docs);
					//}   
				     
				});
			 }  //if end
				    
	     });// MySql.toSQL
	
     } //if end
 }









//ID是否存在
orgInfo.isIDexist =  function isIDexist(orgID,callback) {

   MySql.toSQL('SELECT * FROM `bsd_orginfo` WHERE  orgID = ?', [orgID]  , function(err,results) {
        return  callback(err,results);
    });
}

//组织代码是否存在
orgInfo.isOrgExist =  function isOrgExist(orgCode , callback){
   var sqlstr = "SELECT * FROM `bsd_orginfo` WHERE  `orgCode`= '" + orgCode + "'";
   console.log(sqlstr);
   MySql.toSQL(sqlstr,  function(err,results) {
        return  callback(err,results);
    });
}

//组织代码是否存在于其它组织
orgInfo.isOrgExist_V2 =  function isOrgExist_V2(data , callback){
   var sqlstr = "SELECT * FROM `bsd_orginfo` WHERE  `orgCode`= '" + data.orgCode + "' and `orgID` != '" + data.orgID + "'";
   console.log(sqlstr);
   MySql.toSQL(sqlstr,  function(err,results) {
        return  callback(err,results);
    });
}


//是否存在有效ID
orgInfo.isIDexist_V2 =  function isIDexist_V2(orgID,callback) {

   MySql.toSQL('SELECT * FROM `bsd_orginfo` WHERE `ISVALID` =1 AND orgID = ?', [orgID]  , function(err,results) {
        return  callback(err,results);
    });

}



orgInfo.seachForm =  function seachForm(data, callback){
   MySql.toSQL('SELECT ?? FROM `bsd_orginfo` WHERE ?? = ?', data  , function(err,results) {
		// console.log(err);  
		return callback(err,results);
   });
}



//查询数据
orgInfo.searchData =  function searchData(sql, callback){
    sqlstr=sql;
	MySql.toSQL(sqlstr, function(err, doc) {
		//console.log(doc);
        return callback(err,doc);
   });

}

//更新数据
orgInfo.updateData =  function updateData(sql, callback){
    sqlstr=sql;
    MySql.toSQL(sqlstr, function(err, doc) {
		return   callback(err, doc);	    
	 });	
}

//
orgInfo.savePage = function savePage(orgID, callback){
	 var sqlstr='UPDATE `bsd_orginfo`  SET  `ISVALID`  = 1 WHERE `orgID` = ' + orgID;
	 //console.log(sqlstr);
		MySql.toSQL(sqlstr, function(err, doc) {
			return    callback(err, doc);	    
	   });	

}


//获取试卷头部信息
orgInfo.getHeaderData = function getHeaderData(orgID, callback){
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


}  //orgInfo.getHeaderData end





//获取试卷头部信息
orgInfo.getHeaderData_V2 = function getHeaderData_V2(orgID, callback){
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


}  //orgInfo.getHeaderData end


orgInfo.getOrg_option = function getOrg_option(callback) {
	var sqlstr = "select * from  bsd_orginfo where ISVALID = '1'  ";
	var optionList = "";
	var data = {};
	MySql.toSQL(sqlstr, function(err, docs) {
		if(err) return callback(err);
		else {
			async.eachSeries(docs, function(doc, callback) {    

                 optionList = optionList +  "<option value='"+ doc.orgID +"'  area_name='"+doc.orgFullDes+"'>"+doc.orgFullDes+"</option>";
            
                 return callback();
            

					
			}, function(err){

		  		//if(err) console.log(err);
				data.optionList = optionList;
          		return callback(err,data);

			}); //async.eachSeries END

		} //if end 
			    
	});	  // MySql.toSQL  end

}








