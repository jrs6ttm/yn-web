var UUID = require('node-uuid');
var http = require('http');
var config = require('../../config.json');
var env = global.orgENV;

var POST = function(param, path, next){
    var reqBodyStr, headers, options, internalReq;
    reqBodyStr = JSON.stringify(param);
    var auth = 'Basic c3lzdGVtOmFkbWluQHJvb3Qw';
    headers = {
        'Content-Type': 'application/json',
        'charset': 'UTF-8',
        "Authorization" : auth
    };
    options = {
        host: config[env].OCPath,
        port: 80,
        path: path,
        method: "POST",
        headers: headers
    };
    console.log(options);
    internalReq = http.request(options, function (res) {
        var dataArr = [], len = 0, data;

        res.on("data", function (chunk)
        {
            dataArr.push(chunk);

            len += chunk.length;
        });

        res.on("end", function ()
        {
            data = Buffer.concat(dataArr, len);
            next(JSON.parse(data.toString()));
        });

    });
    internalReq.on('error', function (e) {

    });

    internalReq.write(reqBodyStr);
    internalReq.end();
};

exports.testToOC = function(req, res){
    var ocData = {
        users: ["yetao2", "yetao3", "yetao4"],
        orgId: "16ef8a40-d251-11e6-9048-57cc898cc2c5",
        courseId: "ada770f0-d22a-11e6-80f3-5b6b52d7ba9e",
        courseName: "学习领域1-4",
        teacherId: "yetao1"
    };
    console.log('向OC推送课程组织信息：');
    console.log(JSON.stringify(ocData));
    POST(ocData, '/index.php/apps/notifications/orgNotification', function (ocResult) {
        console.log('课程组织信息消息推送结果：' + JSON.stringify(ocResult));
        res.send('课程组织信息消息推送结果：' + JSON.stringify(ocResult));
    });
};
//--------------------------------------courseOrg start----------------------------------------------
//课程组织操作_保存
exports.saveCourseOrg = function(req, res, mySQL){
    var saveObj = JSON.parse(req.body.saveObj), currDate = getDateStrUUID(), uuid = UUID.v1(), sourceF = '';
    if(saveObj.FILE_ICON && saveObj.FILE_ICON != 'undefined' && saveObj.FILE_ICON != null && saveObj.FILE_ICON != 'null'){
        var fileIcon = JSON.parse(saveObj.FILE_ICON);
        sourceF = fileIcon.sourceF;
    }
    //ecgeditor中的id
    var userId = req.session.userData.id, username = req.session.userData.name;
    if(!username || username.trim() == 'null' || username.trim() == ''){
        username = req.session.user_id;//OC中的id
    }
   //var userId = 'J960DGV0', username = 'user19';
    //console.log(saveObj);
   var insertStr = 'insert into cro_lrnscnorg'+
       '(LRNSCN_ORG_ID, TEACHER_ID, TEACHER_NAME, ORG_USER_ID, ORG_USER_NAME, BEGIN_TIME, END_TIME, LRN_AREA_ID, '+
       'LRN_AREA_NAME, INSTANCE_ID, INSTANCE_NAME, MIN_GROUP, MAX_GROUP, MIN_MEMBER, MAX_MEMBER, MIN_ROLE, MAX_ROLE, FILE_ICON, IS_SINGLE, '+
       ' ISVALID, CREATOR_ID, CREATOR_ORGID, CREATOR_ORGID_NAME, CREATOR_GID, CREATOR_GID_NAME, CREATE_DATE, LSTUPDID, LSTUPDDATE) values("'+
       uuid+'","'+ userId+'","'+ username+'","'+ userId+'","'+ username+'","'+ saveObj.BEGIN_TIME+'","'+ saveObj.END_TIME+'","'+ saveObj.LRN_AREA_ID+'","'+
       saveObj.LRN_AREA_NAME+'","'+ saveObj.INSTANCE_ID+'","'+ saveObj.INSTANCE_NAME+'",'+ saveObj.MIN_GROUP+','+ saveObj.MAX_GROUP+','+
       saveObj.MIN_MEMBER+','+ saveObj.MAX_MEMBER+','+ saveObj.MIN_ROLE+','+ saveObj.MAX_ROLE+',"'+sourceF+'", '+saveObj.IS_SINGLE+
       ', "1","'+ userId+'","'+ saveObj.CREATOR_ORGID+'","'+ saveObj.CREATOR_ORGID_NAME+'","'+ saveObj.CREATOR_GID+'","'+ saveObj.CREATOR_GID_NAME+'","'+currDate+'","'+ userId+'","'+ currDate+'")';

   //console.log(insertStr);
   mySQL.toSQL(insertStr, function(err, result){
       if(err){
           res.send({isOk: false});
       }else{
           //console.log(result);
           res.send({isOk: true, LRNSCN_ORG_ID: uuid});
       }
   });
};
//课程组织操作_删除
exports.deleteCourseOrg = function(req, res, mySQL){
    var LRNSCN_ORG_ID = req.body.LRNSCN_ORG_ID;
    var deleteStr = 'update cro_lrnscnorg  set ISVALID="0" where LRNSCN_ORG_ID="'+LRNSCN_ORG_ID+'"';
    console.log(deleteStr);
    mySQL.toSQL(deleteStr, function(err, result){
        if(err){
            res.send({isOk: false});
        }else{
            //console.log(result);
            res.send({isOk: true});
        }
    });
};

