var MySql = require('../mysql/mysql.js');
//var examPage = require('./examPage'); 
//var examQuestion = require('./examQuestion');

var EventProxy = require('eventproxy');
var ep = new EventProxy();
var async = require("async");

function orgInfoDept(resu) {
		this.resu = resu;
	};	
	
module.exports = orgInfoDept;


//执行SQL
orgInfoDept.toSQL =  function toSQL(sqlstr, callback){
	MySql.toSQL(sqlstr, function(err, doc) {
		//console.log(doc);
        return callback(err,doc);
   });

}



//插入数据
orgInfoDept.insertData =  function insertData(data, callback){
	console.log(data);
   MySql.toSQL('INSERT INTO `bsd_orginfodept`  SET ?', data  , function(err, doc) {
		// console.log(err);  console.log(doc);
		return callback(err,doc);
   });
}




//按数组格式更新数据
orgInfoDept.updateData_arry = function updateData_arry(datas , userID, callback ) {
    //console.log('A',datas);
	var myself = require('./orgInfoDept');
	
    var sqlstr =''; 

	 var moment = require("moment");
	
	async.eachSeries(datas, function(doc, callback) {    
      doc.LSTUPDID = userID;
	  doc.LSTUPDDATE =  moment().format("YYYY-MM-DD HH:mm:ss");
      myself.updateData_Json(doc , doc.deptID , function(err, doc){
         //sqlstr = sqlstr + str;
		 if(err) console.log(err);
         return callback();
	  });
      
	}, function(err){

    // console.log(sqlstr);
     if(err) console.log(err);
	 return callback(sqlstr);

	}); //async.eachSeries END

 }



