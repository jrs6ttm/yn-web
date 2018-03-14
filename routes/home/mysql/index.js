/**
 * Created by 78462 on 2017/2/7.
 */
var express = require('express');
var router = express.Router();
var path = require('path');

   function headers(res){
        res.header('Access-Control-Allow-Origin', '*');
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
        res.header("Content-Type", "application/json;charset=utf-8");
        res.header("Set-Cookie", "path=/; domain=.learn.com; httponly");

    }  



/* GET home page. */
router.get('/', function(req, res, next) {
    headers(res);
    var filePath = path.join(__dirname, '../../../views/app/html', 'app.html');
    res.sendFile(filePath);



});

router.get('/personalInfo', function(req, res, next) {
    headers(res);
    var filePath = path.join(__dirname, '../../../views/app/html', 'personalInfo.html');
    res.sendFile(filePath);

});




























module.exports = router;