
//全局变量
var  orgTreeData = [];
var userdatas = [] ,depUsers  = [] ;
var ORGID='',  selectedDeptID='',  SELECTED_DEPT_NAME='',  SCHOOL_TYPE='';

//******初始化-------*****//
$(
//加载后获取org tree数据源
    function() {
        var id = $("#orgID").val();
        if(!id) {alert('ID数据不正确，数据获取失败');  return ;}
        ORGID = id;
        //get_OrgTree_onload(id);
        //console.log(ORGID);
        get_OrgTree_onload_V2(false);
        depUserlist_Kendo([] )
    }); // function end  //  $() end


//******初始化-------结束*****//

//***********组织-------*******//

//以远程Read的形式打开
function get_OrgTree_onload_V2(expanded) {
    var dataSource = new kendo.data.TreeListDataSource({
        transport: {
            read:  {
                url: "/org/Ajax_getOrgTree_read?id="+ORGID,
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
                expanded: expanded
            }
        }
    });

//onblur="Ajax_update_SQL('cmt_qustn_QuestionInfo', 'Score', 'questionID' , '776'  , 'que_score776' , 'que_hid_score_776'  , 'que_score_flag776'  )"

    orgTreelist_Kendo(dataSource );

}




//KendoUI:组织机构的显示
function orgTreelist_Kendo(dataSource ) {
    $("#treelist").empty();

    var columns =  [{
        template: "  <a id='node_#=orgID#' class='treeNode' oid='#=orgID#' name='#=orgFullDes#' onclick='onSelectedOrg(this)'  " +
        "  ondblclick=\"ShowOrHidden('node_#=orgID#' ,'hid_#=orgID#' , 'flag_#=orgID#' )\"  > #=orgFullDes# </a> " +
        "  <span><input onblur=\"ShowOrHidden( 'node_#=orgID#' ,'hid_#=orgID#' , 'flag_#=orgID#')\" id='hid_#=orgID#' hidden style='width:130px; height:20px;' value='#=orgFullDes#' > </span>    " +
        "  <span> <input  id='flag_#=orgID#' hidden value='0' > </span>" ,
        expandable: false, title: "", width: 80 ,
        autoBind: false,
        attributes: {style: "text-align: left;" }
    }
    ];

    $("#treelist").kendoTreeList({
        dataSource: dataSource,
        height : 510,
        width:  250,
        columns: columns
    });

}


//机构子结点被选中后。。。: 1.改变背景颜色， 2.改变全局变量：选中的机构ID.
function onSelectedOrg(ele) {
    var oid = ele.getAttribute('oid');
    $('a.treeNode').css("background-color","white");
    $(ele).css("background-color","#00ff00");
    selectedDeptID =  oid;

    SELECTED_DEPT_NAME = ele.getAttribute('name');
    //$('#deptDes').val(name);
    $('#selectedDeptID').val(selectedDeptID);

    showDepUsers_selected();
}




//对机构的用户信息的显示： kendoUI
function showDepUsers_selected() {
    $("#grid").empty();
    var dataSource = new kendo.data.DataSource({
        // data: [{'userID': 555}],
        transport: {
            read:  {
                url: "/org/Ajax_depUserRead?deptid=" + selectedDeptID,
                dataType: "json"
            },
            update: {
                url: "/org/Ajax_depUserUpdate",
                dataType: "json",
                type: 'POST'
            },
            destroy: {
                url:"/org/Ajax_depUserDestroy",
                dataType: "json",
                type: 'POST'
            },
            create: {
                url:  "/org/Ajax_depUserCreate",
                dataType: "json",
                type: 'POST'
            },

            parameterMap: function(options, operation) {
                if (operation !== "read" && options.models) {
                    return {models: kendo.stringify(options.models)};
                }
            }
        },
        requestEnd: function(e) {
            var response = e.response;
            var type = e.type;
            //console.log(type); // displays "read"
            // console.log(response.length); // displays "77"
            // console.log(response);
            depUsers =  response;
        },
        batch: true,
        pageSize : 12,
        schema: {
            model: {
                id: "DeptPeoID",
            }
        }
    });

    depUserlist_Kendo(dataSource );

}



//重新为选中机构赋颜色
function  reSelectedClor() {
    //alert(22);
    $('a.treeNode').css("background-color","white");
    $("#node_" + selectedDeptID).css("background-color","#00ff00");
    console.log($("#node_" + selectedDeptID));
}




