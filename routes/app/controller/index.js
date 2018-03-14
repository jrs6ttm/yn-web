/**
 * Created by 78462 on 2017/2/7.
 */
var express = require('express');
var router = express.Router();
//var config = require('../../../config/config.json');
var config = require('../../../config.json');
var path = require('path');
var uuid =  require('node-uuid');
var crypto = require('crypto');
var EventProxy = require('eventproxy');
var user = require('../model/user');
var async = require('async');


var orgDeptPeo =  require('../model/orgDeptPeo');
var orgInfo = require('../model/orgInfo');
var roleapp = require('../model/roleapp');
var orgInfo =  require('../model/orgInfo');
var bsd_app = require('../model/app');
var funs = require('../model/funs');
var appconfig = require('../model/appConfig');
var orgapp = require('../model/orgapp');

var env =global.orgENV;

function headers(res,req){


    var cookies =  req.cookies , setCookie = '';
    for(var key in cookies)  setCookie = setCookie + key + "=" + cookies[key] + ";";
console.log("----------------setCookie:" + setCookie)
    setCookie = setCookie  + " path=/; domain=" + config[env].domain +";path=/; httponly";
    //console.log("setCookie:",setCookie);
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    //res.header("Content-Type", "application/json;charset=utf-8");
    res.header("Set-Cookie", setCookie);

}





/* GET home page. */
router.get('/', function(req, res, next) {
    headers(res,req);
    var filePath = path.join(__dirname, '../../../views/app/html', 'app.html');
	console.log("-----------home2-------------------");
    res.sendFile(filePath);

});

router.get('/personalInfo', function(req, res, next) {
    headers(res,req);
    var filePath = path.join(__dirname, '../../../views/app/html', 'personalInfo.html');
    res.sendFile(filePath);

});


// /*******用户登录相关*******/


function headers_V2(res){
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
}


router.post('/getsessioninfo', getsessioninfo);
router.post('/checkreguser', checkreguser);
router.post('/checkorgdes', checkorgdes);
router.post('/getuserinfo', getuserinfo);
router.post('/updateuserinfo', updateuserinfo);
router.post('/getorginfo', getorginfo);
router.post('/updateorginfo', updateorginfo);
router.post('/setuserdefaultorgrole', setuserdefaultorgrole);
router.get('/addapp', addapp);
router.post('/insertapp', insertapp);
router.post('/getapps', getapps);
router.post('/updateapp', updateapp);
router.get('/addfuns', addfuns);
router.post('/insertfun', insertfun);
router.post('/updatefun', updatefun);
router.post('/getappfuns', getappfuns);
router.get('/orgappassign', orgappassign);
router.post('/getorgapps', getorgapps);
router.post('/updateorgapp', updateorgapp);
router.post('/changerole', changerole);


//代理人
router.get('/orgdepedit', orgdepedit);
router.get('/orgroleapp', orgroleapp);
router.get('/getOrgRoleApp', getOrgRoleApp);
router.post('/logout', logout);
router.get('/logout', logout);




//获取session信息
function getsessioninfo(req,res, next) {
    headers(res,req);
    if(req.session.userData) {
        var datas = {
            status: '200' ,
            userId : req.session.userData.id,
            userData: req.session.userData.userinfo   ,
            nav: req.session.userData.nav ,
            personal:  req.session.userData.personal ,
            roles:req.session.userData.roles  };
        res.send(datas);
    } else {
        res.send({ status: '500' , err:'session未通过'  });
    }

}


