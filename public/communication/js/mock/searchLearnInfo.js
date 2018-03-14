/**
 * Created by admin on 2016/11/28.
 */
Mock.mock(/\/CourseOrg\/optCourseOrgUser\/searchUsers\s*/, [
    {
        'SYNID' : 'P8RL1RE6',
        'USER_ID' : '138_user14',
        'NAME' : '张龙龙'
    },
    {
        'SYNID' : '55SNT9DD',
        'USER_ID' : '138_user15',
        'NAME' : '李杰'
    }
]);

var example = {};

example.record = [];
example.students = [
    {
        'SYNID' : 'P8RL1RE6',
        'USER_ID' : '138_user14',
        'NAME' : '张龙龙'
    },
    {
        'SYNID' : '55SNT9DD',
        'USER_ID' : '138_user15',
        'NAME' : '李杰'
    }
];
example.types = [
    '进入活动',
    '完成活动',
    '查看活动',
    '保存富文本文件',
    '结束课程'
];
example.tree = [
    {
        id: '1',
        name: 'SQL注入基础学习',
        children: [
            {
                id: '10',
                name: 'SQL基本语法',
                children: [
                    {
                        id: '100',
                        name: 'SQL语法构成',
                        children: [
                            {
                                id: '1000',
                                name: 'SQL语句基础知识'
                            },
                            {
                                id: '1001',
                                name: 'SQL语句基础知识'
                            },
                            {
                                id: '1002',
                                name: 'SQL语句基础知识'
                            },
                            {
                                id: '1003',
                                name: 'SQL语句基础知识'
                            }
                        ]
                    },
                    {
                        id: '101',
                        name: 'SQL常用语法'
                    }
                ]
            }
        ]
    }
    //{
    //    id: '2',
    //    name: 'xss漏洞',
    //    children: [
    //        {
    //            id: '11',
    //            name: 'xss漏洞1'
    //        },
    //        {
    //            id: '12',
    //            name: 'xss漏洞2'
    //        }
    //    ]
    //},
    //{
    //    id: '3',
    //    name: '基于服务端控制木马',
    //    children: [
    //        {
    //            id: '13',
    //            name: '演示1'
    //        }
    //    ]
    //}
];