//课程组织操作_更新
exports.updateCourseOrg = function(req, res, mySQL){
    var updateObj = JSON.parse(req.body.updateObj), currDate = getDateStrUUID(), setStr = 'set';
    var userId = req.session.userData.id;
    //var userId = 'J960DGV0';

    var BEGIE_TIME = updateObj.BEGIN_TIME;
    if(BEGIE_TIME && BEGIE_TIME != ''){
        setStr += ' BEGIN_TIME="'+BEGIE_TIME+'",';
    }
    var END_TIME = updateObj.END_TIME;
    if(END_TIME && END_TIME != ''){
        setStr += ' END_TIME="'+END_TIME+'",';
    }
    var CREATOR_GID = updateObj.CREATOR_GID;
    if(CREATOR_GID && CREATOR_GID != ''){
        setStr += ' CREATOR_GID="'+CREATOR_GID+'",';
    }
    var CREATOR_GID_NAME = updateObj.CREATOR_GID_NAME;
    if(CREATOR_GID_NAME && CREATOR_GID_NAME != ''){
        setStr += ' CREATOR_GID_NAME="'+CREATOR_GID_NAME+'",';
    }
    var CREATOR_ORGID = updateObj.CREATOR_ORGID;
    if(CREATOR_ORGID && CREATOR_ORGID != ''){
        setStr += ' CREATOR_ORGID="'+CREATOR_ORGID+'",';
    }
    var CREATOR_ORGID_NAME = updateObj.CREATOR_ORGID_NAME;
    if(CREATOR_ORGID_NAME && CREATOR_ORGID_NAME != ''){
        setStr += ' CREATOR_ORGID_NAME="'+CREATOR_ORGID_NAME+'",';
    }
    var TEACHER_ID = updateObj.TEACHER_ID;
    if(TEACHER_ID && TEACHER_ID != ''){
        setStr += ' TEACHER_ID="'+TEACHER_ID+'",';
    }
    var TEACHER_NAME = updateObj.TEACHER_NAME;
    if(TEACHER_NAME && TEACHER_NAME != ''){
        setStr += ' TEACHER_NAME="'+TEACHER_NAME+'",';
    }
    var ORG_USER_ID = updateObj.ORG_USER_ID;
    if(ORG_USER_ID && ORG_USER_ID != ''){
        setStr += ' ORG_USER_ID="'+ORG_USER_ID+'",';
    }
    var ORG_USER_NAME = updateObj.ORG_USER_NAME;
    if(ORG_USER_NAME && ORG_USER_NAME != ''){
        setStr += ' ORG_USER_NAME="'+ORG_USER_NAME+'",';
    }
    var REMARK = updateObj.REMARK;
    if(REMARK && REMARK != ''){
        setStr += ' REMARK="'+REMARK+'",';
    }
    var STATUS = updateObj.STATUS;
    if(STATUS && STATUS != ''){
        setStr += ' STATUS="'+STATUS+'",';
    }
    var IS_SINGLE = updateObj.IS_SINGLE;
    if(IS_SINGLE){
        setStr += ' IS_SINGLE='+IS_SINGLE+',';
    }
    var PROC_DEF_ID = updateObj.PROC_DEF_ID;
    if(PROC_DEF_ID && PROC_DEF_ID != ''){
        setStr += ' PROC_DEF_ID="'+PROC_DEF_ID+'",';
    }
    setStr +=  '  LSTUPDID="'+userId+'", LSTUPDDATE="'+currDate+'" where LRNSCN_ORG_ID="'+updateObj.LRNSCN_ORG_ID+'"';
    var updateStr = 'update cro_lrnscnorg '+setStr;

    console.log(updateStr);
    mySQL.toSQL(updateStr, function(err, result){
        if(err){
            res.send({isOk: false});
        }else{
            res.send({isOk: true});
            /*
            if(!updateObj.isToOC){
                res.send({isOk: true});
            }else {
                //向OC推送课程组织信息

                var orgAndUserInfo_Sql = 'SELECT cro_lrnscnorg.INSTANCE_ID, cro_lrnscnorg.INSTANCE_NAME, cro_lrnscnorg.TEACHER_ID, cro_lrnscnorguser.USER_ID '+
                                         'FROM cro_lrnscnorg, cro_lrnscnorguser ' +
                                         'WHERE cro_lrnscnorg.LRNSCN_ORG_ID = "'+updateObj.LRNSCN_ORG_ID+'" AND cro_lrnscnorg.ISVALID = "1" AND cro_lrnscnorg.LRNSCN_ORG_ID = cro_lrnscnorguser.LRNSCN_ORG_ID';
                mySQL.toSQL(orgAndUserInfo_Sql, function(err, orgAndUserInfos){
                    if(err || orgAndUserInfos.length == 0){
                        res.send({isOk: true});
                    }else{
                        var usersInOrg = [];
                        for(var j=0; j < orgAndUserInfos.length; j++){
                            usersInOrg.push(orgAndUserInfos[j].USER_ID);
                        }
                        var ocData = {
                            users: usersInOrg,
                            orgId: updateObj.LRNSCN_ORG_ID,
                            courseId: orgAndUserInfos[0].INSTANCE_ID,
                            courseName: orgAndUserInfos[0].INSTANCE_NAME,
                            teacherId: orgAndUserInfos[0].TEACHER_ID
                        };
                        console.log('向OC推送课程组织信息：');
                        console.log(JSON.stringify(ocData));
                        POST(ocData, '/index.php/apps/notifications/orgNotification', function (ocResult) {
                            console.log('课程组织信息消息推送结果：' + ocResult);
                            res.send({isOk: true});
                        });
                    }
                });

            }
        */
        }
    });
};