//检查用户注册
function checkreguser(req,res, next) {
cosole.log('-----------------checkreguser------------------------');
    headers(res);
    
    var username =  req.body.username;
    var email =  req.body.email;
    var type =  req.body.type;
  console.log("-------------username:" + username + ", email:" + email + ", type:" + type);
    if(type == '0' &&  (  !username  && !email  )  ) return  res.send({err:"username, email不能全为空" ,  status : '404'});
    
   if(username) { //检测用户名
        var tmpdata={uid:username};
        user.searchData_Json(tmpdata,function(err,docs){
            if(err)  return res.send({err:err,  status : '404'});

            if(docs.length > 0) return res.send({err:"用户名已存在",  status : '405'});
            else if(docs.length <= 0) { //如果用户名验证通过
                if(!email) return res.send({data:"用户名验证通过",  status : '200'});
                else {  //如果邮箱地址不为空
                    var tmpdata={email:email};
                    user.searchData_Json(tmpdata,function(err,docs){
                        if(err)  return res.send({err:err,  status : '404'});
                        if(docs.length > 0) return res.send({err:"邮箱已存在",  status : '406'});
                        else  return res.send({data:"用户名和邮箱验证通过",  status : '200'});
                    }); //user.searchData_Json  end
                } //if end
            } //if end
        }); //user.searchData_Json  end

   } else if(email) {  //检测邮箱

        var tmpdata={email:email};
        //console.log('检测邮箱',tmpdata);
        user.searchData_Json(tmpdata,function(err,docs){
            if(err)  return res.send({err:err,  status : '404'});
            if(docs.length > 0) return res.send({err:"邮箱已存在",  status : '406'});
            else if(docs.length <= 0)  return res.send({  status : '200'});
        });
   }


}





function checkorgdes(req,res, next) {
    headers_V2(res);
    var orgfulldes =  req.body.orgfulldes;

    if(!orgfulldes  )  return  res.send({err:"orgfulldes不能为空" ,  status : '404'});

    var tmpdata={orgFullDes:orgfulldes};
    orgInfo.searchData_Json(tmpdata,function(err,docs){
        if(err)  return res.send({err:err,  status : '404'});
        if(docs.length > 0) return res.send({err:"此企业名已被注册",  status : '407'});
        else if(docs.length <= 0)  return res.send({ status : '200'});
    }); //user.searchData_Json  end

}



function getuserinfo(req,res, next) {
    headers_V2(res);
    var synid = req.session.userData.id;
    if(synid == '' || synid == undefined  )  return res.send({err:'用户ID数据不正确',  status : '404'});

    //var tmpdata={synid:synid};
    var sqlstr = "select displayname , email  from oc_users where synid = '" + synid + "'  "
    user.toSQL(sqlstr,function(err,docs){
        if(err)  return res.send({err:err,  status : '404'});
        var datas = {displayname: docs[0].displayname  , email: docs[0].email , type:req.session.userData.type   };
        return res.send({ status : '200' , datas:datas });
    }); //user.searchData_Json  end


}



function updateuserinfo(req,res, next) {
    headers_V2(res);
    var synid = req.session.userData.id;
    var displayname = req.body.displayname;
    var email = req.body.email;
    var password = req.body.password;
    var data ={};
    if(!synid  ) return res.send({err:"未检测到当前登录用户",  status : '404'});
    if(!displayname  && !email  &&  !password  ) return res.send({err:"displayname,email,password参数不能为空",  status : '404'});

    if(displayname)   data.displayname = displayname;
    if(email)         data.email = email;
    if(password)      data.password = crypto.createHash('md5').update(password).digest('base64');

    user.updateData_Json(data,synid, function(err,doc){
        if(err) return res.send({err:err,  status : '404'});
        else  return res.send({ status : '200'});
    });

}


function getorginfo(req,res, next) {
    headers_V2(res);
    var orgID = req.session.userData.orgID;
    var type =  req.session.userData.type

    if(type != 2  ) return  res.send( {err:'您无权此操作',  status : '404'});
    if(orgID == '' || orgID == undefined  )  res.send({err:'未检测到登录用户的组织',  status : '404'});

    var tmpdata={orgID:orgID};
    orgInfo.searchData_Json(tmpdata,function(err,docs){
        if(err)  return res.send({err:err,  status : '404'});

        if(docs.length <= 0) return res.send({err:"此企业不存在",  status : '404'});
        else if(docs.length > 0) {
        var orgInfo ={
                orgCode: docs[0].orgCode ,
                orgFullDes: docs[0].orgFullDes ,
                orgShortDes: docs[0].orgShortDes ,
                legalPerson: docs[0].legalPerson ,
                tel1: docs[0].tel1 ,
                tel2: docs[0].tel2  ,
                address: docs[0].address ,
                schoolType: docs[0].schoolType  ,
                emailAdress:docs[0].emailAdress
                     };
        return res.send({datas:orgInfo , status : '200'});
        }

    }); //user.searchData_Json  end

}



