/**
 * Created by admin on 2016/8/9.
 */
var express = require('express');
var config = require('../config/config.json');
var CN = require('./language_CN.js');
var http = require('http');
var url = require('url');
var mode = global.orgENV;
var path = require('path');

var router = express.Router();

router.get('/ongoing', renderOngoing);

router.get('/finished', renderFinished);

router.get('/notOrg', renderNotOrg);

router.get('/config', modeConfig);

router.get('/searchLearnInfo', renderLearnInfo);

router.get('/getStudentLearningInfo', getStudentLearningInfo);

router.get('/orgCourseInstance', renderOrgCourseInstance);

router.get('/courseRecord', renderCourseRecord);

router.get('/courseScore', renderCourseScore);

router.get('/courseScoreIndex', renderCourseScoreIndex);

router.get('/getOptions', getOptions);

router.get('/getUsers', getUsers);

router.post('/getUsersByOrgId', getUsersByOrgId);

router.post('/getCourseTree', getCourseTree);

function modeConfig(req, res) {
    var data = {};
    data.mode = mode;
    data.ecgeditor = config.ecgeditor[mode];
    data.coursePlayer = config.coursePlayer[mode];
    if (req.session.userData) {
        data.userId = req.session.userData.id;
    }
    res.send(data);
}

function renderNotOrg(req, res) {
    var userId, userName;
    if (req.session.userData) {
        userId = req.session.userData.id;
        userName = req.session.userData.name;
    }
    res.render('course_search/notOrg', {
        userId : userId,
        userName : userName,
        ecgeditor : config.ecgeditor[mode],
        coursePlayer : config.coursePlayer[mode]
    });
}

function renderOngoing (req, res) {
    var userId, userName;
    if (req.session.userData) {
        userId = req.session.userData.id;
        userName = req.session.userData.name;
    }
    res.render('course_search/ongoing', {
        userId : userId,
        userName : userName,
        courseOrg : config.courseOrg[mode],
        coursePlayer : config.coursePlayer[mode]
    });
}

function renderFinished(req, res) {
    var userId, userName;
    if (req.session.userData) {
        userId = req.session.userData.id;
        userName = req.session.userData.name;
    }
    res.render('course_search/finished', {
        userId : userId,
        userName : userName,
        courseOrg : config.courseOrg[mode],
        coursePlayer : config.coursePlayer[mode]
    });
}

function renderLearnInfo(req, res) {
    var filePath = path.join(__dirname, '../../../views/course_search/searchLearnInfo.html');
    res.sendFile(filePath);
}

function renderOrgCourseInstance(req, res) {
    var filePath = path.join(__dirname, '../../../views/course_search/orgCourseInstance.html');
    res.sendFile(filePath);
}

function renderCourseRecord(req, res) {
    var filePath = path.join(__dirname, '../../../views/course_search/courseRecord.html');
    res.sendFile(filePath);
}

function renderCourseScore(req, res) {
    var filePath = path.join(__dirname, '../../../views/communication/course_score/courseScore.html');
    res.sendFile(filePath);
}

function renderCourseScoreIndex(req, res) {
    var filePath = path.join(__dirname, '../../../views/communication/course_score/index.html');
    res.sendFile(filePath);
}

function getStudentLearningInfo(req, res) {
    var userId;
    if (req.session.userData) {
        userId = req.session.userData.id;
    }

    var strUrl = config.coursePlayer[mode];
    var parse = url.parse(strUrl);

    var options = {
        method: "GET",
        host: parse.hostname,
        port: parse.port,
        path: "/index.php/apps/courseplayer/getNoOrgByUser?userId=" + userId,
        headers: {
            "Content-Type": 'application/json;charset=UTF-8',
            "Accept": 'application/json',
            "Authorization": "Basic " + (new Buffer('admin:123')).toString('base64')
        }
    };

    if (mode === 'prod' || mode === 'dev') {
        options.headers.Authorization = "Basic " + (new Buffer('root:admin@root0')).toString('base64');
    }

    var newReq = http.request(options, function (newRes) {
        var data = '';

        newRes.on('data', function (chunk) {
            data += chunk;
        });
        newRes.on('end', function () {
            try{
                data = JSON.parse(data);
            } catch (e) {

            }
            res.send({
                data : data
            });
        });

    });

    newReq.end();

    newReq.on('error', function (e)
    {
        console.log('error');
        console.log(e);
        res.send({
            error: e
        });
    });
}

function getOptions(req ,res) {
    var userId = req.query.userId,
        orgId = req.query.orgId,
        courseId = req.query.courseId,
        parse = url.parse(config.coursePlayer[mode]),
        data= {
            host: parse.hostname,
            port: parse.port,
            data: {
                courseId: courseId,
                userId: userId || null
            }
        };

    if (orgId) {
        data.path = "/index.php/apps/courseplayer/findOptionsByOrgId?userId=" + userId + '&orgId=' + orgId;
        data.type = 'get';
    } else {
        data.path = '/index.php/apps/courseplayer/findOptionsByCourseId';
        data.type = 'post';
    }
    proxy(res, data);
}

function getUsers(req, res) {
    var parse = url.parse(config.coursePlayer[mode]),
        data = {
            host: parse.hostname,
            port: parse.port,
            path: "/index.php/apps/courseplayer/findStudents/" + req.query.courseId,
            type: 'get'
        };
    proxy(res, data);
}

function getUsersByOrgId(req, res) {
    var parse = url.parse(config.coursePlayer[mode]),
        data = {
            host: parse.hostname,
            port: parse.port,
            path: "/index.php/apps/courseplayer/getOrg",
            type: 'post',
            data: {
                orgId: req.body.orgId
            }
        };
    proxy(res, data);
}

function getCourseTree(req, res) {
    var parse = url.parse(config.coursePlayer[mode]),
        data = {
            host: parse.hostname,
            port: parse.port,
            path: "/index.php/apps/courseplayer/getCourseTree",
            type: 'post',
            data: {
                courseIds: JSON.parse(req.body.courseIds)
            }
        };
    proxy(res, data);
}


function proxy(res, obj) {
    obj.type = (obj.type || '').toUpperCase();
    var options = {
        method: obj.type,
        host: obj.host,
        port: obj.port,
        path: obj.path,
        headers: {
            "Content-Type": 'application/json;charset=UTF-8',
            "Accept": 'application/json',
            "Authorization": "Basic " + (new Buffer('admin:123')).toString('base64')
        }
    };

    if (typeof obj.headers === 'object') {
        options.headers = obj.headers;
    }

    if (mode === 'prod' || mode === 'dev') {
        options.headers.Authorization = "Basic " + (new Buffer('root:admin@root0')).toString('base64');
    }

    var newReq = http.request(options, function (newRes) {
        var data = '';

        newRes.on('data', function (chunk) {
            data += chunk;
        });
        newRes.on('end', function () {
            try{
                data = JSON.parse(data);
            } catch (e) {

            }
            res.send(data);
        });

    });

    if (obj.type === 'POST') {
        newReq.write(JSON.stringify(obj.data));
    }

    newReq.end();

    newReq.on('error', function (e)
    {
        console.log(e);
        res.send({error: e});
    });
}


module.exports = router;

