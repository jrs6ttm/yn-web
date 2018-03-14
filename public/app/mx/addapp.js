
$(document).ready(function () {

    getApp();

});


// 清除两边的空格
String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, '');
};


//获取App列表
function  getApp(){
    var data={};
    $.post("/app/getapps",  data  ,

        function(dataBack){
            if(dataBack.status == '404') {console.log(dataBack);alert('操作失败:' + dataBack.err);  return ;}

            if(dataBack.status == '200') {
                console.log(dataBack);
                var datas = dataBack.datas;

                var htmlstr = '';

                for(var i=0;i<datas.length;i++) {

                    addAppHtmp(datas[i]);


                } // for end

                // $("#tbody").after(htmlstr);

            }

        });  //ajax end

}




//'添加'按钮
$("#addApp").click(function(){
    var  appid = $("#appid").val().trim();
    var  name = $("#name").val().trim();
    var  svg = $("#svg").val();
    var  hre = $("#hre").val();
    var  ofadmin = $("#ofadmin").val();
    var  position = $("#position").val();
    var  blank='0';

    if(document.getElementById('blank').checked)  blank='1';


    if(!appid)   {alert('appid不能为空');   $('#appid', this.el).focus(); return ;  }
    if(!name)   {alert('name不能为空');   $('#name', this.el).focus(); return ;  }

    var data ={appid:appid, name:name , hre:hre, blank:blank, ofadmin:ofadmin ,position:position , svg:svg};

    insertApp(data);

});





function  insertApp(data)
{
    $.post("/app/insertapp",  data  ,

        function(dataBack){
            if(dataBack.status == '404') {console.log(dataBack);alert('操作失败:' + dataBack.err);  return ;}

            if(dataBack.status == '200') {
                console.log(dataBack);

                addAppHtmp(data);

            }

        });  //ajax end

}



function addAppHtmp(data){
    console.log('AA',data);
    var  appid = data.appid;
    var  name =  data.name;
    var  svg = data.svg;
    var  hre = data.hre;
    var  ofadmin = data.ofadmin;
    var  position = data.position;
    var  blank = data.blank;

    var ofadminOption_Select1 ='' , ofadminOption_Select2 ='' , blank_check ='' ;
    var position_Select1  ='' , position_Select2  ='' , ofadminOption_Select3 ='';

    if(ofadmin == '0')    ofadminOption_Select1 ='selected';
    if(ofadmin == '1')    ofadminOption_Select2 ='selected';
    if(ofadmin == '2')    ofadminOption_Select3 ='selected';

    if(position == '0')   position_Select1 ='selected';
    if(position == '1')   position_Select2 ='selected';

    if(blank == '1')      blank_check ='checked';
    var htmlstr = '';
    htmlstr = htmlstr +
        " <tr id='tr_" + appid+ "' > " +
        "    <td >" + appid+ "</td> " +
        "    <td ><input type='text'  value='" + name + "' id='name_" + appid+ "' appid='" + appid+ "' onblur=\"updateapp(this,'name')\"></td> " +
        "    <td ><input type='text'  value='" + hre + "' id='hre_" + appid+ "' appid='" + appid+ "' onblur=\"updateapp(this,'hre')\" > <input type='checkbox' id='blank_" + appid+ "' appid='" + appid+ "'  " + blank_check + "   onclick=\"updateapp(this,'blank')\"  > blank</label></td>  " +
        "    <td >     " +
        "        <select class='form-control input-sm' style='padding-left:0px;padding-right:0px;' id='svg_" + appid+ "' appid='" + appid+ "' onchange=\"updateapp(this,'svg')\" > " +
        "         <option value='" + svg + "'>当前图片:" + svg + "</value> " +
        "              <option value='admin.svg'>管理</value> " +
        "              <option value='files.svg'>文件</value> " +
        "              <option value='users.svg'>用户</value> " +
        "              <option value='picture.svg'>相册</value> " +
        "              <option value='course.svg'>我的课程</value> " +
        "          </select>      " +
        "      </td> " +
        "      <td> " +
        "          <div class='col-xs-4'  style='text-align: left; margin-left: 2px;'  > " +
        "              <select class='form-control input-sm'  id='ofadmin_" + appid+ "' appid='" + appid+ "'  onchange=\"updateapp(this,'ofadmin')\" > " +
        "                  <option value='0'  " + ofadminOption_Select1 + "  >普通功能</option> " +
        "                  <option value='1'   " + ofadminOption_Select2 + " >超管功能</option> " +
        "                  <option value='2'   " + ofadminOption_Select3 + " >企业代理人</option> " +
        "              </select>    " +
        "          </div>  " +
        "          <div class='col-xs-4'  style='margin-left: 2px;'  appid='" + appid+ "'  > " +
        "              <select class='form-control input-sm' style='padding-left:0px;padding-right:0px;' id='position_" + appid+ "' appid='" + appid+ "'   onchange=\"updateapp(this,'position')\"  > " +
        "                  <option value='0'  " + position_Select1 + "      >位置:菜单</option> " +
        "                  <option value='1'  " + position_Select2 + "     >位置:个人中心</option> " +
        "              </select>    " +
        "          </div>    " +
        "          <button  class='btn btn-danger btn-xs '  style= 'width: 50px;' id='del_" + appid+ "' appid='" + appid+ "'  onclick=\"updateapp(this,'del')\">  注销 </button> " +
        "    </td> " +
        "</tr>  ";

    $("#tbody").append(htmlstr);

}




