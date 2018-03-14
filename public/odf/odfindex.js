
var express = require('express');
var router = express.Router();
//var config = require('../../config/config.json');
var config = require('../../config.json');
var path = require('path');
var uuid =  require('node-uuid');
var crypto = require('crypto');
var EventProxy = require('eventproxy');
var async = require('async');


var env = global.orgENV;
var querystring = require('querystring');
var http = require('http');



function headers(res){
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
}

router.get('/', index);



function index(req,res, next) {
     

      res.render('odf/revieweditor');

}

 function org_edit(req,res, next) {
     headers(res);

     var data={};
     var orgID =  req.query.id;
     //console.log(orgID);
     data.orgID = orgID;

     if(orgID == '' || orgID == undefined  ) res.render('org/org_edit');
     else  //如果获取到ID， 显示后台数据
         orgInfo.searchData_Json(data, function(err,docs){
             //console.log(doc);
             if(err) { console.log(err); res.send({des:err });  }
             else
             {    console.log(docs);
                 if(docs.length == 0) res.send('id数据不存在.');
                 else if(docs.length > 1) res.send('id数据不正确，存在多条记录.');
                 else {
                     var doc = docs[0];
                     //初始化下拉框
                     var s1 = 'orgSort_sle_' +  doc.orgSort;
                     var s2 = 'schoolType_sle_' + doc.schoolType;
                     var s3 = 'orgscaleType_sle_' + doc.orgscaleType;

                     doc[s1] = 'selected';
                     doc[s2] = 'selected';
                     doc[s3] = 'selected';

                     console.log(doc);
                     res.render('org/org_edit', doc);
                 } //if end

             } //if end
         });


 }



 function org_search(req,res, next) {

     res.render('org/org_search');

 }

function orgDep_edit(req,res, next) {
    var data={};
    orgID =  req.query.id;
    //console.log(orgID);
    data.orgID = orgID;

    if(orgID == '' || orgID == undefined  ) res.send('ID数据为空或未定义。');
    else  //如果获取到ID， 显示后台数据
        orgInfo.searchData_Json(data, function(err,docs){
            //console.log(doc);
            if(err) { console.log(err); res.send({des:err });  }
            else
            {    console.log(docs);
                if(docs.length == 0) res.send('id数据不存在.');
                else if(docs.length > 1) res.send('id数据不正确，存在多条记录.');
                else {
                    var doc = docs[0];
                    console.log(doc);
                    if(doc.schoolType==1) doc.selected_1="selected";
                    else  doc.selected_0="selected";

                    res.render('org/orgDep_edit', doc);
                } //if end

            } //if end
        });


}


function Ajax_insertOrj(req,res, next) {

    //获取session user
    var userID = req.session.userData.id;
    //console.log('USERid:' + userID );
    var data = {};
    var moment = require("moment");

    data.orgID = uuid.v1();
    data.orgCode = req.body['orgCode'];
    data.legalPerson = req.body['legalPerson'];
    data.orgFullDes = req.body['orgFullDes'];
    data.tel1 = req.body['tel1'];
    data.orgShortDes = req.body['orgShortDes'];
    data.orgSort = req.body['orgSort'];
    data.emailAdress = req.body['emailAdress'];
    data.tel2 = req.body['tel2'];
    data.address = req.body['address'];
    data.schoolType = req.body['schoolType'];
    data.orgscaleType = req.body['orgscaleType'];
    data.registerMoney = req.body['registerMoney'];
    data.businessLicense = req.body['businessLicense'];
    data.REMARK = req.body['REMARK'];
    data.ISVALID = req.body['ISVALID'];
    data.CREATORID = userID ;
    data.CREATEDATE = moment().format("YYYY-MM-DD HH:mm:ss");

    //console.log(data);
    orgInfo.isOrgExist(data.orgCode, function(err,docs){
        if(err) { console.log(err); res.send({err:err ,  status : '404'});  }
        else if(docs.length > 0  )   res.send({err:"组织代码已被占用，请更换!",  status : '404'});
        else//如果组织代码未被占用
            orgInfo.insertData(data, function(err,doc_exam){
                //console.log(doc_exam);
                if(err) { console.log(err); res.send({err:err ,  status : '404'});  }
                else
                    res.send({docData:data , status : '200'});
            });

    });


}



function   Ajax_updateOrj(req,res, next) {

    //获取session user
    var userID = req.session.userData.id;
    console.log('USERid:' + userID );
    var data = {};
    var moment = require("moment");

    //if(req.body['orgCode'] )
    //if(req.body['legalPerson'] )
    //if(req.body['orgFullDes'] )

    var orgID = req.body['orgID'];

    if(orgID=='' || orgID==undefined ) return res.send({err:"orgID数据不正确" ,  status : '404'});

    if( req.body['checkStatus'] !=undefined )  data.checkStatus = req.body['checkStatus'];

    if( req.body['orgCode']!=undefined ) data.orgCode = req.body['orgCode'];
    if( req.body['legalPerson'] !=undefined ) data.legalPerson = req.body['legalPerson'];
    if( req.body['orgFullDes'] !=undefined ) data.orgFullDes = req.body['orgFullDes'];
    if( req.body['tel1'] !=undefined ) data.tel1 = req.body['tel1'];
    if( req.body['orgShortDes'] !=undefined ) data.orgShortDes = req.body['orgShortDes'];
    if( req.body['orgSort'] !=undefined ) data.orgSort = req.body['orgSort'];
    if( req.body['emailAdress'] !=undefined ) data.emailAdress = req.body['emailAdress'];
    if( req.body['tel2'] !=undefined ) data.tel2 = req.body['tel2'];
    if( req.body['address'] !=undefined ) data.address = req.body['address'];
    if( req.body['schoolType'] !=undefined ) data.schoolType = req.body['schoolType'];
    if( req.body['orgscaleType'] !=undefined ) data.orgscaleType = req.body['orgscaleType'];
    if( req.body['registerMoney'] !=undefined ) data.registerMoney = req.body['registerMoney'];
    if( req.body['businessLicense'] !=undefined ) data.businessLicense = req.body['businessLicense'];
    if( req.body['REMARK'] !=undefined ) data.REMARK = req.body['REMARK'];
    if( req.body['ISVALID'] !=undefined ) data.ISVALID = req.body['ISVALID'];

    data.LSTUPDID = userID ;
    data.LSTUPDDATE = moment().format("YYYY-MM-DD HH:mm:ss");


    data.orgID = orgID;

    console.log('kk',data);
    // orgInfo.isOrgExist_V2(data, function(err,docs){
    //   if(err) { console.log(err); res.send({err:err ,  status : '404'});  }
    //   else if(docs.length > 0  )   res.send({err:"组织代码已被占用，请更换!",  status : '404'});
    //   else//如果组织代码未被占用
    orgInfo.updateData_Json(data, orgID  , function(err,doc){
        //console.log(doc);
        if(err) { console.log(err); res.send({des:err ,err:err ,  status : '404'});  }
        else
            res.send({docData:data , status : '200'});
    });


}

