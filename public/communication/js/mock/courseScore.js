/**
 * Created by admin on 2017/1/11.
 */
var tableInfo = {
    estimationItems: [
        {
            taskId: "123",
            taskName: "任务活动",
            procInstId: "456",
            //评分规则
            scoreRules: [
                {
                    id: '1', //编号， 1，2，3...
                    name: "教学内容科学性", //评分规则的名字， "界面设计"， "教学内容科学性"
                    type: "peopleScore", //评分类型， "isSubmited"作业是否提交， "examScore"试卷得分， "peopleScore"教师/组员评分
                    score: 3, //分值
                    direction: "这是一段评分标准，正确得3分...",
                    myScore: 1 //我的得分，需要判断myScore存在否
                },
                {
                    id: '2', //编号， 1，2，3...
                    name: "教学内容科学性", //评分规则的名字， "界面设计"， "教学内容科学性"
                    type: "peopleScore", //评分类型， "isSubmited"作业是否提交， "examScore"试卷得分， "peopleScore"教师/组员评分
                    score: 3, //分值
                    direction: "这是一段评分标准，正确得3分...",
                    myScore: 2 //我的得分，需要判断myScore存在否
                }
            ],
            //目标
            target: {
                filePath:"system/files/user_file/blank_sys_file/ae22c713-2d77-47ca-bc06-b81c7459cff9.doc",
                fileName:"1.doc",
                optType:"",
                userId:"blank",
                userName:"blank",
                createTime: "xxx"
            }
        },
        {
            taskId: "123456",
            taskName: "测试活动",
            procInstId: "456",
            //评分规则
            scoreRules: [
                {
                    id: '1', //编号， 1，2，3...
                    name: "教学内容科学性", //评分规则的名字， "界面设计"， "教学内容科学性"
                    type: "peopleScore", //评分类型， "isSubmited"作业是否提交， "examScore"试卷得分， "peopleScore"教师/组员评分
                    score: 3, //分值
                    direction: "这是一段评分标准，正确得3分...",
                    myScore: 1 //我的得分，需要判断myScore存在否
                },
                {
                    id: '2', //编号， 1，2，3...
                    name: "教学内容科学性", //评分规则的名字， "界面设计"， "教学内容科学性"
                    type: "peopleScore", //评分类型， "isSubmited"作业是否提交， "examScore"试卷得分， "peopleScore"教师/组员评分
                    score: 3, //分值
                    direction: "这是一段评分标准，正确得3分...",
                    myScore: 2 //我的得分，需要判断myScore存在否
                }
            ],
            //目标
            target: {
                filePath:"system/files/user_file/blank_sys_file/ae22c713-2d77-47ca-bc06-b81c7459cff9.doc",
                fileName:"1.doc",
                optType:"",
                userId:"blank",
                userName:"blank",
                createTime: "xxx"
            }
        }
    ],
    summarize: {
        sumScore: '6',
        comment: 'is test data'
    }
};
var studentInfo = [
    {
        SYNID: 'P8RL1RE6',
        USER_ID: '138_user14',
        NAME: '张龙龙',
        PROC_INST_ID: '233'
    },
    {
        SYNID: '55SNT9DD',
        USER_I: '138_user15',
        NAME: '李杰',
        PROC_INST_ID: '234'
    }
];

var instanceInfo = [
    {
        userId: '138_user14',
        statement: 'off'
    },
    {
        userId: '138_user15',
        statement: 'on'
    }
];

Mock.mock(/\/ec_engine\/course\/getMyEstimationItems\s*/, tableInfo);
Mock.mock(/\/CourseOrg\/optCourseOrgUser\/searchUsers\s*/, studentInfo);
Mock.mock(/\/getUsersByOrgId\s*/, instanceInfo);