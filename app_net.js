var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var Config = require('./config/config.json');
var Config = require('./config.json');

//var sessionControl = require('./session/sessionControl');




var redis =	require("redis");

var session = require('./node_modeles_ext/express-session');
var redisStore = require('./node_modeles_ext/connect-redis')(session);
//var session = require('express-session');
//var redisStore = require('connect-redis')(session);

var app = express();

app.set('env' , Config['runMode']) ;
 
//*****env 环境模式： dev：本机 ， joint：192.168.1.155联合调试， prod: 192.168.1.114瑞星试用，production:..ip未知..产品使用 ******//
var os = require('os'); 
//console.log(env);


var IPv4,hostName;
var production_ENV='';


var prod_ENV="192.168.1.114__192.168.0.29";
var joint_ENV="192.168.1.155__";


/*
if(os.networkInterfaces().eth0) {
    for(var i=0;i<os.networkInterfaces().eth0.length;i++){
        if(os.networkInterfaces().eth0[i].family=='IPv4'){
          IPv4=os.networkInterfaces().eth0[i].address;
            if(joint_ENV.indexOf(IPv4) != -1 )  app.set('env' ,'joint') ;
            else if(prod_ENV.indexOf(IPv4) != -1)  app.set('env' ,'prod') ;
            else if(production_ENV.indexOf(IPv4) != -1)  app.set('env' ,'production') ;
            else app.set('env' ,'dev') ;
        } //if end
    } //for end 

} else { //默认为本机开发
   console.log(os.networkInterfaces());
   app.set('env' ,'dev') ;
}
*/

hostName=os.hostname();
//console.log(os.networkInterfaces() );

console.log('----------OS Type: '+os.type());
console.log('----------local host: '+hostName);
console.log('----------local IP: '+IPv4);

var env=app.get('env');
global.orgENV=env;
console.log('----------NODE ENV: ', env  ) ;
var client = redis.createClient(Config[env]['redis']['port'],Config[env]['redis']['url']);

client.on("error", function (err) {
    console.log("Redis Client Error : " + err);
});
client.auth(Config[env]['redis']['password'], function(err, reply) {
	if(err){
		console.log("Redis Auth Error : " + err);
	}
});

console.log('redis配置信息,端口:', Config[env]['redis']['port'],"IP:" , Config[env]['redis']['url'], 'password:', Config[env]['redis']['password']);

//client.get("PHPREDIS_SESSION:F5dRZXLr01pmnGLmRzUQxIF2bs_oj75x", function(err, reply) {
 //       console.log(" AAAAA : " , reply);
//});

// client.set("stringkey3", JSON.stringify({aa:'aa'}) , redis.print);

// client.get("stringkey3",function(err,reply){
//   console.log(JSON.parse(reply) );
// })
//********Redis的Session设置****//

/*
client.set("string key", "string val", redis.print);
client.hset("hash key", "hashtest 1", "some value", redis.print);
client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
client.hkeys("hash key", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
    //client.quit();
});
*/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.set('view options', { pretty: true });
 app.use( session({
    secret: Config[env]['redis']['secret'],
    store: new  redisStore({
       client: client,
       //prefix: Config[env]['redis']['prefix'],    
       ttl : 26000}),
    saveUninitialized: false,
    resave: false
}));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var phpPath='', cookiesValue = '';

var INpath = ['/' , '/app/checkuser' , '/app/checkreguser' , '/app/checkorgdes' ,'/app/adduser', '/app/logout' ,
      '/addViewTimes', '/saveCourse', '/getCourseType', '/getPopularCourses', '/getSession', '/getConfig', '/getCourseInfo','/course','/situation'
      ];
app.use(function (req, res, next) {
  var bathPath = req.path;
//console.log('7777:', req );
//req.session.user_id= 3;  connect.sid
var val =JSON.stringify(req.cookies); 
//console.log('----------环境模式: '+ env);
//console.log(req._parsedOriginalUrl.pathname);
//console.log('Cookies:' + val);
//console.log('----------用户数据: ',req.session );
  //req.session.test='Test';


  //console.log(req.session);
  // sessionControl.getSession(phpPath,cookiesValue , function(flag,doc){

  //console.log(req.session.user_id)
   // req.session.aa = 'aa';
   
    if( req.session.userData || INpath.indexOf(bathPath) > -1 ) {
        console.log('Session验证通过');
        // req.session.userData.orgID = "5468af60-b540-11e6-bfb6-c9a79e6f810d";
        next();
　   }  else {  //重定向登录界面
        res.send({status:'500', err: 'Session验证未通过'});
　   }



 // }); //sessionControl end 

});