function  Ajax_searchOrg (req,res, next) {
    headers(res);
    //获取session user
    var userID = req.session.userData.id;
    console.log('USERid:' + userID );
    var data = {};
    var moment = require("moment");

    data.orgCode = req.body['orgCode'];
    data.orgFullDes = req.body['orgFullDes'];
    data.orgShortDes = req.body['orgShortDes'];
    data.REMARK = req.body['remark'];

    if(req.body['ISVALID'] !='' &&  req.body['ISVALID'] != undefined )   data.ISVALID = req.body['ISVALID'];
    if(req.body['checkStatus'] !='' &&  req.body['checkStatus'] != undefined )   data.checkStatus = req.body['checkStatus'];

    orgInfo.searchData_Json(data, function(err,docs){

        //console.log(doc);
        if(err) { console.log(err); res.send({des:err ,  status : '404'});  }
        else    res.send({docData:docs ,  status: '200'});

    });

}



function  Ajax_getOrgTree (req,res, next) {
    //获取session user
    //var userID = req.session.userData.id;
    //console.log('USERid:' + userID );
    var data = {};
    var moment = require("moment");
    var orgID = req.body['orgID'];

    //console.log(orgID);

    if(!orgID) res.send({des:"ID数据为空或未定义" ,  status : '404'});
    else
        orgInfo.getOrgTree(orgID, function(err,docs){
            //console.log('OOOOOO');
            console.log(docs);
            if(err) { console.log(err); res.send({des:err ,  status : '404'});  }
            else
            {  res.send({docData:docs , status : '200'}); }
        });

}
function  Ajax_getOrgTree_read (req,res, next) {

    //获取session user
    //var userID = req.session.userData.id;
    //console.log('USERid:' + userID );
    var data = {};
    var moment = require("moment");
    //var orgID = req.body['id'];
    var orgID = req.query.id;
    var call = req.query.callback;

    //console.log(orgID);

    if(!orgID) res.send({des:"ID数据为空或未定义" ,  status : '404'});
    else
        orgInfo.getOrgTree(orgID, function(err,docs){
            //console.log('OOOOOO');
            //console.log(docs);
            if(err) { console.log(err); res.send({des:err ,  status : '404'});  }
            else
            {
                // res.send( call + "(" + JSON.stringify(docs) + ")" );
                res.send(JSON.stringify(docs) );
            }


        });

}

function isDeptEsit(parentId) {
    console.log('父结点ID:' + parentId);
    orgInfoDept.isIDexist(parentId,function(err,results) {
        //console.log(results);
        if(err) return false;
        else if(results.length <= 0 ) return false;
        else {  return true;  }
    });
}

function  Ajax_addDept (req,res, next) {
    //获取session user
    var userID = req.session.userData.id;
    //console.log('USERid:' + userID );
    var data = {};
    var moment = require("moment");

    data.deptID = uuid.v1();
    if(req.body['deptDes'])  data.deptDes = req.body['deptDes'];
    if(req.body['orgID'])  data.orgID = req.body['orgID'];
    if(req.body['parentId'])  data.parentId =  req.body['parentId'];

    if(req.body['REMARK'])       data.REMARK =  req.body['REMARK'];
    if(req.body['isLast'])       data.isLast =  req.body['isLast'];
    if(req.body['leve'])         data.leve =  req.body['leve'];
    if(req.body['treeNodeNum'])  data.treeNodeNum =  req.body['treeNodeNum'];
    if(req.body['deptShortDes']) data.deptShortDes =  req.body['deptShortDes'];

    data.ISVALID = 1;
    data.CREATORID = userID ;
    data.CREATEDATE = moment().format("YYYY-MM-DD HH:mm:ss");

    //console.log(data);

    //判断父结点的ID数据是否存在
    if( isDeptEsit(data.parentId) == false && data.parentId != data.orgID) res.send({des:"结点ID数据出错或不存在。" ,  status : '404'});
    else
        orgInfoDept.insertData(data, function(err,doc_dept){
            //console.log(doc_dept);
            if(err) { console.log(err); res.send({des:err ,  status : '404'});  }
            else
                res.send({docData:doc_dept , status : '200'});
        });

}





function   Ajax_updateDept_arry(req,res, next) {
    headers(res);
    //获取session user
    var userID = req.session.userData.id;
    console.log('USERid:' + userID );
    var moment = require("moment");

    var models = req.body.models;
    var datas = JSON.parse(req.body.models);
    console.log(datas);
//console.log('modes: ',JSON.parse(models)[0]);

    orgInfoDept.updateData_arry(datas, userID , function(err,docs){
        //console.log(doc);
        if(err) res.send({status:404});
        else  res.send({status:200});
    });

}