// 课程组织操作_查询
exports.searchCourseOrg = function(req, res, mySQL){
    var whereStr = ' where ISVALID="1" ';
    var userId = req.session.userData.id;
    var STATUS = req.query.STATUS;
    if(STATUS &&　STATUS　!= ''){
        whereStr += ' and STATUS = "'+STATUS+'"';
    }
    //var userId = 'J960DGV0';
    //var TEACHER_ID = req.query.TEACHER_ID;
    /*
    if( TEACHER_ID &&　TEACHER_ID　!= ''){
        whereStr += ' and (TEACHER_ID = "'+TEACHER_ID+'" or ORG_USER_ID = "'+TEACHER_ID+'")';
    }else{
        whereStr += ' and (TEACHER_ID = "'+userId+'" or ORG_USER_ID = "'+userId+'")';
    }
    */
    var TEACHER_ID = req.query.TEACHER_ID;
    if( TEACHER_ID &&　TEACHER_ID　!= ''){
        whereStr += ' and TEACHER_ID = "'+TEACHER_ID+'"';
    }else{
        whereStr += ' and TEACHER_ID = "'+userId+'"';
    }
    var ORG_USER_ID = req.query.ORG_USER_ID;
    if( ORG_USER_ID && ORG_USER_ID!= ''){
        whereStr += ' and ORG_USER_ID = "'+ORG_USER_ID+'"';
    }
    var TEACHER_NAME = req.query.TEACHER_NAME;
    if( TEACHER_NAME &&　TEACHER_NAME　!= ''){
        whereStr += ' and TEACHER_NAME like \'%'+TEACHER_NAME+'%\'';
    }
    var ORG_USER_NAME = req.query.ORG_USER_NAME;
    if( ORG_USER_NAME &&　ORG_USER_NAME　!= ''){
        whereStr += ' and ORG_USER_NAME like \'%'+ORG_USER_NAME+'%\'';
    }

    var LRNSCN_ORG_ID = req.query.LRNSCN_ORG_ID;
    if( LRNSCN_ORG_ID &&　LRNSCN_ORG_ID　!= ''){
        whereStr += ' and LRNSCN_ORG_ID = \''+LRNSCN_ORG_ID+'\'';
    }
    var INSTANCE_ID = req.query.INSTANCE_ID;
    if( INSTANCE_ID &&　INSTANCE_ID　!= ''){
        whereStr += ' and INSTANCE_ID = \''+INSTANCE_ID+'\'';
    }
    var INSTANCE_NAME = req.query.INSTANCE_NAME;
    if( INSTANCE_NAME &&　INSTANCE_NAME　!= ''){
        whereStr += ' and INSTANCE_NAME like \'%'+INSTANCE_NAME+'%\'';
    }
    var CREATOR_GID_NAME = req.query.CREATOR_GID_NAME;
    if( CREATOR_GID_NAME &&　CREATOR_GID_NAME　!= ''){
        whereStr += ' and CREATOR_GID_NAME like \'%'+CREATOR_GID_NAME+'%\'';
    }
    var CREATOR_ORGID_NAME = req.query.CREATOR_ORGID_NAME;
    if( CREATOR_ORGID_NAME &&　CREATOR_ORGID_NAME　!= ''){
        whereStr += ' and CREATOR_ORGID_NAME like \'%'+CREATOR_ORGID_NAME+'%\'';
    }
    var BEGIN_TIME = req.query.BEGIN_TIME;
    if( BEGIN_TIME &&　BEGIN_TIME　!= ''){
        whereStr += ' and BEGIN_TIME >= "'+BEGIN_TIME+'"';
    }
    var END_TIME = req.query.END_TIME;
    if( END_TIME &&　END_TIME　!= ''){
        whereStr += ' and END_TIME <= "'+END_TIME+'"';
    }

    var orderStr = ' order by BEGIN_TIME desc';
    var selectStr = 'select * from cro_lrnscnorg' + whereStr + orderStr;
    console.log(selectStr);
    mySQL.toSQL(selectStr, function(err, doc) {
        var callbackName = req.query.jsonCallBack;
        if(err){
            console.log(err);
            if(callbackName){
                var sendStr = callbackName + '('+JSON.stringify({userId: userId, datas: []})+')';
                res.send(sendStr);
            }else{
                res.send({userId: userId, datas: []});
            }
        }
        if(callbackName){
            var sendStr = callbackName + '('+JSON.stringify({userId: userId, datas: doc})+')';
            res.send(sendStr);
        }else{
            res.send({userId: userId, datas: doc});
        }
    });
};