//KendoUI:机构的用户显示
function depUserlist_Kendo(dataSource ) {

    $("#grid").empty();
    var columns =  [
        { field: "userID",title:"<div align='center'>用户账号</div>", width: "100px" },
        { field: "name", title:"<div align='center'>姓名</div>",  width: "80px" },
        { title: "<div align='center'>审核状态</div>", width: "100px",  template: " #if(checkStatus=='0'){#<div id='divCheck_#=DeptPeoID#'>未审核</div>#}else if(checkStatus=='2'){#<div id='divCheck_#=DeptPeoID#'>审核未通过</div>#}else if(checkStatus=='1'){#<div id='divCheck_#=DeptPeoID#'>已审核</div>#}# " },
        { field: "rolename", title:"<div align='center'>角色</div>",  width: "80px" },
        // { command: "destroy", title: "操作", width: "100px" }
        // "#if(isProxy=='0'){#<button class='btn btn-primary btn-xs' style ='width: 80px' id='proxy_#=DeptPeoID#' dp='#=DeptPeoID#' onclick='updateProxy(this, 1)' >  设为代理人 </button>#} "
        {
            title: "<div align='center'>操作</div>",
            template: " <button class='btn btn-danger btn-xs' style ='width: 50px' id='del_#=DeptPeoID#' userid='#=userID#' dp='#=DeptPeoID#' onclick='delDepUser(this)' >  删除 </button> " +
            "#if(checkStatus=='0'){# <button class='btn btn-success btn-xs' style ='width: 50px' id='check_#=DeptPeoID#' dp='#=DeptPeoID#' val='1' onclick='updateCheck(this)' >   审核通过 </button>" +
            "  <button class='btn btn-warning btn-xs' style ='width: 50px' id='check2_#=DeptPeoID#' dp='#=DeptPeoID#' val='2'  onclick='updateCheck(this)' > 拒绝 </button> #}#"

        }
    ];


    $("#grid").kendoGrid({
        dataSource:dataSource,
        //pageable: true,
        pageable: {
            buttonCount: 3
        },
        height: 678,
        toolbar: [ ],
        columns: columns,
        editable: false
    });
}



//审核通过用户
function updateCheck(ele) {
    var DeptPeoID = ele.getAttribute('dp');
    var val = ele.getAttribute('val');
    var id = ele.getAttribute('id');
    var data={};
    data = { "DeptPeoID"  : DeptPeoID ,  "checkStatus" : val };
    var  data = JSON.stringify(data);
    var data2 = {models: data};

    $.post('/org/Ajax_updateDeptPeo_json', data2 ,
        function(dataBack) {
            if(dataBack.status == '404') {alert('审核操作失败'); console.log(dataBack.err); return ;}

            if(dataBack.status == '200') {
                //更新组织树形结构
                //alert('审核成功');
                //$("#" + id).hide();
                $("#check_" + DeptPeoID).hide();
                $("#check2_" + DeptPeoID).hide();

                if(val=='1')  $("#divCheck_" + DeptPeoID).text("已通过");
                if(val=='2')  $("#divCheck_" + DeptPeoID).text("审核未通过");

            } //if end
        }); //function end   //.post end

}





//'查询'按钮被按下
$("#depUserSearch").click(function() {

    if(selectedDeptID == '') {alert('请选中一个机构.');  return;}
    var userAccount = $('#userAccount').val().trim();
    var userName = $('#userName').val().trim();

    //如果机构名称不为空， 后台增加机构数据， 父节点数据暂时伪造
    var data={};
    if(userAccount)  data.userID = userAccount;
    if(userName)  data.name = userName;

    searchDepUsers(data);

});



//查询用户， 用于查询按钮
function searchDepUsers(data) {
    $("#grid").empty();
    var dataSource = new kendo.data.DataSource({
        transport: {
            read:  {
                url: "/org/Ajax_depUserRead_V2?deptid=" + selectedDeptID + "&userID=" + data.userID + "&name=" + data.name ,
                dataType: "json"
            },
            update: {
                url: "/org/Ajax_depUserUpdate",
                dataType: "json",
                type: 'POST'
            },
            destroy: {
                url:"/org/Ajax_depUserDestroy",
                dataType: "json",
                type: 'POST'
            },
            create: {
                url:  "/org/Ajax_depUserCreate",
                dataType: "json",
                type: 'POST'
            },
            parameterMap: function(options, operation) {
                if (operation !== "read" && options.models) {
                    return {models: kendo.stringify(options.models)};
                }
            }
        },

        requestEnd: function(e) {
            var response = e.response;
            var type = e.type;
            //console.log(type); // displays "read"
            // console.log(response.length); // displays "77"
            // console.log(response);
            depUsers =  response;
        },

        batch: true,
        pageSize : 12,

        schema: {
            model: {
                id: "DeptPeoID",
            }
        }

    });

    depUserlist_Kendo(dataSource );

}