function   Ajax_insertUser_arry_myOrg(req,res, next) {

    //获取session user
    var creatorID = req.session.userData.id;
    console.log('USERid:' + creatorID );

    //console.log(req.body);

    var data = req.body.str;

    data = JSON.parse(data)  ;
    data.DeptPeoID = uuid.v1();
    data.synid = req.session.userData.id  ;
    data.userID = req.session.userData.name  ;
    data.name = req.session.userData.name  ;
    data.ISVALID = 1;



    if(data.isOrg == 0)  //如果选择机构
        var sqlstr =" select a.orgID , a.orgFullDes  , b.deptID ,  b.deptDes , c.orgRoleID,c.DeptPeoID ,d.name as rolename   from bsd_orginfo as a , bsd_orginfodept as b , bsd_orgdeptpeo as c , bsd_orgrole  as d where a.orgID = b.orgID and b.deptID = c.deptID  and  c.orgRoleID = d.orgRoleID   and  b.ISVALID = '1' and c.ISVALID = '1'  and  c.synid = '" + req.session.userData.id +"'  ";
    else if(data.isOrg == 1)  //如果选择组织
        var sqlstr =" select a.orgID , a.orgFullDes  , a.orgID as deptID , a.orgFullDes as deptDes , c.orgRoleID,c.DeptPeoID ,d.name as rolename   from bsd_orginfo as a , bsd_orgdeptpeo as c , bsd_orgrole  as d where a.orgID = c.orgID  and  c.orgRoleID = d.orgRoleID   and  c.ISVALID = '1'   and  c.synid = '" + req.session.userData.id +"'  ";


    //console.log(data);
    //console.log(sqlstr);

    // sqlstr = sqlstr + "  and  c.synid = '" + req.session.userData.id +"'  ";
    delete data.isOrg;

    orgDeptPeo.insertData(data, function(err, doc){

        if(err) { console.log(err); return res.send({err:err ,  status : '404'});  }
        else {
            console.log(doc);
            sqlstr = sqlstr + " and  c.DeptPeoID = '" + data.DeptPeoID + "' " ;

            console.log(sqlstr);

            orgDeptPeo.toSQL(sqlstr, function(err,peoDoc) {
                if(err) { console.log(err); res.send({err:err ,  status : '404'});  }
                else
                    res.send({ status : '200' , datas: peoDoc[0]  });
            });

        }

    });

}


function   Ajax_searchUsers(req,res, next) {

    //获取session user
    var userID = req.session.userData.id;
    console.log('USERid:' + userID );
    var data = {};
    var moment = require("moment");

    data.uid = req.body['uid'];
    data.displayname = req.body['displayname'];
    data.email = req.body['email'];
    orgID = req.body['orgid'];

    console.log(data);

    var mysql = require('mysql');
    var mysqlConf=config[env]['OC_mysql'];
    mysqlConf.database = config[env]['OC_dataBase']['owncloud_dev3'];
    console.log(mysqlConf);

    var connection = mysql.createConnection(mysqlConf);

    connection.connect();

    if(req.body['email']) {
        var sql = "select a.`synid` , a.`uid` as `userid`, a.`displayname` , b.`configvalue` as `email` from `oc_users` as a,  `oc_preferences` as b  where a.uid = b.userid and b.configkey = 'email'  ";
        if(req.body['uid']) sql =  sql +  " and  a.`uid` like '%" + req.body['uid'] + "%'  ";
        if(req.body['displayname']) sql =  sql +  " and  a.`displayname` like '%" + req.body['displayname'] + "%'  ";
        sql =  sql +  " and  b.`configvalue` like '%" + req.body['email'] + "%'  ";
    } else {
        var sql = "select a.`synid` , a.`uid` as `userid`, a.`displayname`  from `oc_users` as a  where 1 ";
        if(req.body['uid'])  sql =  sql +  " and  a.`uid` like '%" + req.body['uid'] + "%'  ";
        if(req.body['displayname'])  sql =  sql +  " and  a.`displayname` like '%" + req.body['displayname'] + "%'  ";
    }


    console.log(sql)
    connection.query(sql, function(err,docs){
        connection.end();
        console.log(docs);
        if(err) { console.log(err); res.send({des:err ,  status : '404'});  }
        else
        {
            orgRole.searchData_Json({orgID:orgID , ISVALID:1}, function(err, roledocs){
                //console.log('角色',roledocs);
                if(err) { console.log(err); res.send({des:err ,  status : '404'});  }
                else  res.send({docData:docs , roles: roledocs ,status : '200'});
            });
        }
    });


}





function   Ajax_delOrg(req,res, next) {
    //获取session user
    var userID = req.session.userData.id;
    console.log('USERid:' + userID );
    var data = {};
    var moment = require("moment");


    var orgID = req.body['id'];
    data.orgID = orgID;

    console.log(data);
    if(orgID == '') res.send({err:'ID数据不正确.' ,  status : '404'});
    else
        orgInfo.delOrg(orgID  , function(err){
            //console.log(doc);
            if(err) { console.log(err); res.send({err:err ,  status : '404'});  }
            else
                res.send({status : '200'});
        });

}
function   Ajax_delDept(req,res, next) {
    //获取session user
    var userID = req.session.userData.id;
    console.log('USERid:' + userID );
    var data = {};
    var moment = require("moment");

    var deptID = req.body['id'];
    data.deptID = deptID;

    console.log(data);
    if(deptID=='' || deptID==undefined)  res.send({des:'ID数据不正确' ,  status : '404'});
    else {
        console.log(deptID);
        orgInfoDept.delDept_All(deptID);
        res.send({ status : '200'});
    }

}

function  Ajax_insertUser_arry (req,res, next) {
    //获取session user
    var creatorID = req.session.userData.id;
    console.log('USERid:' + creatorID );

    //console.log(req.body);

    var datas = req.body.str;
    datas = JSON.parse(datas)  ;

    console.log(datas);

    orgDeptPeo.insertData_arry(datas, creatorID, function(err){

        if(err) { console.log(err); res.send({des:err ,  status : '404'});  }
        else
            res.send({ status : '200'});
    });

}


