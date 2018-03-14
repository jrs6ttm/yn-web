/**
 * Created by admin on 2016/12/19.
 */
var express = require('express');
var config = require('../config/config.json');
var mode = global.orgENV;
var path = require('path');

var router = express.Router();

router.get('/config', modeConfig);

router.get('/:name', render);

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

function render(req, res) {
    var name = req.params.name;
    var filePath = path.join(__dirname, '../../../views/course_search/' + name +'.html');
    res.sendFile(filePath);
}

module.exports = router;