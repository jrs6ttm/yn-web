/**
 * Created by Administrator on 2016/8/18.
 */
var express = require('express');
var mySQL = require('./mysql/mysql.js');
var config = require('../../config.json');
var courseOrg = require('./courseOrg.js');
//var http = require('http');
var router = express.Router();
var env = global.orgENV;
if(mySQL) {
    router.get('/testToOC', function(req, res){
        courseOrg.testToOC(req, res);
    });

    //进入课程组织列表页面
    router.get('/search', function (req, res) {
        //跨域
        res.header('Access-Control-Allow-Origin', '*');

        res.render('course_org/searchCourseOrg', {ecgeditorHost: config[env].ecgeditorHost});
    });
    //进入课程组织详细操作页面
    router.get('/opt', function (req, res) {
        //跨域
        res.header('Access-Control-Allow-Origin', '*');

        var type = req.query.optType;
        if(type == 'save'){
            res.render('course_org/saveCourseOrg', {
                ecgeditorHost: config[env].ecgeditorHost,
                courseId: req.query.courseId
            });
        }else {
            res.render('course_org/optCourseOrg', {
                ecgeditorHost: config[env].ecgeditorHost,
                engineHost: config[env].engineHost
            });
        }
    });
    //--------------------------------------courseOrg start----------------------------------------------
    //课程组织操作_保存
    router.post('/optCourseOrg/save', function(req, res){
        courseOrg.saveCourseOrg(req, res, mySQL);
    });
    //课程组织操作_删除
    router.post('/optCourseOrg/delete', function(req, res){
        courseOrg.deleteCourseOrg(req, res, mySQL);
    });

    //课程组织操作_更新
    router.post('/optCourseOrg/update', function(req, res){
        courseOrg.updateCourseOrg(req, res, mySQL);
    });

    // 课程组织操作_查询
    router.get('/optCourseOrg/search', function (req, res) {
        courseOrg.searchCourseOrg(req, res, mySQL);
    });

    //课程组织操作_查询学生可学的已组织好的课程列表
    router.get('/getMyOrgedCourses', function(req, res){
        courseOrg.searchMyOrgedCourses(req, res, mySQL);
    });

    //--------------------------------------courseOrg end----------------------------------------------
    //--------------------------------------courseOrgStructure start----------------------------------------------
    //课程组织结构操作_检查分组名称
    router.post('/optCourseOrgStructure/checkGroupName', function(req, res){
        courseOrg.checkGroupName(req, res, mySQL);
    });
    //课程组织结构操作_保存
    router.post('/optCourseOrgStructure/save', function(req, res){
        courseOrg.saveCourseOrgStructure(req, res, mySQL);
    });
    //课程组织结构操作_删除
    router.post('/optCourseOrgStructure/delete', function(req, res){
        courseOrg.deleteCourseOrgStructure(req, res, mySQL);
    });
    //课程组织人员操作_保存
    router.post('/optCourseOrgStructure/update', function(req, res){
        courseOrg.updateCourseOrgStructure(req, res, mySQL);
    });
    // 课程组织结构操作_查询
    router.post('/optCourseOrgStructure/search', function (req, res) {
        courseOrg.searchCourseOrgStructure(req, res, mySQL);
    });

    //--------------------------------------courseOrgStructure end----------------------------------------------
    //--------------------------------------courseOrgUser start----------------------------------------------
    //课程组织人员操作_保存
    router.post('/optCourseOrgUser/save', function(req, res){
        courseOrg.saveCourseOrgUser(req, res, mySQL);
    });
    //课程组织人员操作_保存
    router.post('/optCourseOrgUser/update', function(req, res){
        courseOrg.updateCourseOrgUser(req, res, mySQL);
    });
    //课程组织人员操作_删除
    router.post('/optCourseOrgUser/delete', function(req, res){
        courseOrg.deleteCourseOrgUser(req, res, mySQL);
    });
    //课程组织人员操作_查询
    router.post('/optCourseOrgUser/search', function (req, res) {
        courseOrg.searchCourseOrgUser(req, res, mySQL);
    });

    router.post('/optCourseOrgUser/searchAllOrgedUsers', function (req, res) {
        courseOrg.searchAllOrgedUsers(req, res, mySQL);
    });

    //对外, 非实时监控获取课程组织的学生
    router.get('/optCourseOrgUser/searchUsers', function (req, res) {
        courseOrg.searchUsers(req, res, mySQL);
    });


    //-----------------------------------------------------TEST-------------------------------------------------------
    router.post('/getAllUsers', function(req, res){
        courseOrg.getAllUsers(req, res, mySQL);
    });
    router.post('/getAllOrgs', function(req, res){
        courseOrg.getAllOrgs(req, res, mySQL);
    });
    router.get('/study', function(req, res){
        res.render('course_player/study_course');
    });
}else{
    console.log('error : can not connect mySql !');
}

module.exports = router;