function   Ajax_updateDeptPeo_json(req,res, next) {
    headers(res);

    //获取session user
    var userID = req.session.userData.id;
    console.log('USERid:' + userID );
    var moment = require("moment");

    var models = req.body.models;
    var datas = JSON.parse(req.body.models);
    console.log(datas);
//console.log('modes: ',JSON.parse(models)[0]);

    orgDeptPeo.updateData_Json(datas, datas.DeptPeoID, function(err,docs){
        //console.log(doc);
        if(err) res.send({status:404});
        else  res.send({status:200});
    });
}


function  Ajax_depUserRead_V2 (req,res, next) {
    headers(res);

    //获取session user
    var userID = req.session.userData.id;
    console.log('USERid:' + userID );
    var data = {};
    var moment = require("moment");

    var deptid =  req.query.deptid;
    data.deptID =  deptid;
    //data.userID = req.query.userID;
    //data.name = req.query.name;

    var null_arr = [];

    //console.log('deptid:' + deptid );

    //console.log(req.query);
    console.log('CAO');
    console.log('userIDA:' + req.query.userID );
    if(req.query['userID'] != '' &&  req.query['userID'] != undefined )  { console.log('userID:' ,req.query.userID );data.userID = req.query.userID; }
    if(req.query.name != '' ||  req.query.name != undefined )   data.name = req.query.name;
    console.log(data);

    if(deptid=='') res.send(null_arr);
    else
        orgDeptPeo.searchData_Json_role(data, function(err,docs){
            //console.log(doc);
            if(err) { console.log(err); res.send(null_arr);  }
            else
            {
                console.log(JSON.stringify(docs) );
                res.send( JSON.stringify(docs) );
            }
        });

}


function  Ajax_depUserRead(req,res, next) {
    headers(res);

    //获取session user
    var userID = req.session.userData.id;
    //console.log('USERid:' + userID );
    var data = {};
    var moment = require("moment");


    var deptid =  req.query.deptid;
    var null_arr = [];
    data.deptID =  deptid;
//console.log('deptid:' + deptid );

    if(deptid=='') res.send(null_arr);
    else
        orgDeptPeo.searchData_Json_role(data, function(err,docs){
            //console.log(doc);
            if(err) { console.log(err); res.send(null_arr);  }
            else
            {
                //var re = {"results" : docs };
                //console.log(  JSON.stringify( re ) ) ;
                //res.send(JSON.stringify( re ));
                // res.send(re);
                //console.log(JSON.stringify(docs) );
                res.send( JSON.stringify(docs) );
            }
        });

}



function   Ajax_depUserUpdate(req,res, next) {
    headers(res);

    //获取session user
    var userID = req.session.userData.id;
    console.log('USERid:' + userID );
    var moment = require("moment");

    var models = req.body.models;
    var datas = JSON.parse(req.body.models);
//console.log(datas);
//console.log('modes: ',JSON.parse(models)[0]);

    orgDeptPeo.updateData_arry(datas, userID, function(err,docs){
        //console.log(doc);
        res.send(models);
    });

}

function   Ajax_depUserDestroy(req,res, next) {

        headers(res);

        //获取session user
        var userID = req.session.userData.id;
        console.log('USERid:' + userID );
        var moment = require("moment");

        var models = req.body.models;
        var datas = JSON.parse(req.body.models);
        console.log(datas);
//console.log('modes: ',JSON.parse(models)[0]);

        orgDeptPeo.delData_arry(datas, function(err,docs){
            //console.log(doc);
            res.send(models);
        });

    }

function  Ajax_depUserDestroy_myOrg(req,res, next) {
    headers(res);

    //获取session user
    var userID = req.session.userData.id;
    console.log('USERid:' + userID );
    var moment = require("moment");

    var models = req.body.models;
    var datas = JSON.parse(req.body.models);
    var result ={};
    console.log(datas);
//console.log('modes: ',JSON.parse(models)[0]);

    orgDeptPeo.delData_arry(datas, function(err,docs){
        //console.log(doc);
        if(err) { console.log(err); res.send({err:err ,  status : '404'});  }
        else res.send( { status : '200'});

    });

}

function  Ajax_orgSearchDep (req,res, next) {
    headers(res);

    //获取session user
    //var userID = req.session.userData.id;
    //console.log('USERid:' + userID );
    var data = {};
    var moment = require("moment");

    //var userID = req.query.userID;
    var userID = req.body.userID;

    var null_arr = [];

    if(userID == '' || userID== undefined) res.send({ status: '404', err: '用户ID数据错误.'});
    else {
        data.synid = userID ;
        console.log(data);
        orgInfoDept.getUserDept(data,function(err,docs){
            if(err) { console.log(err); res.send({ status: '404', err: err});  }
            else   res.send({ status: '200', err: err, datas: docs });
        });
    }

}

function   Ajax_orgSearchDepUsers(req,res, next) {

    headers(res);

    //获取session user
    var userID = req.session.userData.id;
    console.log('USERid:' + userID );
    var data = {};
    var moment = require("moment");

// var deptid =  req.query.deptID;
    var deptid =  req.body.deptID;
    var null_arr = [];

    if(deptid == '' || deptid== undefined) res.send({ status: '404', err: '机构ID数据错误.'});
    else {
        data.deptID =  deptid;
        console.log(data );

        orgDeptPeo.searchData_Json_V2(data, function(err,docs){

            if(err) { console.log(err); res.send({ status: '404', err: err});  }
            else   res.send({ status: '200', err: err, datas: docs });

        });
    }
}