// 课程组织操作_查询userId可学的已组织好的课程列表
exports.searchMyOrgedCourses = function(req, res, mySQL){
    var childWhereStr = '', whereStr= '';
    var orgID = req.session.userData.orgID, deptID = req.session.userData.deptID;
    if( orgID && orgID != ''){
        if(childWhereStr.trim() == ''){
            childWhereStr += ' WHERE ';
        }else{
            childWhereStr += ' AND ';
        }
        childWhereStr += 'ORG_ID = "'+orgID+'" ';
    }
    if( deptID && deptID != ''){
        if(childWhereStr.trim() == ''){
            childWhereStr += ' WHERE ';
        }else{
            childWhereStr += ' AND ';
        }
        childWhereStr += 'DEPT_ID = "'+deptID+'" ';
    }

    var userId = req.query.userId;
    if( userId && userId != ''){
    	if(childWhereStr.trim() == ''){
            childWhereStr += ' WHERE ';
        }else{
            childWhereStr += ' AND ';
        }
        childWhereStr += 'SYNID = "'+userId+'" ';
    }

    var LRNSCN_ORG_ID = req.query.LRNSCN_ORG_ID;
    if( LRNSCN_ORG_ID && LRNSCN_ORG_ID != ''){
    	if(childWhereStr.trim() == ''){
            childWhereStr += ' WHERE ';
        }else{
            childWhereStr += ' AND ';
        }
        childWhereStr += 'LRNSCN_ORG_ID = "'+LRNSCN_ORG_ID+'" ';
    }

    var INSTANCE_ID = req.query.INSTANCE_ID;
    if( INSTANCE_ID &&　INSTANCE_ID　!= ''){
        whereStr += ' AND INSTANCE_ID = "'+INSTANCE_ID+'" ';
    }
    var STATUS = req.query.STATUS;
    if(STATUS &&　STATUS　!= ''){
        whereStr += ' AND STATUS = "'+STATUS+'"';
    }
    whereStr += ' ORDER BY BEGIN_TIME DESC';
    var selectStr = 'SELECT * FROM cro_lrnscnorg '+
                    'WHERE LRNSCN_ORG_ID IN (SELECT LRNSCN_ORG_ID FROM cro_lrnscnorguser '+childWhereStr+') AND ISVALID="1" '+whereStr;

    console.log(selectStr);
    mySQL.toSQL(selectStr, function(err, doc) {
        var callbackName = req.query.jsonCallBack;
        if(err){
            console.log(err);
            if(callbackName){
                var sendStr = callbackName + '('+JSON.stringify([])+')';
                res.send(sendStr);
            }else{
                res.send([]);
            }
        }
        if(callbackName){
            var sendStr = callbackName + '('+JSON.stringify(doc)+')';
            res.send(sendStr);
        }else{
            res.send(doc);
        }
    });
};
//--------------------------------------courseOrg end----------------------------------------------
//--------------------------------------courseOrgStructure start----------------------------------------------
//课程组织结构操作_检查分组名称
exports.checkGroupName = function(req, res, mySQL){
   var sqlStr = 'select * from cro_lrnscnorgstruct where LRNSCN_ORG_ID = "'+req.body.LRNSCN_ORG_ID+'" and SORT = "O" and CONTEXT_DES="'+req.body.CONTEXT_DES+'"';

    console.log(sqlStr);
    mySQL.toSQL(sqlStr, function(err, result){
        if(err){
            res.send('error');
        }else{
            res.send(result);
        }
    });
}
//课程组织结构操作_保存
exports.saveCourseOrgStructure = function(req, res, mySQL){
    var saveArr = JSON.parse(req.body.saveArr);
    var L = saveArr.length;
    var currDate = getDateStrUUID();
    var tempUUID = {}, myValues = '', userId = req.session.userData.id;
    if(L > 0){
        for(var i=0; i < L; i++){
            var uuid = UUID.v1();
            myValues += '("'+uuid+'","'+saveArr[i].PARENT_ID+'","'+saveArr[i].TREE_NODE_CODE+'","'+saveArr[i].SORT+'","'+saveArr[i].CONTEXT_ID+'","'+saveArr[i].CONTEXT_DES+'",'+saveArr[i].LEVEL+',"'+saveArr[i].ISLEAF+'","'+
            saveArr[i].LRNSCN_ORG_ID+'","'+saveArr[i].REMARK+'","'+saveArr[i].ISVALID+'","'+userId+'","'+currDate+'","'+userId+'","'+currDate+'")';
            tempUUID[i+''] = uuid;
            if(i < L-1){
                myValues += ', '
            }
        }
        var insertStr = 'insert into cro_lrnscnorgstruct'+
            '(ORG_STRUCTURE_ID, PARENT_ID, TREE_NODE_CODE, SORT, CONTEXT_ID, CONTEXT_DES, LEVEL, ISLEAF, LRNSCN_ORG_ID, '+
            'REMARK, ISVALID, CREATOR_ID, CREATE_DATE, LSTUPDID, LSTUPDDATE) values '+ myValues;

        console.log(insertStr);
        mySQL.toSQL(insertStr, function(err, result){
            if(err){
                res.send({isOk: false});
            }else{
                //console.log(result);
                res.send({isOk: true, ORG_STRUCTURE_IDS: tempUUID});
            }
        });
    }
};
//课程组织结构操作_删除
exports.deleteCourseOrgStructure = function(req, res, mySQL){
    var ORG_STRUCTURE_ID = req.body.ORG_STRUCTURE_ID;
    var deleteUserStr = 'delete from cro_lrnscnorguser where ORG_STRUCTURE_ID in ( select ORG_STRUCTURE_ID from cro_lrnscnorgstruct where PARENT_ID="'+ORG_STRUCTURE_ID+'" )';
    console.log(deleteUserStr);
    mySQL.toSQL(deleteUserStr, function(err, result1){//先删除角色下的人员
        if(err){
            res.send({isOk: false});
        }else{
            //console.log(result1);
            var deleteStructStr = 'delete from cro_lrnscnorgstruct  where ORG_STRUCTURE_ID="'+ORG_STRUCTURE_ID+'" or PARENT_ID="'+ORG_STRUCTURE_ID+'"';
            console.log(deleteStructStr);
            mySQL.toSQL(deleteStructStr, function(err, result2){//删除角色组织结构
                if(err){
                    res.send({isOk: false});
                }else{
                    //console.log(result2);
                    res.send({isOk: true});
                }
            });
        }
    });
};
//课程组织人员操作_保存
exports.updateCourseOrgStructure = function(req, res, mySQL){
    var updateObj = JSON.parse(req.body.updateObj), currDate = getDateStrUUID(), userId = req.session.userData.id;
    var setStr = ' set ';

    var count = updateObj.COUNT;
    if(count){
        setStr += 'COUNT='+ count+', ';
    }
    var des = updateObj.CONTEXT_DES;
    if(des){
        setStr += ' CONTEXT_DES="'+des+'", ';
    }
    setStr += ' LSTUPDDATE="'+currDate+'", LSTUPDID="'+userId+'" ';

    var updateStr = 'update cro_lrnscnorgstruct ' + setStr + ' where ORG_STRUCTURE_ID="'+updateObj.ORG_STRUCTURE_ID+'"';
    console.log(updateStr);
    mySQL.toSQL(updateStr, function(err, result){
        if(err){
            res.send({isOk: false});
        }else{
            //console.log(result);
            res.send({isOk: true});
        }
    });
};
// 课程组织结构操作_查询
exports.searchCourseOrgStructure = function(req, res, mySQL){
    var whereStr = '';
    var LRNSCN_ORG_ID = req.body.LRNSCN_ORG_ID;
    if( LRNSCN_ORG_ID &&　LRNSCN_ORG_ID　!= ''){
        if(whereStr.trim() == ''){
            whereStr += ' where ';
        }else{
            whereStr += ' and ';
        }
        whereStr += ' LRNSCN_ORG_ID = \''+LRNSCN_ORG_ID+'\'';
    }
    var PARENT_ID = req.body.PARENT_ID;
    if( PARENT_ID &&　PARENT_ID　!= ''){
        if(whereStr.trim() == ''){
            whereStr += ' where ';
        }else{
            whereStr += ' and ';
        }
        whereStr += ' PARENT_ID = \''+PARENT_ID+'\'';
    }
    var SORT = req.body.SORT;
    if( SORT &&　SORT　!= ''){
        if(whereStr.trim() == ''){
            whereStr += ' where ';
        }else{
            whereStr += ' and ';
        }
        whereStr += ' SORT = \''+SORT+'\'';
    }
    var ORG_STRUCTURE_ID = req.body.ORG_STRUCTURE_ID;
    if( ORG_STRUCTURE_ID &&　ORG_STRUCTURE_ID　!= ''){
        if(whereStr.trim() == ''){
            whereStr += ' where ';
        }else{
            whereStr += ' and ';
        }
        whereStr += ' ORG_STRUCTURE_ID = \''+ORG_STRUCTURE_ID+'\'';
    }
    var STATUS = req.body.STATUS;
    if( STATUS &&　STATUS　!= ''){
        if(whereStr.trim() == ''){
            whereStr += ' where ';
        }else{
            whereStr += ' and ';
        }
        whereStr += ' STATUS = \''+STATUS+'\'';
    }

    var selectStr = 'select * from cro_lrnscnorgstruct' + whereStr;
    console.log(selectStr);
    mySQL.toSQL(selectStr, function(err, doc) {
        if(err){
            console.log(err);
            res.send([]);
        }
        res.send(doc);
    });
};
//--------------------------------------courseOrgStructure end----------------------------------------------
//--------------------------------------courseOrgUser start----------------------------------------------
//课程组织人员操作_保存
exports.saveCourseOrgUser = function(req, res, mySQL){
    var saveArr = JSON.parse(req.body.saveArr), L = saveArr.length,currDate = getDateStrUUID(),
        tempUUID = {}, myValues = '', userId = req.session.userData.id;
    if (L > 0) {
        for (var i = 0; i < L; i++) {
            var uuid = UUID.v1();
            myValues += '("' + uuid + '","' + saveArr[i].SYNID + '","' + saveArr[i].USER_ID + '","' + saveArr[i].NAME + '","' + saveArr[i].SEX + '","' + saveArr[i].SKILL + '","' +
            saveArr[i].DEPT_ID + '","' + saveArr[i].DEPT_FULL_DES + '","' +saveArr[i].ORG_ID + '","' + saveArr[i].ORG_FUll_DES + '","' +
            saveArr[i].LRNSCN_ORG_ID + '","' + saveArr[i].ORG_STRUCTURE_ID + '","' +
            saveArr[i].REMARK + '","' + saveArr[i].ISVALID + '","' + userId + '","' + currDate + '","' + userId + '","' + currDate + '")';
            tempUUID[i + ''] = uuid;
            if (i < L - 1) {
                myValues += ', '
            }
        }
        var insertStr = 'insert into cro_lrnscnorguser' +
            '(LRNSCN_ORG_USER_CID, SYNID, USER_ID, NAME, SEX, SKILL, DEPT_ID, DEPT_FULL_DES, ORG_ID, ORG_FUll_DES, LRNSCN_ORG_ID, ORG_STRUCTURE_ID,  ' +
            'REMARK, ISVALID, CREATOR_ID, CREATE_DATE, LSTUPDID, LSTUPDDATE) values ' + myValues;

        console.log(insertStr);
        mySQL.toSQL(insertStr, function (err, result) {
            if (err) {
                res.send({isOk: false});
            } else {
                //console.log(result);
                res.send({isOk: true, ORG_USER_CIDS: tempUUID});
            }
        });
    }
};
/*
exports.saveCourseOrgUser = function(req, res, mySQL){
    var saveArr = JSON.parse(req.body.saveArr), L = saveArr.length,currDate = getDateStrUUID(),
        tempUUID = {}, myValues = '', userId = req.session.userData.id;
    if (L > 0) {
        var deleteUserStr = 'delete from cro_lrnscnorguser where ORG_STRUCTURE_ID = "'+saveArr[0].ORG_STRUCTURE_ID+'" ';
        console.log(deleteUserStr);
        mySQL.toSQL(deleteUserStr, function(err, result1) {//先删除角色下的人员
            if(err){
                res.send({isOk: false});
            }else {
                for (var i = 0; i < L; i++) {
                    var uuid = UUID.v1();
                    myValues += '("' + uuid + '","' + saveArr[i].SYNID + '","' + saveArr[i].USER_ID + '","' + saveArr[i].NAME + '","' + saveArr[i].SEX + '","' + saveArr[i].SKILL + '","' +
                    saveArr[i].DEPT_ID + '","' + saveArr[i].DEPT_FULL_DES + '","' +saveArr[i].ORG_ID + '","' + saveArr[i].ORG_FUll_DES + '","' +
                    saveArr[i].LRNSCN_ORG_ID + '","' + saveArr[i].ORG_STRUCTURE_ID + '","' +
                    saveArr[i].REMARK + '","' + saveArr[i].ISVALID + '","' + userId + '","' + currDate + '","' + userId + '","' + currDate + '")';
                    tempUUID[i + ''] = uuid;
                    if (i < L - 1) {
                        myValues += ', '
                    }
                }
                var insertStr = 'insert into cro_lrnscnorguser' +
                    '(LRNSCN_ORG_USER_CID, SYNID, USER_ID, NAME, SEX, SKILL, DEPT_ID, DEPT_FULL_DES, ORG_ID, ORG_FUll_DES, LRNSCN_ORG_ID, ORG_STRUCTURE_ID,  ' +
                    'REMARK, ISVALID, CREATOR_ID, CREATE_DATE, LSTUPDID, LSTUPDDATE) values ' + myValues;

                console.log(insertStr);
                mySQL.toSQL(insertStr, function (err, result) {
                    if (err) {
                        res.send({isOk: false});
                    } else {
                        //console.log(result);
                        res.send({isOk: true, ORG_USER_CIDS: tempUUID});
                    }
                });
            }
        });
    }
};
*/
//课程组织人员操作_保存
exports.updateCourseOrgUser = function(req, res, mySQL){
    var updateObj = JSON.parse(req.body.updateObj), currDate = getDateStrUUID(), userId = req.session.userData.id;

    var updateStr = 'update cro_lrnscnorguser set SKILL="'+updateObj.SKILL+'", REMARK="'+updateObj.REMARK+'", LSTUPDDATE="'+currDate+'", LSTUPDID="'+userId+'"  where LRNSCN_ORG_USER_CID="'+updateObj.LRNSCN_ORG_USER_CID+'"';
    console.log(updateStr);
    mySQL.toSQL(updateStr, function(err, result){
        if(err){
            res.send({isOk: false});
        }else{
            //console.log(result);
            res.send({isOk: true});
        }
    });
};
//课程组织人员操作_删除
exports.deleteCourseOrgUser = function(req, res, mySQL){
    var LRNSCN_ORG_USER_CID = req.body.LRNSCN_ORG_USER_CID;
    var deleteStr = 'delete from cro_lrnscnorguser  where LRNSCN_ORG_USER_CID="'+LRNSCN_ORG_USER_CID+'"';
    console.log(deleteStr);
    mySQL.toSQL(deleteStr, function(err, result){
        if(err){
            res.send({isOk: false});
        }else{
            //console.log(result);
            res.send({isOk: true});
        }
    });
};
//课程组织人员操作_查询
exports.searchCourseOrgUser = function(req, res, mySQL){
    var whereStr = '';
    var ORG_STRUCTURE_ID = req.body.ORG_STRUCTURE_ID;
    if( ORG_STRUCTURE_ID &&　ORG_STRUCTURE_ID　!= ''){
        if(whereStr.trim() == ''){
            whereStr += ' where ';
        }else{
            whereStr += ' and ';
        }
        whereStr += ' ORG_STRUCTURE_ID = \''+ORG_STRUCTURE_ID+'\'';
    }
    var LRNSCN_ORG_ID = req.body.LRNSCN_ORG_ID;
    if(LRNSCN_ORG_ID && LRNSCN_ORG_ID != ''){
        if(whereStr.trim() == ''){
            whereStr += ' where ';
        }else{
            whereStr += ' and ';
        }
        whereStr += ' LRNSCN_ORG_ID = \''+LRNSCN_ORG_ID+'\'';
    }

    var selectStr = 'select * from cro_lrnscnorguser' + whereStr;
    console.log(selectStr);
    mySQL.toSQL(selectStr, function(err, doc) {
        if(err){
            console.log(err);
            res.send([]);
        }
        res.send(doc);
    });
};