function updateapp(ele,flag) {
    var appid =  ele.getAttribute('appid');
    var id = ele.getAttribute('id');

    var data = {appid:appid};
    if(flag == 'name')  data.name = $('#' + id).val().trim();
    if(flag == 'hre') {
        var hre = $('#' + id).val().trim();
        data.hre = hre;
    }

    if(flag == 'blank') {
        var hre =  $('#hre_' + appid).val().trim();
        if(hre == '' || hre == undefined)  return ;
        else {
            if(document.getElementById('blank_'+appid).checked)  data.blank ='1';
            else  data.blank ='0';
        }
    }

    if( flag ==  'ofadmin' ) {
        data.ofadmin = $('#ofadmin_' + appid).val();
    }

    if( flag ==  'position' ) {
        data.position = $('#position_' + appid).val();
    }

    if( flag ==  'svg' ) {
        data.svg = $('#svg_' + appid).val();
    }


    if( flag ==  'del' ) {
        data.isvalid = '0';
    }


    console.log(data);
    console.log(appid,flag);

    $.post("/app/updateapp",  data  ,

        function(dataBack){
            if(dataBack.status == '404') {console.log(dataBack);alert('操作失败:' + dataBack.err);  return ;}

            if(dataBack.status == '200') {
                console.log(dataBack);
                if( flag ==  'del' )  $('#tr_' + appid).remove();
            }

        });  //ajax end

}






function getRoleApp()
{
    $.get("/org/Ajax_getRoleApp", {} ,

        function(dataBack){
            if(dataBack.status == '404') {console.log(dataBack);alert('操作失败:' + dataBack.err);  return ;}

            if(dataBack.status == '200') {
                console.log(dataBack);
                var datas = dataBack.datas;

                var htmlstr = '';
                for(var x in datas) {
                    var roleAppJSON =  datas[x];
                    var htmlstr = htmlstr + "<tr> " +
                        "<td class='is-hidden'  style='vertical-align: middle;text-align: center;'>" +  roleAppJSON.name + "</td> " +
                        " <th scope='row' > " +
                        "  <div class='one'>";

                    for(y in roleAppJSON) {
                        if(y != 'name') {
                            var checked = "";
                            if(roleAppJSON[y].status == 1)  checked = "checked";
                            htmlstr = htmlstr +  "<div class='checkbox' > <label > <input id='box_" + roleAppJSON[y].id + "' " + checked + " type='checkbox' raid='" + roleAppJSON[y].id + "'  onclick='updateRoleApp(this)'  >" +  y + "</label> </div>";
                        }
                    } //for end

                    htmlstr = htmlstr +  "</div></th></tr>"

                } //for end

                $("#roleappTable").append(htmlstr);
            }
        });  //ajax end


}


function updateRoleApp(ele) {
    var rid = ele.getAttribute('raid');
    var flag = 0;
    var rid = ele.getAttribute('raid');
    if( document.getElementById("box_" + rid).checked ) flag = 1;
    console.log(rid , flag);
    var data = {rid:rid , flag:flag};

    $.post("/org/Ajax_updateRoleApp",  data  ,

        function(dataBack){
            if(dataBack.status == '404') {console.log(dataBack);alert('操作失败:' + dataBack.err);  return ;}

            if(dataBack.status == '200') {
                console.log(rid,"权限操作成功");
            }
        });  //ajax end


}









function  insertdata(data)
{
    $.post("/org/Ajax_addRole",  data  ,

        function(dataBack){
            if(dataBack.status == '404') {console.log(dataBack);alert('操作失败:' + dataBack.err);  return ;}

            if(dataBack.status == '200') {
                console.log(dataBack);
                var id = dataBack.datas.insertId;

                var trtmp = "" +
                    "<tr id = 'tr_" + id + "' > " +
                    "  <td>#</td> " +
                    "  <td>" + data.name + " </td> " +
                    "  <td><div id='status_" + id + "' >有效</div></td> " +
                    "  <td>" +
                    "<button  id='button_del_" + id + "'  onclick='delRole(this)'   rid='" + id + "' class='btn btn-warning'  style= 'width: 80px;height:28px;' >  删除 </button>" +
                    "<button  id='button_use_" + id + "'  onclick='useRole(this)'   rid='" + id + "' class='btn btn-danger'  style= 'width: 80px;height:28px;display:none;' >  锁定</button>" +
                    "<button  id='button_lock_" + id + "' onclick='lockRole(this)'  rid='" + id + "' class='btn btn-danger'  style= 'width: 80px;height:28px;' >  锁定</button>" +
                    "</td>  " +
                    " </tr> " ;
                $('table#role').append(trtmp);

            }

        });  //ajax end

}



