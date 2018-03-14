/**
 * Created by lijiemoop on 1/18/2017.
 */
var express = require('express');
var router = express.Router();
var path = require('path');
//var config = require('../../config/config.json');
var config = require('../../config.json');
var mysql = require('../course_org/mysql/mysql.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    var filePath = path.join(__dirname, '../../views/course_pro/coursePro.html');
    res.sendFile(filePath);
});

router.post('/search', function(req, res, next) {
    var courseId = req.body.courseId;
    var users = req.body.users;
    var type = req.body.type;
    var i,tree = {};
    console.log(courseId,users,type);

    /*var findEnd = function(taskNames,arr){
        var k;
        for(k=0;k<arr.length;k++){
            if(arr[k].child){
                findEnd(taskNames,arr[k].child);
            }else{
                taskNames.push(arr[k].name)
            }
        }
    };

    var getTaskNames = function(tree){
        var taskNames = [];
        if(tree.child){
            findEnd(taskNames,tree.child);
        }
        return taskNames;
    };

    var findChild = function(id,arr){
        var j,childArr = [];
        for(j=0;j<arr.length;j++){
            if(arr[j].parent_id === id){
                childArr.push({
                    id:arr[j].course_id,
                    name:arr[j].name,
                    child:findChild(arr[j].course_id,arr)
                });
            }
        }
        return childArr.length?childArr:null;
    };

    try{
        var classSql = 'SELECT * '+
            'FROM oc_courseplayer_courseClass';
        mysql.toSQL(classSql,function(err,data){
            for(i=0;i<data.length;i++){
                if(data[i].course_id === courseId){
                    tree = {
                        id:data[i].course_id,
                        name:data[i].name,
                        child:findChild(data[i].course_id,data)
                    }
                }
            }
            console.log(getTaskNames(tree));
        });
    }catch(e){
        console.log(e);
    }*/
    try{
        var sqlStr = "CALL Dvp_SP_UserCourseStat('"+users.toString()+"', '"+courseId+"', '1')";
        //var sqlStr = "CALL Dvp_SP_UserCourseStat('zhangll', '12345678-0d19-48e6-8fdb-123456789800', '1')";
        mysql.toSQL(sqlStr,function(err,data){console.log(err,data);
            if(data){
                res.send(data[0]);
            }else{
                res.send([]);
            }

        });
    }catch(e){
        console.log(e);
    }
});

router.post('/getSession', function(req, res, next) {
    var userData =  req.session.userData;
    res.send(userData);
});

module.exports = router;