function   Ajax_userDep_V2(req,res, next) {
    headers(res);

    //获取session user
    //var userID = req.session.userData.id;
    //console.log('USERid:' + userID );
    var data = {};
    var moment = require("moment");

    var userID = req.query.userId;
    //var userID = req.body.userID;

    var null_arr = [];

    if(userID == '' || userID== undefined) res.send({ success: false , msg: '用户ID数据错误.'});
    else {
        data.synid = userID ;
        //console.log(data);

        orgInfoDept.getUserDept_V2(data,function(err,docs){
            if(err) { console.log(err); res.send({ success: false , msg: err});  }
            else   res.send({ success: true ,  data: docs });
        });
    }
}



function   org_role(req,res, next) {
    var orgID = req.session.userData.orgID;
    var type =  req.session.userData.type

    if(type != 2  ) return  res.send( {err:'您无权此操作'});
    if(orgID == '' || orgID == undefined  )  return  res.send({err:'数据错误'});


    data={orgID : orgID , ISVALID : '1'};
    data.ISVALID = 1;
    var j=0;
    var list='', status_str='';
    orgRole.searchData_Json(data, function(err,docs){

        async.eachSeries(docs, function(doc, callback) {

            if(doc.status ==0) {
                //status_str="";
                list = list +
                    "<tr id = 'tr_" + doc.orgRoleID + "' > " +
                    "    <td>#</td> " +
                    "    <td>" + doc.name + " </td> " +
                    "    <td><div id = 'status_" + doc.orgRoleID + "'>挂起</div></td> " +
                    "    <td> " +
                    "       <button id='button_del_" + doc.orgRoleID + "' onclick='delRole(this)'  rid='" + doc.orgRoleID + "' class='btn btn-warning'  style= 'width: 80px;height:28px;' >  删除 </button> " +
                    "       <button id='button_use_" + doc.orgRoleID + "'  onclick='useRole(this)'  rid='" + doc.orgRoleID + "' class='btn btn-success'  style= 'width: 80px;height:28px;' >  启用 </button> " +
                    "       <button id='button_lock_" + doc.orgRoleID + "'  onclick='lockRole(this)'  rid='" + doc.orgRoleID + "' class='btn btn-danger'  style= 'width: 80px;height:28px;' >  锁定 </button> " +
                    "    </td>  " +
                    " </tr> " ;

                j++;
                return callback();

            } else if(doc.status ==1)  {

                list = list +
                    "<tr id = 'tr_" + doc.orgRoleID + "' > " +
                    "    <td>#</td> " +
                    "    <td>" + doc.name + " </td> " +
                    "    <td><div id = 'status_" + doc.orgRoleID + "'>有效</div></td> " +
                    "    <td> " +
                    "       <button id='button_del_" + doc.orgRoleID + "' onclick='delRole(this)'  rid='" + doc.orgRoleID + "' class='btn btn-warning'  style= 'width: 80px;height:28px;' >  删除 </button> " +
                    "       <button  id='button_use_" + doc.orgRoleID + "'  onclick='useRole(this)'  rid='" + doc.orgRoleID + "' class='btn btn-success'  style= 'width: 80px;height:28px; display:none;' >  启用 </button> " +
                    "       <button id='button_lock_" + doc.orgRoleID + "'  onclick='lockRole(this)'  rid='" + doc.orgRoleID + "' class='btn btn-danger'  style= 'width: 80px;height:28px;' >  锁定 </button> " +
                    "    </td>  " +
                    " </tr> " ;

                j++;
                return callback();

            } else if(doc.status ==2)  {

                list = list +
                    "<tr id = 'tr_" + doc.orgRoleID + "' > " +
                    "    <td>#</td> " +
                    "    <td>" + doc.name + " </td> " +
                    "    <td><div id = 'status_" + doc.orgRoleID + "'>锁定</div></td> " +
                    "    <td> " +
                    "       <button  id='button_del_" + doc.orgRoleID + "'  onclick='delRole(this)'  rid='" + doc.orgRoleID + "' class='btn btn-warning'  style= 'width: 80px;height:28px;display:none;' >  删除 </button> " +
                    "       <button  id='button_use_" + doc.orgRoleID + "'   onclick='useRole(this)'  rid='" + doc.orgRoleID + "' class='btn btn-success'  style= 'width: 80px;height:28px;display:none;' >  启用 </button> " +
                    "       <button  id='button_lock_" + doc.orgRoleID + "'   onclick='lockRole(this)'  rid='" + doc.orgRoleID + "' class='btn btn-danger'  style= 'width: 80px;height:28px;display:none;' >  锁定 </button> " +
                    "    </td>  " +
                    " </tr> " ;

                j++;
                return callback();
            }  else { return callback();     }

        }, function(err){

            if(err) console.log(err);
            data.roleList = list;
            res.render('org/org_role' , data);

        }); //async.eachSeries END

    });

}

function   myOrg(req,res, next) {

    var data={};
    var list='', status_str='';

    orgInfo.getOrg_option(function(err,optData){

        if(err) console.log(err);
        data.optionList =  optData.optionList;
        //console.log(req.session.userData);  // = {name:'user19' , id:'T3DAJ62A' , email: 'user19@1.1'  ,role:['ordinary']};

        if(!req.session.userData) res.render('org/myOrg',data );
        else {
            orgDeptPeo.getMyOrgDep(req.session.userData.id, function(err,myData){
                if(err) console.log(err);
                data.myOrgList =  myData.myOrgList;
                res.render('org/myOrg',data );
            });
        }
    });

}




function   Ajax_addRole(req,res, next) {
    var orgID = req.session.userData.orgID;
    if(req.body['name'] == '' || req.body['name'] ==undefined ) res.send({err:"角色名数据错误" ,  status : '404'});
    else {

        orgRole.isRoleExist_ForName_V2(orgID, req.body['name'] , function(flag){
            //console.log('bbbb', flag);
            if(flag ==  true ) { res.send({err:"角色名已存在或系统错误" ,  status : '404'});  }
            else {
                //获取session user
                var userID = req.session.userData.id;
                //console.log('USERid:' + userID );
                var data = {};
                var moment = require("moment");

                data.name = req.body['name'];
                data.orgID =  req.session.userData.orgID;
                data.status = 1;
                data.ISVALID = 1;
                data.CREATORID = userID ;
                data.CREATEDATE = moment().format("YYYY-MM-DD HH:mm:ss");

                orgRole.insertData(data ,function(err, doc) {
                    if(err) return res.send({err:err,  status : '404'});
                    else  return res.send({datas:doc,  status : '200'});
                });

            } //if end

        }); //orgRole.isRoleExist_ForName end

    }  //if end

}