//********验证Session end *****//

var appController = require('./routes/app/controller');

/****通讯模块****/
var webRTCController = require('./routes/communication/controller/webRTCController');
var monitorController = require('./routes/communication/controller/monitorController');
var courseSearch = require('./routes/communication/controller/courseSearchController');

/****通讯模块  END****/

var routes = require('./routes/home/index');
var users = require('./routes/home/users');

/****课程组织 ****/
//var course_org = require('./routes/course_org/courseOrg.js');

var course_org = require('./routes/course_org/route.js');
/****课程组织  END****/

//*******用户登录相关*******//

var checkuser = require('./routes/app/checkuser');
var adduser = require('./routes/app/adduser');

console.log("--------------------------app_net.js--------------------------------");

// var getsessioninfo = require('./routes/app/getsessioninfo');
// var checkreguser = require('./routes/app/checkreguser');  
// var checkorgdes = require('./routes/app/checkorgdes');
// var getuserinfo = require('./routes/app/getuserinfo');
// var updateuserinfo = require('./routes/app/updateuserinfo'); 
// var getorginfo = require('./routes/app/getorginfo'); 
// var updateorginfo = require('./routes/app/updateorginfo'); 
// var setuserdefaultorgrole= require('./routes/app/setuserdefaultorgrole'); 
// var addapp = require('./routes/app/addapp'); 
// var insertapp = require('./routes/app/insertapp'); 
// var getapps = require('./routes/app/getapps'); 
// var updateapp = require('./routes/app/updateapp'); 
// var addfuns = require('./routes/app/addfuns'); 
// var insertfun = require('./routes/app/insertfun'); 
// var updatefun = require('./routes/app/updatefun'); 
// var getappfuns = require('./routes/app/getappfuns'); 
// var orgappassign = require('./routes/app/orgappassign'); 
// var getorgapps = require('./routes/app/getorgapps'); 
// var updateorgapp = require('./routes/app/updateorgapp'); 
// var changerole = require('./routes/app/changerole'); 

// //代理人的
// var orgdepedit = require('./routes/app/orgdepedit');
// var orgroleapp = require('./routes/app/orgroleapp');
// var getOrgRoleApp = require('./routes/app/getOrgRoleApp');
// var logout = require('./routes/app/logout');  

//*******用户登录相关  END*******//





//*******组织机构管理*******//

// var org_edit = require('./routes/org/org_edit');
// var org_search = require('./routes/org/org_search');
// var orgDep_edit = require('./routes/org/orgDep_edit');
// var Ajax_insertOrj = require('./routes/org/Ajax_insertOrj');
// var Ajax_updateOrj = require('./routes/org/Ajax_updateOrj');
// var Ajax_searchOrg = require('./routes/org/Ajax_searchOrg');
// var Ajax_getOrgTree = require('./routes/org/Ajax_getOrgTree');
// var Ajax_getOrgTree_read = require('./routes/org/Ajax_getOrgTree_read');
// var Ajax_addDept = require('./routes/org/Ajax_addDept');
// var Ajax_updateDept_arry = require('./routes/org/Ajax_updateDept_arry');
// var Ajax_searchUsers = require('./routes/org/Ajax_searchUsers');
// var Ajax_delOrg = require('./routes/org/Ajax_delOrg');
// var Ajax_delDept = require('./routes/org/Ajax_delDept');
// var Ajax_insertUser_arry = require('./routes/org/Ajax_insertUser_arry');
// var Ajax_insertUser_arry_myOrg = require('./routes/org/Ajax_insertUser_arry_myOrg');
// var Ajax_updateDeptPeo_json = require('./routes/org/Ajax_updateDeptPeo_json');
// var Ajax_insertUser = require('./routes/org/Ajax_insertUser');
// var Ajax_depUserRead_V2 =  require('./routes/org/Ajax_depUserRead_V2');
// var Ajax_depUserRead =  require('./routes/org/Ajax_depUserRead');
// var Ajax_depUserUpdate =  require('./routes/org/Ajax_depUserUpdate');
// var Ajax_depUserDestroy = require('./routes/org/Ajax_depUserDestroy');
// var Ajax_depUserDestroy_myOrg = require('./routes/org/Ajax_depUserDestroy_myOrg');
// var Ajax_orgSearchDep = require('./routes/org/Ajax_orgSearchDep');
// var Ajax_orgSearchDepUsers = require('./routes/org/Ajax_orgSearchDepUsers');
// var Ajax_userDep_V2 =  require('./routes/org/Ajax_userDep_V2');
// var org_role = require('./routes/org/org_role');
// var myOrg = require('./routes/org/myOrg');
// var Ajax_addRole =  require('./routes/org/Ajax_addRole');
// var Ajax_delRole =  require('./routes/org/Ajax_delRole');
// var Ajax_updateRole =  require('./routes/org/Ajax_updateRole');
// var org_roleapp = require('./routes/org/org_roleapp');
// var Ajax_getRoleApp =  require('./routes/org/Ajax_getRoleApp');
// var Ajax_updateRoleApp =  require('./routes/org/Ajax_updateRoleApp');
// var Ajax_updateDefine = require('./routes/org/Ajax_updateDefine');
// var Ajax_getUserApp =  require('./routes/org/Ajax_getUserApp');
// var Ajax_getorglist =  require('./routes/org/Ajax_getorglist');
// var org_roletop = require('./routes/org/org_roletop');
// var Ajax_addRole_top =  require('./routes/org/Ajax_addRole_top');
// var Ajax_setRoleType =  require('./routes/org/Ajax_setRoleType');
// var org_roleapptop =  require('./routes/org/org_roleapptop');
// var Ajax_getRoleApptop =  require('./routes/org/Ajax_getRoleApptop');
// var Ajax_getOrgRoles = require('./routes/org/Ajax_getOrgRoles');