//删除机构用户
function delDepUser(ele) {

    var userid = ele.getAttribute('userid');
    var flag = confirm("确定要删除用户：" + userid + "?" );
    if(flag == false) return;
    var DeptPeoID = ele.getAttribute('dp');
    var data=[];
    data[0] = { "DeptPeoID"  : DeptPeoID };
    var  data = JSON.stringify(data);
    var data2 = {models: data};

    $.post('/org/Ajax_depUserDestroy', data2 ,
        function(dataBack) {
            if(dataBack.status == '404') {alert('性别更新失败。'); console.log(dataBack.err); return ;}

            if(dataBack.status == '200') {
                //更新组织树形结构

            } //if end
        }); //function end   //.post end

    var parent = ele.parentNode.parentNode;
    var grandParent = parent.parentNode;
    grandParent.removeChild(parent);

    //setBackgroud(grandParent);

}




//更新代理人
function updateProxy(ele, flag) {

    var DeptPeoID = ele.getAttribute('dp');
    var data = { "DeptPeoID"  : DeptPeoID ,  "isProxy" : flag };
    var  data = JSON.stringify(data);
    var data2 = {models: data};

    $.post('/org/Ajax_updateDeptPeo_json', data2 ,
        function(dataBack) {
            if(dataBack.status == '404') {alert('设置代理人失败。'); console.log(dataBack.err); return ;}

            if(dataBack.status == '200') {
                //更新组织树形结构
                alert('设置成功');
                $("#proxy_" + DeptPeoID).hide();

            } //if end
        }); //function end   //.post end

}



//获取机构的全部信息

function getDeptData(id) {
    var res = {};
    for(var i=0; i< orgTreeData.length; i++) {
        if(id == orgTreeData[i].orgID)  res = orgTreeData[i];
    }
    return res;
}


//'同级上移'按钮被按下
$("#upDep").click(function() {
    if(selectedDeptID == '') {alert('请选中一个机构.');  return;}
    if(selectedDeptID == ORGID)  {  alert('所选机构为最顶层父结点，不可同级上移'); return ; }
    var flag = confirm("确认要将:" + SELECTED_DEPT_NAME +"上移?");
    if(flag == false) return;
    var slefData = getDeptData(selectedDeptID);
    if(slefData.leve == '1' )  {  alert('子结点不可上移至最顶层父结点'); return ; }
    var parentData = getDeptData(slefData.parentId);

    //如果机构名称不为空， 后台增加机构数据， 父节点数据暂时伪造
    var data={};
    data.deptID = selectedDeptID;
    data.parentId = parentData.parentId;
    data.leve = parentData.leve;

    Ajax_updateDept(data);

});


//机构的下级中是否重名
function isExistDepName(parentId, deptDes) {

    var result = false;
    for(var i=0; i< orgTreeData.length ; i++) {
        if( orgTreeData[i].parentId  == parentId && orgTreeData[i].orgFullDes== deptDes) {result = true; break;} 
    }

    return result;
 
}



//'添加下级'按钮被按下
$("#addChild").click(function() {
    //alert('添加下级');
    var deptDes = $('#deptDes').val();
    deptDes =  deptDes.trim();
    if(selectedDeptID == '') {alert('请选中一个机构.');  return;}
    if(deptDes == '' )  {alert('机构名称不能为空!');  $('#deptDes', this.el).focus(); return ;}

    //如果机构名称不为空， 后台增加机构数据， 父节点数据暂时伪造
    var data={};
    var parentId = selectedDeptID;
    var tmp_dep = getDeptData(parentId);

    if(parseInt(tmp_dep.leve) == 4 && SCHOOL_TYPE==1)  {alert("属于学校的组织只能有4级机构，不可在班级下设子机构。"); return ; }
    if(isExistDepName(parentId, deptDes) == true )  {alert("机构名不能重名。"); return ; }

    data.leve = parseInt(tmp_dep.leve) + 1 ;
    data.deptDes = deptDes;
    data.parentId = parentId;
    data.orgID = ORGID;

    Ajax_addDept(data);

});