function   Ajax_delRole(req,res, next) {
    //获取session user
    var userID = req.session.userData.id;
    console.log('USERid:' + userID );
    var data = {};
    var moment = require("moment");

    var ID = req.body['id'];

    if(ID=='' || ID==undefined)  res.send({err:'ID数据不正确' ,  status : '404'});
    else {

        orgRole.delRole_V2(ID ,function(err,docs){
            if(err)  res.send({err:err ,  status : '404'});
            else res.send({ status : '200'});
        });
    }

}

function   Ajax_updateRole(req,res, next) {
    //获取session user
    var userID = req.session.userData.id;
    console.log('USERid:' + userID );
    var data = {};
    var moment = require("moment");


    //console.log(req.body);
    var ID = req.body['id'];
    var status =  req.body['status'];

    console.log(ID, status);

    if(ID == '' || status == '' || ID == undefined   || status == undefined ) res.send({err:"ID数据错误",  status : '404'});
    else {

        //data.orgRoleID = ID;
        data.status = status;
        data.LSTUPDID = userID ;
        data.LSTUPDDATE = moment().format("YYYY-MM-DD HH:mm:ss");

        //console.log(data);
        orgRole.isRoleExist_ForID(ID, function(flag){
            if(flag == false) {   res.send({err:"此ID的角色不存在",  status : '404'}); }
            else {  //如果角色存在
                orgRole.updateData_Json(data,ID , function(err,doc){
                    if(err )  res.send({err:err,  status : '404'});
                    else  res.send({  status : '200'});
                });
            }
        });
    }

}



function   org_roleapp(req,res, next) {
    var data={};
    data.ISVALID = 1;
    data.orgID = req.session.userData.orgID;
    var j=0;
    var list='', status_str='';

    var ep = new EventProxy();

    var appJson = {configkey:'enabled'};
    appconfig.searchData_Json(appJson,  function(err,appdocs){
        if(err) {console.log(err);  res.send({err:err});}
        else {

            //var roleappJson = {orgID: req.session.userData.orgID  };
            roleapp.getOrgRoleApp(req.session.userData.orgID,function(err,roleappDocs){
                if(err) {console.log(err); }
                //console.log('ggg',roleappDocs);
                var step2 = {appdocs:appdocs , roleappDocs:roleappDocs}
                ep.emit('completedRoleApp',step2 );

            });  //roleapp.getOrgRoleApp  end

        }  //if end

    });  // appconfig.searchData_Json  end


    ep.all('completedRoleApp', function (step2_JSON ) {

        roleapp.completedRoleApp(step2_JSON,function(err){
            if(err)  console.log(err);
            res.render('org/org_roleapp.jade' , data);

        });  //roleapp.completedRoleApp  end

    }); //ep.all end

}

function   Ajax_getRoleApp(req,res, next) {
    console.log(8888888);
    var data={};
    data.ISVALID = 1;
    data.orgID = req.session.userData.orgID;

    var ep = new EventProxy();

    //获取组角色及对应的功能
    roleapp.getOrgRoleApp(req.session.userData.orgID,function(err,roleappDocs){

        if(err) {console.log(err);  res.send({'status':404, err:err});  }
        else  res.send({'status':200, datas:roleappDocs});
    });  //roleapp.getOrgRoleApp  end

}

function  Ajax_updateRoleApp (req,res, next) {
    //获取session user
    var userID = req.session.userData.id;
    console.log('USER ID:' + userID );
    var data = {};
    var moment = require("moment");

    if(req.body['rid'] == '' || req.body['flag'] == '' || req.body['rid'] == undefined   || req.body['flag'] == undefined ) res.send({err:"ID数据错误",  status : '404'});
    else {

        var roleAppID =req.body['rid'] ;
        data.status = req.body['flag'];
        data.LSTUPDID = userID ;
        data.LSTUPDDATE = moment().format("YYYY-MM-DD HH:mm:ss");

        roleapp.updateData_Json(data,roleAppID ,  function(err,doc){
            if(err) {   res.send({err:err,  status : '404'}); }
            else  res.send({  status : '200'});
        }); // roleapp.updateData_Json end

    } //if end

}

function   Ajax_updateDefine(req,res, next) {
    //获取session user
    var userID = req.session.userData.id;
    //console.log('USERid:' + userID );
    var data = {};
    var moment = require("moment");

    var DeptPeoID = req.body['id'];
    var orgID =  req.body['orgid'];

    console.log(DeptPeoID);

    if(DeptPeoID == '' || DeptPeoID == undefined  ) res.send({err:"ID数据错误",  status : '404'});
    else {

        //data.orgRoleID = ID;
        data.isDefault = '1';
        data.LSTUPDID = userID ;
        data.LSTUPDDATE = moment().format("YYYY-MM-DD HH:mm:ss");

        orgDeptPeo.regainDefin( {synid:userID , orgID : orgID} , function(err, doc){
            if(err) { console.log(err); res.send({err:err,  status : '404'}); }
            else {
                orgDeptPeo.updateData_Json( data , DeptPeoID , function(err, doc){
                    res.send({status : '200'});
                });
            } //if end
        }); //orgDeptPeo.updateData_Json end

    }  //if end

}