function updateorginfo(req,res, next) {
    headers_V2(res);
    var orgID = req.session.userData.orgID;
    var type =  req.session.userData.type

    if(type != 2   ) return  res.send( {err:'您无权此操作',  status : '404'});
    if(orgID == '' || orgID == undefined  )  res.send({err:'未检测到登录用户的组织',  status : '404'});

    var orgCode = req.body.orgCode  ,orgFullDes =req.body.orgFullDes   , orgShortDes=req.body.orgShortDes ,schoolType =req.body.schoolType    ;
    var legalPerson= req.body.legalPerson , tel1=req.body.tel1 , tel2=req.body.tel2  , address=req.body.address  , emailAdress=req.body.emailAdress ;

    if(!orgCode  && !orgFullDes  && !orgShortDes && !schoolType  && !legalPerson  && !tel1  && !tel2  && !address  && !emailAdress )  return  res.send({err:"没有有效参数" ,  status : '404'});

    var tmpdata={ };
    if(orgCode) tmpdata.orgCode =orgCode ;
    if(orgFullDes) tmpdata.orgFullDes = orgFullDes;
    if(orgShortDes) tmpdata.orgShortDes = orgShortDes ;
    if(schoolType) tmpdata.schoolType = schoolType ;

    if(legalPerson) tmpdata.legalPerson = legalPerson ;
    if(tel1) tmpdata.tel1 = tel1 ;
    if(tel2) tmpdata.tel2 = tel2;
    if(address) tmpdata.address = address ;
    if(emailAdress) tmpdata.emailAdress = emailAdress ;

    console.log(tmpdata);

    orgInfo.updateData_Json(tmpdata,orgID ,function(err,doc){
        if(err)  return res.send({err:err,  status : '404'});
        else  return res.send({ status : '200'});

    }); //user.searchData_Json  end

}



function setuserdefaultorgrole(req,res, next) {
    headers_V2(res);

    var depUserID =  req.body.depUserID;
    var synid = req.session.userData.id;

    if(!synid  ) return res.send({err:"未检测到当前登录用户",  status : '404'});
    if(!depUserID  )  return  res.send({err:"depUserID参数传递不正确" ,  status : '404'});
    //if(req.session.userData.userinfo.type == '1'  )  return  res.send({err:"超级管理员账户不能切换角色" ,  status : '404'});
    var data = {};
    var tmpdata = {};
    orgDeptPeo.regainDefin( {synid:synid } , function(err, doc){
        if(err) res.send({err:err,  status : '404'});
        else {
          data.isDefault = '1';
          orgDeptPeo.updateData_Json( data , depUserID , function(err, doc){
              res.send({status : '200'});
          });
        } //if end
    }); //orgDeptPeo.updateData_Json end
}


function addapp(req,res, next) {
    res.render('app/addapp',{title:'添加功能'}  );
}


function insertapp(req,res, next) {
    headers_V2(res);
    var  appid = req.body.appid  ;
    var  name = req.body.name  ;
    var  svg = req.body.svg  ;
    var  hre = req.body.hre  ;
    var  ofadmin = req.body.ofadmin  ;
    var  position = req.body.position  ;
    var  blank= req.body.blank  ;

    console.log('data:',appid);
    if( !appid )  return  res.send({err:"appid数据不正确" ,  status : '404'});

    if( name=='' ||  ofadmin=='' ||  position=='' || name==undefined ||  ofadmin==undefined ||  position==undefined   ) return  res.send({err:"必选参数不能为空" ,  status : '404'});
    //console.log('A');
    var data={};
    data.appid = appid; data.name = name;  data.svg = svg; data.ofadmin = ofadmin;  data.position = position;

    if(hre != undefined) data.hre =hre;
    if(blank == '1') data.blank = '1';

    bsd_app.insertData(data,function(err,docs){
        if(err) return res.send({status : '404' ,  err:err });
        else return res.send({status : '200' });

    });  //bsd_app.insertData end

}



function getapps(req,res, next) {
    headers_V2(res);
    var sqlstr =  "select  appid , name  ,hre , blank , ofadmin ,position ,svg  from bsd_app where isvalid ='1'   ";

    bsd_app.toSQL(sqlstr , function(err,doc){
        if(err) return res.send({status : '404' ,  err:err });
        else return res.send({status : '200' ,datas: doc });
    });
}


