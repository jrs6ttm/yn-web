
//全局变量
var  orgTreeData = [];
var userdatas = [] ,depUsers  = [] ;
var ORGID='',  selectedDeptID='',  SELECTED_DEPT_NAME='',  SCHOOL_TYPE='';




//******初始化---js----结束*****//
$(
//加载后获取org tree数据源

    function() {

        var id = GetQueryString('id');
        if(!id) {alert('ID数据不正确，数据获取失败');  return ;}
        ORGID = id;
        //get_OrgTree_onload(id);

        get_OrgTree_onload_V2(id);

    }); // function end  //  $() end


//******初始化---js----结束*****//




//***********组织---JS----*******//

//以远程Read的形式打开

function get_OrgTree_onload_V2(id) {
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
                expanded: false
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
                template: " <a id='node_#=orgID#' class='treeNode' oid='#=orgID#' name='#=orgFullDes#' onclick='onSelectedOrg(this)'  " +
                " ondblclick=\"ShowOrHidden('node_#=orgID#' ,'hid_#=orgID#' , 'flag_#=orgID#' )\"  > #=orgFullDes# </a> " +
                "  <span><input onblur=\"ShowOrHidden( 'node_#=orgID#' ,'hid_#=orgID#' , 'flag_#=orgID#')\" id='hid_#=orgID#' hidden style='width:130px; height:20px;' value='#=orgFullDes#' > </span>    " +
                "<span> <input  id='flag_#=orgID#' hidden value='0' > </span>" ,
                expandable: false, title: "", width: 80 ,
                autoBind: false,
                attributes: {style: "text-align: left;" }
            },
        ]

    });

}



//以相关功能处理过后打开