function   Ajax_getUserApp(req,res, next) {
    headers(res);
    var data={};
    data.ISVALID = 1;
    console.log(req.session.userData);
    var userID = req.session.userData.id;
    //data.orgID = req.session.userData.orgID;
    // req.session.userData.test  =  "OK test";

    var ep = new EventProxy();

    //获取用户的默认组织机构
    orgDeptPeo.getMyrole(userID, function(err,doc) {
        console.log(doc);
        if(err)  return res.send({'status':404, err:err});

        if(doc == null ) { console.log('BBBBB');res.send({'status':200, datas:doc});  }
        else {
            req.session.userData.orgID  =  doc.orgID;
            req.session.userData.deptID =  doc.deptID;
            req.session.userData.DeptPeoID =  doc.DeptPeoID;
            req.session.userData.orgRoleID = doc.orgRoleID ;

            ep.emit('ST', doc.orgRoleID );

        }

    });

    ep.all('ST' , function(orgRoleID){
        var sqltxt ="select * from `bsd_orgrole` where  `ISVALID` = 1 and `orgRoleID` = '" + orgRoleID + "'    ";
        orgrole.toSQL(sqltxt, function(err,roledoc){
            if(roledoc) req.session.userData.roleType = roledoc[0].type ;
            if(err) console.log(err);


            ep.emit('apps', orgRoleID);
        });

    });//ep.all EDN



    var reslut = {};

    ep.all('apps' , function(orgRoleID){
        roleapp.getRoleApps(orgRoleID,function(err,apps){
            console.log('apps',apps);
            reslut.roleID =  orgRoleID;
            reslut.apps = apps;

            //err='test';
            if(err)  res.send({'status':404, err:err});
            else if(apps.length <= 0 )  res.send({'status':200, datas:null});
            else if(apps.length > 0 )    res.send({'status':200, datas:reslut});
        });

    });

}


function   Ajax_getorglist(req,res, next) {
    var orgID = req.body.id;
    if(orgID=='' || orgID==undefined)  return res.send({status:404,err:'ID数据错误.'});

    data={orgID : orgID , ISVALID : '1'};
    //data.ISVALID = 1;
    console.log(data);
    var j=0;
    var list='', status_str='';

    orgRole.searchData_Json(data, function(err,docs){
        if(err) return res.send({status:404,err:err});
        else return res.send({status:200,datas:docs});

    });

}


function   org_roletop(req,res, next) {

    var data={orgID : req.session.userData.orgID , ISVALID : '1'};
    data.ISVALID = 1;
    var j=0;
    var list='', status_str='';

    var result = {};

    var ep = new EventProxy();

    orgInfo.getOrg_option(function(err,optData){

        if(err) console.log(err);
        result.optionList =  optData.optionList;
        res.render('org/org_roletop' , result);

    });

}

function   Ajax_addRole_top(req,res, next) {
    var orgID = req.body['orgID'];
    //console.log(req.body['name'] , orgID);
    if(req.body['name'] == '' || req.body['name'] == undefined || orgID == '' || orgID == undefined  ) res.send({err:"数据错误" ,  status : '404'});
    else {

        orgRole.isRoleExist_ForName_V2(orgID, req.body['name'] , function(flag){
            //console.log('bbbb', flag);
            if(flag ==  true ) { res.send({err:"角色名已存在或系统错误" ,  status : '404'});  }
            else {
                //获取session user
                var userID = req.session.userData.id;
                //console.log('USERid:' + userID );
                var data = {};
                var moment = require("moment");

                data.name = req.body['name'];
                data.orgID = orgID;
                data.status = 1;
                data.ISVALID = 1;
                data.CREATORID = userID ;
                data.CREATEDATE = moment().format("YYYY-MM-DD HH:mm:ss");

                orgRole.insertData(data ,function(err, doc) {
                    if(err) return res.send({err:err,  status : '404'});
                    else  return res.send({datas:doc,  status : '200'});
                });

            } //if end

        }); //orgRole.isRoleExist_ForName end

    }  //if end

}

function   Ajax_setRoleType(req,res, next) {
    //获取session user
    var userID = req.session.userData.id;
    console.log('USERid:' + userID );
    var data = {};
    var moment = require("moment");

    var ID = req.body['id'];
    var val =  req.body['val'];

    console.log(ID, val);

    if(ID == '' || val == '' || ID == undefined   || val == undefined )  res.send({err:"ID数据错误",  status : '404'});
    else {
        data.type = val;
        orgRole.updateData_Json(data,ID , function(err,doc){
            if(err )  res.send({err:err,  status : '404'});
            else  res.send({  status : '200'});
        });
    }

}

function  org_roleapptop (req,res, next) {
    var data={};
    data.ISVALID = 1;
    data.orgID = req.session.userData.orgID;
    var j=0;
    var list='', status_str='';

    orgInfo.getOrg_option(function(err,optData){

        if(err) console.log(err);
        data.optionList =  optData.optionList;
        return  res.render('org/org_roleapptop.jade' , data);

    });

    var ep = new EventProxy();

    var appJson = {configkey:'enabled'};
    appconfig.searchData_Json(appJson,  function(err,appdocs){
        if(err) {console.log(err);  res.send({err:err});}
        else {

            //var roleappJson = {orgID: req.session.userData.orgID  };
            roleapp.getOrgRoleApp(req.session.userData.orgID,function(err,roleappDocs){
                if(err) {console.log(err); }
                //console.log('ggg',roleappDocs);
                var step2 = {appdocs:appdocs , roleappDocs:roleappDocs}
                ep.emit('completedRoleApp',step2 );

            });  //roleapp.getOrgRoleApp  end

        }  //if end

    });  // appconfig.searchData_Json  end


    ep.all('completedRoleApp', function (step2_JSON ) {

        roleapp.completedRoleApp(step2_JSON,function(err){
            if(err)  console.log(err);
            res.render('org/org_roleapptop.jade' , data);

        });

    });

}



