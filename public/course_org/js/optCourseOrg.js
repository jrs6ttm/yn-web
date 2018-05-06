/**
 * Created by Administrator on 2015/11/20.
 */
(function($){
    var Course_Org_Panel =
                '<ul class="nav nav-tabs nav-justified" style="margin-bottom:30px;">'+
                    '<li class="active myTabsLi" data-tab = "tab1"><a href="javascript:void(0);">课程组织_设置基本信息</a></li>'+
                    '<li class="myTabsLi" data-tab = "tab2"><a href="javascript:void(0);">课程组织_设置人员信息</a></li>'+
                '</ul>'+
                '<div class="myTabsDiv tab1" data-org-id="<%=LRNSCN_ORG_ID%>">'+
                    '<div class="row" style="margin-bottom:15px;">'+
                    '<!--'+
                        '<div class="col-sm-2" align="right"><span >课程名称:</span></div>'+
                        '<div class="col-sm-4 form-inline">'+
                            '<input type="text" class="form-control setCourseOrg" name="LRN_AREA_NAME" value="<%=LRN_AREA_NAME%>" disabled="disabled" />'+
                            '<input type="hidden" class="form-control setCourseOrg" name="LRN_AREA_ID" value="<%=LRN_AREA_ID%>" />'+
                            '<span style="color:red" title="必填项"> *</span>'+
                        '</div>'+
                    '-->'+
                        '<span class="col-sm-1" align="right">课程名称:</span>'+
                        '<div class="col-sm-3 form-inline" title="必填项">'+
                            '<input type="text" class="form-control setCourseOrg" name="INSTANCE_NAME" value="<%=INSTANCE_NAME%>" disabled="disabled" />'+
                            '<input type="hidden" class="form-control setCourseOrg" name="INSTANCE_ID" value="<%=INSTANCE_ID%>"/>'+
                            '<span style="color:red"> *</span>'+
                        '</div>'+

                        '<span class="col-sm-1" align="right">开始时间:</span>'+
                        '<div class="col-sm-3 form-inline" title="必填项">'+
                            '<input type="text" class="form-control  setCourseOrg time" id="BEGIN_TIME" readonly style="cursor: pointer;" <%if(optType=="look"){%>disabled="disabled"<%}%> name="BEGIN_TIME" value="<%=BEGIN_TIME%>">'+
                            '<span style="color:red"> *</span>'+
                        '</div>'+
                        '<span class="col-sm-1" align="right">结束时间:</span>'+
                        '<div class="col-sm-3 form-inline" title="必填项">'+
                            '<input type="text" class="form-control  setCourseOrg time" id="END_TIME" readonly style="cursor: pointer;" <%if(optType=="look"){%>disabled="disabled"<%}%> name="END_TIME" value="<%=END_TIME%>">'+
                            '<span style="color:red"> *</span>'+
                        '</div>'+
                    '</div>'+

                    '<div class="row" style="margin-bottom:15px;">'+
                        '<span class="col-sm-1" align="center">组织单位:</span>'+
                        '<div class="col-sm-3 form-inline">'+
                            '<select class="form-control setCourseOrg" name="CREATOR_ORGID_NAME" style="width:74%"></select>'+
                            '<span style="color:red"> *</span>'+
                        '</div>'+
                        '<span class="col-sm-1" align="right">组织机构:</span>'+
                        '<div class="col-sm-3 form-inline" title="必填项">'+
                            '<input type="text" class="form-control  setCourseOrg pre_select_organization" readonly style="cursor: pointer;" <%if(optType=="look"){%>disabled="disabled"<%}%> name="CREATOR_GID_NAME" value="<%=CREATOR_GID_NAME%>">'+
                            '<input type="hidden" class="form-control setCourseOrg" name="CREATOR_GID" value="<%=CREATOR_GID%>"/>'+
                            '<span style="color:red"> *</span>'+
                        '</div>'+
                    '</div>'+

                    '<div class="row" style="margin-bottom:15px;">'+
                        '<span class="col-sm-1" align="right">负责老师:</span>'+
                        '<div class="col-sm-3 form-inline" title="必填项">'+
                            '<input type="text" class="form-control setCourseOrg pre_select_person" readonly style="cursor: pointer;" <%if(optType=="look"){%>disabled="disabled"<%}%> name="TEACHER_NAME" value="<%=TEACHER_NAME%>">'+
                            '<input type="hidden" class="form-control setCourseOrg" name="TEACHER_ID" value="<%=TEACHER_ID%>" />'+
                            '<span style="color:red"> *</span>'+
                        '</div>'+
                        '<span class="col-sm-1" align="right">组织人:</span>'+
                        '<div class="col-sm-3 form-inline" title="必填项">'+
                            '<input type="text" class="form-control  setCourseOrg pre_select_person" readonly style="cursor: pointer;" <%if(optType=="look"){%>disabled="disabled"<%}%> name="ORG_USER_NAME" value="<%=ORG_USER_NAME%>">'+
                            '<input type="hidden" class="form-control setCourseOrg" name="ORG_USER_ID" value="<%=ORG_USER_ID%>"/>'+
                            '<span style="color:red"> *</span>'+
                        '</div>'+
                    '</div>'+

                    '<div class="row" style="margin-bottom:25px;">'+
                        '<span class="col-sm-1" align="right">组织摘要:</span>'+
                        '<div class="col-md-11">'+
                                '<div id="toFillInBlankItem">'+
                                    '<textarea  class="form-control setCourseOrg" rows="8" <%if(optType=="look"){%>disabled="disabled"<%}%> name="REMARK" ><%=REMARK%></textarea>'+
                                '</div>'+
                        '</div>'+
                    '</div>'+

                    '<div style="float:right;">'+
                        '<button type="button" name="back"  class="btn btn-info btn-sm optCourseOrg">返 回</button>&nbsp;&nbsp;'+
                        '<%if(optType=="edit"){%>'+
                            '<button type="button" name="update"  class="btn btn-info btn-sm optCourseOrg">保 存</button>&nbsp;&nbsp;'+
                            '<button type="button" name="reset"  class="btn btn-info btn-sm optCourseOrg">重 置</button>&nbsp;&nbsp;'+
                            '<!--<button type="button" name="end"  class="btn btn-info btn-sm optCourseOrg">结束组织</button>&nbsp;&nbsp;'+
                            '<button type="button" name="delete"  class="btn btn-info btn-sm optCourseOrg">撤销组织</button>-->'+
                        '<%}%>'+
                    '</div>'+
                '</div>'+
                '<div class="myTabsDiv tab2" style="display:none;margin-bottom:30px;">'+
                    '<div class="row alert alert-info" style="margin-bottom:20px;"><div class="col-sm-5"><div class="col-sm-7">组内角色的人数范围为：</div><div class="col-sm-5">[<%=MIN_ROLE%>， <%=MAX_ROLE%>]</div></div></div>'+
                    '<!--<div class="row" style="margin-bottom:15px;">'+
                        '<span class="col-sm-2" align="center">课程名称:</span>'+
                        '<div class="col-sm-4">'+
                            '<input type="text" class="form-control" name="LRN_AREA_NAME" value="<%=LRN_AREA_NAME%>" disabled="disabled" />'+
                            '<input type="hidden" class="form-control" name="LRN_AREA_ID" value="<%=LRN_AREA_ID%>" />'+
                        '</div>'+
                        '<span class="col-sm-2" align="center">学习情境:</span>'+
                        '<div class="col-sm-4">'+
                            '<input type="text" class="form-control" name="INSTANCE_NAME" value="<%=INSTANCE_NAME%>" disabled="disabled" />'+
                            '<input type="hidden" class="form-control" name="INSTANCE_ID" value="<%=INSTANCE_ID%>"/>'+
                        '</div>'+
                    '</div><hr />-->'+
                    '<div class="row" style="margin-bottom:15px;">'+
                        '<div class="col-sm-4" style="border-right:1px solid #d0d0d0">'+
                            '<h4 align="center"><strong>分组情况</strong></h4><hr />'+
                            '<div class="row" style="margin-bottom:5px;">'+
                                '<span class="col-sm-4" align="right">分组名称:</span>'+
                                '<div class="col-sm-8">'+
                                    '<input type="text" <%if(optType=="look"){%>disabled="disabled"<%}%> class="form-control newGroup" placehoder="请添加一个分组~"/>'+
                                '</div>'+
                            '</div>'+
                            '<div style="margin-bottom:20px;">'+
                                '<button type="button" style="float:right;" class="btn btn-info btn-sm addNewGroup" <%if(optType=="look"){%>disabled="disabled"<%}%>>增 加</button>&nbsp;&nbsp;'+
                            '</div>'+
                            '<div style="height:400px;overflow-y:auto;" id="course_groups"></div>'+
                        '</div>'+
                        '<div class="col-sm-8">'+
                            '<h4 align="center"><strong>人员情况</strong></h4><hr />'+
                            '<div class="row" style="margin-bottom:15px;">'+
                                '<span class="col-sm-2" align="right">人员类型:</span>'+
                                '<div class="col-sm-8">'+
                                    '<label class="checkbox-inline">'+
                                       '<input type="radio" name="person_type_radio"  value="1" checked>&nbsp;学生'+
                                    '</label>'+
                                    '<label class="checkbox-inline">'+
                                       '<input type="radio" name="person_type_radio"  value="2">&nbsp;老师'+
                                    '</label>'+
                                '</div>'+
                            '</div>'+
                            '<div class="row" style="margin-bottom:15px;">'+
                                '<span class="col-sm-2" align="right">机构:</span>'+
                                '<div class="col-sm-3">'+
                                    '<input class="form-control" name="orgs" org_ID=""  deptID="" disabled="disabled" />'+
                                '</div>'+
                                '<div class="col-sm-1">'+
                                    '<button type="button" name="tab2_pre_select_organization"  class="btn btn-info btn-sm pre_select_organization" <%if(optType=="look"){%>disabled="disabled"<%}%>>选 择</button>&nbsp;&nbsp;'+
                                '</div>'+
                                '<span class="col-sm-2" align="right">人员:</span>'+
                                '<div class="col-sm-3">'+
                                    '<input type="text" class="form-control" name="persons" disabled="disabled" />'+
                                '</div>'+
                                '<div class="col-sm-1">'+
                                    '<button type="button" name="tab2_pre_select_person"  class="btn btn-info btn-sm pre_select_person" <%if(optType=="look"){%>disabled="disabled"<%}%> >选 择</button>&nbsp;&nbsp;'+
                                '</div>'+
                            '</div>'+

                            '<div style="height:400px;overflow-y:auto;">'+
                                '<div class="modal fade" id="editPersonPanel" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
                                    '<div class="modal-dialog">'+
                                        '<div class="modal-content">'+
                                            '<div class="modal-header">'+
                                                '<button type="button" class="close"data-dismiss="modal" aria-hidden="true">&times;</button>'+
                                                '<h4>编辑人员信息</h4>'+
                                            '</div>'+
                                            '<div class="modal-body" style="margin-top: 20px;margin-bottom: 20px;">'+
                                                '<div class="row" style="margin-bottom: 5px;">'+
                                                    '<span class="col-sm-3" align="right">用户账号:</span>'+
                                                    '<div class="col-sm-8">'+
                                                        '<input type="text" class="form-control updateUser" name="USER_ID"disabled="disabled"  />'+
                                                    '</div>'+
                                                '</div>'+
                                                '<div class="row" style="margin-bottom: 5px;">'+
                                                    '<span class="col-sm-3" align="right">姓 名:</span>'+
                                                    '<div class="col-sm-8">'+
                                                        '<input type="text" class="form-control updateUser" name="NAME" disabled="disabled"  />'+
                                                    '</div>'+
                                                '</div>'+
                                                '<div class="row" style="margin-bottom: 5px;">'+
                                                    '<span class="col-sm-3" align="right">性 别:</span>'+
                                                    '<div class="col-sm-8">'+
                                                        '<input type="text" class="form-control updateUser" name="SEX" disabled="disabled"  />'+
                                                    '</div>'+
                                                '</div>'+
                                                '<div class="row" style="margin-bottom: 5px;">'+
                                                    '<span class="col-sm-3" align="right">所属机构:</span>'+
                                                    '<div class="col-sm-8">'+
                                                        '<input type="text" class="form-control updateUser" name="DEPT_FULL_DES" disabled="disabled"  />'+
                                                    '</div>'+
                                                '</div>'+
                                                '<div class="row" style="margin-bottom: 5px;">'+
                                                    '<span class="col-sm-3" align="right">个人擅长:</span>'+
                                                    '<div class="col-sm-8">'+
                                                        '<input type="text"  class="form-control updateUser" name="SKILL"  />'+
                                                    '</div>'+
                                                '</div>'+
                                                '<div class="row" style="margin-bottom: 5px;">'+
                                                    '<span class="col-sm-3" align="right">备注:</span>'+
                                                    '<div class="col-sm-8">'+
                                                        '<input type="text"  class="form-control updateUser" name="REMARK"  />'+
                                                    '</div>'+
                                                '</div>'+
                                            '</div>'+
                                            '<div class="modal-footer">'+
                                                '<button type="button" class="btn btn-info optPerson" name="update">确 定</button>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                                '<div id="roleUsersGrid"></div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                    '<div style="float:right;">'+
                        '<button type="button"  class="btn btn-info btn-sm optGroupInfo" name="back">返 回</button>&nbsp;&nbsp;'+
                        '<%if(optType=="edit"){%>'+
                            '<button type="button"  class="btn btn-info btn-sm optGroupInfo" name="save">保 存</button>&nbsp;&nbsp;'+
                            '<button type="button" name="complete"  class="btn btn-info btn-sm optGroupInfo">完成组织</button>&nbsp;&nbsp'+
                            '<!--<button type="button"  class="btn btn-info btn-sm optGroupInfo" name="reset">重 置</button>&nbsp;&nbsp;-->'+
                        '<%}%>'+
                    '</div>'+
                '</div>'+
                '<div class="modal fade" id="selectOrgPanel" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
                    '<div class="modal-dialog">'+
                        '<div class="modal-content">'+
                            '<div class="modal-header">'+
                                '<button type="button" class="close"data-dismiss="modal" aria-hidden="true">&times;</button>'+
                                '<h4><strong>选择组织机构:</strong></h4>'+
                            '</div>'+
                            '<div class="modal-body">'+
                                '<div id="deptTreeGrid" style="height:550px;"></div>'+
                            '</div>'+
                            '<div class="modal-footer">'+
                                '<button type="button" class="btn btn-info select_organization">确 定</button>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
                '<div class="modal fade" id="selectPersonPanel" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
                    '<div class="modal-dialog">'+
                        '<div class="modal-content">'+
                            '<div class="modal-header">'+
                                '<button type="button" class="close"data-dismiss="modal" aria-hidden="true">&times;</button>'+
                                '<h4><strong>选择人员:</strong></h4>'+
                            '</div>'+
                            '<div class="modal-body">'+
                                '<div class="row" style="margin-bottom:15px;">'+
                                    '<span class="col-sm-2" align="right">用户账号:</span>'+
                                    '<div class="col-sm-4 form-inline">'+
                                        '<input type="text" class="form-control searchOrgUser" name="userID" />'+
                                    '</div>'+
                                    '<span class="col-sm-2" align="right">姓名:</span>'+
                                        '<div class="col-sm-4 form-inline">'+
                                        '<input type="text" class="form-control searchOrgUser" name="name" />'+
                                    '</div>'+
                                '</div>'+
                                '<div class="row" style="margin-bottom: 25px;">'+
                                    '<div class="col-sm-9"></div>'+
                                    '<div class="col-sm-3">'+
                                        '<button type="button" class="btn btn-info  optOrgUser" name="search">查 询</button>&nbsp;&nbsp;'+
                                        '<button type="button" class="btn btn-info  optOrgUser" name="reset">重 置</button>'+
                                    '</div>'+
                                '</div>'+
                                '<div id="orgUsersGrid" style="height:530px"></div>'+
                            '</div>'+
                            '<div class="modal-footer">'+
                                '<div class="row" align="center">'+
                                    '<div class="col-sm-10"></div>'+
                                    '<div class="col-sm-2"><button type="button" class="btn btn-info select_person">确 定</button></div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>';
    //组织机构tree
    var setDeptTreeGrid = function(orgID, userId, cName){
        $("#deptTreeGrid").empty();
        if($("#deptTreeGrid").html() == '' || $("#deptTreeGrid").html() == '<p><strong>找不到机构!</strong></p>') {
            $.get('/org/Ajax_getUserDepAndChild', {orgID: orgID, userId: userId}, function(result) {
            //$.post('/CourseOrg/getAllOrgs', {orgID: orgID, userId: userId}, function(result) {
                if (result.status == '404') {
                    alert(result.err);
                } else {
                    var orgs = result.datas;
                    if (orgs && orgs.length > 0) {
                        $('.select_organization').removeAttr('disabled');
                        var dataSource = new kendo.data.TreeListDataSource({
                            data: orgs,

                            schema: {
                                model: {
                                    id: 'deptID',
                                    parentId: 'parentId',
                                    expanded: true
                                }
                            }
                        });

                        $("#deptTreeGrid").kendoTreeList({
                            dataSource: dataSource,
                            columns: [
                                {
                                    template: '<span style="cursor:pointer;" class="org" data_org_id="#=deptID#">#=deptDes#</span>',
                                    headerAttributes: {
                                        style: "display: none"
                                    }
                                }
                            ]
                        });
                    }else{
                        console.log('找不到机构~~');
                        //personHtml += '<p>找不到该机构下的人员!</p></div>';
                        $('#deptTreeGrid', '#selectOrgPanel').html('<p><strong>找不到机构!</strong></p>');
                        $('.select_organization').attr('disabled', 'disabled');
                    }
                }
            });

        }

        $('#selectOrgPanel').attr('name', cName);
        $('#selectOrgPanel').modal('show');
    };

    //组织机构下人员列表{userId: userId, orgID: orgID}
    var setOrgUserGrid = function(params, type, next){
        $("#orgUsersGrid").empty();

        var checkbox = type=='teachers'?'radio':'checkbox';
        $.get('/org/Ajax_depUserRead_V3', params, function(result){
        //$.post('/CourseOrg/getAllUsers', params, function(result){
            var persons = result;
            if (persons && persons.length > 0) {
                $('.select_person').removeAttr('disabled');
                var destUserList = new CourseOrgUserList();
                _.each(persons, function (p) {
                    if(type == 'students') {//把已经分配过的人员过滤掉
                        var isHas = false;
                        _.each(courseOrgUserList.models, function (user) {
                            if (p.synid == user.get('SYNID')) {
                                isHas = true;
                                return false;
                            }
                        });
                        if (!isHas) {
                            destUserList.push({SYNID:p.synid, USER_ID: p.userID, NAME: p.name, SEX: p.sex});
                        }
                    }else{
                        destUserList.push({SYNID:p.synid, USER_ID: p.userID, NAME: p.name, SEX: p.sex});
                    }
                });

                $("#orgUsersGrid").kendoGrid({
                    dataSource: {
                        data: destUserList.toJSON(),
                        pageSize: 14
                    },
                    sortable: {
                        mode: "single",
                        allowUnsort: false
                    },
                    pageable: {
                        buttonCount: 5
                    },
                    scrollable: false,
                    columns: [
                        {
                            title: "<div align='center'><strong>选择</strong></div>",
                            template:'<input type="'+checkbox+'" class="users" name="users" data_synid="#=SYNID#" data_user_id="#=USER_ID#" data_name="#=NAME#" data_sex="#=SEX#" />',
                            width: "10%"
                        },
                        {
                            field: "USER_ID",
                            title: "<div align='center'><strong>用户账号</strong></div>",
                            width: "35%"
                        },
                        {
                            field: "NAME",
                            title: "<div align='center'><strong>姓名</strong></div>",
                            width: "30%"
                        },
                        {
                            template: '#if(SEX == "0"){#女#}else if(SEX == "1"){#男#}else{#--#}#',
                            title: "<div align='center'><strong>性别</strong></div>",
                            width: "25%"
                        }
                    ]
                });
            } else {
                console.log('找不到该机构下的人员~~');
                $('#orgUsersGrid', '#selectPersonPanel').html('<p><strong>找不到该机构下的人员!</strong></p>');
                $('.select_person').attr('disabled', 'disabled');
            }

            if(next){
                next();
            }
        });
    };
    var initOrgUserGrid = function(params, cName, type){
        $("#orgUsersGrid").empty();

        setOrgUserGrid(params, type, function(){
            $('#selectPersonPanel').attr('name', cName);
            $('#selectPersonPanel').attr('data_org_id', params.deptid);
            $('#selectPersonPanel').modal('show');
        });
    };

    //角色下人员列表
    var setRoleUsersGrid = function(ORG_STRUCTURE_ID, optType){
        $("#roleUsersGrid").empty();
        var disabledType = '';
        if(optType == 'look'){
            disabledType = 'disabled="disabled"';
        }
        $.post('/CourseOrg/optCourseOrgUser/search', {ORG_STRUCTURE_ID: ORG_STRUCTURE_ID}, function(usersResult){
            if(usersResult && usersResult.length>0){

                $("#roleUsersGrid").kendoGrid({
                    dataSource: {
                        data: usersResult,
                        pageSize: 20
                    },
                    sortable: {
                        mode: "single",
                        allowUnsort: false
                    },
                    pageable: {
                        buttonCount: 5
                    },
                    scrollable: false,
                    columns: [
                        {
                            template: '<span id="#=SYNID#">#=USER_ID#</span>',
                            title: "<div align='center'><strong>用户账号</strong></div>",
                            width: "15%"
                        },
                        {
                            field: "NAME",
                            title: "<div align='center'><strong>姓名</strong></div>",
                            width: "10%"
                        },

                        {
                            template: '#if(SEX == "0"){#女#}else if(SEX == "1"){#男#}else{#--#}#',
                            title: "<div align='center'><strong>性别</strong></div>",
                            width: "5%"
                        },

                        {
                            field: "DEPT_FULL_DES",
                            title: "<div align='center'><strong>所属机构</strong></div>",
                            width: "16%"
                        },

                        {
                            field: "SKILL",
                            title: "<div align='center'><strong>个人擅长</strong></div>",
                            width: "17%"
                        },

                        {
                            field: "REMARK",
                            title: "<div align='center'><strong>备注</strong></div>",
                            width: "17%"
                        },

                        {
                            template: '<div align="center"><button type="button" class="btn btn-info btn-xs optPerson" name="edit" '+disabledType+' data_user_cid="#=LRNSCN_ORG_USER_CID#">编 辑</button>&nbsp;&nbsp;' +
                            '<button type="button" class="btn btn-info btn-xs optPerson" name="delete" '+disabledType+' data_user_cid="#=LRNSCN_ORG_USER_CID#">删 除</button></div>',
                            title: "<div align='center'><strong>操作</strong></div>",
                            width: "15%"
                        }
                    ]
                });

                $('.active', '#course_groups').find('span').eq(1).html(usersResult.length);
            }else{
                //alert('该角色下无学员！');
            }
        });
    };

    var CourseOrgPanelView = Backbone.View.extend({
        el : '.container',
        attributes : {

        },

        events: {
            'click .myTabsLi': 'switchTab',
            'focus .time': 'setTime',
            'click .optCourseOrg': 'optCourseOrg',
            'click input[name="study_type_radio"]': 'checkStudyType',
            'click .addNewGroup': 'addNewGroup',
            'click .deleteCourseGroup': 'deleteCourseGroup',
            'click .groupName': 'preUpdateGroupName',
            'blur .updateGroupName': 'updateGroupName',
            'click .role': 'getPersonsOfRole',
            'click .pre_select_organization': 'preSelectOrganization',
            'click .org': 'setBgForActiveOrg',
            'click .select_organization': 'selectOrganization',
            'click .pre_select_person': 'preSelectPerson',
            'click .optOrgUser': 'optOrgUser',
            'click .select_person': 'selectPerson',
            'click .check_stu': 'checkStu',
            'click .optPerson': 'optPerson',
            'click .optGroupInfo': 'optGroupInfo'
        },

        initialize : function(){
            _.bindAll(this, 'render', 'switchTab', 'optCourseOrg');
            this.template = _.template(Course_Org_Panel);
            this.render();
        },

        render : function(){
            var urlParams = window.location.search;
            if(urlParams.indexOf('?') != -1){//?LRNSCN_ORG_ID=1&optType=edit
                var param = urlParams.substr(1),
                    myParams = param.split('&'),
                    paramArr1 = myParams[0].split('='),
                    paramArr2 = myParams[1].split('='),
                    optType = paramArr2[1];

                var me = this;
                $.get('/CourseOrg/optCourseOrg/search', {LRNSCN_ORG_ID: paramArr1[1]}, function(courseOrg) {
                    //console.log(JSON.stringify(result));
                    var data = courseOrg.datas;
                    if (data && data.length > 0) {
                        me.model = new CourseOrgModel(data[0]);
                        me.model.set({optType : optType, userId: courseOrg.userId});
                        $(me.el).append(
                            me.template(me.model.toJSON())
                        );

                        //获取初始化课程组织所在课程的所有人员
                        $.post('/CourseOrg/optCourseOrgUser/searchAllOrgedUsers', {LRNSCN_ORG_ID: paramArr1[1]}, function(courseOrgUsers){
                            if(courseOrgUsers && courseOrgUsers.length > 0){
                                courseOrgUserList.add(courseOrgUsers);
                            }
                        });

                        //初始化组织单位
                        $.get('/org/Ajax_getUserOrg', {userId: courseOrg.userId}, function(result) {
                        //$.post('/CourseOrg/getRootOrgs', {userId: courseOrg.userId}, function(result){
                            if(result.status == '404'){
                                alert(result.err);
                            }else {
                                var rootOrgs = result.datas;
                                _.each(rootOrgs, function(rootOrg, index){
                                    var selected = '';
                                    if(me.model.get('CREATOR_ORGID') == '' && index == 0){
                                        selected = 'selected = "selected"';
                                    }else{
                                        if(rootOrg.orgID == me.model.get('CREATOR_ORGID')){
                                            selected = 'selected = "selected"';
                                        }
                                    }

                                    $('select[name="CREATOR_ORGID_NAME"]', me.el).append('<option value="'+rootOrg.orgID+'" '+selected+'>'+rootOrg.orgFullDes+'</option>');
                                });
                            }
                        });

                        //获取课程角色
                        //courseRoleList.getRole(data[0].INSTANCE_ID);
                        $.getJSON('http://'+ecgeditorHost+'/load/loadAllLane?fileId='+data[0].INSTANCE_ID+'&jsonCallBack=?', function(result){
                            if(result.success) {
                                var roles = result.data;
                                if (roles && roles.length > 0) {
                                    courseRoleList.reset(roles);

                                    var org_type_html = '';
                                    if(roles.length == 1){
                                        if(data[0].MAX_ROLE == 1){//一定为单人要组织的课程
                                            org_type_html = '<div class="col-sm-7">'+
                                                                '<span class="col-sm-3" align="left">课程组织类型:</span>'+
                                                                '<div class="col-sm-9" align="left">'+
                                                                    '<label class="checkbox-inline">'+
                                                                        '<input type="radio" name="study_type_radio"  value="1" checked disabled>&nbsp;单人独立学习'+
                                                                    '</label>'+
                                                                '</div>'+
                                                            '</div>'+
                                                            '<div class="col-sm-12" style="margin-top:5px;"><small>提示：你需要把所有参与学习的学生一次性的选择并添加到一个组里的一个角色里；学习时，组内的各个学生各自独立完成学习任务，但可以参与组内聊天讨论</small></div>';
                                        }else if(data[0].MIN_ROLE <=1){//不一定为单人要组织的课程，看老师想分配几个人，可能是单人课程，也可能是多人课程（这种情况不算是标准的多角色合作课程）
                                            org_type_html = '<div class="col-sm-7">'+
                                                                '<span class="col-sm-3" align="left">课程组织类型:</span>'+
                                                                '<div class="col-sm-9" align="left">'+
                                                                    '<label class="checkbox-inline">'+
                                                                        '<input type="radio" name="study_type_radio"  value="1">&nbsp;单人独立学习'+
                                                                    '</label>'+
                                                                    '<label class="checkbox-inline">'+
                                                                        '<input type="radio" name="study_type_radio"  value="0">&nbsp;多人(多角色)合作学习'+
                                                                    '</label>'+
                                                                '</div>'+
                                                            '</div>'+
                                                            '<div id="study_type_1" style="display:none;margin-top:5px;" class="col-sm-12"><small>提示：你需要把所有参与学习的学生一次性的选择并添加到一个组里的一个角色里；学习时，组内的各个学生各自独立完成学习任务，但可以参与组内聊天讨论</small></div>'+
                                                            '<div id="study_type_0" style="display:none;margin-top:5px;" class="col-sm-12"><small>提示：你可以按照自己的需要生成若干个组。然后在每个组里，对角色添加若干个你想指定的学生进来；学习时，各组相互独立；一个组内的角色里的学生分别完成本角色的课程任务，协作共同完成课程的学习；也可以参与组内聊天讨论</small></div>';
                                        }else{
                                            org_type_html = '<div class="col-sm-7">'+
                                                                '<span class="col-sm-3" align="left">课程组织类型:</span>'+
                                                                '<div class="col-sm-9" align="left">'+
                                                                    '<label class="checkbox-inline">'+
                                                                        '<input type="radio" name="study_type_radio"  value="0" checked disabled>&nbsp;多人(多角色)合作学习'+
                                                                    '</label>'+
                                                                '</div>'+
                                                            '</div>'+
                                                            '<div class="col-sm-12" style="margin-top:5px;"><small>提示：你可以按照自己的需要生成若干个组。然后在每个组里，对每个角色添加若干个你想指定的学生进来，扮演此角色；学习时，各组相互独立；一个组内的各个角色里的学生分别完成本角色的课程任务，协作共同完成课程的学习；也可以参与组内聊天讨论</small></div>';

                                        }
                                    }else{//一定为多人多角色要组织的课程（这种情况是标准的多角色合作课程）
                                        org_type_html = '<div class="col-sm-7">'+
                                                            '<span class="col-sm-3" align="left">课程组织类型:</span>'+
                                                            '<div class="col-sm-9" align="left">'+
                                                                '<label class="checkbox-inline">'+
                                                                '<input type="radio" name="study_type_radio"  value="0" checked disabled>&nbsp;多人(多角色)合作学习'+
                                                                '</label>'+
                                                            '</div>'+
                                                        '</div>'+
                                                       '<div class="col-sm-12" style="margin-top:5px;"><small>提示：你可以按照自己的需要生成若干个组。然后在每个组里，对每个角色添加若干个你想指定的学生进来，扮演此角色；学习时，各组相互独立；一个组内的各个角色里的学生分别完成本角色的课程任务，协作共同完成课程的学习；也可以参与组内聊天讨论</small></div>';
                                    }

                                    $('.alert-info', '.tab2').append(org_type_html);
                                }
                            }else{
                                console.log('获取不到该课程的角色!');
                            }
                        });
                        /*
                        courseRoleList.set([
                            {ROLE_ID:'001', ROLE_NAME:'需求分析人员'},{ROLE_ID:'002', ROLE_NAME:'项目经理'}, {ROLE_ID:'003', ROLE_NAME:'架构设计师'},
                            {ROLE_ID:'004', ROLE_NAME:'开发人员'},{ROLE_ID:'005', ROLE_NAME:'测试人员'}
                        ]);
                        */
                        //初始化第二个tab, 角色
                        $.post('/CourseOrg/optCourseOrgStructure/search', {LRNSCN_ORG_ID: paramArr1[1], SORT: 'O'}, function(orgStructures){//取组
                            if(orgStructures && orgStructures.length > 0){
                                _.each(orgStructures, function(orgStructure){
                                    $.post('/CourseOrg/optCourseOrgStructure/search', {PARENT_ID: orgStructure.ORG_STRUCTURE_ID, SORT: 'R'}, function(roles){//取角色
                                        var newGroupHtml = '<div style="margin-bottom:5px;" class="course_group">';
                                        if(optType == 'edit') {
                                            newGroupHtml += '<span class="glyphicon glyphicon-remove deleteCourseGroup" style="cursor: pointer;float:right;" title="删除该组"></span>';
                                        }
                                        newGroupHtml += '<div><p data_structure_id="'+orgStructure.ORG_STRUCTURE_ID+'" class="groupName" title="点击修改" style="cursor:pointer;"><strong>'+orgStructure.CONTEXT_DES+'</strong></p>'+
                                                        '<input type="text" class="form-control updateGroupName" style="display:none" value="'+orgStructure.CONTEXT_DES+'"/></div>'+
                                                        '<div style="margin-left:4%;">';

                                        if(roles && roles.length > 0){
                                            newGroupHtml += '<ul class="nav nav-pills nav-stacked">';
                                            _.each(roles, function(role, index){
                                                newGroupHtml += '<li class="role" data_structure_id="'+role.ORG_STRUCTURE_ID+'">'+
                                                                '<a href="javascript:void(0);">'+
                                                                '<span data_role_id="'+role.CONTEXT_ID+'">'+role.CONTEXT_DES+'</span>'+
                                                                '<span class="badge pull-right" title="人数">'+role.COUNT+'</span>'+
                                                                '</a></li>';
                                            });
                                            newGroupHtml += '</ul></div></div>';
                                        }else{
                                            newGroupHtml += '<p>找不到该组下的角色信息！</p></div></div>';
                                        }
                                        $('#course_groups', '.tab2').append(newGroupHtml);
                                        newGroupHtml = '';
                                    });
                                });
                            }
                        });
                    }
                });
            }
        },

        switchTab: function(event){
            var obj = event.currentTarget;
            this.switchTabOpt($(obj).attr('data-tab'));
        },

        switchTabOpt: function(data_tab){
            $('.myTabsLi', this.el).removeClass('active');
            $('.myTabsDiv', this.el).css('display', 'none');

            $('[data-tab="'+data_tab+'"]', this.el).addClass('active');
            $('.'+data_tab, this.el).css('display', 'block');
        },

        setTime: function(event){
            var currObj = event.currentTarget,
                cName = $(currObj).attr('name');
            if(cName == 'BEGIN_TIME'){
                WdatePicker({el: 'BEGIN_TIME', dateFmt:'yyyy-MM-dd HH:mm:ss', minDate:'%y-%M-%d', maxDate: '#F{$dp.$D(\'END_TIME\', {d: -1});}'});
            }else if(cName == 'END_TIME'){
                WdatePicker({el: 'END_TIME', dateFmt:'yyyy-MM-dd HH:mm:ss', minDate: '#F{$dp.$D(\'BEGIN_TIME\', {d: 1});}'});
            }

        },

        checkStu: function(event){
            var currObj = event.currentTarget,
                cName = $(currObj).attr('data_id'),
                checked = true;
            if(cName == 'none'){
                checked = false;
            }
            $('.users', '#selectPersonPanel').each(function(){
                $(this)[0].checked = checked;
            });
        },

        optCourseOrg: function(event){
            var currObj = event.currentTarget,
                cName = $(currObj).attr('name');

            if(cName == 'update'){

                this.updateCourseOrg();

            }else if(cName == 'reset'){
                $('.setCourseOrg', '.tab1').each(function(){
                    var cType = $(this).attr('type'),
                        cName = $(this).attr('name');
                    if(cType != 'hidden' && cName != 'LRN_AREA_NAME' && cName != 'INSTANCE_NAME')
                        $(this).val("");
                });
            }else if(cName == 'back'){
                window.location.href = '/CourseOrg/search';
            }else if(cName == 'end'){

            }else if(cName == 'delete'){

            }
        },

        //设置课程组织类型
        checkStudyType:function(event){
            var currObj = event.currentTarget;
            var study_type = $(currObj).val();
            if(study_type == '1'){
                $('#study_type_0', '.tab2').css('display', 'none');
                $('#study_type_1', '.tab2').css('display', 'block');
            }else{
                $('#study_type_0', '.tab2').css('display', 'block');
                $('#study_type_1', '.tab2').css('display', 'none');
            }
        },

        updateCourseOrg : function(){
            var tempJ = {};
            $('.setCourseOrg', '.tab1').each(function(){
                var cNode = $(this).attr('name'),
                    cValue = $(this).val();
                if(cNode != 'REMARK') {
                    if (!cValue || cValue.trim() == '') {
                        alert('您有必填项未完成！');
                        $(this).focus();
                        tempJ = {};
                        return false;
                    }
                }
                if(cNode == 'CREATOR_ORGID_NAME'){
                    tempJ['CREATOR_ORGID'] = cValue;
                    tempJ['CREATOR_ORGID_NAME'] = $(this).find('option[selected="selected"]').eq(0).text();
                }else{
                    tempJ[cNode] = cValue;
                }
            });
            if(JSON.stringify(tempJ) == '{}')
                return false;

            console.log(tempJ);
            tempJ.LRNSCN_ORG_ID = $('.tab1', 'body').attr('data-org-id');
            $.post('/CourseOrg/optCourseOrg/update', {updateObj: JSON.stringify(tempJ)}, function(updateResult){
                if(updateResult && updateResult.isOk){
                    alert('课程组织的组织信息保存成功~~');
                }else{
                    alert('课程组织的组织信息保存失败~~');
                }
            });
        },

        //增加一个分组
        addNewGroup : function(){
            if(courseRoleList.length == 0) {
                /*
                courseRoleList.set([
                    {roleId:''+Math.random(), roleName:'组员'}
                ]);
                */
                alert("获取不到此课程设置的角色，无法进行操作！请检查此课程是否设置了角色信息！");
                courseRoleList.getRole(this.model.get('INSTANCE_ID'));

                return false;
            }

            //检查是否设置了课程组织类型
            var LRNSCN_ORG_ID = $('.tab1', 'body').attr('data-org-id');
            var study_type = $('input[name="study_type_radio"]:checked').val();
            if(!study_type){
                alert('请先设置课程组织类型！');
                return false;
            }else{
                var IS_SINGLE = parseInt(study_type);
                if(IS_SINGLE == 1){
                    if($('.course_group', '.tab2').length >= 1){
                        alert('该课程组织类型为 单人独立学习，只能设置一个分组！');
                        return false;
                    }
                }

                $.post('/CourseOrg/optCourseOrg/update', {updateObj: JSON.stringify({IS_SINGLE: IS_SINGLE, LRNSCN_ORG_ID: LRNSCN_ORG_ID})}, function(updateResult){
                    if(updateResult && updateResult.isOk){
                        console.log('设置课程组织类型【'+IS_SINGLE+'】成功！');
                    }else{
                        console.log('设置课程组织类型【'+IS_SINGLE+'】失败！');
                    }
                });
            }

            //$('.addNewGroup', '.tab2').attr('disabled', true);
            var newGroup = $('.newGroup', '.tab2').val();
            if(!newGroup || newGroup.trim() == ''){
                $('.newGroup', '.tab2').focus();
                //$('.addNewGroup', '.tab2').attr('disabled', true);
                return false;
            }
            /*
            var maxGroup = parseInt(this.model.get('MAX_GROUP'));
            if($('.course_group', '.tab2').length >= maxGroup){
                alert('该课程最多能分'+maxGroup+'个小组~~');
                return false;
            }
            */
            //检查分组名称是否已存在
            $.post('/CourseOrg/optCourseOrgStructure/checkGroupName', {LRNSCN_ORG_ID:LRNSCN_ORG_ID, CONTEXT_DES:newGroup.trim()}, function(checkResult){
                if(checkResult == 'error'){
                    alert('检查分组['+newGroup+']失败！');
                }else if(checkResult.length > 0){
                    alert('分组名称['+newGroup+']已存在！');
                }else{
                    var tempGroup = new CourseOrgStructureModel(), CREATOR_ID = $('input[name="TEACHER_ID"]', '.tab1').val(), tempRoles = [];
                    tempGroup.set({
                        SORT:'O', CONTEXT_DES:newGroup, LEVEL:1, ISLEAF:'0', LRNSCN_ORG_ID: LRNSCN_ORG_ID, ISVALID: '1',CREATOR_ID:CREATOR_ID
                    });
                    $.post('/CourseOrg/optCourseOrgStructure/save', {saveArr: JSON.stringify([tempGroup.toJSON()])}, function(groupResult){
                        if(groupResult && groupResult.isOk){
                            var newORG_STRUCTURE_ID = groupResult.ORG_STRUCTURE_IDS['0'];
                            //增加角色
                            var newGroupHtml = '<div style="margin-bottom:5px;" class="course_group">'+
                                '<span class="glyphicon glyphicon-remove deleteCourseGroup" style="cursor: pointer;float:right;" title="删除该组"></span>' +
                                '<div><p data_structure_id="'+newORG_STRUCTURE_ID+'" class="groupName" title="点击修改" style="cursor:pointer;"><strong>'+newGroup+'</strong></p>'+
                                '<input type="text" class="form-control updateGroupName" style="display:none" value="'+newGroup+'"/></div>'+
                                '<div style="margin-left:4%;">';

                            _.each(courseRoleList.models, function(role){
                                tempRoles.push(
                                    {
                                        PARENT_ID:newORG_STRUCTURE_ID, TREE_NODE_CODE:'', SORT:'R', CONTEXT_ID: role.get('roleId'), CONTEXT_DES:role.get('roleName'),
                                        LEVEL:2, ISLEAF:'1', LRNSCN_ORG_ID: LRNSCN_ORG_ID, REMARK:'', ISVALID: '1',CREATOR_ID:CREATOR_ID, LSTUPDID: CREATOR_ID
                                    }
                                );
                            });

                            $.post('/CourseOrg/optCourseOrgStructure/save', {saveArr: JSON.stringify(tempRoles)}, function(roleResult) {
                                if (roleResult && roleResult.isOk) {
                                    console.log(roleResult.ORG_STRUCTURE_IDS);
                                    newGroupHtml += '<ul class="nav nav-pills nav-stacked">';
                                    _.each(courseRoleList.models, function(role, index){
                                        newGroupHtml += '<li class="role" data_structure_id="'+roleResult.ORG_STRUCTURE_IDS[index+'']+'"><a href="javascript:void(0);"><span data_role_id="'+role.get('roleId')+'">'+role.get('roleName')+'</span><span class="badge pull-right" title="人数">0</span></a></li>';
                                    });
                                    newGroupHtml += '</ul></div></div>';
                                }else{
                                    newGroupHtml += '<p>为该组分配角色失败！</p></div></div>';
                                }
                                $('#course_groups', '.tab2').append(newGroupHtml);
                                $('.newGroup', '.tab2').val('');
                                //$('.addNewGroup', '.tab2').attr('disabled', false);
                            });
                        }else{
                            console.log('创建分组['+newGroup+']失败~~');
                            alert('创建分组['+newGroup+']失败~~');
                        }
                    });
                }
            });
        },
        //删除分组
        deleteCourseGroup: function(event){
            var currObj = event.currentTarget, parent = $(currObj).parent();
            if(confirm('确定要删除分组[ '+parent.find('p').eq(0).text()+' ]吗？')) {

                var ORG_STRUCTURE_ID = parent.find('p').eq(0).attr('data_structure_id');
                $.post('/CourseOrg/optCourseOrgStructure/delete', {ORG_STRUCTURE_ID: ORG_STRUCTURE_ID}, function(deleteResult){
                    if(deleteResult && deleteResult.isOk){
                        if($('.active', parent).length > 0){
                            //重置右侧栏数据
                            $('input[name="persons"]', '.tab2').val('');
                            $('input[name="persons"]', '.tab2').attr('title', '');
                            $('#roleUsersGrid').empty();
                        }
                        parent.remove();
                    }else{
                        alert('删除分组失败~~');
                    }
                });
            }
        },

        preUpdateGroupName: function(event){
            var currObj = event.currentTarget, parentObj = $(currObj).parent();
            $(currObj).css('display', 'none');
            $('input', parentObj).css('display', 'block');
            $('input', parentObj).focus();
        },

        updateGroupName: function(event){
            var currObj = event.currentTarget, parentObj = $(currObj).parent(),
            structureId = $('p', parentObj).attr('data_structure_id'), newName = $(currObj).val().trim(),
                oldName = $('strong', parentObj).text();
            if(newName == oldName){
                $(currObj).css('display', 'none');
                $('p', parentObj).css('display', 'block');
                return false;
            }
            if(!newName || newName == '' || newName.length > 64){
                alert('组名不能为空, 且字符长度小于64！');
                return false;
            }

            var LRNSCN_ORG_ID = $('.tab1', 'body').attr('data-org-id');
            $.post('/CourseOrg/optCourseOrgStructure/checkGroupName', {LRNSCN_ORG_ID:LRNSCN_ORG_ID, CONTEXT_DES:newName}, function(checkResult){
                if(checkResult == 'error'){
                    alert('检查分组['+newGroup+']失败！');
                }else if(checkResult.length > 0){
                    alert('分组名称['+newGroup+']已存在！');
                }else{
                    $.post('/CourseOrg/optCourseOrgStructure/update', {updateObj: JSON.stringify({CONTEXT_DES: newName, ORG_STRUCTURE_ID: structureId})}, function(result){
                        if(result && result.isOk){
                            $(currObj).css('display', 'none');
                            $('p', parentObj).css('display', 'block');
                            $('strong', parentObj).text(newName);
                        }else{
                            alert('组名更新失败！');
                        }
                    });
                }
            });
        },

        //获取并显示选中角色下的所有人员
        getPersonsOfRole : function(event){
            var currObj = event.currentTarget, ORG_STRUCTURE_ID = $(currObj).attr('data_structure_id'), optType = '';
            $('li', '#course_groups').removeClass('active');
            $(currObj).addClass('active');
            //重置右侧栏数据
            $('input[name="persons"]', '.tab2').val('');
            $('input[name="persons"]', '.tab2').attr('title', '');
            //显示选中角色下的学员
            setRoleUsersGrid(ORG_STRUCTURE_ID, this.model.get('optType'));
        },
        //获取机构tree,供选择
        preSelectOrganization: function(event){
            var currObj = event.currentTarget,
                cName = $(currObj).attr('name');
            if(cName == 'tab2_pre_select_organization') {
                if ($('.course_group', '.tab2').length == 0) {
                    alert('请先在左侧栏里生成一个分组~~');
                    return false;
                }
                if ($('.active', '#course_groups').length == 0) {
                    alert('请先从左侧分组里面选中一个角色~~');
                    return false;
                }
            }

            var orgID = $('select[name="CREATOR_ORGID_NAME"]', '.tab1').val(),
                userId = this.model.get('userId');
            if(!orgID || orgID.trim() == ''){
                alert('请先选择组织单位！');
                return false;
            }
            setDeptTreeGrid(orgID, userId, cName);
        },
        //为选中机构设置背景色
        setBgForActiveOrg: function(event){
            $('.org', '#deptTreeGrid').css('background-color','#ffffff');
            $('.org', '#deptTreeGrid').removeClass('activeOrg');

            var currObj = event.currentTarget;
            $(currObj).css('background-color','#5bc0de');
            $(currObj).addClass('activeOrg');
        },
        //选择机构
        selectOrganization: function(){
            var  selOption = $('.activeOrg', '#deptTreeGrid'),
                orgID = selOption.attr('data_org_id'),
                cName = $('#selectOrgPanel').attr('name');
            if(!orgID || orgID == ''){
                alert('请先选择一个机构~~');
                return false;
            }
            //var orgText = $('tbody tr', '#deptTreeGrid').find('td').eq(0).find('span').eq(1).text()+'-'+selOption.text();
            var orgText = selOption.text();
            if(cName == 'tab2_pre_select_organization'){
                $('input[name="orgs"]', '.tab2').attr('title', orgText);
                $('input[name="orgs"]', '.tab2').val(orgText);
                $('input[name="orgs"]', '.tab2').attr('org_id', orgID);
                //$('input[name="orgs"]', '.tab2').attr('dept_id', orgID);
            }else{
                $('input[name="CREATOR_GID_NAME"]', '.tab1').val(orgText);
                $('input[name="CREATOR_GID"]', '.tab1').val(orgID);
            }

            $('#selectOrgPanel').modal('hide');
        },
        //获取相应机构的人员，供为角色选择添加
        preSelectPerson: function(event){
            var currObj = event.currentTarget,
                cName = $(currObj).attr('name'), orgID='', userId = this.model.get('userId');
            if(cName == 'tab2_pre_select_person') {
                if ($('.course_group', '.tab2').length == 0) {
                    alert('请先在左侧栏里生成一个分组~~');
                    return false;
                }
                if ($('.active', '#course_groups').length == 0) {
                    alert('请先从左侧分组里面选中一个角色~~');
                    return false;
                }

                var personType = $('input[name="person_type_radio"]:checked').val();
                if(personType == "1"){
                    if ($('input[name="orgs"]', '.tab2').val().trim() != '') {
                        orgID = $('input[name="orgs"]', '.tab2').attr('org_id');
                    }else{
                        orgID = $('input[name="CREATOR_GID"]', '.tab1').val();
                        if(!orgID || orgID == ''){
                            alert('请先在 设置基本信息栏 里选择组织机构！');
                            return false;
                        }
                    }

                    initOrgUserGrid({deptid: orgID, roleType:1, userID:'', name:''}, cName, 'students');
                }else{
                    orgID = $('input[name="CREATOR_GID"]', '.tab1').val();
                    if(!orgID || orgID == ''){
                        alert('请先在 设置基本信息栏 里选择组织机构！');
                        return false;
                    }
                    initOrgUserGrid({deptid: orgID, roleType:2, userID:'', name:''}, cName, 'teachers_role');
                }

            }else{
                orgID = $('input[name="CREATOR_GID"]', '.tab1').val();
                if(!orgID || orgID == ''){
                    alert('请先在 设置基本信息栏 里选择择组机构！');
                    return false;
                }
                initOrgUserGrid({deptid: orgID, roleType:2, userID:'', name:''}, cName, 'teachers');
            }
        },

        //查询符合条件的人员
        optOrgUser: function(event){
            var currObj = event.currentTarget, type = $(currObj).attr('name'),
                tempU = {
                    deptid:$('#selectPersonPanel').attr('data_org_id'),
                    userID:'', name:''
                };

            $('.searchOrgUser', '#selectPersonPanel').each(function(){
                if(type == 'reset'){
                    $(this).val('');
                }else if(type == 'search'){
                    var cNode = $(this).attr('name'),
                        cValue = $(this).val();

                    tempU[cNode] = cValue;
                }
            });

            var modalType = '';
            if($('#selectPersonPanel').attr('name') == 'tab2_pre_select_person'){
                modalType = 'students';
                tempU['roleType'] = 1;
            }else{
                modalType = 'teachers';
                tempU['roleType'] = 2;
            };

            setOrgUserGrid(tempU, modalType, null);
        },

        //为角色选择添加人员
        selectPerson: function(){
            var cName = $('#selectPersonPanel').attr('name');
            var ORG_STRUCTURE_ID = $('.active', '#course_groups').attr('data_structure_id'), LRNSCN_ORG_ID = $('.tab1', 'body').attr('data-org-id'),
                tempUsers = [], names = '';
            $('.users', '#orgUsersGrid').each(function(){
                var me = this;
                if($(me)[0].checked) {
                    var currUsername = $(me).attr('data_name'),
                        SEX = $(me).attr('data_sex'),
                        tempUser = new CourseOrgUserModel(),deptID='', deptDes='';
                    if($('input[name="orgs"]', '.tab2').val()){
                        deptID = $('input[name="orgs"]', '.tab2').attr('org_id');
                        deptDes =  $('input[name="orgs"]', '.tab2').val();
                    }else{
                        deptDes = $('input[name="CREATOR_GID_NAME"]', '.tab1').val();
                        deptID = $('input[name="CREATOR_GID"]', '.tab1').val();
                    }
                    if(!currUsername || currUsername.trim() == 'null' || currUsername.trim() == ''){
                        currUsername = $(me).attr('data_user_id');
                    }
                    names += currUsername + ' ';
                    tempUser.set({
                        SYNID: $(me).attr('data_synid'),
                        USER_ID: $(me).attr('data_user_id'),    //        '人员ID',
                        NAME : currUsername,
                        SEX: SEX,
                        DEPT_ID: deptID,
                        DEPT_FULL_DES: deptDes,
                        ORG_ID: $('select[name="CREATOR_ORGID_NAME"]', '.tab1').val(),
                        ORG_FUll_DES: $('select[name="CREATOR_ORGID_NAME"]', '.tab1').text(),
                        LRNSCN_ORG_ID: LRNSCN_ORG_ID,  //        '课程组织ID',
                        ORG_STRUCTURE_ID: ORG_STRUCTURE_ID  //        '课程组织结构ID',
                    });
                    tempUsers.push(tempUser.toJSON());

                    if($(me).attr('type') == 'radio'){
                        return false;
                    }
                }
            });

            if(cName != 'tab2_pre_select_person'){//选老师
                if(tempUsers.length == 0){
                    alert('请选择一名老师！');
                    return false;
                }
                if(cName == 'ORG_USER_NAME'){
                    $('input[name="ORG_USER_NAME"]', '.tab1').val(tempUsers[0].NAME);
                    $('input[name="ORG_USER_ID"]', '.tab1').val(tempUsers[0].SYNID);
                }else if(cName == 'TEACHER_NAME'){
                    $('input[name="TEACHER_NAME"]', '.tab1').val(tempUsers[0].NAME);
                    $('input[name="TEACHER_ID"]', '.tab1').val(tempUsers[0].SYNID);
                }

                $('#selectPersonPanel').modal('hide');
            }else {//选学生
                var minRole = this.model.get('MIN_ROLE'), maxRole = this.model.get('MAX_ROLE'),
                    currMems = $('tbody tr', '#roleUsersGrid').length,
                    totalMems = currMems + tempUsers.length;
                if(totalMems < minRole || totalMems > maxRole){
                    alert('此角色下已有'+currMems+'人，您选择了'+tempUsers.length+'人，不满足该角色的学员人数范围：'+minRole+'到'+maxRole+'人！');
                    tempUsers = [];
                    return false;
                }
                $('#selectPersonPanel').modal('hide');
                /*
                if(tempUsers.length < minRole || tempUsers.length > maxRole){
                    alert('您选择了'+tempUsers.length+'人，该角色的学员人数范围为'+minRole+'到'+maxRole+'人~~');
                    tempUsers = [];
                    return false;
                }
                $('#selectPersonPanel').modal('hide');

                //将人员从已分配人员集合里移除

                $('tbody tr', '#roleUsersGrid').each(function(){
                    var tdNode = $(this).find('td').eq(0);
                    var currSynid = $('span', tdNode).attr('id'), destUser=null;
                    _.each(courseOrgUserList.models, function(user){
                        if(user.get('SYNID') == currSynid){
                            destUser = user;
                            return false;
                        }
                    });
                    courseOrgUserList.remove(destUser);
                });
                */
                var me = this;
                $.post('/CourseOrg/optCourseOrgUser/save', {saveArr: JSON.stringify(tempUsers)}, function (userResult) {
                    if (userResult && userResult.isOk) {
                        //将分配的人员添加到集合里
                        courseOrgUserList.add(tempUsers);

                        $('input[name="persons"]', '.tab2').val(names);
                        $('input[name="persons"]', '.tab2').attr('title', names);
                        $.post('/CourseOrg/optCourseOrgStructure/update', {
                            updateObj: JSON.stringify({
                                ORG_STRUCTURE_ID: ORG_STRUCTURE_ID,
                                COUNT: totalMems    //tempUsers.length
                            })
                        }, function (updateResult) {
                            if (updateResult && updateResult.isOk) {
                                setRoleUsersGrid(ORG_STRUCTURE_ID, me.model.get('optType'));
                            }
                        });
                    } else {
                        alert('为角色添加人员失败~~');
                        console.log('为角色添加人员失败~~');
                    }
                });
            }
        },
        //角色内人员操作
        optPerson: function(event){
            var currObj = event.currentTarget,
                optType = $(currObj).attr('name'),
                data_user_cid = $(currObj).attr('data_user_cid'),
                me = this;

            if(optType == 'edit'){
                var currTr = $(currObj).parent().parent().parent();
                $('button[name="update"]', '#editPersonPanel').attr('data_user_cid', data_user_cid);
                $('.updateUser', '#editPersonPanel').each(function(index){
                    $(this).val(currTr.find('td').eq(index).text().trim());
                });

                $('#editPersonPanel', '.tab2').modal('show');
            }else if(optType == 'update'){
                var tempU = {LRNSCN_ORG_USER_CID: data_user_cid};
                $('.updateUser', '#editPersonPanel').each(function(){
                    var cName = $(this).attr('name'),
                        cValue = $(this).val();
                    tempU[cName] = cValue;
                });

                $.post('/CourseOrg/optCourseOrgUser/update', {updateObj: JSON.stringify(tempU)}, function(updateResult){
                    if(updateResult && updateResult.isOk){
                        $('#editPersonPanel', '.tab2').modal('hide');

                        var ORG_STRUCTURE_ID = $('.active', '#course_groups').attr('data_structure_id');
                        setRoleUsersGrid(ORG_STRUCTURE_ID, me.model.get('optType'));
                    }else{
                        alert('人员信息更新失败~~');
                    }
                });

            }else if(optType == 'delete'){
                if(confirm('确定要删除此人员？')) {
                    $.post('/CourseOrg/optCourseOrgUser/delete', {LRNSCN_ORG_USER_CID: data_user_cid}, function (deleteResult) {
                        if (deleteResult && deleteResult.isOk) {
                            var roleNode = $('.active', '#course_groups').find('span').eq(1),
                                newCount = parseInt(roleNode.text().trim()) - 1,
                                ORG_STRUCTURE_ID = $('.active', '#course_groups').attr('data_structure_id');
                            $.post('/CourseOrg/optCourseOrgStructure/update', {updateObj:JSON.stringify({ORG_STRUCTURE_ID: ORG_STRUCTURE_ID, COUNT: newCount})}, function(updateResult){
                                if(updateResult && updateResult.isOk){
                                    var tdNode = $(currObj).parent().parent().parent().find('td').eq('0'),
                                        userId = $('span', tdNode).attr('id'), destUser = null;
                                    //将人员从已分配人员集合里移除
                                    _.each(courseOrgUserList.models, function(user){
                                        if(user.get('SYNID') == userId){
                                            destUser = user;
                                            return false;
                                        }
                                    });
                                    courseOrgUserList.remove(destUser);

                                    setRoleUsersGrid(ORG_STRUCTURE_ID, me.model.get('optType'));
                                }
                            });
                        }
                    });
                }
            }

        },

        optGroupInfo: function(event){
            var currObj = event.currentTarget,
                cName = $(currObj).attr('name');

            if(cName == 'save' || cName == 'complete'){
                var lis = $('li', '#course_groups'), hasUser = true, minGroup = parseInt(this.model.get('MIN_GROUP'));
                /*
                if(lis.length < minGroup){
                    alert('课程组织至少要有'+minGroup+'个分组');
                    return false;
                }
                */
                if(lis.length == 0){
                    alert('课程组织至少要有1个分组');
                    return false;
                }
                var minRole = this.model.get('MIN_ROLE'), maxRole = this.model.get('MAX_ROLE');
                lis.each(function(){
                    var currCount = $(this).find('span').eq(1).text().trim();
                    if(currCount < minRole || currCount > maxRole){
                        var tempGroup = $(this).parent().parent().parent().find('p').eq(0).text(),
                            tempRole = $(this).find('span').eq(0).text();
                        hasUser = false;
                        alert('分组[ '+tempGroup+' ]的角色[ '+tempRole+' ]的学员数实际为'+currCount+'人，该角色的学员人数范围为'+minRole+'到'+maxRole+'人~~');
                        return false;
                    }
                });

                if(!hasUser){
                    return false;
                }
                if(cName == 'save'){
                    this.updateCourseOrg();
                    //alert('课程组织保存成功~~');
                }
                if(cName == 'complete'){
                    var LRNSCN_ORG_ID = $('.tab1', 'body').attr('data-org-id'), bpmnInstanceId = this.model.get('INSTANCE_ID');
                    $.post('http://'+engineHost+'course/deploy',
                        {ecgeditorHost: ecgeditorHost, bpmnInstanceId:bpmnInstanceId, courseInstanceId:bpmnInstanceId+'@'+LRNSCN_ORG_ID, isCooperation: "1"},
                        //{ecgeditorHost: 'authoring2.xuezuowang.com', bpmnInstanceId:bpmnInstanceId, courseInstanceId:bpmnInstanceId+'@'+LRNSCN_ORG_ID},
                        function(deployResult){
                            //var r = JSON.parse(deployResult);
                            if(!deployResult){
                                alert('课程发布失败失败~~');
                            }else if(deployResult.processDefinitionId == ''){
                                alert('课程发布失败, 原因:'+deployResult.errorMsg);
                            }else{
                                $.post('/CourseOrg/optCourseOrg/update', {updateObj:JSON.stringify({LRNSCN_ORG_ID: LRNSCN_ORG_ID, STATUS: '1', PROC_DEF_ID:deployResult.processDefinitionId , isToOC : true})}, function(updateResult){
                                    if(updateResult && updateResult.isOk){
                                        alert('本课程已组织完成，可以开始进行学习了~~');
                                        window.location.href = '/CourseOrg/search';
                                    }else{
                                        alert('完成组织课程失败~~');
                                    }
                                });
                            }
                    });
                }
            }/*else if(cName == 'reset'){
                $('.newGroup', '.tab2').val('');
                $('#course_groups', '.tab2').html('');
                $('input[name="orgs"]', '.tab2').val('');
                $('input[name="persons"]', '.tab2').val('');
                $('#selected_persons', '.tab2').html('');
            }*/else if(cName == 'back'){
                window.location.href = '/CourseOrg/search';
            }
        }
    });

    var CourseOrgView = new CourseOrgPanelView();
})(jQuery);
