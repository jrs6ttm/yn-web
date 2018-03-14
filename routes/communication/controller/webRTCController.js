/**
 * Created by admin on 2016/8/5.
 */
var express = require('express');
var config = require('../config/config.json');

var router = express.Router();

router.get('/', renderWebRTC);

function renderWebRTC(req, res) {
    var userId, userName;
    userId = req.query.userId;
    userName = req.query.userName;
    //if (req.session.userData) {
    //    userId = req.session.userData.id;
    //    userName = req.session.userData.name;
    //}
    res.render('communication/webRTC', {
        userId : userId,
        userName : userName,
        socketPort : config.socketPort[config.runMode]
    });
}


module.exports = router;