exports.searchUsers = function(req, res, mySQL){
    var whereStr = '';
    var ORG_STRUCTURE_ID = req.query.ORG_STRUCTURE_ID;
    if( ORG_STRUCTURE_ID &&　ORG_STRUCTURE_ID　!= ''){
        if(whereStr.trim() == ''){
            whereStr += ' where ';
        }else{
            whereStr += ' and ';
        }
        whereStr += ' ORG_STRUCTURE_ID = \''+ORG_STRUCTURE_ID+'\'';
    }
    var LRNSCN_ORG_ID = req.query.LRNSCN_ORG_ID;
    if(LRNSCN_ORG_ID && LRNSCN_ORG_ID != ''){
        if(whereStr.trim() == ''){
            whereStr += ' where ';
        }else{
            whereStr += ' and ';
        }
        whereStr += ' LRNSCN_ORG_ID = \''+LRNSCN_ORG_ID+'\'';
    }

    var selectStr = 'select SYNID, USER_ID, NAME, PROC_INST_ID from cro_lrnscnorguser' + whereStr;
    console.log(selectStr);
    mySQL.toSQL(selectStr, function(err, doc) {
        if(err){
            console.log(err);
            res.send([]);
        }
        res.send(doc);
    });
};

exports.searchAllOrgedUsers = function(req, res, mySQL){
    var LRNSCN_ORG_ID = req.body.LRNSCN_ORG_ID;
    if(LRNSCN_ORG_ID && LRNSCN_ORG_ID != ''){
        var selectStr = 'SELECT cro_lrnscnorguser.* FROM cro_lrnscnorguser , cro_lrnscnorg ' +
            'WHERE cro_lrnscnorg.INSTANCE_ID IN ' +
            '(SELECT INSTANCE_ID FROM cro_lrnscnorg ' +
            'WHERE LRNSCN_ORG_ID = "'+LRNSCN_ORG_ID+'" AND ISVALID="1") ' +
            'AND cro_lrnscnorg.STATUS IN ("0", "1", "2") AND cro_lrnscnorg.ISVALID="1" AND cro_lrnscnorguser.LRNSCN_ORG_ID = cro_lrnscnorg.LRNSCN_ORG_ID' ;
        console.log(selectStr);
        mySQL.toSQL(selectStr, function(err, doc) {
            if(err){
                console.log(err);
                res.send([]);
            }
            res.send(doc);
        });
    }else{
        console.log("searchAllOrgedUsers: LRNSCN_ORG_ID为空！");
        res.send([]);
    }


};

