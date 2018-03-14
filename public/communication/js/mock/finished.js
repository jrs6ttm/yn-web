/**
 * Created by admin on 2016/12/20.
 */
var data = {
    "userId": "J960DGV0",
    "datas": []
};

for (var i = 0; i < 50; i++) {
    var test = {
        "LRNSCN_ORG_ID": "a29586c0-6074-11e6-a234-bd6a0d946d8b",
        "TEACHER_ID": "J960DGV0",
        "TEACHER_NAME": "user19",
        "ORG_USER_ID": "J960DGV0",
        "ORG_USER_NAME": "user19",
        "BEGIN_TIME": "2016-08-17 08:59:18",
        "END_TIME": "2016-08-17 08:59:18",
        "LRN_AREA_ID": "001",
        "LRN_AREA_NAME": "SQL注入系列教程",
        "INSTANCE_ID": "379c4440-c365-11e6-b401-09ecf19b296e",
        "INSTANCE_NAME": "SQL注入进阶篇",
        "MIN_GROUP": "1",
        "MAX_GROUP": "1",
        "MIN_MEMBER": "1",
        "MAX_MEMBER": "1",
        "REMARK": null,
        "ISVALID": "1",
        "STATUS": "3",
        "CREATOR_ID": "J960DGV0",
        "CREATOR_GID": "",
        "CREATOR_GID_NAME": "",
        "LSTUPDDATE": "2016-08-17 08:59:18",
        "LSTUPDID": "J960DGV0"
    };
    test.INSTANCE_NAME = "SQL注入进阶篇" + i;
    data.datas.push(test);
}

Mock.mock(/\/CourseOrg\/optCourseOrg\/search\s*/, data);
Mock.mock(/\/CourseOrg\/getMyOrgedCourses\s*/, data);