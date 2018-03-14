/**
 * Created by lijiemoop on 3/3/2016.
 */

//登录
var userSignIn = function(){
    var currentHref = window.location.href;
    window.location.href =  signPort +'/login?targetUrl=' + currentHref;
};

//注册
var userSignUp = function(){
    window.location.href =  signPort +'/register';
};

//注销
var userSignOut = function(){
    sendMessage('get','','/signOut','',function(data){
        if(data === 'sign out success'){
            location.reload();
        }else{
            $.MsgBox.Alert('注销失败','注销失败，请重试！');
        }
    });
};

var getUser = function(){
  sendMessage('get','','/index.php/apps/courseplayer/getUser','',function(userId){
       return userId;
   });
};

var getIsTeacher = function(){
    var isTeacher = false;
    $(userData.roles).each(function(i,role){
        if(role.depUserID == userData.depUserID){
            if(role.role == '老师') isTeacher = true;
        }
    });
    return isTeacher;
};