function get_OrgTree_fun_V3() {


    $("#treelist").empty();

    var dataSource = new kendo.data.TreeListDataSource({
        transport: {
            read:  {
                url: "/org/Ajax_getOrgTree_read?id=" + ORGID,
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

        sync: function(e) {
            //alert("sync complete");
        },


        schema: {
            model: {
                id: "orgID",
                expanded: true
            }
        }


    });



    $("#treelist").kendoTreeList({
        dataSource: dataSource,

        height : 510,
        width:  250,
        columns: [
            {
                //field: "orgFullDes",
                template: " <a id='node_#=orgID#' class='treeNode' oid='#=orgID#' name='#=orgFullDes#' onclick='onSelectedOrg(this)'  " +
                " ondblclick=\"ShowOrHidden('node_#=orgID#' ,'hid_#=orgID#' , 'flag_#=orgID#' )\"  > #=orgFullDes# </a> " +
                "  <span><input onblur=\"ShowOrHidden( 'node_#=orgID#' ,'hid_#=orgID#' , 'flag_#=orgID#')\" id='hid_#=orgID#' hidden style='width:130px; height:20px;' value='#=orgFullDes#' > </span>    " +
                "<span> <input  id='flag_#=orgID#' hidden value='0' > </span>" ,
                // expandable: false, title: "", width: 80 ,
                autoBind: false,
                attributes: {style: "text-align: left;" }
            },
        ]

    });

    //if(selectedDeptID)  reSelectedClor();

}



//重新为选中机构赋颜色
function  reSelectedClor() {
    //alert(22);

    $('a.treeNode').css("background-color","white");

    $("#node_" + selectedDeptID).css("background-color","#00ff00");

    console.log($("#node_" + selectedDeptID));
}




//加载的时候使用， 获取组织树形数据，并网页初始化
function get_OrgTree_onload(id) {

    var data = {};
    var orgID = id;
    console.log(orgID);

    data.orgID = orgID;
    if(!data.orgID) {alert('ID数据不正确，数据获取失败');  return ;}

    //console.log(data);
    $.post('/org/Ajax_getOrgTree', data ,

        function(dataBack) {
            if(dataBack.status == '404') {alert('数据获取失败。'); console.log(dataBack.des) ;return ;}

            if(dataBack.status == '200') {
                orgTreeData = dataBack.docData;
                //console.log(orgTreeData);
                //初始化Org 树形列表
                SCHOOL_TYPE = orgTreeData[0].schoolType;
                console.log('学校类型,' + SCHOOL_TYPE  );
                onloadTree_onload(orgTreeData);
            } //if end
        }); //function end   //.post end
}


//加载的时候使用，初始化Org 树形列表
function onloadTree_onload(datas) {
    console.log('tree data', datas);
    var tree_data = new kendo.data.TreeListDataSource({
        //{ orgId: 1, orgShortDes: "武汉理工大学",  parentId: null },
        //{ orgId: 2, orgShortDes: "计算机学院", parentId: 1 },
        data: datas   ,
        schema: {
            model: {
                id: "orgID",
                expanded: false
            }
        }
    });

    //tree_data.sync();


    $("#treelist").kendoTreeList({
        dataSource: tree_data,
        height : 510,
        width:  250,
        columns: [
            {
                //field: "orgFullDes",
                template: " <a id='node_#=orgID#' class='treeNode' oid='#=orgID#' name='#=orgFullDes#' onclick='onSelectedOrg(this)'  " +
                " ondblclick=\"ShowOrHidden('node_#=orgID#' ,'hid_#=orgID#' , 'flag_#=orgID#' )\"  > #=orgFullDes# </a> " +
                "  <span><input onblur=\"ShowOrHidden( 'node_#=orgID#' ,'hid_#=orgID#' , 'flag_#=orgID#')\" id='hid_#=orgID#' hidden style='width:130px; height:20px;' value='#=orgFullDes#' > </span>    " +
                "<span> <input  id='flag_#=orgID#' hidden value='0' > </span>" ,
                expandable: false, title: "", width: 80 ,
                autoBind: false,
                attributes: {style: "text-align: left;" }
            },
        ]
        //autoBind: true
    });


    //var treeList = $("#treeList").data("kendoTreeList");
    //treeList.refresh();



}









//获取组织树形数据，并网页初始化
function get_OrgTree(id) {

    var data = {};
    var orgID = id;
    console.log(orgID);

    data.orgID = orgID;
    if(!data.orgID) {alert('ID数据不正确，数据获取失败');  return ;}

//console.log(data);
    $.post('/org/Ajax_getOrgTree', data ,

        function(dataBack) {
            if(dataBack.status == '404') {alert('数据获取失败。'); console.log(dataBack.des) ;return ;}

            if(dataBack.status == '200') {
                orgTreeData = dataBack.docData;
                //console.log(orgTreeData);
                SCHOOL_TYPE = orgTreeData[0].schoolType;
                console.log('学校类型,' + SCHOOL_TYPE  );
                //初始化Org 树形列表
                onloadTree(orgTreeData);
            } //if end
        }); //function end   //.post end
}


//初始化Org 树形列表
function onloadTree(datas) {
    console.log('tree data', datas);
    var tree_data = new kendo.data.TreeListDataSource({
        //{ orgId: 1, orgShortDes: "武汉理工大学",  parentId: null },
        //{ orgId: 2, orgShortDes: "计算机学院", parentId: 1 },
        data: datas   ,
        schema: {
            model: {
                id: "orgID",
                expanded: true
            }
        }
    });

    // tree_data.sync();

    $("#treelist").kendoTreeList({
        dataSource: tree_data,
        height : 510,
        columns: [
            {
                //field: "orgFullDes",
                template: " <a id='node_#=orgID#' class='treeNode' oid='#=orgID#' name='#=orgFullDes#' onclick='onSelectedOrg(this)'  " +
                " ondblclick=\"ShowOrHidden('node_#=orgID#' ,'hid_#=orgID#' , 'flag_#=orgID#' )\"  > #=orgFullDes# </a> " +
                "  <span><input onblur=\"ShowOrHidden( 'node_#=orgID#' ,'hid_#=orgID#' , 'flag_#=orgID#')\" id='hid_#=orgID#' hidden style='width:130px; height:20px;' value='#=orgFullDes#' > </span>    " +
                "<span> <input  id='flag_#=orgID#' hidden value='0' > </span>" ,
                expandable: false, title: "", width: 80 ,
                autoBind: false,
                attributes: {style: "text-align: left;" }
            },
        ],
        editable: true
    });


    var treeList = $("#treeList").data("kendoTreeList");
    treeList.refresh();



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

    //console.log(selectedDeptID);
    showDepUsers_selected();

}


//'查询'按钮被按下
$("#depUserSearch").click(function() {

    if(selectedDeptID == '') {alert('请选中一个机构.');  return;}

    var userAccount = $('#userAccount').val();  userAccount =  userAccount.trim();
    var userName = $('#userName').val(); userName =  userName.trim();

    //如果机构名称不为空， 后台增加机构数据， 父节点数据暂时伪造
    var data={};
    //data.deptID = selectedDeptID;
    if(userAccount)  data.userID = userAccount;
    if(userName)  data.name = userName;

    showDepUsers_selected_V2(data);


});


//对机构的用户信息查询
function showDepUsers_selected_V2(data) {
    //console.log('UUU:', data);
    $("#grid").empty();
    var dataSource = new kendo.data.DataSource({
        // data: [{'userID': 555}],

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
            //console.log(response.length); // displays "77"
            //console.log(response);
            depUsers =  response;
        },

        batch: true,
        pageSize: 12 ,

        schema: {
            model: {
                id: "DeptPeoID",
            }
        }

    });

    //console.log(dataSource.data());
    $("#grid").kendoGrid({
        dataSource:dataSource,
        //pageable: true,
        pageable: {
            buttonCount: 3
        },

        height: 678,
        toolbar: [ ],
        columns: [
            { field: "userID",title:"<div align='center'>用户账号</div>", width: "100px" },
            { field: "name", title:"<div align='center'>姓名</div>",  width: "80px" },
            { title: "<div align='center'>审核状态</div>", width: "100px",  template: " #if(checkStatus=='0'){#<div id='divCheck_#=DeptPeoID#'>未审核</div>#}else if(checkStatus=='1'){#<div id='divCheck_#=DeptPeoID#'>已审核</div>#}# " },
            { field: "rolename", title:"<div align='center'>角色</div>",  width: "80px" },
            // { field: "sex",title:"性别", width: "70px" },
            // { template: " <select id='sex_#=DeptPeoID#' dp='#=DeptPeoID#' onchange='updateSex(this, this.value)'><option value='0'>选择性别</option> <option  #if(sex=='1') { #selected# }# value='1'>女</option> <option  #if(sex=='2') { #selected# }# value='2'>男</option> </select> ",title:"性别", width: "100px"},
            //{ field: "tel",title:"<div align='center'>联系电话</div>", width: "120px" },
            //{ field: "address",title:"<div align='center'>家庭地址</div>", width: "130px" },
            // { command: "destroy", title: "操作", width: "100px" }
            {title: "<div align='center'>操作</div>", template: " <button class='btn btn-danger' style ='width: 50px' id='del_#=DeptPeoID#' userid='#=userID#' dp='#=DeptPeoID#' onclick='delDepUser(this)' >  删除 </button> " +
            "#if(checkStatus=='0'){#<button class='btn btn-success' style ='width: 50px' id='check_#=DeptPeoID#' dp='#=DeptPeoID#' onclick='updateCheck(this)' >  审核通过 </button> #}#"+
            "#if(isProxy=='0'){#<button class='btn btn-primary' style ='width: 80px' id='proxy_#=DeptPeoID#' dp='#=DeptPeoID#' onclick='updateProxy(this, 1)' >  设为代理人 </button>#} " +
            "else if(isProxy=='1') {# <button class='btn btn-warning' style ='width: 80px'  id='proxy_#=DeptPeoID#' dp='#=DeptPeoID#' onclick='updateProxy(this, 0)'  >  取消代理资格 </button> #}#"
            },
        ],

        editable: true
    });


}





//对机构的用户信息初始化
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


    //console.log(dataSource.data());
    $("#grid").kendoGrid({
        dataSource:dataSource,
        //pageable: true,
        pageable: {
            buttonCount: 3
        },
        height: 678,
        toolbar: [ ],
        columns: [
            { field: "userID",title:"<div align='center'>用户账号</div>", width: "100px" },
            { field: "name", title:"<div align='center'>姓名</div>",  width: "80px" },
            { title: "<div align='center'>审核状态</div>", width: "100px",  template: " #if(checkStatus=='0'){#<div id='divCheck_#=DeptPeoID#'>未审核</div>#}else if(checkStatus=='1'){#<div id='divCheck_#=DeptPeoID#'>已审核</div>#}# " },
            { field: "rolename", title:"<div align='center'>角色</div>",  width: "80px" },
            // { field: "sex",title:"性别", width: "70px" },
            // { template: " <select id='sex_#=DeptPeoID#' dp='#=DeptPeoID#' onchange='updateSex(this, this.value)'><option value='0'>选择性别</option> <option  #if(sex=='1') { #selected# }# value='1'>女</option> <option  #if(sex=='2') { #selected# }# value='2'>男</option> </select> ",title:"性别", width: "100px"},
            //{ field: "tel",title:"<div align='center'>联系电话</div>", width: "120px" },
            //{ field: "address",title:"<div align='center'>家庭地址</div>", width: "130px" },
            // { command: "destroy", title: "操作", width: "100px" }
            // "#if(isProxy=='0'){#<button class='btn btn-primary btn-xs' style ='width: 80px' id='proxy_#=DeptPeoID#' dp='#=DeptPeoID#' onclick='updateProxy(this, 1)' >  设为代理人 </button>#} "
            {title: "<div align='center'>操作</div>", template: " <button class='btn btn-danger btn-xs' style ='width: 50px' id='del_#=DeptPeoID#' userid='#=userID#' dp='#=DeptPeoID#' onclick='delDepUser(this)' >  删除 </button> " +
            "#if(checkStatus=='0'){#<button class='btn btn-success btn-xs' style ='width: 50px' id='check_#=DeptPeoID#' dp='#=DeptPeoID#' onclick='updateCheck(this)' >  审核通过 </button> #}#"

            },

        ],
        editable: false
    });

}