// //---***** 接口
// var Ajax_getUserOrg = require('./routes/org/Ajax_getUserOrg');  //获取用户的组织信息
// var Ajax_getUserDepAndChild = require('./routes/org/Ajax_getUserDepAndChild');  //获取用户所有机构及子机构的结点
// //获取机构下的用户信息，可以复用上面的接口： var Ajax_depUserRead =  require('./routes/org/Ajax_depUserRead');
//
// var Ajax_depUserRead_V3 =  require('./routes/org/Ajax_depUserRead_V3');
//
// var Ajax_proxy_test =  require('./routes/org/Ajax_proxy_test');


//---*****UI 测试
//var Ajax_UItest_tree =  require('./routes/org/Ajax_UItest_tree');

  //----*** OC服务
var OC_Ajax_searchOrg= require('./routes/org/OC_Ajax_searchOrg');

//var integrity_oc_users = require('./routes/org/integrity_oc_users');


  //----*** OC服务   end

//*******结束*******//



app.use('/', routes);

/****app模块****/

app.use('/app', appController);

/****app模块****/

/****通讯模块****/
app.use('/communication/webRTC', webRTCController);
app.use('/communication/monitor', monitorController);
app.use('/courseSearch', courseSearch);

/****通讯模块****/


/****课程组织 ****/
app.use('/CourseOrg', course_org);
/****课程组织  END ****/




//*******用户登录相关*******//

app.use('/app/checkuser', checkuser);
app.use('/app/adduser', adduser);


// app.use('/app/getsessioninfo', getsessioninfo);
// app.use('/app/checkreguser', checkreguser);
// app.use('/app/checkorgdes', checkorgdes);
// app.use('/app/getuserinfo', getuserinfo);
// app.use('/app/updateuserinfo', updateuserinfo);
// app.use('/app/getorginfo', getorginfo);
// app.use('/app/updateorginfo', updateorginfo);
// app.use('/app/setuserdefaultorgrole', setuserdefaultorgrole);
// app.use('/app/addapp', addapp);
// app.use('/app/insertapp', insertapp);
// app.use('/app/getapps', getapps);
// app.use('/app/updateapp', updateapp);
// app.use('/app/addfuns', addfuns);
// app.use('/app/insertfun', insertfun);
// app.use('/app/updatefun', updatefun);
// app.use('/app/getappfuns', getappfuns);
// app.use('/app/orgappassign', orgappassign);
// app.use('/app/getorgapps', getorgapps);
// app.use('/app/updateorgapp', updateorgapp);
// app.use('/app/changerole', changerole);


// //代理人
// app.use('/app/orgdepedit', orgdepedit);
// app.use('/app/orgroleapp', orgroleapp);
// app.use('/app/getOrgRoleApp', getOrgRoleApp);
// app.use('/app/logout', logout);




//*******用户登录相关  END*******//




//*******组织机构*******//
var orgindex = require('./routes/org/orgindex');
app.use('/org',orgindex);


//app.use('/org/org_edit', org_edit);
// app.use('/org/org_search', org_search);
//app.use('/org/orgDep_edit', orgDep_edit);

