/**
 * Created by Administrator on 2016/7/29.
 */
//课程组织
var CourseOrgModel = Backbone.Model.extend({
    defaults : {
        CID:1,
        optType:'', //操作类型：search、look、edit
        userId: '', //登录用户

        LRNSCN_ORG_ID: '',   //           '课程组织ID',
        TEACHER_ID: '', //               '负责老师ID'
        TEACHER_NAME: '',   //               '负责老师名字'
        ORG_USER_ID: '',    //                '组织人员ID',
        ORG_USER_NAME: '',  //                '组织人员名字',
        BEGIN_TIME: '',     //                  '组织开始时间'
        END_TIME: '',   //                    '组织结束时间'
        LRN_AREA_ID: '',     //             '学习领域ID',
        LRN_AREA_NAME: '',  //             '学习领域名称',
        INSTANCE_ID: '',    //           '学习情景实例ID',
        INSTANCE_NAME:'',   //             '学习情景名称'
        MIN_GROUP:0,       //              '最小组数'
        MAX_GROUP:0,       //              '最大组数'
        MIN_MEMBER:0,      //              '最小组成员数'
        MAX_MEMBER:0,      //              '最大组成员数'
        MIN_ROLE:0,      //              '角色中最小成员数'
        MAX_ROLE:0,      //              '角色中最大成员数'
        FILE_ICON:'',      //               '课程图标'
        PROC_DEF_ID: '',
        //IS_COOPERATION: '', //         true:课程组织起来学习 , false:课程不组织，独立完成课程(无意义，进入到这里的课程，都是要组织起来的课程)
        IS_SINGLE:0,       //          1:(组织起来)每人独立学习课程 , 0:(组织起来)多人协作学习课程

        REMARK: '',     //                '备注说明',
        ISVALID: '1',    //               '是否有效,1:有效,0或NULL无效',
        STATUS: '0',    //                  '课程组织状态，0:未完成；1:已完成'
        CREATOR_ID: '',     //             '录入人员',

        CREATOR_ORGID: '',    //           '录入单位ID',
        CREATOR_ORGID_NAME: '',   //           '录入单位名称',
        CREATOR_GID: '',    //           '录入机构ID',
        CREATOR_GID_NAME: '',   //           '录入机构名称',

        CREATE_DATE: '',    //            '录入日期',
        LSTUPDID: '',   //              '最近更新人',
        LSTUPDDATE: ''  //            '最近更新时间',
    }
});
//课程组织结构
var CourseOrgStructureModel = Backbone.Model.extend({
    defaults: {
        ORG_STRUCTURE_ID:'',     //      '课程组织结构ID',
        PARENT_ID:'',   //       '课程组织结构父结点ID',
        TREE_NODE_CODE:'',  //       '层次编码',
        SORT:'R',    //       '类型：R：角色，O：分组',
        CONTEXT_ID:'',  //       '内容ID',
        CONTEXT_DES:'',     //       '内容名称',
        LEVEL:'',   //       '层级数',
        ISLEAF:'1',  //       '是否未级，1：未级，0或NULL表示非未级',
        COUNT: 0, //角色下的人员数
        //LRN_AREA_ID:'',     //       '学习领域ID',
        //INSTANCE_ID:'',     //       '学习情景实例ID',

        LRNSCN_ORG_ID:'',   //       '课程组织ID',

        REMARK:'',  //       '备注说明',
        ISVALID:'',     //       '是否有效,1:有效,0或NULL无效',
        CREATOR_ID:'',  //       '录入人员',
        //CREATOR_GID:'',     //       '录入机构',
        CREATE_DATE:'',     //       '录入日期',
        LSTUPDID:'',    //       '最近更新人',
        LSTUPDDATE:''   //       '最近更新时间',
    }
});
//课程组织结构人员
var CourseOrgUserModel = Backbone.Model.extend({
    defaults: {
        LRNSCN_ORG_USER_CID: '',    //        '课程组织人员表ID',
        SYNID : '',
        USER_ID: '',    //        '人员ID',
        NAME : '',
        SEX:'',
        SKILL:'',

        DEPT_ID: '', //人员所属末级机构id
        DEPT_FULL_DES: '', //人员所属末级机构
        ORG_ID: '',  //人员所属机构id
        ORG_FUll_DES:'',
        //ORG_DES:'', //人员所属机构描述
        //LRN_AREA_ID: '',    //        '学习领域ID',
        //INSTANCE_ID: '',    //        '学习情景实例ID',

        LRNSCN_ORG_ID: '',  //        '课程组织ID',
        ORG_STRUCTURE_ID: '',   //        '课程组织结构ID',

        REMARK: '',     //        '备注说明',
        ISVALID: '1',    //        '是否有效,1:有效,0或NULL无效',
        CREATOR_ID: '',     //        '录入人员',
        //CREATOR_GID: '',    //        '录入机构',
        CREATE_DATE: '',    //        '录入日期',
        LSTUPDID: '',   //        '最近更新人',
        LSTUPDDATE: ''  //        '最近更新时间',
    }
});
//课程角色
var CourseRole = Backbone.Model.extend({
    defaults: {
        //LRN_AREA_ID: '', //             '学习领域ID',
        //INSTANCE_ID: '', //           '学习情景实例ID',

        roleId:'',
        roleName:''
    }
});
var CourseOrgUserList = Backbone.Collection.extend({
    model:CourseOrgUserModel
});
var CourseRoleList = Backbone.Collection.extend({
    model: CourseRole,
    initialize: function(){
        _.bindAll(this, 'getRole');
    },
    getRole: function(INSTANCE_ID){
        //console.log(INSTANCE_ID +' '+INSTANCE_ID);
        //TODO
        //tangfangzhou
         var me = this;
         $.getJSON('http://'+ecgeditorHost+'/load/loadAllLane?fileId='+INSTANCE_ID+'&jsonCallBack=?', function(result){
             if(result.success) {
                 var roles = result.data;

                 if (roles && roles.length > 0) {
                     me.reset(roles);
                 }
             }else{
                 console.log('获取不到该课程的角色!');
             }
         });
    }
});
var courseOrgUserList = new CourseOrgUserList();
var courseRoleList = new CourseRoleList();