//审核通过用户
function updateCheck(ele) {
    var DeptPeoID = ele.getAttribute('dp');
    var data={};
    data = { "DeptPeoID"  : DeptPeoID ,  "checkStatus" : '1' };
    var  data = JSON.stringify(data);
    var data2 = {models: data};

    $.post('/org/Ajax_updateDeptPeo_json', data2 ,
        function(dataBack) {
            if(dataBack.status == '404') {alert('审核操作失败'); console.log(dataBack.err); return ;}

            if(dataBack.status == '200') {
                //更新组织树形结构
                //alert('审核成功');
                $("#check_" + DeptPeoID).hide();
                $("#divCheck_" + DeptPeoID).text("已通过");

            } //if end
        }); //function end   //.post end

}




//删除机构用户
function updateProxy(ele, flag) {

    //var flag = confirm("确定要设置代理人?" );
    //if(flag == false) return;

    var DeptPeoID = ele.getAttribute('dp');

    var data={};
    data = { "DeptPeoID"  : DeptPeoID ,  "isProxy" : flag };

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

    setBackgroud(grandParent);

}


//对table的tr赋值颜色
function setBackgroud(ele) {

    // var trr =  ele.children();
    // console.log(trr);




}





//更新性别
function updateSex(ele) {

    var DeptPeoID = ele.getAttribute('dp');
    //alert(DeptPeoID);
    var sex = ele.value;      //$('#sex_' + DeptPeoID).val();
    //alert(sex);
    var data={};
    data.DeptPeoID = DeptPeoID;
    data.sex = sex;

    var  data = JSON.stringify(data);

    var data2 = {models: data};

    $.post('/org/Ajax_updateDeptPeo_json', data2 ,
        function(dataBack) {
            if(dataBack.status == '404') {alert('性别更新失败。'); console.log(dataBack.err); return ;}

            if(dataBack.status == '200') {
                //更新组织树形结构

            } //if end
        }); //function end   //.post end

}