function   Ajax_getRoleApptop(req,res, next) {
    var orgID = req.body.id;

    if(orgID =='' || orgID ==undefined )  res.send({'status':404, err:"ID数据错误"});
    data={};
    data.ISVALID = 1;
    data.orgID = orgID;

    var j=0;
    var list='', status_str='';

    var ep = new EventProxy();

    var appJson = {configkey:'enabled'};
    appconfig.searchData_Json(appJson,  function(err,appdocs){
        if(err) {console.log(err);  res.send({err:err});}
        else {
            roleapp.getOrgRoleApp(orgID,function(err,roleappDocs){
                if(err) {console.log(err); }
                //console.log('ggg',roleappDocs);
                var step2 = {appdocs:appdocs , roleappDocs:roleappDocs}
                ep.emit('create',step2 );
            });  //roleapp.getOrgRoleApp  end
        }  //if end
    });  // appconfig.searchData_Json  end

    ep.all('create', function (step2_JSON ) {
        roleapp.completedRoleApp(step2_JSON,function(err){
            if(err)  console.log(err);
            ep.emit('END',orgID );

        });
    });

    ep.all('END', function (orgID ) {
        roleapp.getOrgRoleApp_V2(orgID,function(err,roleappDocs){

            if(err) {console.log(err);  res.send({'status':404, err:err});  }
            else  res.send({'status':200, datas:roleappDocs});
        });  //roleapp.getOrgRoleApp  end
    });

}



function  Ajax_getOrgRoles (req,res, next) {
    headers(res);
    //获取session user
    var orgID = req.body.orgID;
    if(orgID == '' || orgID == undefined ) return res.send({ status: 404 , err: 'orgID数据错误.'});

    var sqlstt = "select orgRoleID , name from bsd_orgrole where  ISVALID = '1' and status != 0  and orgID ='" + orgID + "'  ";

    orgDeptPeo.toSQL(sqlstt,function(err,docs){
        if(err) { console.log(err); res.send({ status: 404  ,  err: err});  }
        else   res.send({  status: 200  ,  datas: docs });
    });

}

function Ajax_insertUser(req,res, next) {
    //获取session user
    var creatorID = req.session.userData.id;
    console.log('USERid:' + creatorID );
    var data = req.body.data; console.log(data);
    console.log(req.body);
    var moment = require("moment");


    data.DeptPeoID = uuid.v1();
    if(req.body['synid'])   data.orgID = req.body['synid'];
    if(req.body['orgID'])   data.orgID = req.body['orgID'];
    if(req.body['deptID']  )    data.deptID = req.body['deptID'];
    if(req.body['userID']  )    data.userID = req.body['userID'];
    if(req.body['tel']  )   data.tel = req.body['tel'];
    if(req.body['address']  )    data.address = req.body['address'];
    if(req.body['nickname']  )    data.nickname= req.body['nickname'];
    if(req.body['name']  )    data.name  = req.body['name'];
    if(req.body['sex']  )    data.sex = req.body['sex'];
    if(req.body['REMARK']  )    data.REMARK = req.body['REMARK'];

    data.ISVALID = 1;
    data.CREATORID = creatorID;
    data.CREATEDATE = moment().format("YYYY-MM-DD HH:mm:ss");
    //console.log(data);

    orgDeptPeo.insertData(data, function(err,doc_exam){
        console.log(doc_exam);
        if(err) { console.log(err); res.send({des:err ,  status : '404'});  }
        else
            res.send({docData:data , status : '200'});
    });

}

function Ajax_getUserOrg(req,res, next) {
    headers(res);

    //获取session user

    var data = {};
    var moment = require("moment");

    var userID = req.query.userId;
    var orgID = req.session.userData.orgID;
    //var userID = req.body.userID;

    var null_arr = [];

    if(userID == '' || userID== undefined ) res.send({ status: 404 , err: '用户ID数据错误.'});
    else if(orgID == '' || orgID== undefined ) res.send({ status: 404 , err: '组织ID数据错误.'});
    else {
        data.synid = userID ;
        data.orgID = orgID;
        // console.log('TTTTTT:',data);
        orgInfoDept.getUserDept_V6(data,function(err,docs){
            if(err) { console.log(err); res.send({ status: 404  ,  err: err});  }
            else   res.send({  status: 200  ,  datas: docs });
        });
    }


}


function Ajax_getUserDepAndChild(req,res, next) {
    headers(res);
    //获取session user

    var data = {};
    var moment = require("moment");
    var userID = req.query.userId;
    var orgID = req.query.orgID;
    //var userID = req.body.userID;
    var null_arr = [];

    if(userID == '' || userID== undefined) res.send({ status: 404 , err: '用户ID数据错误.'});
    else if(orgID == '' || orgID== undefined) res.send({ status: 404 , err: '组织ID数据错误.'});
    else {
        data.synid = userID ;
        data.orgID = orgID;
        console.log(data);

        orgInfoDept.getUserDept_V5(data,function(err,docs){

            if(err) { console.log(err); res.send({ status: 404, err: err});  }
            else   res.send({ status: 200 ,  datas: docs });
        });
    }

}




function Ajax_depUserRead_V3(req,res, next) {
    headers(res);

    //获取session user
    var userID = req.session.userData.id;
    console.log('USERid:' + userID );
    var data = {};
    var moment = require("moment");
    var roleType = '';
    if(req.query.roleType != '' &&  req.query.roleType != undefined ) {
        var roletype = req.query.roleType;
    }

    var deptid =  req.query.deptid;
    var null_arr = [];
    data.deptID =  deptid;
    console.log('data:' , data );


    if(deptid=='') res.send(null_arr);
    else
        orgDeptPeo.searchData_Json_V3(roletype , data, function(err,docs){
            //console.log(doc);
            if(err) { console.log(err); res.send(null_arr);  }
            else
            {
                console.log(JSON.stringify(docs) );
                res.send( JSON.stringify(docs) );
            }
        });

}


function Ajax_proxy_test(req,res, next) {
    headers(res);
    //获取session user
    var userID = req.session.userData.id;
    res.send({data:userID ,  status: '200'});

}




module.exports = router;
