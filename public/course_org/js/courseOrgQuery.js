/**
 * Created by Administrator on 2016/7/27.
 */
var QueryModel = Backbone.Model.extend({
    defaults:{
        userId : '',
        INSTANCE_NAME:'',//             '课程名称'
        TEACHER_NAME: '',//               '负责老师名字'
        CREATOR_GID_NAME: '', //           '录入机构名称',
        ORG_USER_NAME: '', //                '组织人员名字',
        BEGIN_TIME: '', //                  '组织开始时间'
        END_TIME: '' //                    '组织结束时间'
    }
});
var Query = new QueryModel();

var CourseOrgList = Backbone.Collection.extend({
    model : CourseOrgModel,
    initialize : function(){
        _.bindAll(this, 'postForm');
        //处理可能的请求，即此页面可能由其他页面请求而来
        var urlParams = window.location.search;
        if(urlParams.indexOf('?') != -1){
            var param = urlParams.substr(1);
            var paramArr = param.split('=');
            Query.set({TEACHER_NAME : paramArr[1]}, {silent: true});
            console.log(Query);
        }
    },

    postForm : function(){
        var me = this;
        $.get('/CourseOrg/optCourseOrg/search', Query.toJSON(), function(result){
            var data = result.datas, userId = result.userId;
            if(data && data.length > 0) {
                Query.set({userId:userId}, {silent: true});
                me.reset(data);
            }else {
                Query.set({userId:userId}, {silent: true});
                me.reset(null);
            }
        });
    }
});

var courseOrgList = new CourseOrgList();
courseOrgList.postForm();