//‘组织维护’链接被点击
$("#editOrg").click(function(){
    var url = "/org/org_edit?id=" + ORGID ;
    window.location.href=url;
});









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

//机构的下级中是否重名
function isExistDepName(parentId, deptDes) {
    //console.log(999999);
    var result = false;
    for(var i=0; i< orgTreeData.length ; i++) {
        if( orgTreeData[i].parentId  == parentId && orgTreeData[i].orgFullDes== deptDes) {result = true; break;} 
    }

    return result;
 
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
                get_OrgTree_fun_V3();
                showDepUsers(depUsers);



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
                get_OrgTree_fun_V3();
                showDepUsers(depUsers);

            } //if end

        }); //function end   //.post end

}



//后台添加机构
function Ajax_addDept(data) {
    $.post('/org/Ajax_addDept', data ,

        function(dataBack) {
            if(dataBack.status == '404') {alert('机构添加失败。'); console.log(dataBack.des) ;return ;}

            if(dataBack.status == '200') {
                //更新组织树形结构
                get_OrgTree_fun_V3();


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
                get_OrgTree_fun_V3();



            } //if end

        }); //function end   //.post end


}





//***********组织---JS---结束---*******//








//***********用户选择弹出框---JS------*******//



//'重置'按钮被点击后，弹出选择用户的界面
$("#userSet").click(function() {
    $('#uid').val('');
    $('#displayname').val('');
    $('#email').val('');

});