//'增加同级'按钮被按下
$("#addPeer").click(function() {
    //alert('添加同级');
    var deptDes = $('#deptDes').val();
    deptDes =  deptDes.trim();
    if(selectedDeptID == '') {alert('请选中一个机构.');  return;}
    //如果选择总结点， 如‘武汉大学’，禁用‘增加同级’
    if(selectedDeptID == ORGID)  {  alert('所选机构为最顶层父结点，不可添加同级'); return ; }
    if(deptDes == '' )  {alert('机构名称不能为空!');  $('#deptDes', this.el).focus(); return ;}
    //如果机构名称不为空， 后台增加机构数据， 父节点数据暂时伪造
    var data={};
    var parentId = getParentID();   //"9abfb0c0-5303-11e6-af2d-358a86764e4c";
    if(isExistDepName(parentId, deptDes) == true )  {alert("机构名不能重名。"); return ; }
    var tmp_dep = getDeptData(parentId);

    data.leve = parseInt(tmp_dep.leve) +1 ;
    data.deptDes = deptDes;
    data.parentId = parentId;
    data.orgID = ORGID;

    Ajax_addDept(data);

});



//后台添加机构
function Ajax_addDept(data) {
    $.post('/org/Ajax_addDept', data ,
        function(dataBack) {
            if(dataBack.status == '404') {alert('机构添加失败。'); console.log(dataBack.des) ;return ;}
            if(dataBack.status == '200') {
                //更新组织树形结构
                get_OrgTree_onload_V2(true);
            } //if end
        }); //function end   //.post end
}


//获取被选中结点的父结点ID
function getParentID() {
    for(var i=0; i< orgTreeData.length ; i++) {
        if( orgTreeData[i].orgID  == selectedDeptID)  return  orgTreeData[i].parentId;
    }
}



//'删除机构'按钮被按下
$("#delDep").click(function() {

    if(selectedDeptID=='') {alert('请选择要删除的机构!'); return ;}
    var flag = confirm("确认要删除:" + SELECTED_DEPT_NAME +"?");
    if(flag == false) return;
    //如果选择组织，判断组织是否生效，如果生效不能删除，否则删除组织下的全部机构和人员。
    console.log(ORGID);
    if( selectedDeptID == ORGID) {
        delOrg();
    } else {   //删除机构下的所有子机构，以及对应的人员
        delDept();
    }

});






//删除组织, 更新组织树形结构
function delOrg() {
    //alert('删除组织');
    var data={};
    data.id = ORGID;
    $.post('/org/Ajax_delOrg', data ,
        function(dataBack) {
            if(dataBack.status == '404') {alert(dataBack.err); console.log(dataBack.err); return ;}
            if(dataBack.status == '200') {
                //更新组织树形结
                //清空全局变量，用户信息
                ORGID='',  selectedDeptID='',  SELECTED_DEPT_NAME='',  SCHOOL_TYPE='';
                depUsers  = [] ;
                get_OrgTree_onload_V2(true);
                depUserlist_Kendo(depUsers);

            } //if end
        }); //function end   //.post end
}



//删除机构
function delDept() {
    //alert('删除机构');
    var data={};
    data.id = selectedDeptID;
    $.post('/org/Ajax_delDept', data ,
        function(dataBack) {
            if(dataBack.status == '404') {alert('机构删除失败。'); console.log(dataBack.err); return ;}

            if(dataBack.status == '200') {
                //更新组织树形结构
                // get_OrgTree(ORGID);
                //清空用户信息
                depUsers  = [] ;
                selectedDeptID='',  SELECTED_DEPT_NAME='';
                get_OrgTree_onload_V2(true);
                depUserlist_Kendo(depUsers);

            } //if end

        }); //function end   //.post end

}







//更新机构
function Ajax_updateDept(data) {
    var tmp_arry = [];
    tmp_arry[0] = data;
    var str_tmp = JSON.stringify(tmp_arry);
    $.post('/org/Ajax_updateDept_arry', {models:  str_tmp} ,
        function(dataBack) {
            if(dataBack.status == '404') {alert('机构添加失败。'); console.log(dataBack.des) ;return ;}
            if(dataBack.status == '200') {
                //更新组织树形结构
                get_OrgTree_onload_V2(true);
            } //if end
        }); //function end   //.post end
}



//***********组织------结束---*******//



//***********用户选择弹出框---------*******//


function setAllBox(ele){

    var id = ele.getAttribute('id');

    if( $("#" + id).is(':checked') ) { $(":checkbox[class='box']").prop("checked",true); }   //alert('选中');
    else  { $(":checkbox[class='box']").prop("checked",false);}   //alert('没选中');
}



//***********用户选择弹出框-----结束---*******//