//------------------------------------------------engine business-------------------------------------------------------------
/**
 * 获取用户userId的组的信息
 * @param userId
 * @param LRNSCN_ORG_ID
 * @param mySQL
 * @param next
 */
exports.getGroupInfo = function(userId, LRNSCN_ORG_ID, mySQL, next){
    var selectSql = 'SELECT PARENT_ID, ORG_STRUCTURE_ID, CONTEXT_ID, CONTEXT_DES '+
                    'FROM cro_lrnscnorgstruct '+
                    'WHERE ORG_STRUCTURE_ID IN (SELECT ORG_STRUCTURE_ID  FROM cro_lrnscnorguser WHERE SYNID="'+userId+'" AND LRNSCN_ORG_ID="'+LRNSCN_ORG_ID+'")';

    console.log(selectSql);
    mySQL.toSQL(selectSql, function(err, doc) {
        if(err){
            console.log(err);
            next([]);
        }
        next(doc);
    });
};
/**
 * 获取角色下的人员数
 * @param ORG_STRUCTURE_ID
 * @param mySQL
 * @param next
 */
exports.getCountOfMembers = function(ORG_STRUCTURE_ID, mySQL, next){
    var selectSql = 'SELECT COUNT(*) FROM cro_lrnscnorguser WHERE ORG_STRUCTURE_ID="'+ORG_STRUCTURE_ID+'"';

    console.log(selectSql);
    mySQL.toSQL(selectSql, function(err, doc) {
        if(err){
            console.log(err);
            next('error');
        }
        next(doc);
    });
};
/**
 * 登记userId完成了任务taskId
 * @param userId
 * @param taskId
 * @param mySQL
 * @param next
 */