example.options = [
    {
        "userId": "admin",
        "userName": "admin",
        "optTime": "1480477422167",
        "optDes": "\u8fdb\u5165\u6d3b\u52a8\"\u786e\u5b9a\u5b66\u4e60\u9886\u57df\u540d\u79f0\"",
        "optResult": "-",
        "optType": "\u8fdb\u5165\u6d3b\u52a8",
        "courseId": "fafbb9d0-b12b-11e6-bb30-d7675e6989ca",
        "courseName": "\u5355\u4eba\u8bfe\u7a0b_\u5de5\u5b66\u7ed3\u5408\u8bfe\u7a0b\u8bbe\u8ba1",
        "instanceId": "958fb282-7e40-463a-b939-efbd093287d6",
        "orgId": "1",
        "taskId": "293458",
        "taskName": "\u786e\u5b9a\u5b66\u4e60\u9886\u57df\u540d\u79f0",
        "subtaskId": "EC4",
        "subtaskName": "\u5b66\u4e60\u9886\u57df\u8bbe\u8ba1"
    },
    {
        "userId": "admin",
        "userName": "admin",
        "optTime": "1480477427390",
        "optDes": "\u5b8c\u6210\u6d3b\u52a8\"\u786e\u5b9a\u5b66\u4e60\u9886\u57df\u540d\u79f0\"",
        "optResult": "-",
        "optType": "\u5b8c\u6210\u6d3b\u52a8",
        "courseId": "fafbb9d0-b12b-11e6-bb30-d7675e6989ca",
        "courseName": "\u5355\u4eba\u8bfe\u7a0b_\u5de5\u5b66\u7ed3\u5408\u8bfe\u7a0b\u8bbe\u8ba1",
        "instanceId": "958fb282-7e40-463a-b939-efbd093287d6",
        "orgId": "1",
        "taskId": "293458",
        "taskName": "\u786e\u5b9a\u5b66\u4e60\u9886\u57df\u540d\u79f0",
        "subtaskId": "EC4",
        "subtaskName": "\u5b66\u4e60\u9886\u57df\u8bbe\u8ba1"
    },
    {
        "userId": "admin",
        "userName": "admin",
        "optTime": "1480477427504",
        "optDes": "\u8fdb\u5165\u6d3b\u52a8\"\u63cf\u8ff0\u5b66\u4e60\u9886\u57df\"",
        "optResult": "-",
        "optType": "\u8fdb\u5165\u6d3b\u52a8",
        "courseId": "fafbb9d0-b12b-11e6-bb30-d7675e6989ca",
        "courseName": "\u5355\u4eba\u8bfe\u7a0b_\u5de5\u5b66\u7ed3\u5408\u8bfe\u7a0b\u8bbe\u8ba1",
        "instanceId": "958fb282-7e40-463a-b939-efbd093287d6",
        "orgId": "1",
        "taskId": "293468",
        "taskName": "\u63cf\u8ff0\u5b66\u4e60\u9886\u57df",
        "subtaskId": "EC4",
        "subtaskName": "\u5b66\u4e60\u9886\u57df\u8bbe\u8ba1"
    },
    {
        "userId": "admin",
        "userName": "admin",
        "optTime": "1480477440632",
        "optDes": "\u67e5\u770b\u6d3b\u52a8\"\u786e\u5b9a\u5b66\u4e60\u9886\u57df\u540d\u79f0\"",
        "optResult": "-",
        "optType": "\u67e5\u770b\u6d3b\u52a8",
        "courseId": "fafbb9d0-b12b-11e6-bb30-d7675e6989ca",
        "courseName": "\u5355\u4eba\u8bfe\u7a0b_\u5de5\u5b66\u7ed3\u5408\u8bfe\u7a0b\u8bbe\u8ba1",
        "instanceId": "958fb282-7e40-463a-b939-efbd093287d6",
        "orgId": "1",
        "taskId": "293458",
        "taskName": "\u786e\u5b9a\u5b66\u4e60\u9886\u57df\u540d\u79f0",
        "subtaskId": "EC4",
        "subtaskName": "\u5b66\u4e60\u9886\u57df\u8bbe\u8ba1"
    },
    {
        "userId": "admin",
        "userName": "admin",
        "optTime": "1480477674886",
        "optDes": "\u4fdd\u5b58\u5bcc\u6587\u672c\u6587\u4ef6\"\"",
        "optResult": "\u4fdd\u5b58\u4e86\u5bcc\u6587\u672c\u6587\u4ef6\"\"",
        "optType": "\u4fdd\u5b58\u5bcc\u6587\u672c\u6587\u4ef6",
        "courseId": "e4b51860-b5f4-11e6-b57b-3957009119c1",
        "courseName": "\u5b66\u4e60\u9886\u57df_\u5355\u4eba\u8bfe\u7a0b\u793a\u4f8b_\u5b66\u4e60\u60c5\u5883",
        "instanceId": "92739f40-453d-4773-8c45-8788e4f4e2e7",
        "orgId": "1",
        "taskId": "293378",
        "taskName": "\u6d3b\u52a8\u5355\u5143\u4e4b\u4e09",
        "subtaskId": "EC6",
        "subtaskName": "\u5b50\u4efb\u52a1"
    },
    {
        "userId": "admin",
        "userName": "admin",
        "optTime": "1480477759150",
        "optDes": "\u5b8c\u6210\u6d3b\u52a8\"\u6d3b\u52a8\u5355\u5143\u4e4b\u56db\"",
        "optResult": "\u5b8c\u6210\u4e86\u6d3b\u52a8\"\u6d3b\u52a8\u5355\u5143\u4e4b\u56db\"",
        "optType": "\u5b8c\u6210\u6d3b\u52a8",
        "courseId": "e4b51860-b5f4-11e6-b57b-3957009119c1",
        "courseName": "\u5b66\u4e60\u9886\u57df_\u5355\u4eba\u8bfe\u7a0b\u793a\u4f8b_\u5b66\u4e60\u60c5\u5883",
        "instanceId": "92739f40-453d-4773-8c45-8788e4f4e2e7",
        "orgId": "1",
        "taskId": "293478",
        "taskName": "\u6d3b\u52a8\u5355\u5143\u4e4b\u56db",
        "subtaskId": "",
        "subtaskName": ""
    },
    {
        "userId": "admin",
        "userName": "admin",
        "optTime": "1480487521081",
        "optDes": "\u8fdb\u5165\u6d3b\u52a8\"\u6d3b\u52a8\u5355\u5143\u4e4b\u4e00\"",
        "optResult": "-",
        "optType": "\u8fdb\u5165\u6d3b\u52a8",
        "courseId": "e4b51860-b5f4-11e6-b57b-3957009119c1",
        "courseName": "\u5b66\u4e60\u9886\u57df_\u5355\u4eba\u8bfe\u7a0b\u793a\u4f8b_\u5b66\u4e60\u60c5\u5883",
        "instanceId": "73798907-b7f6-4a98-966a-3660489e53b0",
        "orgId": "1",
        "taskId": "293507",
        "taskName": "\u6d3b\u52a8\u5355\u5143\u4e4b\u4e00",
        "subtaskId": "",
        "subtaskName": ""
    }
];

for(var j = 1; j < 6; j++) {
    for(var i = 0; i < 8; i++) {
        example.record.push({
            optTime: '2016-08-17 10:56',
            userName: 'user' + j,
            optDes: '课程设计任务',
            optType: '学习资料查看',
            optResult: '查看了《SQL准备环境资料》'
        });
    }
}