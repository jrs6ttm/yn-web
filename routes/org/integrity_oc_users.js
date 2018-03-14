var express = require('express');
var router = express.Router();
//var config = require('../../config/config.json');
var config = require('../../config.json');
var uuid =  require('node-uuid');
var async = require("async");
var JSON =  require("JSON");

//var OCDB = require('./model/OCdb');
//var examPage = require('./model/examPage');
//var examQuestion = require('./model/examQuestion');
var http = require('http');
var querystring = require('querystring');
var app = express();
var env = global.orgENV;

console.log('Ajax_searchUsers env:', env );

/* GET home page. */
router.get('/', function(req, res, next) {


    //获取session user
    var userID = req.session.userData.id;
    console.log('USERid:' + userID );
    var data = {};
    var moment = require("moment");

    data.uid = req.body['uid'];
    data.displayname = req.body['displayname'];
    data.email = req.body['email'];

    console.log(data);

    var mysql = require('mysql');
    var mysqlConf=config[env]['OC_mysql'];
    mysqlConf.database = config[env]['OC_dataBase']['owncloud_dev3'];
    console.log(mysqlConf);
    var connection = mysql.createConnection(mysqlConf);

    connection.connect();


    var sql = "select * from `oc_users` where  synid ='' ";

    console.log(sql)
    connection.query(sql, function(err,docs){
        console.log(docs);
        if(err) { console.log(err); res.send({des:err ,  status : '404'});  }
        else
        {
            async.eachSeries(docs, function(doc, callback) {  //填充所有的synid为空的数据
                if(doc.synid == '')
                {
                    var sqltmp = "UPDATE `oc_users` SET `synid`=`uid` WHERE `uid`='" + doc.uid + "' ";
                    connection.query(sqltmp, function(err,docs){  callback();  });

                } else { callback();  }


            }, function(err){

                console.log(err);
                res.send({docData:docs , status : '200'});

            }); //async.eachSeries END

        }
    });  // connection.query end



});

module.exports = router;