exports.registerMyFinishedTask = function(userId, taskId, mySQL, next){
    var updateSql = 'UPDATE act_ru_task SET COUNT = CONCAT(COUNT, ",'+userId+'") WHERE ID_="'+taskId+'"';

    console.log(updateSql);
    mySQL.toSQL(updateSql, function(err, doc) {
        if(err){
            console.log(err);
            next('error');
        }
        next('ok');
    });
};
/**
 * 获取已完成任务taskId的人员
 * @param taskId
 * @param mySQL
 * @param next
 */
exports.getFinishedCountOfTask = function(taskId, mySQL, next){
    var selectSql = 'SELECT COUNT FROM act_ru_task WHERE ID_="'+taskId+'"';

    console.log(selectSql);
    mySQL.toSQL(selectSql, function(err, doc) {
        if(err){
            console.log(err);
            next('error');
        }
        next(doc);
    });
};

function getDateStrUUID(){
    var date = new Date();
    var month = (date.getMonth()+1)<10?'0'+(date.getMonth()+1):(date.getMonth()+1);
    var day = date.getDate()<10 ? ('0'+date.getDate()) : date.getDate();
    var hour = date.getHours()<10 ? ('0'+date.getHours()) : date.getHours();
    var minutes = date.getMinutes()<10 ? ('0'+date.getMinutes()) : date.getMinutes();
    var seconds = date.getSeconds()<10 ? ('0'+date.getSeconds()) : date.getSeconds();

    var dateStr = '' + date.getFullYear() +'-'+  month +'-'+  day +' '+hour +':'+  minutes +':'+  seconds ;

    return dateStr;
}
//-----------------------------------------------------TEST-------------------------------------------------------
exports.getAllUsers = function(req, res, mySQL){
    var tempUsers = [
        {USER_ID: '103456', NAME: '李大杰1', SEX: '1'},
        {USER_ID: '113456', NAME: '李大杰2', SEX: '1'},
        {USER_ID: '123456', NAME: '李大杰3', SEX: '1'},
        {USER_ID: '133456', NAME: '李大杰4', SEX: '1'},
        {USER_ID: '143456', NAME: '李大杰5', SEX: '1'},
        {USER_ID: '153456', NAME: '李大杰6', SEX: '1'}

    ];

    res.send({status:'200', err:'', datas:tempUsers});
};
exports.getAllOrgs = function(req, res, mySQL){
    var tempOrgs = [
                    {
                        CREATEDATE: "2016-08-15T12:54:19.000Z",
                        CREATEORGID: null,
                        CREATORID: "PV5V3SO6",
                        ISVALID: "1",
                        LSTUPDDATE: "2016-09-05T08:43:56.000Z",
                        LSTUPDID: "T3DAJ62A",
                        REMARK: "dsfsdfd",
                        address: "打开的机房看电视剧",
                        businessLicense: "dkljflkdsmf",
                        emailAdress: "FKDJFLDF",
                        legalPerson: "来点",
                        leve: 0,
                        numb: null,
                        orgCode: "WD",
                        orgFullDes: "武汉大学",
                        orgID: "61addb10-62e7-11e6-829e-b9e92c7a483c",
                        orgShortDes: "武大",
                        orgSort: 1,
                        orgscaleType: "1000000",
                        parentId: null,
                        registerMoney: 10000000,
                        schoolType: 1,
                        tel1: "5832457",
                        tel2: "",
                        testID: null
                    },
                    {
                        leve: 1,
                        orgFullDes: "武昌校区",
                        orgID: "5c806740-62f4-11e6-9c2c-dd5f12dedcbc",
                        parentId: "61addb10-62e7-11e6-829e-b9e92c7a483c"
                    },
                    {
                        leve:2,
                        orgFullDes:"计算机系",
                        orgID:"95e9d250-62f4-11e6-9c2c-dd5f12dedcbc",
                        parentId:"5c806740-62f4-11e6-9c2c-dd5f12dedcbc"
                    },
                    {
                        leve: 2,
                        orgFullDes: "机械系",
                        orgID: "9b009df0-62f4-11e6-9c2c-dd5f12dedcbc",
                        parentId: "5c806740-62f4-11e6-9c2c-dd5f12dedcbc"
                    },
                    {
                        leve: 2,
                        orgFullDes: "中文系",
                        orgID: "9ebd30c0-62f4-11e6-9c2c-dd5f12dedcbc",
                        parentId: "5c806740-62f4-11e6-9c2c-dd5f12dedcbc"
                    },
                    {
                        leve: 3,
                        orgFullDes: "软件工程专业",
                        orgID: "a8395250-62f4-11e6-9c2c-dd5f12dedcbc",
                        parentId: "95e9d250-62f4-11e6-9c2c-dd5f12dedcbc"
                    },
                    {
                        leve: 4,
                        orgFullDes: "A班",
                        orgID: "ac110e40-62f4-11e6-9c2c-dd5f12dedcbc",
                        parentId: "a8395250-62f4-11e6-9c2c-dd5f12dedcbc"
                    },
                    {
                        leve: 4,
                        orgFullDes: "B班",
                        orgID: "d58d0290-635f-11e6-ba47-816f6ec5ff70",
                        parentId: "a8395250-62f4-11e6-9c2c-dd5f12dedcbc"
                    },
                    {
                        leve: 4,
                        orgFullDes: "C班",
                        orgID: "48a039d0-6902-11e6-8713-cbcd3351b061",
                        parentId: "a8395250-62f4-11e6-9c2c-dd5f12dedcbc"
                    }
                ];

    res.send({status:'200', err:'', datas:tempOrgs});
};