function  delRole(ele) {

    var flag = confirm("确认要删除此角色?");
    if(flag == false) return;

    var rid = ele.getAttribute('rid');
    if(rid == '' ) {alert('无法删除，ID数据错误'); return ; }
    var data = {id: rid};
    console.log(data);
    ajax_delRole(data);
}



function ajax_delRole(data) {
    $.post("/org/Ajax_delRole",  data  ,

        function(dataBack){
            if(dataBack.status == '404') {console.log(dataBack);alert('操作失败:' + dataBack.err);  return ;}

            if(dataBack.status == '200') {
                $('tr#tr_' + data.id).remove();
            }
        });  //ajax end

}




function ajax_updateRole(data) {
    $.post("/org/Ajax_updateRole",  data  ,

        function(dataBack){
            if(dataBack.status == '404') {console.log(dataBack);alert('操作失败:' + dataBack.err);  return ;}

            if(dataBack.status == '200') {
                //$('tr#tr_' + data.id).remove();
                if(data.status == 0) {  //挂起
                    $('#status_' + data.id).text('挂起');
                    $('#button_del_' + data.id).show();
                    $('#button_use_' + data.id).show();
                    $('#button_lock_' + data.id).show();

                    // alert('挂起成功');
                }

                if(data.status == 1) {  //启用
                    $('#status_' + data.id).text('启用');
                    $('#button_use_' + data.id).hide();
                    $('#button_lock_' + data.id).show();
                    $('#button_del_' + data.id).show();


                    // alert('启用成功');
                }

                if(data.status == 2) {  //锁定
                    $('#status_' + data.id).text('锁定');
                    $('#button_del_' + data.id).hide();
                    $('#button_use_' + data.id).hide();
                    $('#button_lock_' + data.id).hide();

                    // alert('锁定成功');
                }
            }
        });  //ajax end

}

function useRole(ele) {

    var flag = confirm("确认要启用此角色?");
    if(flag == false) return;

    var rid = ele.getAttribute('rid');
    if(rid == '' ) {alert('ID数据错误'); return ; }
    var data = {id: rid , status:1};
    console.log(data);
    ajax_updateRole(data);

}



function lockRole(ele) {

    var flag = confirm("确认要启用此角色?");
    if(flag == false) return;

    var rid = ele.getAttribute('rid');
    if(rid == '' ) {alert('ID数据错误'); return ; }
    var data = {id: rid , status:2};
    console.log(data);
    ajax_updateRole(data);

}





//更新组织数据 , flag为1表示被提交生效调用
function saveOrj(data,flag)
{
    $.post("/org/Ajax_updateOrj",  data  ,

        function(dataBack){
            if(dataBack.status == '404') {alert('操作失败:' + dataBack.err );$('#orgCode', this.el).focus();  return ;}

            if(dataBack.status == '200') {
                if(flag == 1)   alert('已经生效');
                else
                    alert('保存成功');
            }

        });  //ajax end
}




//组织机构编辑中'转机构维护页'按钮
$("#toOrgEdit").click(function(){
    var orjID =  $('#orjID').val();
    orjID = orjID.trim();

    if(orjID == '') {alert('请先完成组织的创建');  return ;}

    var url = "/org/orgDep_edit?id=" + orjID  ;
    window.location.href=url;

});




