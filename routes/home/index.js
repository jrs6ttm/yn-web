var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var http = require('http');
//var config = require('../../config/config.json');
var config = require('../../config.json');
var mySQL = require('./mysql/mysql.js');
var env = global.orgENV;


var headers = function(res){
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
};






if(mySQL) {
    var firstCharacterToUpper = function(srcStr){
        return srcStr.substring(0, 1).toUpperCase() + srcStr.substring(1);
    };

    var replaceUnderlineAndfirstToUpper = function(srcStr,org,ob){
        var newString = "";
        var first=0;
        while(srcStr.indexOf(org)!=-1)
        {
            first=srcStr.indexOf(org);
            if(first!=srcStr.length)
            {
                newString=newString+srcStr.substring(0,first)+ob;
                srcStr=srcStr.substring(first+org.length,srcStr.length);
                srcStr=firstCharacterToUpper(srcStr);
            }
        }
        newString=newString+srcStr;
        return newString;
    };

    var changeToUpper = function(arr){
        var i,newArr=[],ob;
        for(i=0;i<arr.length;i++){
            ob={};
            for(var t in arr[i]){
                if(arr[i].hasOwnProperty(t)){
                    ob[replaceUnderlineAndfirstToUpper(t,'_','')] = arr[i][t];
                }
            }
            newArr.push(ob);
        }
        return newArr;
    };
    /*others req*/
    router.post('/findOptionsByCourseId',function(req,res){
        headers(res);
        var userId = req.body.userId,
            courseId = req.body.courseId;
        var sqlStr;
        if(userId){
            sqlStr = 'SELECT * FROM oc_courseplayer_options WHERE user_id = "'+ userId+'" AND course_id = "'+courseId+'"';
        }else{
            sqlStr = 'SELECT * FROM oc_courseplayer_options WHERE course_id = "'+courseId+'"';
        }
        mySQL.toSQL(sqlStr, function(err, doc) {
            if(err){
                console.log(err);
                res.send([]);
            }else{
                res.send(changeToUpper(doc));
            }
        });
    });

    router.post('/getCourseTree',function(req,res){
        headers(res);
        var courseIds = JSON.parse(req.body.courseIds);
        var courseTree = [],allCourse,sqlStr;
        var getAllCourse = function(next){
            sqlStr = 'SELECT * FROM oc_courseplayer_courseclass';
            mySQL.toSQL(sqlStr, function(err, doc) {
                if(err){
                    console.log(err);
                    next([]);
                }else{
                    next(changeToUpper(doc));
                }
            });
        };
        var findChildByParentId = function(id){
            var categoryTrees = [], i,child = {},childArr;
            for(i=0;i<allCourse.length;i++){
                if(allCourse[i].parentId == id){
                    child  = {};
                    child.id = allCourse[i].courseId;
                    child.name = allCourse[i].name;
                    if(allCourse[i].nodeType !== 'learnAct'){
                        childArr = findChildByParentId(allCourse[i].courseId);
                        if(childArr.length){
                            child.children = childArr;
                        }
                    }
                    categoryTrees.push(child);
                }
            }
            return categoryTrees;
        };
        var getCourseTree = function(courseId,next){
            var thisCourse,resData = {};
            sqlStr = 'SELECT * FROM oc_courseplayer_courseClass WHERE course_id = "'+ courseId+'"';
            mySQL.toSQL(sqlStr, function(err, doc) {
                if(err){
                    console.log(err);
                    res.send(err);
                }else{
                    thisCourse = changeToUpper(doc)[0];
                    resData.id = thisCourse.courseId;
                    resData.name = thisCourse.name;
                    resData.children = findChildByParentId(thisCourse.courseId);
                    next(resData);
                }
            });
        };
        var getOne = function(index,next){
            if(index < courseIds.length){
                getCourseTree(courseIds[index],function(data){
                    courseTree.push(data);
                    getOne(index+1,next);
                });
            }else{
                next();
            }
        };
        getAllCourse(function(data){
            allCourse = data;
            getOne(0,function(){
                res.send(courseTree);
            });
        });
    });

    router.get('/findOptionsByOrgId',function(req,res){
        headers(res);
        var userId = req.query.userId,
            orgId = req.query.orgId,
            taskId = req.query.taskId,
            subtaskId = req.query.subtaskId,
            courseId = req.query.courseId;
        var sqlStr;
        if(courseId){
            if(userId){
                if(taskId){
                    sqlStr = 'SELECT * FROM oc_courseplayer_options WHERE user_id = "'+ userId+'" AND course_id = "'+courseId+'" AND task_id = "'+taskId+'"';
                }else if(subtaskId){
                    sqlStr = 'SELECT * FROM oc_courseplayer_options WHERE user_id = "'+ userId+'" AND course_id = "'+courseId+'" AND subtask_id = "'+subtaskId+'"';
                }else{
                    sqlStr = 'SELECT * FROM oc_courseplayer_options WHERE user_id = "'+ userId+'" AND course_id = "'+courseId+'"';
                }
            }else{
                if(taskId){
                    sqlStr = 'SELECT * FROM oc_courseplayer_options WHERE task_id = "'+ taskId+'" AND course_id = "'+courseId+'"';
                }else if(subtaskId){
                    sqlStr = 'SELECT * FROM oc_courseplayer_options WHERE subtask_id = "'+ subtaskId+'" AND course_id = "'+courseId+'"';
                }else{
                    sqlStr = 'SELECT * FROM oc_courseplayer_options WHERE course_id = "'+ courseId+'"';
                }
            }
        }
        if(orgId){
            if(userId){
                if(taskId){
                    sqlStr = 'SELECT * FROM oc_courseplayer_options WHERE user_id = "'+ userId+'" AND org_id = "'+orgId+'" AND task_id = "'+taskId+'"';
                }else if(subtaskId){
                    sqlStr = 'SELECT * FROM oc_courseplayer_options WHERE user_id = "'+ userId+'" AND org_id = "'+orgId+'" AND subtask_id = "'+subtaskId+'"';
                }else{
                    sqlStr = 'SELECT * FROM oc_courseplayer_options WHERE user_id = "'+ userId+'" AND org_id = "'+orgId+'"';
                }
            }else{
                if(taskId){
                    sqlStr = 'SELECT * FROM oc_courseplayer_options WHERE task_id = "'+ taskId+'" AND org_id = "'+orgId+'"';
                }else if(subtaskId){
                    sqlStr = 'SELECT * FROM oc_courseplayer_options WHERE subtask_id = "'+ subtaskId+'" AND org_id = "'+orgId+'"';
                }else{
                    sqlStr = 'SELECT * FROM oc_courseplayer_options WHERE org_id = "'+ orgId+'"';
                }
            }
        }

        mySQL.toSQL(sqlStr, function(err, doc) {
            if(err){
                console.log(err);
                res.send([]);
            }else{
                res.send(changeToUpper(doc));
            }
        });
    });

    router.post('/getOrg',function(req,res){
        headers(res);
        var orgId = req.body.orgId,
            userId = req.body.userId,
            sqlStr;
        if(userId){
            sqlStr = 'SELECT * FROM oc_courseplayer_courses WHERE user_id = "'+ userId+'" AND org_id = "'+orgId+'"';
        }else{
            sqlStr = 'SELECT * FROM oc_courseplayer_courses WHERE org_id = "'+ orgId+'"';
        }
        mySQL.toSQL(sqlStr, function(err, doc) {
            if(err){
                console.log(err);
                res.send({});
            }else{
                res.send(changeToUpper(doc)[0]?changeToUpper(doc):{});
            }
        });
    });

    router.get('/findStudents',function(req,res){
        headers(res);
        var courseId = req.query.courseId;
        var lastUser,users = [],tmp;
        //sqlStr = 'SELECT * FROM oc_users';
        var sqlStr = "SELECT * FROM `oc_courseplayer_courses` c LEFT JOIN `oc_users` u ON c.user_id=u.synid WHERE `course_id` = '"+courseId+"' ORDER BY `uid` ASC";
        mySQL.toSQL(sqlStr, function(err, doc) {console.log(courseId,doc,'____________________________________________________________')
            if(err){
                console.log(err);
                res.send(users);
            }else{
                tmp = changeToUpper(doc);
                for(i=0;i<tmp.length;i++){
                    if(tmp[i].uid != lastUser){
                        lastUser = tmp[i].uid;
                        users.push(tmp[i]);
                    }
                }
                res.send(users);
            }
        });
    });

    router.get('/getNoOrgByUser',function(req,res){
        headers(res);
        var userId = req.query.userId;
        var resData = [],tmp,i;
        var sqlStr = 'SELECT * FROM oc_courseplayer_courses WHERE user_id = "'+ userId+'"';
        mySQL.toSQL(sqlStr, function(err, doc) {
            if(err){
                console.log(err);
                res.send(resData);
            }else{
                tmp = changeToUpper(doc);
                for(i=0;i<tmp.length;i++){
                    if(!tmp[i].lrnScnOrgId){
                        resData.push(tmp[i]);
                    }
                }
                res.send(resData);
            }
        });
    });

    router.post('/getCourseOrgGroup',function(req,res){
        headers(res);
        var arr = req.body.data;
        var resData = [];

        var findCoursesByUserANDOrgId = function(userId,orgId,index){
            var sqlStr = 'SELECT * FROM oc_courseplayer_courses WHERE user_id = "'+ userId+'" AND org_id = "'+orgId+'"';
            mySQL.toSQL(sqlStr, function(err, doc) {
                if(err){
                    console.log(err);
                    //resData.push([]);
                    getOne(index+1);
                }else{
                    resData.push(changeToUpper(doc));
                    getOne(index+1);
                }
            });
        };

        var getOne = function(index,next){
            if(index < arr.length){
                findCoursesByUserANDOrgId(arr[index].userId,arr[index].orgId,index);
            }else{
                next();
            }
        };
        getOne(0,function(){
            res.send(resData);
        });
    });

    router.post('/getCourseDataByIds',function(req,res){
        headers(res);
        var arr = req.body.arr;
        var resData = {};

        var findCoursesById = function(courseId,index){
            var sqlStr = 'SELECT * FROM oc_courseplayer_courses WHERE course_id = "'+ courseId+'"';
            mySQL.toSQL(sqlStr, function(err, doc) {
                if(err){
                    console.log(err);
                    resData[arr[index]] = [];
                    getOne(index+1);
                }else{
                    resData[arr[index]] = changeToUpper(doc);
                    getOne(index+1);
                }
            });
        };

        var getOne = function(index,next){
            if(index < arr.length){
               findCoursesById(arr[index],index);
            }else{
                next();
            }
        };
        getOne(0,function(){
            res.send(resData);
        });
    });

    router.get('/getAllCourseData',function(req,res){
        headers(res);
        var sqlStr = 'SELECT * FROM oc_courseplayer_courses';
        mySQL.toSQL(sqlStr, function(err, doc) {
            if(err){
                console.log(err);
                res.send([]);
            }else{
                res.send(changeToUpper(doc));
            }
        });
    });

    router.get('/getCourseDataByUser',function(req,res){
        headers(res);
        var userId = req.query.userId;
        var sqlStr = 'SELECT * FROM oc_courseplayer_courses WHERE user_id = "'+ userId+'"';
        mySQL.toSQL(sqlStr, function(err, doc) {
            if(err){
                console.log(err);
                res.send([]);
            }else{
                res.send(changeToUpper(doc));
            }
        });
    });
    /*player page req*/
    router.post('/evaluateCourse',function(req,res){//TODO

    });

    router.post('/checkPageOffice',function(req,res){//TODO

    });

    router.get('/findFile',function(req,res){
        var courseInstId = req.query.courseInstId,
            taskId = req.query.taskId,
            userId = req.session.userData.id;

        var sqlStr = 'SELECT * FROM oc_courseplayer_file WHERE course_inst_id = "'+ courseInstId+'"'+'AND task_id = "'+taskId+'"'+'AND user_id = "'+userId+'"';
        mySQL.toSQL(sqlStr, function(err, doc) {
            if(err){
                console.log(err);
                res.send([]);
            }else{
                res.send(changeToUpper(doc));
            }
        });
    });

    router.post('/saveFile',function(req,res){
        var courseInstId = req.body.courseInstId,
            taskId = req.body.taskId,
            updateTime = req.body.updateTime,
            fileId = req.body.fileId,
            fileName = req.body.fileName,
            fileUrl = req.body.fileUrl,
            fileType = req.body.fileType,
            userId = req.session.userData.id;

        var insertStr = 'insert into oc_courseplayer_file(course_inst_id,task_id, user_id, update_time, file_id, file_name,file_url,file_type) values ("'+courseInstId+ '","'+taskId+ '","' +userId+ '","'+updateTime+ '","'+fileId+ '","'+fileName+ '","'+fileUrl+'","' +fileType+'")';
        console.log(insertStr);
		mySQL.toSQL(insertStr, function(err) {
            if(err){
                console.log(err);
                res.send('err');
            }else{
                res.send('ok');
            }
        });
    });

    router.get('/checkChoice',function(req,res){
        var questionId = req.query.questionId;
        var options = {
            hostname : config.ports[env].examPort.substring(7),
            port:80,
            path:'/exam/checkMyExamCompleted?id='+questionId,
            method:'GET'
        };
        var request = http.request(options,function(response){
            var resData = '';
            console.log('STATUS:'+response.statusCode);
            console.log('HEADERS:'+JSON.stringify(response.headers));
            response.setEncoding('utf-8');
            response.on('data',function(chunk){
                console.log('数据片段分隔-----------------------\r\n');
                console.log(chunk);
                resData+=chunk;
            });
            response.on('end',function(){
                console.log('响应结束********');
                res.send(resData);
            });
        });
        request.on('error',function(err){
            console.error(err);
        });
        request.end();
    });

    router.post('/saveOption',function(req,res){
        var userId = req.body.userId,
            userName = req.body.userName,
            optDes = req.body.optDes,
            optResult = req.body.optResult,
            optType = req.body.optType,
            courseId = req.body.courseId,
            courseName = req.body.courseName,
            instanceId = req.body.instanceId,
            orgId = req.body.orgId,
            taskId = req.body.taskId,
            taskName = req.body.taskName,
            subtaskId = req.body.subtaskId,
            optTime = new Date().getTime(),
            subtaskName = req.body.subtaskName,
            link = req.body.link;
        var insertStr = 'insert into oc_courseplayer_options(user_id,user_name, opt_des, opt_result, opt_type, course_id,course_name,instance_id,org_id,task_id,task_name,subtask_id,subtask_name,opt_time,link) values ("'+userId+ '","'+userName+ '","' +optDes+ '","'+optResult+ '","'+optType+ '","'+courseId+ '","'+courseName+'","' +instanceId+ '","'+orgId+ '","'+taskId+ '","'+taskName+ '","'+subtaskId+ '","'+subtaskName+ '","'+optTime+'","'+link+'")';
        mySQL.toSQL(insertStr, function(err) {
            if(err){
                console.log(err);
                res.send('err');
            }else{
                res.send('ok');
            }
        });
    });

    router.post('/saveLastTasks',function(req,res){
        var courseId = req.body.courseId;
        var task = req.body.task;
        fs.appendFile('./routes/home/lastTasks/'+courseId+'.txt',task+'^^','utf8',function (error){
            if(error){
                res.send('false');
            }else{
                res.send('ok');
            }
        }) ;
    });

    router.get('/getLastTasks',function(req,res){
        var courseId = req.query.courseId;
        fs.readFile('./routes/home/lastTasks/'+courseId+'.txt','utf8',function (error,data){
            if(error){
                res.send(null);
            }else{
                res.send(data);
            }
        }) ;
    });
    /*course page req*/
    router.post('/updateInstance', function(req, res) {
        var completedTime = req.body.completedTime,
            statement = req.body.statement,
            courseCompleteId = req.body.courseCompleteId;
        var updateStr = 'update oc_courseplayer_courses set statement="'+statement+'", completed_time="'+completedTime+'"  where course_complete_id="'+courseCompleteId+'"';
        mySQL.toSQL(updateStr, function (err) {
            if (err) {
                console.log(err);
                res.send('err');
            } else {
                res.send('ok');
            }
        });
    });

    router.get('/getInstance', function(req, res) {
        var courseId = req.query.courseId,
            orgId = req.query.orgId,
            courseCompleteId = req.query.courseCompleteId,
            userId = req.session.userData.id,
            sqlStr;
        if(courseCompleteId){
            sqlStr = 'SELECT * FROM oc_courseplayer_courses WHERE course_complete_id = "'+ courseCompleteId+'" order by selected_time desc';
        }else{
            if(orgId){
                sqlStr = 'SELECT * FROM oc_courseplayer_courses WHERE course_id = "'+ courseId+'" AND lrn_scn_org_id = "'+ orgId+'" AND user_id = "'+ userId+'" order by selected_time desc';
            }else{
                sqlStr = 'SELECT * FROM oc_courseplayer_courses WHERE course_id = "'+ courseId+'" AND user_id = "'+ userId+'" order by selected_time desc';
            }
        }
        mySQL.toSQL(sqlStr, function(err, doc) {
            if(err){
                console.log(err);
                res.send([]);
            }else{
                res.send(changeToUpper(doc));
            }
        });
    });

    router.post('/saveInstance', function(req, res) {
        var courseName = req.body.courseName,
            courseId = req.body.courseId,
            courseCompleteId = req.body.courseCompleteId,
            teacherId = req.body.teacherId,
            teacherName = req.body.teacherName,
            statement = req.body.statement,
            selectedTime = new Date().getTime(),
            processDefinitionId = req.body.processDefinitionId,
            lrnScnOrgId = req.body.lrnScnOrgId,
            lastTasks = req.body.lastTasks;
        var insertStr = 'insert into oc_courseplayer_courses(user_id,course_name, course_id, course_complete_id, teacher_id, teacher_name,statement,selected_time,process_definition_id,lrn_scn_org_id,last_tasks) values ("'+req.session.userData.id+ '","'+courseName+ '","' +courseId+ '","'+courseCompleteId+ '","'+teacherId+ '","'+teacherName+ '","'+statement+'","' +selectedTime+ '","'+processDefinitionId+ '","'+lrnScnOrgId+ '","'+lastTasks+'")';
        mySQL.toSQL(insertStr, function(err) {
            if(err){
                console.log(err);
                res.send('err');
            }else{
                res.send('ok');
            }
        });
    });

    router.get('/getCourseInfo', function(req, res) {
        var courseId = req.query.courseId;
        var sqlStr = 'SELECT * FROM oc_courseplayer_courseInfo WHERE course_id = "'+ courseId+'"';
        mySQL.toSQL(sqlStr, function(err, doc) {
            if(err){
                console.log(err);
                res.send('');
            }else{
                res.send(changeToUpper(doc)[0]);
            }
        });
    });
    /*situation page req*/
    router.get('/addViewTimes', function(req, res) {
        if(req.session){
            if(!req.session.userData){
                return res.send('no sesson');
            }
        }else{
            return res.send('no sesson');
        }
        var courseId = req.query.courseId;
        var updateStr;
        var sqlStr = 'SELECT * FROM oc_courseplayer_courseClass WHERE course_id = "'+ courseId+'"';
        mySQL.toSQL(sqlStr, function(err, doc) {
            if(err){
                console.log(err);
                res.send('err');
            }else{
                if(doc.length){
                    if(doc[0].view_times){
                        updateStr = 'update oc_courseplayer_courseClass set view_times="'+(parseInt(doc[0].view_times)+1)+'"  where course_id="'+courseId+'"';
                        mySQL.toSQL(updateStr, function (err) {
                            if (err) {
                                console.log(err);
                                res.send('err');
                            } else {
                                res.send('ok');
                            }
                        });
                    }else{
                        updateStr = 'update oc_courseplayer_courseClass set view_times="'+1+'"  where course_id="'+courseId+'"';
                        mySQL.toSQL(updateStr, function (err) {
                            if (err) {
                                console.log(err);
                                res.send('err');
                            } else {
                                res.send('ok');
                            }
                        });
                    }
                }else{
                    res.send('ok');
                }
            }
        });
    });

    router.post('/saveCourse', function(req, res) {
        headers(res);
        var nodeType = req.body.nodeType,
            courseId = req.body.courseId,
            name = req.body.name,
            parentId = req.body.parentId,
            imageUrl = req.body.imageUrl;

        var sqlStr = 'SELECT * FROM oc_courseplayer_courseClass WHERE course_id = "'+ courseId+'"';
        mySQL.toSQL(sqlStr, function(err, doc) {
            if(err){
                console.log(err);
                res.send('err');
            }else{
                if(doc.length){
                    if(doc[0].node_type === nodeType&&doc[0].course_id === courseId&&doc[0].name===name&&doc[0].parent_id===parentId&&doc[0].image_url===imageUrl){
                        res.send('ok');
                    }else{
                        var updateStr = 'update oc_courseplayer_courseClass set node_type="'+nodeType+'", course_id="'+courseId+'", name="'+name+'", parent_id="'+parentId+'", image_url="'+imageUrl+'"  where course_id="'+courseId+'"';
                        mySQL.toSQL(updateStr, function (err) {
                            if (err) {
                                console.log(err);
                                res.send('err');
                            } else {
                                res.send('ok');
                            }
                        });
                    }
                }else{
                    var insertStr = 'insert into oc_courseplayer_courseClass(node_type, course_id, name, parent_id, image_url,view_times) values ("'+nodeType+ '","' +courseId+ '","'+name+ '","'+parentId+ '","'+imageUrl+ '",'+1+')';
                    mySQL.toSQL(insertStr, function (err) {
                        if (err) {
                            console.log(err);
                            res.send('err');
                        } else {
                            res.send('ok');
                        }
                    });
                }
            }
        });
    });
    /*home page req*/
    router.get('/getCourseType', function(req, res) {
        headers(res);
        var sqlStr = 'SELECT * FROM oc_courseplayer_coursetype';
        mySQL.toSQL(sqlStr, function(err, doc) {
            if(err){
                console.log(err);
                res.send([]);
            }else{
                res.send(changeToUpper(doc));
            }
        });
    });

    router.get('/getPopularCourses', function(req, res) {
        var sqlStr = 'SELECT * FROM oc_courseplayer_courseclass ORDER BY view_times DESC LIMIT 5';
        mySQL.toSQL(sqlStr, function(err, doc) {
            if(err){
                console.log(err);
                res.send([]);
            }else{
                res.send(changeToUpper(doc));
            }
        });
    });
    /* GET page. */
    router.get('/video', function(req, res) {
        var userId = req.query.userId;
        var filePath = req.query.filePath;
        res.render('home/video',{title:'学做网',userId:userId,filePath:filePath});
    });

    router.get('/viewTxt/:id1/:id2', function(req, res) {
        var id1 = req.params.id1;
        var id2 = req.params.id2;
        res.render('home/viewTxt',{title:'学做网',id1:id1,id2:id2 });
    });

    router.get('/player', function(req, res) {
        res.render('home/player',{title:'学做网' });
    });

    router.get('/course', function(req, res) {
        res.render('home/course',{title:'学做网' });
    });

    router.get('/situation', function(req, res) {
        res.render('home/situation',{title:'学做网' });
    });




    router.get('/', function(req, res) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
           // res.header("Content-Type", "application/json;charset=utf-8");
		   console.log("-----------home1-------------------");
        res.render('home/home',{title:'学做网'});
    });


    /*public req*/
    router.get('/getSession', function(req, res) {
        if(req.session){
            if(req.session.userData){
                var userData =  req.session.userData;
                res.send(userData);
                return;
            }
        }
        res.send(null);
    });

    router.get('/getConfig', function(req, res) {
        res.send(config.ports[env]);
    });
}else{
    console.log('error : can not connect mySql !');
}

module.exports = router;