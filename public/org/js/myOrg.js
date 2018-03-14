
var selectedOrgID = '', selectedDeptID = '' , SELECTED_DEPT_NAME = '' , SELECTED_ORG_NAME = '' ;


//'添加一个机构'按钮
$("#addOrg").click(function(){
    var orgID = $("#orglist").val();
    if(!orgID) {alert('组织不能为空!'); return ;}
    //alert(orgID);
    selectedOrgID = orgID;
    SELECTED_ORG_NAME = "";

    //清空数据
    selectedDeptID = '';
    SELECTED_DEPT_NAME = '';

    $.post("/org/Ajax_getOrgRoles" ,{orgID:orgID }, function(dataBack){
        console.log(dataBack);
        if(dataBack.status == '404') {alert('用户添加失败:' + dataBack.err); console.log(dataBack.err) ;}

        if(dataBack.status == '200') {
            $("#rolelist").html("<option value='-1'>请选择角色</option>");
            for(var i=0; i< dataBack.datas.length; i++) {
                var roleinfo = dataBack.datas[i];
                var htmlstr = "<option value='" + roleinfo.orgRoleID +"'>" +roleinfo.name+"</option>";
                $("#rolelist").append(htmlstr);
            }

            $("#treelist").empty();
            get_OrgTree_myOrg(orgID);
            $('#myModal').modal('show');

        }

    });


});




//'确定选择'按钮
$("#orgSure").click(function(){

    if(selectedDeptID=='') {alert('请选择一个机构！' ); return; }

    var orgRoleID = $("#rolelist").val() ;console.log(orgRoleID);

    if(orgRoleID == '-1' || orgRoleID == undefined   )   {alert('请选择一个角色！' ); return; }

    var isOrg =0;
    if(selectedOrgID == selectedDeptID) isOrg = 1;

    tmp_arr = {
        orgID:  selectedOrgID,
        deptID: selectedDeptID,
        orgRoleID :orgRoleID,
        isOrg : isOrg
    };


    var arrystr = JSON.stringify(tmp_arr);
    $.ajax({
        url: '/org/Ajax_insertUser_arry_myOrg',
        //data: { "selectedIDs": _list },
        data :{str: arrystr} ,
        dataType: "json",
        type: "POST",
        //traditional: true,
        success: function (dataBack) {

            if(dataBack.status == '404') {alert('用户添加失败:' + dataBack.err); console.log(dataBack.err) ;}

            if(dataBack.status == '200') {
                //如果用户添加成功，先更新机构用户， 在情况查询用户数据， 最后关闭摸态框。
                doc = dataBack.datas;
                var trtmp = "" +
                    "<tr id='tr_" + doc.DeptPeoID + "'> " +
                    "  <td>#</td> " +
                    "	 <td>" + doc.deptDes  + " </td> " +
                    "	 <td>" + doc.rolename  + " </td> " +
                    "	 <td> 待审核 </td> " +
                    "	 <td> " +
                    "	      <button id='button_del_" + doc.DeptPeoID + "' onclick='delMyOrg(this)' dpid='" + doc.DeptPeoID  + "' class='btn btn-warning' style='width: 80px;height:28px;'>  删除 </button>   " +
                    "	 </td> " +
                    "</tr>" ;

                $('table#myorg').append(trtmp);


                //清空数据
                $("#treelist").empty();
                $('#myModal').modal('hide');
                selectedOrgID = '', selectedDeptID = '' , SELECTED_DEPT_NAME = '' , SELECTED_ORG_NAME = '';



            }


        }

    });




});


//以远程Read的形式打开

function get_OrgTree_myOrg(id) {
    var dataSource = new kendo.data.TreeListDataSource({
        transport: {
            read:  {
                url: "/org/Ajax_getOrgTree_read?id="+id,
                dataType: "json"
            },

            update: {
                url:  "/EmployeeDirectory/Update",
                dataType: "json"
            },
            destroy: {
                url: "/EmployeeDirectory/Destroy",
                dataType: "json"
            },
            create: {
                url: "/EmployeeDirectory/Create",
                dataType: "json"
            },

            parameterMap: function(options, operation) {
                if (operation !== "read" && options.models) {
                    return {models: kendo.stringify(options.models)};
                }
            }
        },
        batch: true,

        requestEnd: function(e) {
            var response = e.response;
            var type = e.type;
            console.log(type); // displays "read"
            console.log(response.length); // displays "77"
            console.log(response);
            orgTreeData =  response;
        },


        schema: {
            model: {
                id: "orgID",
                expanded: true
            }
        }


    });

//onblur="Ajax_update_SQL('cmt_qustn_QuestionInfo', 'Score', 'questionID' , '776'  , 'que_score776' , 'que_hid_score_776'  , 'que_score_flag776'  )"

    $("#treelist").kendoTreeList({
        dataSource: dataSource,

        height : 510,
        width:  250,
        columns: [
            {
                //field: "orgFullDes",
                template: " <a id='node_#=orgID#' class='treeNode' oid='#=orgID#' name='#=orgFullDes#' onclick='onSelectedOrg(this)'  > #=orgFullDes# </a> "  ,
                expandable: false, title: "", width: 80 ,
                autoBind: false,
                attributes: {style: "text-align: left;" }
            },
        ]

    });

}




//机构子结点被选中后。。。: 1.改变背景颜色， 2.改变全局变量：选中的机构ID.
function onSelectedOrg(ele) {
    var oid = ele.getAttribute('oid');
    $('a.treeNode').css("background-color","white");
    $(ele).css("background-color","#00ff00");
    selectedDeptID =  oid;

    SELECTED_DEPT_NAME = ele.getAttribute('name');
    console.log(selectedOrgID , selectedDeptID  , SELECTED_DEPT_NAME)

}




function  delMyOrg(ele) {

    var flag = confirm("确认要删除此角色?");
    if(flag == false) return;

    var dpid = ele.getAttribute('dpid');
    if(dpid == '' ) {alert('无法删除，ID数据错误'); return ; }
    var data =[];
    data[0] = {DeptPeoID: dpid};
    console.log(data);
    ajax_delMyOrg(data);

}


function ajax_delMyOrg(data) {
    var tmpparm = {models: JSON.stringify(data)}
    $.post("/org/Ajax_depUserDestroy_myOrg",  tmpparm  ,

        function(dataBack){
            if(dataBack.status == '404') {console.log(dataBack);alert('操作失败:' + dataBack.err);  return ;}

            if(dataBack.status == '200') {
                console.log(data[0].DeptPeoID);
                $('tr#tr_' + data[0].DeptPeoID).remove();
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



function updateDefine(ele) {
    var id=ele.getAttribute('dfid');
    var orgid=ele.getAttribute('orgid');
    //console.log(id);
    var data={};
    data.id = id;
    data.orgid=orgid;
    $.post("/org/Ajax_updateDefine",  data  ,

        function(dataBack){
            if(dataBack.status == '404') {alert('操作失败:' + dataBack.err );}

            if(dataBack.status == '200') {

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



