function updateapp(req,res, next) {
    headers_V2(res);
    var  appid = req.body.appid;
    var  name = req.body.name;
    var  svg = req.body.svg;
    var  hre = req.body.hre;
    var  ofadmin = req.body.ofadmin;
    var  position = req.body.position;
    var  blank = req.body.blank;
    var  isvalid = req.body.isvalid;


    if(appid=='' || appid==undefined ) return  res.send({err:"appid不正确" ,  status : '404'});
    var data ={appid:appid};
    if(name!='' && name!=undefined ) data.name = name;
    if( svg!=undefined ) data.svg = svg ;
    if( hre!=undefined ) data.hre = hre ;
    if(ofadmin!='' && ofadmin!=undefined ) data.ofadmin = ofadmin;
    if(position!='' && position!=undefined ) data.position = position;
    if(blank!='' && blank!=undefined ) data.blank = blank;
    if(isvalid!='' && isvalid!=undefined ) data.isvalid = isvalid;

    console.log(data);
    bsd_app.updateData_Json(data,appid ,function(err,doc){
        if(err)  return res.send({err:err,  status : '404'});
        else  return res.send({ status : '200'});
    }); //user.searchData_Json  end

}


function addfuns(req,res, next) {
    res.render('app/addfuns',{title:'添加功能'}  );
}


function insertfun(req,res, next) {
    headers_V2(res);
    var  appid = req.body.appid  ;
    var  name = req.body.name  ;
    var  url = req.body.url  ;

    //console.log('data:',appid);
    if( name=='' ||  appid=='' ||  url=='' || name==undefined ||  appid==undefined ||  url==undefined   ) return  res.send({err:"必选参数不能为空" ,  status : '404'});
    var data={};
    data.appid = appid; data.name = name;  data.url = url;

    funs.insertData(data,function(err,doc){
    //console.log(docs);
        if(err) return res.send({status : '404' ,  err:err });
        else return res.send({status : '200' , datas: {funid:doc.insertId} });
    });  //bsd_app.insertData end

}


function updatefun(req,res, next) {
    headers_V2(res);
    var  funid= req.body.funid;
    var  name = req.body.name;
    var  url = req.body.url;
    var  isvalid = req.body.isvalid;

    if(funid=='' || funid==undefined ) return  res.send({err:"funid不正确" ,  status : '404'});
    if( (name=='' || name==undefined ) && (url=='' || url==undefined  ) && (isvalid=='' || isvalid==undefined  )  ) return  res.send({err:"参数传递不正确" ,  status : '404'});

    var data ={funid:funid};

    if(name!='' && name!=undefined ) data.name = name;
    if( url!='' && url!=undefined ) data.url = url ;
    if(isvalid!='' && isvalid!=undefined ) data.isvalid = isvalid;

    console.log(data);
    funs.updateData_Json(data,funid ,function(err,doc){
        if(err)  return res.send({err:err,  status : '404'});
        else  return res.send({ status : '200'});
    }); //user.searchData_Json  end

}



function getappfuns(req,res, next) {
    headers_V2(res);

    var appid = req.body.appid;
    if(appid == '' || appid==undefined )  return res.send({status : '404' ,  err:"appid数据不正确" });

    var sqlstr =  " select  funid , name  ,url   from bsd_funs where isvalid ='1' and  appid = '" + appid + "' ";

    funs.toSQL(sqlstr , function(err,doc){
        if(err) return res.send({status : '404' ,  err:err });
        else return res.send({status : '200' ,datas: doc });
    });

}




function orgappassign(req,res, next) {
    var data={};
    data.ISVALID = 1;
    data.orgID = req.session.userData.orgID;
    var j=0;
    var list='', status_str='';

    orgInfo.getOrg_option(function(err,optData){
        if(err) console.log(err);
        data.optionList =  optData.optionList;
        return  res.render('app/orgappassign.jade' , data);

    });

}


function getorgapps(req,res, next) {
headers_V2(res);

var orgID = req.body.orgID;

if(orgID=='' || orgID == undefined) return res.send({status : '404' ,  err:"orgID数据不正确" });
var sqlstr =  "CALL  m_initOrgApp('" + orgID + "') ";

bsd_app.toSQL(sqlstr , function(err,doc){
//console.log(doc);
    if(err) return res.send({status : '404' ,  err:err });
    var data =doc[0][0];
    //console.log(data);
    if(data.result != 1) return res.send({status : '404' ,  err:"数据初始化失败" });
    else {
        orgapp.getOrgApp(orgID,function(err,appdocs){
             if(err) return res.send({status : '404' ,  err:err });
             return res.send({status : '200' ,datas: appdocs });
        });
    }

});
}


