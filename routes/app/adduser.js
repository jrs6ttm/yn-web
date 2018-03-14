var express = require('express');
var router = express.Router();
//var config = require('../../config/config.json');
var config = require('../../config.json');
var uuid =  require('node-uuid');
var crypto = require('crypto');
var user = require('./model/user');
var orgInfo =  require('./model/orgInfo');
var orgDeptPeo = require('./model/orgDeptPeo');
var EventProxy = require('eventproxy');


router.post('/', function(req, res, next) {
  headers();
  var username =  req.body.username;
  var email =  req.body.email;
  var type =  req.body.type;
  var orgFullDes =  req.body.orgfulldes;
  var password =  req.body.password;

  // console.log('orgFullDes:',orgFullDes);
  if( !type  || ( type != '1' && type != '0'   ) )  return  res.send({err:"type数据不正确" ,  status : '404'});

  if(type == '1' && ( !username  || !email ||  !password || !orgFullDes )   ) return  res.send({err:"企业用户注册username, email,password ,orgFullDes不能为空" ,  status : '404'});
  if(type == '0' &&  (  !username  || !email ||  !password )  ) return  res.send({err:"username, email ,password不能为空" ,  status : '404'});


    password = crypto.createHash('md5').update(password).digest('base64');
    synid =  uuid.v1();
    var tmpdata={uid:username};
    user.searchData_Json(tmpdata,function(err,docs){
        if(err)  return res.send({err:err,  status : '404'});
        
        if(docs.length > 0) return res.send({err:"用户名已存在",  status : '405'});
        else if(docs.length <= 0) { //如果用户名验证通过
            
            var tmpdata={email:email};
            user.searchData_Json(tmpdata,function(err,docs){
                if(err)  return res.send({err:err,  status : '404'});

                if(docs.length > 0) return res.send({err:"邮箱已存在",  status : '406'});
                else if(docs.length <= 0) {
                    var userdata = {synid:synid ,  uid:username  , password:password,  isadmin:0 , email:email  };
                    if(type=='0') { //如果为普通用户，加载用户到系统
                       
                       user.insertData(userdata , function(err, doc){ //加载用户到系统
                           if(err)  return res.send({err:err,  status : '404'});

                           return res.send({  status : '200' , info: '普通用户加载成功'});

                       }) ; //user.insertData end
                       
                         
                    } else if(type=='1'){ //如果企业用户

                           var tmpdata={orgFullDes:orgFullDes};
                            orgInfo.searchData_Json(tmpdata,function(err,docs){
                                if(err)  return res.send({err:err,  status : '404'});
                                
                                if(docs.length > 0) return res.send({err:"此企业名已被注册",  status : '407'});
                                else if(docs.length <= 0)  {  //企业用户：  1.加载用户到系统， 2， 添加组织机构   3.并将用户添加为此企业代理人
                                        user.insertData(userdata , function(err, doc){ //1.加载用户到系统
                                            if(err)  return res.send({err:err,  status : '404'});
                                            var orgID = uuid.v1();
                                            var orgdata = {orgID:orgID  , orgFullDes:orgFullDes , orgSort:'1' , schoolType:'1' ,ISVALID:1 ,checkStatus:'0'   };
                                            orgInfo.insertData(orgdata, function(err,doc){   // 2， 添加组织机构
                                                  if(err)  return res.send({err:err,  status : '404'}); 
                                                  var DeptPeoID = uuid.v1();
                                                  var deptpeoData = {
                                                      DeptPeoID: DeptPeoID,
                                                      synid: userdata.synid,
                                                      orgID: orgdata.orgID,
                                                      deptID: orgdata.orgID,
                                                      userID: userdata.uid,
                                                      checkStatus:'0',
                                                      orgRoleID: -2,
                                                  };



                                                  orgDeptPeo.insertData(deptpeoData,function(err,doc) { // 3.并将用户添加为此企业代理人
                                                     if(err)  return res.send({err:err,  status : '404'}); 
                                                     //生成老师和学生角色并锁定
                                                      var sqlstr = "CALL m_createOrginit('" + orgID + "')";
                                                      orgDeptPeo.toSQL(sqlstr,function(err,doc){
                                                          if(err)  return res.send({err:err,  status : '404'}); 
                                                          //console.log('BBB', doc);
                                                            
                                                          return res.send({  status : '200' , info: '企业用户加载成功'});
                                                      });



                                                     
                                                  });  //orgDeptPeo.insertData end 

                                            }); //orgInfo.insertData end

                                            
                                        }) ;  //user.insertData end 

                                }  //if end

                            }); //user.searchData_Json  end
                      
                    } //if end

                } //if end

            }); //user.searchData_Json  end

        }//if end

       
    }); //user.searchData_Json  end






    function headers(){
        res.header('Access-Control-Allow-Origin', '*');
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
        res.header("Content-Type", "application/json;charset=utf-8");
    }  



});





module.exports = router;