//按Json格式更新数据
orgInfoDept.updateData_Json = function updateData_Json(data,deptID , callback ) {
 //console.log(data);
 var sql1 = "UPDATE `bsd_orginfodept`  SET  ";
 var sql2 = " where `deptID` = '" + deptID + "'";
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
	if(i == 0) {console.log('AAAAA');	return callback("orgInfoDept.updateData_Json中Json数据为空");}
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



orgInfoDept.getUserDept = function getUserDept(data, callback) {
	var myself = require('./orgInfoDept');
	myself.isUserInClass(data.synid, function(flag ,docs){
		if(flag == false ) {
           return callback("数据错误:没有在班级搜索到此用户ID，请将用户分配到班级中去。或者系统错误:请查看控制台！");
		} else { //如果存在于班级中, 返回班级数据。
		   
		   // return callback(null, docs);

            var resu = [], j=-1;
			async.eachSeries(docs, function(doc, callback) {    
                j++;
				//resu[j] = doc;
				myself.getUserTree(doc.parentId , function(tree){
					 var tmp_json = {};
					 tmp_json = doc;
					 tmp_json.tree = doc.orgFullDes + "-->" + tree + "-->" + doc.deptDes;

					 resu[j] = tmp_json;

					return callback();
				});
					
			}, function(err){

				if(err) console.log(err);
				return callback(err , resu );

			}); //async.eachSeries END

		}
	});

}


//查找用户所在的组织
orgInfoDept.getUserDept_V3 = function getUserDept_V3(data, callback) {
	//var myself = require('./orgInfoDept');

     var sqlstr = " select  DISTINCT a.`orgID` , b.`orgFullDes` from   `bsd_orgdeptpeo` as a , `bsd_orginfo` as b  where a.orgID = b.orgID and  `synid` = '" + data.synid + "' ";

     MySql.toSQL(sqlstr  , function(err,docs) {

		return callback(err, docs);

	 });  // MySql.toSQL end

}




//查找用户所在的组织和部门
orgInfoDept.getUserDept_V4 = function getUserDept_V4(data, callback) {
	//var myself = require('./orgInfoDept');

     var sqlstr = " select  `deptID`  from   `bsd_orgdeptpeo`  where  `synid` = '" + data.synid + "' ";

     MySql.toSQL(sqlstr  , function(err,docs) {

		return callback(err, docs);

	 });  // MySql.toSQL end

}


//设置V5专用的全局变量，记录被遍历的结点ID数据



//获取组织的信息
orgInfoDept.getUserDept_V5  =  function getUserDept_V5(data , callback) {
  // var sqlstr = "select a.`orgID`  ,  b.`deptID` , a.orgFullDes, b.deptDes  from  `bsd_orginfo` as a , `bsd_orginfodept` as b  where  a.`orgID` = b.`orgID`  and a.`orgID` = b.`parentId`  " +
   //            "  b.`deptID` IN (select  DISTINCT d.`deptID` from  `bsd_orginfodept` as d,  `bsd_orgdeptpeo` as e where   ) ";
   //console.log(sqlstr);
   var myself = require('./orgInfoDept');
   var nullArr= [], res = [], i=-1;
   var sqlstr = " select  a.deptID , b.parentId from   `bsd_orgdeptpeo` as a, `bsd_orginfodept` as b where a.deptID=b.deptID and a.orgID ='" + data.orgID + "'  and  a.synid ='" + data.synid + "' ";
   var tmpstr = '';

   var rootDep = [],  rootDepParent = [];

   var haveSearch = '-1'; //
   console.log(sqlstr);
   MySql.toSQL(sqlstr  , function(err,docs) {
        if(err) return callback(err);
		else 
		   if(docs.length <= 0) {console.log('森林为空');return callback(err,nullArr);} 
		   else if(docs.length > 0)

				async.eachSeries(docs, function(doc, callback) { 
					rootDep[rootDep.length] = doc.deptID;
					rootDepParent[rootDepParent.length] = doc.parentId;

					myself.getDepTree(doc.deptID, haveSearch ,function(val , newhaveSearch){
			   			
							res.push.apply(res,val);
							haveSearch = newhaveSearch;
							callback();
					});  // myself.getDepTree end

				}, function(err){
                    //console.log('rootDep:' , rootDep);
					if(err) console.log(err);

					//console.log("rootDepParent:",rootDepParent);					

					//去除树父节点的parentId
					myself.delTreeParentIdNull(res,haveSearch, rootDep , rootDepParent ,function(err,newRes){
                         // myself.changOrgIDToDeptID(newRes,function(val) {
                              return callback(err , newRes );
					     // });    
					}); 

			    }); //async.eachSeries END
   });

}

/*
orgInfoDept.changOrgIDToDeptID =  function changOrgIDToDeptID (newRes,callback) {

    var val=[], tmp={}, i=-1;
	console.log('UUUU:' ,  newRes);
	async.eachSeries(newRes, function(doc, callback) {
		
		tmp.orgID = doc.deptID; 
		tmp.deptDes = doc.deptDes;
		tmp.parentId =doc.parentId;
        console.log(tmp);

        val[val.length] =  tmp;

		callback();  

	}, function(err){

	  console.log(val);

	  return callback( val );

	}); //async.eachSeries END

}
*/


//去除树父节点的parentId
orgInfoDept.delTreeParentIdNull =  function delTreeParentIdNull (res,newhaveSearch,rootDep,rootDepParent  ,callback) {
	var myself = require('./orgInfoDept');
    var newRes =  res; i=-1;
	console.log("newhavesearch:",newhaveSearch);

	async.eachSeries(rootDep, function(doc, callback) { 
	   i++;
       if(newhaveSearch.indexOf(rootDepParent[i]) == -1 ) {  //如果树的父节点不存在于森林中， 将它的父节点设为空
          console.log(i+ ":" + rootDepParent[i]);
		  myself.updateParentNull(newRes,doc, function(val){
            newRes = val; 
            callback();  
		  });
         	 
	  } else {   

          callback();  
	   }
	  

	}, function(err){

	 console.log('TTTTt',newRes);

	  return callback(err , newRes );


	}); //async.eachSeries END

}


orgInfoDept.updateParentNull =  function updateParentNull (res,deptID,callback) {
   	console.log('res:', res, 'ID',deptID);

    var val=[], tmp={}, i=-1;
	async.eachSeries(res, function(doc, callback) {
		  
	       tmp = doc; 
		   i++;
		   console.log(i, doc );
           if(doc.deptID == deptID ) {
                tmp.parentId = null;
				val[val.length] = tmp;
				callback();  
		   } else {
				val[val.length] = tmp;
				callback();  
		   }


	}, function(err){

	  console.log(val);

	  return callback( val );

	}); //async.eachSeries END

}





//获取机构下的所有子结点信息
orgInfoDept.getDepTree =  function getDepTree (deptID,haveSearch,callback) {
	//1. 先判断此结点是否已经被遍历   2.如果否， 怎么遍历它的子结点信息
    var myself = require('./orgInfoDept');
	var res =[];
	var newhaveSearch =  haveSearch;
	//console.log(deptID, newhaveSearch);

    //先判断此结点是否已经遍历， 是，则返回； 否，遍历子节点
	if(newhaveSearch.indexOf(deptID) != -1 )  return callback(res,newhaveSearch);
	else //如果没有遍历过此节点

		myself.getDepInfo(deptID,function(err,depDocs){
		
			if(err ) {console.log(err); return callback(res, newhaveSearch); }
			else {
				//将本结点信息采集完成， 然后采集子节点信息， 在返回主函数
				var tmpjson = {}; 
				 tmpjson.orgID =depDocs[0].orgID; 
				 tmpjson.deptID =depDocs[0].deptID; 
				 tmpjson.deptDes =depDocs[0].deptDes; 
                 tmpjson.parentId =  depDocs[0].parentId;


				 res[res.length] = tmpjson;
				 newhaveSearch = newhaveSearch + "," + depDocs[0].deptID;

                //开始遍历子节点
				var sqlstr="select *  from `bsd_orginfodept` where `parentId` ='" + deptID + "' ";
				MySql.toSQL(sqlstr  , function(err,docs) {
					if(err) {console.log(err); return callback(res, newhaveSearch); }
					else  if(docs.length <=0 ) return callback(res, newhaveSearch );
					else  if(docs.length >0 )
					   async.eachSeries(docs, function(doc, callback) { 
									
                          myself.getDepTree(doc.deptID  ,  newhaveSearch ,function(val , newhaveSearchtmp){
                             res.push.apply(res,val);
							 newhaveSearch = newhaveSearchtmp;
							 callback();

						  } );


					   }, function(err){
							//console.log('res:' , res);
							if(err) console.log(err);

							return callback(res, newhaveSearch );

					  }); //async.eachSeries END

				});
				

				

				}
				
		});  //myself.getDepInfo end 

}






//获取机构信息
orgInfoDept.getUserDept_V2  =  function getUserDept_V2(data , callback) {
  // var sqlstr = "select a.`orgID`  ,  b.`deptID` , a.orgFullDes, b.deptDes  from  `bsd_orginfo` as a , `bsd_orginfodept` as b  where  a.`orgID` = b.`orgID`  and a.`orgID` = b.`parentId`  " +
   //            "  b.`deptID` IN (select  DISTINCT d.`deptID` from  `bsd_orginfodept` as d,  `bsd_orgdeptpeo` as e where   ) ";
   //console.log(sqlstr);
   var myself = require('./orgInfoDept');
   var nullArr= [], res = [], i=-1;
   var sqlstr = " select  *   from   `bsd_orgdeptpeo` where  `synid` ='" + data.synid + "' ";
   var tmpstr = '';
   MySql.toSQL(sqlstr  , function(err,docs) {
        if(err) return callback(err);
		else 
		   if(docs.length <= 0) return (err,nullArr);
		   else

				async.eachSeries(docs, function(doc, callback) { 
					
					var tmpjson = {};
					if(doc.orgID == doc.deptID)  {i++; res[i] = {'orgID': doc.orgID ,  'deptID' : ''  } ; callback(); }
					else{
						tmpjson.orgID = doc.orgID;
						
							myself.getSecondParent(doc.deptID,function(val){
								
                                if(tmpstr.indexOf(val) == -1){  //如果不重复二级院校的ID
									i++
                                    tmpstr =  tmpstr + '_' + val;
									tmpjson.deptID = val;
									res[i] = tmpjson;
                                    callback();
								} else {
									callback();
								}

							}); 

					}  //if end

                  
				}, function(err){
                    //console.log('res:' , res);
					if(err) console.log(err);
					return callback(err , res );

				}); //async.eachSeries END
   });

}






 orgInfoDept.getSecondParent = function getSecondParent (deptID, callback) {
	 var myself = require('./orgInfoDept');
     var sqlstr = " select  *   from   `bsd_orginfodept`  where  `deptID` ='" + deptID + "' ";
	 var nullstr = '';
     MySql.toSQL(sqlstr  , function(err,docs) {

		 if(docs.length <= 0 )  return callback(nullstr);
		 else if(docs.length > 1 ) { console.log('存在多个相同的deptID,数据错误');  return callback(nullstr);}
		 else if(docs.length == 1) {
              if(docs[0].orgID == docs[0].parentId) return callback(docs[0].deptID);   //如果父节点ID为orgID,则表示它为二级院校，返回数据
			  else  //如果父节点ID不为orgID,继续向上查找。

                 myself.getSecondParent(docs[0].parentId,function(val){   //递归调用
                      return callback(val); 
				
			     });

		 }

	 });  // MySql.toSQL end

 }




//获取班级的机构树形结构:  系--》专业,  参数deptID：为专业的ID
orgInfoDept.getUserTree = function  getUserTree(deptID, callback) {
  var str = '';
  var myself = require('./orgInfoDept');
  myself.getDepInfo(deptID,function(err,doc1){  //获取专业的信息
     if(err) console.log(err);
     
	 if(!doc1[0]) return callback('数据错');
	 else
		myself.getDepInfo(doc1[0].parentId,function(err,doc2){  //获取系的信息
			if(err) console.log(err);
			if(doc2[0])  str = str + doc2[0].deptDes +  "-->";
			else str = str + "数据出错" +  "-->";

			if(doc1[0])  str = str + doc1[0].deptDes;
			else str = str + "数据出错";


			// str =  doc2[0].deptDes + "-->" + doc1[0].deptDes ;


			return callback(str);

		});

  });

}


//获取机构信息
orgInfoDept.getDepInfo  =  function getDepInfo(deptID, callback) {
   var sqlstr = "select * from  `bsd_orginfodept` where  `deptID` = '" + deptID + "'  ";
   //console.log(sqlstr);
   MySql.toSQL(sqlstr  , function(err,docs) {
	    if(err) console.log(err);
		return callback(err,docs);
   });

}





//用户是否存在于班级这一机构中，班级机构的leve = 4
orgInfoDept.isUserInClass =  function isUserInClass(synid,callback) {
   var sqlstr = "select b.`deptID` , a.`deptDes`  , a.`orgID` , c.`orgFullDes`, a.`parentId`  from `bsd_orginfodept`as a,  `bsd_orgdeptpeo` as b , `bsd_orginfo` as c  " + 
    " where a.`deptID` = b.`deptID` and a.orgID = c.orgID  and c.schoolType ='1' and a.`leve` = '4' and  b.`synid` = '"+ synid +"' " ;
	console.log(sqlstr);
   MySql.toSQL(sqlstr  , function(err,results) {
	    if(err) console.log(err);
		
		if(results.length <= 0) return callback(false);
		else  return callback(true,results);
    });

}





//按Json格式，查询符合条件的数据
orgInfoDept.searchData_Json = function searchData_Json(data, callback ) {
 //console.log(data);
 var sqlstr = "select * from  `bsd_orginfodept` where 1   ";

 var i=0;
 async.forEachOf(data, function (value, key, callback) {
	 i++;
     if(value != '' ) sqlstr = sqlstr + " and  `" + key + "` like '%" + value + "%' ";

    callback();
 }	, function (err) {
    if (err) console.error(err.message);
    // configs is now a map of JSON data
	if(i == 0) {console.log('AAAAA');	return callback("orgInfoDept.searchData_Json中Json数据为空");}
    else  //如果JSON中有数据
	{
	  console.log(sqlstr);
	  MySql.toSQL(sqlstr, function(err, doc) {
			return    callback(err, doc);	    
	   });	
	}  //if end
 }); //async.forEachOf end 

}


//获取组织的树形结构
 orgInfoDept.getOrgTree_Child = function getOrgTree_Child(orgID ,   callback ) {
	 if(!orgID) return callback('ID为空');
	 else { //如果orgID不为空
         var sqlstr = "select  deptID as orgID , parentId , deptDes  as orgFullDes , leve  from `bsd_orginfodept` where `orgID` = '" + orgID + "'";
		 console.log(sqlstr);
		 MySql.toSQL(sqlstr, function(err, docs) {
			 //console.log(docs);
             return    callback(err, docs);   
	     });	
	
     } //if end
 }


//删除机构及机构下的所有子结点和人员， 无返回
orgInfoDept.delDept_All  =  function  delDept_All(deptID) {

   delDept_F(deptID);

}

function delDept_F(deptID) {
   var sqlstr = "select  `deptID` from  `bsd_orginfodept` where  `parentId` =  '" + deptID + "' ";
   console.log(sqlstr );
   
   MySql.toSQL(sqlstr, function(err,docs){  //先查询子结点的ID数据， 然后删除本结点及人员， 再递归删除子结点的所有子结点和人员
       if(err) console.log(err);
	   else {
		  
		    delDept_one(deptID);      //删除本结点
		    delDeptPeo(deptID);        //删除本结点的用户
		    console.log(deptID + ":本机构删除完毕.");
          // console.log(docs);

		   async.eachSeries(docs, function(doc, callback) {    
               //console.log(doc.deptID);
			   delDept_F(doc.deptID);
               callback();
	        }, function(err){

            }); //async.eachSeries END

	   }

   });  //MySql.toSQL end

}


//物理删除单一机构结点，无返回
 function delDept_one(ID) {
	var sqlstr="DELETE FROM `bsd_orginfodept`   WHERE `deptID` = '" + ID + "'"; 
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




//ID是否存在
orgInfoDept.isIDexist =  function isIDexist(deptID,callback) {

   MySql.toSQL('SELECT * FROM `bsd_orginfodept` WHERE  `deptID` = ?', [deptID]  , function(err,results) {
        return  callback(err,results);
    });

}

//是否存在有效ID
orgInfoDept.isIDexist_V2 =  function isIDexist_V2(orgID,callback) {

   MySql.toSQL('SELECT * FROM `bsd_orginfodept` WHERE `ISVALID` =1 AND deptID= ?', [orgID]  , function(err,results) {
        return  callback(err,results);
    });

}



orgInfoDept.seachForm =  function seachForm(data, callback){
   MySql.toSQL('SELECT ?? FROM `bsd_orginfodept` WHERE ?? = ?', data  , function(err,results) {
		// console.log(err);  
		return callback(err,results);
   });
}



//查询数据
orgInfoDept.searchData =  function searchData(sql, callback){
    sqlstr=sql;
	MySql.toSQL(sqlstr, function(err, doc) {
		//console.log(doc);
        return callback(err,doc);
   });

}

//更新数据
orgInfoDept.updateData =  function updateData(sql, callback){
    sqlstr=sql;
    MySql.toSQL(sqlstr, function(err, doc) {
		return   callback(err, doc);	    
	 });	
}

//
orgInfoDept.savePage = function savePage(orgID, callback){
	 var sqlstr='UPDATE `bsd_orginfodept`  SET  `ISVALID`  = 1 WHERE `orgID` = ' + orgID;
	 //console.log(sqlstr);
		MySql.toSQL(sqlstr, function(err, doc) {
			return    callback(err, doc);	    
	   });	

}


//获取试卷头部信息
orgInfoDept.getHeaderData = function getHeaderData(orgID, callback){
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


}  //orgInfoDept.getHeaderData end





//获取试卷头部信息
orgInfoDept.getHeaderData_V2 = function getHeaderData_V2(orgID, callback){
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


}  //orgInfoDept.getHeaderData end











