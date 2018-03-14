


$(document).ready(function () {



});


function getroleapplist() {
    var orjID = $('#org').val();

    if(orjID == undefined )  { console.log('组织ID为空');  return; }

    var data = {id:orjID};
    $.post("/org/Ajax_getRoleApptop", data ,

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

                $("#roleapplist").html(htmlstr);

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