//app.use('/org/Ajax_insertOrj', Ajax_insertOrj);
//app.use('/org/Ajax_updateOrj', Ajax_updateOrj);
//app.use('/org/Ajax_searchOrg', Ajax_searchOrg);
//app.use('/org/Ajax_getOrgTree', Ajax_getOrgTree);
//app.use('/org/Ajax_getOrgTree_read', Ajax_getOrgTree_read);
//app.use('/org/Ajax_addDept', Ajax_addDept);
//
// app.use('/org/Ajax_updateDept_arry', Ajax_updateDept_arry);
// app.use('/org/Ajax_insertUser_arry_myOrg', Ajax_insertUser_arry_myOrg);
// app.use('/org/Ajax_searchUsers', Ajax_searchUsers);
// app.use('/org/Ajax_delOrg', Ajax_delOrg);
// app.use('/org/Ajax_delDept', Ajax_delDept);
// app.use('/org/Ajax_insertUser_arry', Ajax_insertUser_arry);
// app.use('/org/Ajax_updateDeptPeo_json', Ajax_updateDeptPeo_json);
// app.use('/org/Ajax_depUserRead_V2', Ajax_depUserRead_V2);
// app.use('/org/Ajax_depUserRead', Ajax_depUserRead);
// app.use('/org/Ajax_depUserUpdate', Ajax_depUserUpdate);
// app.use('/org/Ajax_depUserDestroy', Ajax_depUserDestroy);
// app.use('/org/Ajax_depUserDestroy_myOrg', Ajax_depUserDestroy_myOrg);
// app.use('/org/Ajax_orgSearchDep', Ajax_orgSearchDep);
// app.use('/org/Ajax_orgSearchDepUsers', Ajax_orgSearchDepUsers);
// app.use('/org/Ajax_userDep_V2', Ajax_userDep_V2);
// app.use('/org/org_role', org_role)     ;
// app.use('/org/myOrg', myOrg);
// app.use('/org/Ajax_addRole', Ajax_addRole);
// app.use('/org/Ajax_delRole', Ajax_delRole);
// app.use('/org/Ajax_updateRole', Ajax_updateRole);
// app.use('/org/org_roleapp', org_roleapp);
// app.use('/org/Ajax_getRoleApp', Ajax_getRoleApp);
// app.use('/org/Ajax_updateRoleApp', Ajax_updateRoleApp);
// app.use('/org/Ajax_updateDefine', Ajax_updateDefine);
// app.use('/org/Ajax_getUserApp', Ajax_getUserApp);
// app.use('/org/Ajax_getorglist', Ajax_getorglist);
// app.use('/org/org_roletop', org_roletop);
// app.use('/org/Ajax_addRole_top', Ajax_addRole_top);
// app.use('/org/Ajax_setRoleType', Ajax_setRoleType);
// app.use('/org/org_roleapptop', org_roleapptop);
// app.use('/org/Ajax_getRoleApptop', Ajax_getRoleApptop);
// app.use('/org/Ajax_getOrgRoles', Ajax_getOrgRoles);


//--**
// var test = require('./routes/UItest/test');
// app.use('/org/Ajax_UItest_tree', Ajax_UItest_tree);
// app.use('/UItest/test', test);


  //----*** OC服务

app.use('/org/OC_Ajax_searchOrg', OC_Ajax_searchOrg);
//app.use('/org/integrity_oc_users', integrity_oc_users);

  //----*** OC服务   end


//---*** 接口
// app.use('/org/Ajax_getUserOrg', Ajax_getUserOrg);
// app.use('/org/Ajax_getUserDepAndChild', Ajax_getUserDepAndChild);
// app.use('/org/Ajax_depUserRead_V3', Ajax_depUserRead_V3);
// app.use('/org/Ajax_proxy_test', Ajax_proxy_test);


//***********************

var coursePro = require('./routes/course_pro/courseProController');
app.use('/coursePro', coursePro);

// error handlers

// development error handler
// will print stacktrace
if (env === 'development' || env === 'dev' || env === 'joint' || env === 'prod'   ) {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//var https = require('https');
//var fs = require('fs');
//var crt = fs.readFileSync('../../useCase/webservice/ssl/org.xuezuowang.com.crt', 'utf-8');
//var key = fs.readFileSync('../../useCase/webservice/ssl/org.xuezuowang.com.key', 'utf-8');
//https.createServer({'cert': crt, 'key': key},app).listen(9189, function() {
//    console.log('server is listening at 9189');
//});

//启动服务器
var server = app.listen(Config[env]["port"], function () {
  
  console.log('App listening at %s', Config[env]["port"]);
});

//socketServer.createOnStartSocketServer(server);

//socket.startSocketIo(server, env);

module.exports = app;