//'新增'按钮被点击后，弹出选择用户的界面
$("#addUser").click(function() {
    if(selectedDeptID=='') {alert('请选择要删除的机构!'); return ;}
    $('#myModal').modal('show');
});


//'查询'按钮被点击后，弹出选择用户的界面
$("#userSearch").click(function() {
    var uid = $('#uid').val();
    var displayname = $('#displayname').val();
    var email = $('#email').val();
    uid = uid.trim(); displayname = displayname.trim();  email = email.trim();
    if(uid == '' && displayname == '' &&  email == '' )  {alert('查询条件，不能全为空。'); return;}

    //初始化data， 并请求后台数据
    var data = {};
    data.uid = uid;  data.displayname = displayname;  data.email = email; data.orgid = ORGID;
    //获取User信息
    Ajax_searchUsers(data);
});



//检查用户是否存在于选择的机构用户中，是返回True, 否则返回false
function IsUserExist(synid) {
    var res = false;

    for(var i=0; i< depUsers.length; i++  ) {
        if(depUsers[i].synid == synid) {res = true; return true;}
    }

    return res;

}


//获取User信息
function Ajax_searchUsers(data) {

    $.post('/org/Ajax_searchUsers', data ,

        function(dataBack) {
            if(dataBack.status == '404') {alert('机构添加失败。'); console.log(dataBack.des) ;return ;}

            if(dataBack.status == '200') {
                //更新用户树形结构
                console.log(dataBack.docData);
                var tmp_data = dataBack.docData;
                var roles =  dataBack.roles;
                console.log("角色数据",roles);
                var orgRolesHtml = makeHtml_orgRoles(roles);
                userdatas=[];
                var j=-1;
                for(var i=0; i<tmp_data.length; i++ ) {  //已经存在的用户
                    if( IsUserExist(tmp_data[i].synid) == false  )  {
                        j++;
                        tmp_data[i].orgRoleList =orgRolesHtml;
                        userdatas[j] =  tmp_data[i];

                    }  //if end

                }  //for end

                showUserTree(userdatas);
                // get_OrgTree(GetQueryString('id'));

            } //if end

        }); //function end   //.post end

}

//   for( i=0; i<roles.length ; i++) {
//     res = res + "<option > </option>";

//   }

function makeHtml_orgRoles(roles) {
    //console.log(roles);
    var i, res = '';
    for(i=0;i<roles.length;i++){
        res=res + "<option  value='" + roles[i].orgRoleID +"' > " + roles[i].name +" </option>"
    }

    return res;
}





//'关闭'按钮被点击后，弹出选择用户的界面
$("#userClosed").click(function() {
    userdatas=[];
    showUserTree(userdatas);

});