function updateorgapp(req,res, next) {
    headers_V2(res);
    var  orgappid= req.body.oaid;
    var  isassign = req.body.isassign;

    if(orgappid=='' || orgappid==undefined ) return  res.send({err:"oaid不正确" ,  status : '404'});
    if( isassign=='' || isassign==undefined  ) return  res.send({err:"参数传递不正确" ,  status : '404'});

    var data ={orgappid:orgappid  , isassign:isassign };

    orgapp.updateData_Json(data,orgappid ,function(err,doc){
        if(err)  return res.send({err:err,  status : '404'});
        else  return res.send({ status : '200'});
    }); //user.searchData_Json  end

}



function changerole(req,res, next) {
    headers_V2(res);
    var depUserID =  req.body['depUserID'];
    var userID = req.session.userData.id;

    if(depUserID == '' || depUserID==undefined ) return  res.send({err:"depUserID不能为空" ,  status : '404'});

    var ep = new EventProxy();
    ep.all('setSession',function (epdatas ) {
        var  resDatas = epdatas.resDatas  ,  userinfo = epdatas.userinfo;

        req.session.userData={id: userinfo.synid ,  name: userinfo.uid , email: userinfo.email  , orgID: userinfo.orgID , type: userinfo.type , roleType:userinfo.roleType ,orgRoleID:userinfo.orgRoleID ,
        DeptPeoID: resDatas.userData.depUserID , deptID: resDatas.userData.deptID
        };
        req.session.userData.userinfo = resDatas.userData ;
        req.session.userData.nav = resDatas.nav  ;
        req.session.userData.personal = resDatas.personal;
        req.session.userData.roles = resDatas.roles;
        //console.log('Session信息:', req.session.userData );
        res.send(resDatas);
    }); //ep.all('setSession' end


    ep.all('changRole',function (userinfo ) {

        var resDatas = {};
        var sqlstr = "select b.orgFullDes as `org`, d.deptDes as `dep` , c.name as `role` , a.orgRoleID as `roleID` , a.DeptPeoID as `depUserID` , c.type as `roleType` , a.orgID , a.deptID    " +
        "from `bsd_orgdeptpeo` as a , `bsd_orginfo` as b , `bsd_orgrole` as c ,`bsd_orginfodept` as d " +
        "  where c.orgRoleID = a.orgRoleID and a.deptID=d.deptID and  d.orgID = b.orgID and a.`ISVALID`='1' and b.ISVALID='1' and c.ISVALID='1' and d.ISVALID='1'  " +
        "  and b.checkStatus = '1'   and a.checkStatus = '1' and  a.`synid` = '" + userID +"'       order by a.isDefault desc ";

        orgDeptPeo.toSQL(sqlstr , function(err , docs){
            if(err) return res.send({status : '404' ,  err:err });

            if(docs.length <= 0) {  //游客

                resDatas.status = '200';
                resDatas.userData = {name:userinfo.uid ,type:3 , roleID:'' ,depUserID: 'null' , deptID:'' , email: userinfo.email  ,displayname:userinfo.displayname ,roleType:'-1'  };
                resDatas.nav = [];        //游客无使用功能权限
                resDatas.personal = [];   //游客无使用功能权限
                resDatas.roles = [{org:'无组织', dep:'' , role:'游客', roleID:'',depUserID:'null',roleType:'-1'  }];

                userinfo.orgID = '';
                userinfo.type = 3 ;
                userinfo.roleType = '-1';

                var epdatas ={resDatas: resDatas, userinfo :　userinfo};
                ep.emit('setSession', epdatas );

            } else if(docs.length >0) { //有组织的用户
                //console.log("角色数据：",docs[0]);
                var flag = 0, doc={};
                for(var i=0; i<docs.length; i++ ){
                    var doctmp= docs[i];
                    if(doctmp.depUserID == depUserID )  {flag=1; doc=doctmp; break;}
                } //for end

                //开始获取用户所在角色的功能数据
                if(flag == 0) return res.send({status : '404' ,  err:"未找到要切换的角色" });
                else  {
                    user.getUserNavAndPersonal(doc, function(err,funsdocs){
                        if(err) return res.send({status : '404' ,  err:err });
                        //console.log('docs:', docs);
                        resDatas.status = '200';
                        resDatas.userData = {name:userinfo.uid ,type:0 , roleID:doc.roleID ,depUserID:doc.depUserID , deptID:doc.deptID , email: userinfo.email  ,displayname:userinfo.displayname ,roleType:doc.roleType  };
                        resDatas.nav = funsdocs.nav ;              //
                        resDatas.personal = funsdocs.personal  ;   //
                        resDatas.roles = docs;

                        userinfo.orgID = doc.orgID;
                        userinfo.type = 0 ;
                        userinfo.roleType = doc.roleType;

                        var epdatas ={resDatas: resDatas, userinfo :　userinfo};

                        ep.emit('setSession', epdatas );
                    });  //user.getUserNavAndPersonal end

                } //if end

            } //if end

        });  //orgDeptPeo.toSQL end

    }); //ep.all  end

    user.getUserInfo_ID(userID, function(err,userinfos){
        if(err) return res.send({status : '404' ,  err:err });
        if(userinfos.length <=0 ) return res.send({status : '404' ,  err:'此用户状态不正确' });
        else  if(userinfos.length > 0 ) {
            var userinfo = userinfos[0] ;
            ep.emit('changRole', userinfo );
        } //if end
    }); //user.getUserInfo_ID end

}



