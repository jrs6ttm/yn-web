var express = require('express');
var router = express.Router();
//var config = require('../../config/config.json');
var config = require('../../config.json');
var uuid =  require('node-uuid');
var crypto = require('crypto');
var user = require('./model/user');
var orgDeptPeo =  require('./model/orgDeptPeo');
var EventProxy = require('eventproxy');


router.post('/', function(req, res, next) {
  headers();
  
  var username =  req.body['username'];
  var password =  req.body['password'];
  
  if(req.body['username'] == '' || req.body['username'] ==undefined ) return  res.send({err:"用户名不能为空" ,  status : '404'});

  password = crypto.createHash('md5').update(password).digest('base64');
  
  var ep = new EventProxy();
  ep.all('setSession',function (epdatas ) {
      　var  resDatas = epdatas.resDatas  ,  userinfo = epdatas.userinfo;
             //console.log('userinfo', userinfo);
                   
                    //req.session.userData.orgID  =  doc.orgID;
                    //req.session.userData.deptID =  doc.deptID;
                    
                    //req.session.userData.DeptPeoID =  doc.DeptPeoID;
                     //req.session.userData.orgRoleID = doc.orgRoleID ;
                    //req.session.userData.roleType = roledoc[0].type ;
        
        req.session.userData={id: userinfo.synid ,  name: userinfo.uid , email: userinfo.email  , orgID: userinfo.orgID , type: userinfo.type , roleType:userinfo.roleType ,orgRoleID:userinfo.orgRoleID ,
                                DeptPeoID: resDatas.userData.depUserID , deptID: resDatas.userData.deptID
                             };
        req.session.userData.userinfo = resDatas.userData ;
        req.session.userData.nav = resDatas.nav  ;
        req.session.userData.personal = resDatas.personal;  
        req.session.userData.roles = resDatas.roles; 
        console.log('登录验证后生成的Session信息:', req.session.userData );

       res.send(resDatas);
   });




  var resDatas = {};
  user.getUserInfo(username,function(err, userinfodoc){
      if(err) return res.send({status : '404' ,  err:err });
      if(userinfodoc.length <=0 ) return res.send({status : '404' ,  err:"用户不存在" });
      else {
          var userinfo = userinfodoc[0];
          //console.log('User:', userinfodoc);
          if(password != userinfo.password)  return res.send({status : '404' ,  err:"用户名或密码错误" });
          else {
              console.log('通过密码');
              var userID = userinfo.synid;
              
              if(userinfo.isadmin == 1) {
                  user.getAdminNavAndPersonal(function(err,docs){  //超级管理员
                      //console.log('Docs:', docs);
                     if(err) return res.send({status : '404' ,  err:err });

                     resDatas.status = '200';
                     resDatas.userData = {name:userinfo.uid ,type:1 , roleID:-1,depUserID: '-1' ,deptID:'-1'  , roleType:'-1' };
                     resDatas.nav = docs.nav;
                     resDatas.personal = docs.personal;
                     resDatas.roles = [{org:'易能教育', dep:'' , role:'超级管理员', roleID:-1,depUserID: '-1' , roleType:'-1'   }];

                     userinfo.orgID = '-1';
                     userinfo.type = 1 ;
                     userinfo.roleType = '-1';
                     
                     var epdatas ={resDatas: resDatas, userinfo :　userinfo};

                     ep.emit('setSession', epdatas );

                  }); //user.getAdminNavAndPersonal

              } else {

                  //1.检测是否是企业代理人
                  var sqlstr = "select a.DeptPeoID as depUserID  ,a.synid , a.orgID ,a.deptID ,a.userID ,a.orgRoleID ,b.checkStatus , b.orgFullDes ,b.ISVALID from  bsd_orgDeptPeo as a , bsd_orginfo as b where " +  
                               " a.orgID =b.orgID  and a.synid ='" + userID +"'  and a.orgRoleID = -2  ";
                  //console.log('企业代理人sqlstr',sqlstr);
                  orgDeptPeo.toSQL(sqlstr , function(err , DeptPeodoc){
                      if(err) return res.send({status : '404' ,  err:err });
                      
                      // console.log('企业DeptPeodoc',DeptPeodoc);

                      if(DeptPeodoc.length > 0) { //企业代理认账户
                          var peodata = DeptPeodoc[0];
                         
                          if(peodata.ISVALID != '1' ) return res.send({status : '404' ,  err:"您所在的企业未生效" }); 

                          if(peodata.checkStatus == '2')  return res.send({status : '404' ,  err:"此企业账号审核未通过" });     //审核未通过的账户
                          else if(peodata.checkStatus == '0') return res.send({status : '404' ,  err:"此企业账号正在审核中" });   //待审状态，禁止使用任何权限
                          else if(peodata.checkStatus == '1') { //审核通过状态，开发代理认的权限功能
                               
                               var orgID = peodata.orgID , depUserID = peodata.depUserID,  deptID = peodata.deptID ,  orgRoleID = -2  , orgFullDes = peodata.orgFullDes ;
                                user.getCompanyNavAndPersonal(function(err,docs){
                                    //console.log('Docs:', docs);
                                    if(err) return res.send({status : '404' ,  err:err });

                                    resDatas.status = '200';
                                    resDatas.userData = {name:userinfo.uid ,type:2 , roleID:-2 ,depUserID: depUserID ,deptID:deptID ,email: userinfo.email  ,displayname:userinfo.displayname ,roleType:'-2'  };
                                    resDatas.nav = docs.nav;
                                    resDatas.personal = docs.personal;
                                    resDatas.roles = [{org:orgFullDes, dep:'' , role:'管理员', roleID:-2,depUserID:depUserID , roleType:'-2' }];

                                    userinfo.orgID = orgID;
                                    userinfo.type = 2 ;
                                    userinfo.roleType = '-2';
                                    
                                    var epdatas ={resDatas: resDatas, userinfo :　userinfo};

                                    ep.emit('setSession', epdatas );


                                }); //user.getAdminNavAndPersonal

                          } //if end



                  } else if (DeptPeodoc.length <= 0) { //普通用户
                    //1.查看此用户处于那些机构。 2.如果不存在，则作为游客处理。  3.如果存在则获取默认组织，并获取其对用的nav, personal的app数据。
                    
                    var sqlstr = "select b.orgFullDes as `org`, d.deptDes as `dep` , c.name as `role` , a.orgRoleID as `roleID` , a.DeptPeoID as `depUserID` , c.type as `roleType` , a.orgID , a.deptID    " + 
                          "from `bsd_orgdeptpeo` as a , `bsd_orginfo` as b , `bsd_orgrole` as c ,`bsd_orginfodept` as d " + 
                          "  where c.orgRoleID = a.orgRoleID and a.deptID=d.deptID and  d.orgID = b.orgID and a.`ISVALID`='1' and b.ISVALID='1' and c.ISVALID='1' and d.ISVALID='1'  " + 
                          "  and b.checkStatus = '1'   and a.checkStatus = '1' and  a.`synid` = '" + userID +"' order by a.isDefault desc ";
                    
                    orgDeptPeo.toSQL(sqlstr , function(err , docs){
                      if(err) return res.send({status : '404' ,  err:err });

                      if(docs.length<=0) {  //游客

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
                            var doc= docs[0];

                            //开始获取用户所在角色的功能数据

                            user.getUserNavAndPersonal(doc, function(err,funsdocs){
                                if(err) return res.send({status : '404' ,  err:err });
                                console.log('docs:', docs);
                                //console.log('有组织的用户');
                                resDatas.status = '200';    
                                resDatas.userData = {name:userinfo.uid ,type:0 , roleID:doc.roleID ,depUserID:doc.depUserID , deptID:doc.deptID , email: userinfo.email  ,displayname:userinfo.displayname ,roleType:doc.roleType  };
                                resDatas.nav = funsdocs.nav ;        //
                                resDatas.personal = funsdocs.personal  ;   //
                                resDatas.roles = docs;

                                userinfo.orgID = doc.orgID;
                                userinfo.type = 0 ;
                                userinfo.roleType = doc.roleType;
                                
                                var epdatas ={resDatas: resDatas, userinfo :　userinfo};

                                ep.emit('setSession', epdatas );

                            });

                      } //if end

                    });  //orgDeptPeo.toSQL end 

                  }

                }); //orgDeptPeo.toSQL end 



              }  //if end 






          } //if end
          
      } //if end

  }); // user.getUserInfo end
 
 




    function headers(){
        res.header('Access-Control-Allow-Origin', '*');
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
        res.header("Content-Type", "application/json;charset=utf-8");
    }  

});




module.exports = router;