//"确定选择"按钮被点击后，弹出选择用户的界面
$("#userSure").click(function() {

    if(selectedDeptID == '' ) alert('未选择机构， 用户添加失败！');

    var addusers = depUsers, j=-1;
    var tmp_arr = [];

    var dataSource= new kendo.data.DataSource({data:addusers});

    for(var i=0;i<userdatas.length; i++ ) {  //循环遍历  userdatas[i]

        if( $("#"+ userdatas[i].synid ).is(':checked') )  {
            j++;
            var role_type = $("#roleID_" + userdatas[i].synid).val();
            tmp_arr[j] = {
                synid: userdatas[i].synid ,
                userID:  userdatas[i].userid,
                name: userdatas[i].displayname ,
                orgID:  ORGID,
                deptID: selectedDeptID,
                orgRoleID :　role_type
            };
        } //if end
    }  //for end

    //  depUsers   将选中的user添加到机构用户中，并向后端发送请求添加机构用户




    var arrystr = JSON.stringify(tmp_arr);
    $.ajax({
        url: '/org/Ajax_insertUser_arry',
        //data: { "selectedIDs": _list },
        data :{str: arrystr} ,
        dataType: "json",
        type: "POST",
        //traditional: true,
        success: function (dataBack) {

            if(dataBack.status == '404') {alert('用户添加失败'); console.log(dataBack.err) ;}

            if(dataBack.status == '200') {
                //如果用户添加成功，先更新机构用户， 在情况查询用户数据， 最后关闭摸态框。
                showDepUsers_selected();
                userdatas=[];
                showUserTree(userdatas);  //清空查询用户数据

                $('#myModal').modal('hide');
            }


        }

    });



});



function  showUserTree(userdatas) {

    $("#singleSort").empty();
    var dataSource = new kendo.data.DataSource({
        data: userdatas,
        autoSync: true,
        pageSize : 12,
    });


    $("#singleSort").kendoGrid({
        dataSource: dataSource,
        pageable: {
            buttonCount: 3
        },
        height: 400,
        columns: [
            {
                template: "<input class='box' type='checkbox' id='#=synid#'  >",
                title: "<div align='center'> <input onclick='setAllBox(this)' type='checkbox' id='boxControl'  > </div>",
                width: 30
            },
            {
                field: "userid",
                title: "<div align='center'>用户账户</div>",
                width: 150
            },

            {
                //field: "orgRoleID",   " <select id='role_#=orgRoleID#' rid='#=orgRoleID#'  ><option value='0'>选择性别</option> <option  #if(sex=='1') { #selected# }# value='1'>女</option> <option  #if(sex=='2') { #selected# }# value='2'>男</option> </select> ",
                template: " <select id='roleID_#=synid#' > #=orgRoleList# </select> ",
                title: "<div align='center'>选择角色</div>",
                //title: "<div align='center'>用户账户</div>",
                width: 150
            },

            {
                field: "displayname",
                title: "<div align='center'>全名</div>",
                width: 100
            },
            {
                field: "email",
                title: "<div align='center'>邮件地址</div>",
                width: 150
            },
        ],
        editable: true
    });


}


function setAllBox(ele){

    var id = ele.getAttribute('id');

    if( $("#" + id).is(':checked') ) { $(":checkbox[class='box']").prop("checked",true); }   //alert('选中');
    else  { $(":checkbox[class='box']").prop("checked",false);}   //alert('没选中');
}






//***********用户选择弹出框---JS---结束---*******//






//***********机构用户---JS------****************//

$(document).ready(function () {
    //初始化机构用户
    var data=[];

    showDepUsers(data)

});


//对机构的用户信息初始化
function showDepUsers(datas) {
    $("#grid").empty();

    var dataSource = new kendo.data.DataSource({

        pageSize: 12,
        data: datas,
        //autoSync: true,

        schema: {
            model: {
                id: "synid"
            }
        }

    });


    $("#grid").kendoGrid({
        dataSource: dataSource,
        //pageable: true,
        pageable: {
            buttonCount: 3
        },

        height: 678,
        toolbar: [],


        columns: [
            { field: "userID",title:"<div align='center'>用户账号</div>", width: "100px" },
            { field: "name", title:"<div align='center'>姓名</div>",  width: "80px" },
            { field: "rolename", title:"<div align='center'>角色</div>",  width: "80px" },
            { command: "destroy", title: "<div align='center'>操作</div>", width: "100px" }],
        editable: true
    });


}



//***********机构用户------结束---*************//