function getorglist() {
    var orjID = $('#org').val();

    if(orjID == undefined )  { console.log('组织ID为空');  return; }

    var data = {id:orjID};

    $.post("/org/Ajax_getorglist",  data  ,

        function(dataBack){
            console.log(dataBack);
            if(dataBack.status == '404') {alert('操作失败:' + dataBack.err ); return ;}

            if(dataBack.status == '200') {
                var docs = dataBack.datas;
                var list = '';
                for(var i=0; i<docs.length ; i++ ) {
                    var doc = docs[i];
                    if(doc.status ==0) {
                        //status_str="";
                        var rolestatus = "挂起"
                        var deldisplay = "";
                        var usedisplay ="";
                        var lockdisplay = "";

                    } else if(doc.status ==1)  {
                        var rolestatus = "有效"
                        var deldisplay = "";
                        var usedisplay ="display:none;";
                        var lockdisplay = "";

                    } else if(doc.status ==2)  {
                        var rolestatus = "锁定";
                        var deldisplay = "display:none;";
                        var usedisplay ="display:none;";
                        var lockdisplay = "display:none;";

                    } //if end


                    list = list +
                        "<tr id = 'tr_" + doc.orgRoleID + "' > " +
                        "    <td>#</td> " +
                        "    <td>" + doc.name + " </td> " +
                        "    <td><div id = 'status_" + doc.orgRoleID + "'>" + rolestatus + "</div></td> " +
                        "    <td> " +
                        "       <div style='float:left;'><button  id='button_del_" + doc.orgRoleID + "'  onclick='delRole(this)'  rid='" + doc.orgRoleID + "' class='btn btn-warning'  style= 'width: 80px;height:28px;" + deldisplay + "' >  删除 </button> " +
                        "          <button  id='button_use_" + doc.orgRoleID + "'   onclick='useRole(this)'  rid='" + doc.orgRoleID + "' class='btn btn-success'  style= 'width: 80px;height:28px;" + usedisplay + "' >  启用 </button> " +
                        "          <button  id='button_lock_" + doc.orgRoleID + "'   onclick='lockRole(this)'  rid='" + doc.orgRoleID + "' class='btn btn-danger'  style= 'width: 80px;height:28px;" + lockdisplay + "' >  锁定 </button> " +
                        "       </div>"+
                        "    <div style='float:left;'><input  onblur='setRoleType(this)'  rid='" + doc.orgRoleID + "'   type='text' id='typeval_" + doc.orgRoleID + "' value='" + doc.type + "' style= 'width: 30px;height:28px;'  > " +
                        //"      <button onclick='setRoleType(this)' rid='" + doc.orgRoleID + "' class='btn btn-info btn-xs optOrganizedCourse'  style= 'width: 80px;height:28px;' >设置</button>"+
                        "    </div>"  +
                        "    </td>  " +
                        " </tr> " ;

                } //for end;

                $("#rolelist").html(list);

            }

        });  //ajax end
}



function setRoleType(ele) {

    var rid = ele.getAttribute('rid');
    if( rid == '' ) {alert('ID数据错误'); return ; }
    var val = $("#typeval_" + rid).val();
    if(val == '' )  {alert('val数据错误'); return ; }

    var data = {id : rid , val : val };
    $.post("/org/Ajax_setRoleType",  data  ,

        function(dataBack){
            if(dataBack.status == '404') {alert('操作失败:' + dataBack.err );  return ;}
            if(dataBack.status == '200') {
                console.log('设置成功');
            }
        });  //ajax end

}




//'添加'按钮
$("#addRoleTop").click(function(){
    var orgID = $('#org').val();
    if(orgID == undefined )  { console.log('组织ID为空');  return; }
    var name = $('#roleName').val();
    name = name.trim();
    if(name == '')   {alert('角色名不能为空');    return ;}

    var data ={};
    data.orgID = orgID;
    data.name = name;
    insertdata_top(data);

});



function  insertdata_top(data)
{
    $.post("/org/Ajax_addRole_top",  data  ,

        function(dataBack){
            if(dataBack.status == '404') {console.log(dataBack);alert('操作失败:' + dataBack.err);  return ;}

            if(dataBack.status == '200') {
                console.log(dataBack);
                var id = dataBack.datas.insertId;

                var trtmp = "" +
                    "<tr id = 'tr_" + id + "' > " +
                    "  <td>#</td> " +
                    "  <td>" + data.name + " </td> " +
                    "  <td><div id='status_" + id + "' >有效</div></td> " +
                    "  <td>" +
                    "    <div style='float:left;'><button  id='button_del_" + id + "'  onclick='delRole(this)'   rid='" + id + "' class='btn btn-warning'  style= 'width: 80px;height:28px;' >  删除 </button>" +
                    "       <button  id='button_use_" + id + "'  onclick='useRole(this)'   rid='" + id + "' class='btn btn-danger'  style= 'width: 80px;height:28px;display:none;' >  锁定</button>" +
                    "       <button  id='button_lock_" + id + "' onclick='lockRole(this)'  rid='" + id + "' class='btn btn-danger'  style= 'width: 80px;height:28px;' >  锁定</button>" +
                    "    </div>"+
                    "    <div style='float:left;'><input type='text' id='typeval_" + id + "' value='' style= 'width: 30px;height:28px;'  > " +
                    //"         <button onclick='setRoleType(this)' rid='" + id + "' class='btn btn-info btn-xs optOrganizedCourse'  style= 'width: 80px;height:28px;' >设置</button>" +
                    "    </div>"  +
                    "</td>  " +

                    " </tr> " ;
                $('table#role').append(trtmp);

            }

        });  //ajax end

}