function orgdepedit(req,res, next) {
    var data={};
    var orgID = req.session.userData.orgID;
    var type =  req.session.userData.type
    if(type != 2  ) return  res.send( {err:'您无权此操作'});
    if(orgID == '' || orgID == undefined  )  res.send({err:'数据错误'});
    //console.log(orgID);
    data.orgID = orgID;
    console.log(data);

    orgInfo.searchData_Json(data, function(err,docs){
        //console.log(doc);
        if(err) { console.log(err); return  res.send({des:err });  }
        console.log('AAAAA',docs);

        if(docs.length <= 0)  return  res.send('数据不存在.');
        else if(docs.length > 1) return  res.send('数据不正确，存在多条记录.');
        else {
            var doc = docs[0];
            var result = {orgID:orgID};
            //console.log(doc);
            if(doc.schoolType==1) result.selected_1="selected";
            else  result.selected_0="selected";

            res.render('app/orgdepedit', result);
        } //if end

    });


}


function orgroleapp(req,res, next) {
    var orgID = req.session.userData.orgID;
    var type =  req.session.userData.type

    if(type != 2  ) return  res.send( {err:'您无权此操作'});
    if(orgID == '' || orgID == undefined  )  res.send({err:'数据错误'});

    var data={};
    data.ISVALID = 1;
    data.orgID = orgID;
    var j=0;
    var list='', status_str='';

    roleapp.orgRoleApp_init(orgID, function(err,doc){
        if(err)  {console.log(err); return res.send({err:err});}
        console.log(doc);
        //if(doc[0][0].result)
        res.render('app/org_roleapp.jade');

    });

}




function getOrgRoleApp(req,res, next) {
    headers_V2(res);
    var orgID = req.session.userData.orgID;
    var type =  req.session.userData.type;

    if(type != 2  ) return  res.send( {err:'您无权此操作'});
    if(orgID == '' || orgID == undefined  )  res.send({err:'数据错误'});

    var data ={};
    var sqlstr = "select orgRoleID  ,name from bsd_orgrole where isvalid = '1' and  orgID = '" + orgID + "' ";

    roleapp.toSQL(sqlstr, function(err, doc) {
        if(err) return res.send({status : '404' ,  err:err });
        data.roles = doc;

        roleapp.getorgRoleApp_ass(orgID , function(err,doc){
            //console.log(doc);
            if(err) return res.send({status : '404' ,  err:err });
            else {data.roleapps = doc;   return res.send({status : '200' ,datas: data });}
        });

    });


}


function logout(req,res, next) {
    headers_V2(res);
    delete req.session.userData;
    res.send({ status: '200'  });

}











module.exports = router;