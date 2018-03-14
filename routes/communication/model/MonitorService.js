/**
 * Created by admin on 2016/3/22.
 */
var studentsInfo = {};       //用来存放当前在线学生当前学习的所有课程及进度 -- 主要用来给教师初始化页面使用
var systemSocketsFromUser = require('./SocketPollService').systemSocketsFromUser;    //以用户为索引的套接字索引表
var msgs = require('./ChatSocketService').msgs;
var isEmpty = require('../lib/testFunction').isEmpty;                                     //检测对象是否为空
//flag里面存放的属性是上线用户发来的instanceId，值是用户当前进入该课程的次数，用来判断上线用户是协同操作
//或者是正常学习以及是否是多次进入同一课程
var flag = {};
//存储帮助协同操作的成员列表，及对应的任务ID
var synergy = {};


exports.handleStudentsOnline = function (data, socket) {
    //将当前学生所学习课程对应负责的老师存储到socket.currentTeacherId
    socket.currentTeacherId = data.teacherId;
    socket.studentId = data.userId;
    //socket.userId用来作为索引使用
    socket.courseId = data.courseId;
    socket.userId = data.userId;
    socket.instanceId = data.instanceId;
    socket.isSynergy = data.isSynergy;

    if (synergy[data.instanceId] === undefined) {
        synergy[data.instanceId] = {};
    }
    if (data.isSynergy === undefined) {
        if (synergy[data.instanceId].userId === undefined) {
            synergy[data.instanceId].userId = data.userId;
        }
        if (flag[data.instanceId] === undefined) {
            flag[data.instanceId] = 1;
            //将用户进入课程的信息存储到 studentsInfo 中，用来给老师初始化监控页面
            //studentsInfo的数据存储方式 studentsInfo[data.userId][data.teacherId];
            if (studentsInfo[data.userId] === undefined) {
                studentsInfo[data.userId] = {};
                studentsInfo[data.userId][data.teacherId] = {};
            } else if (studentsInfo[data.userId][data.teacherId] === undefined) {
                studentsInfo[data.userId][data.teacherId] = {};
            }
            //因为每个用户的 userId 是固定不变的所以只需要赋值一次
            if (studentsInfo[data.userId].userId === undefined) {
                studentsInfo[data.userId].userId = data.userId;
            }
            studentsInfo[data.userId].userName = data.userName;
            studentsInfo[data.userId].userAvatar = data.userAvatar;
            if (studentsInfo[data.userId][data.teacherId][data.instanceId] === undefined) {
                studentsInfo[data.userId][data.teacherId][data.instanceId] = {};
            }
            studentsInfo[data.userId][data.teacherId][data.instanceId].courseName = data.courseName;
            studentsInfo[data.userId][data.teacherId][data.instanceId].progress = data.progress;
            studentsInfo[data.userId][data.teacherId][data.instanceId].onlineTime = 0;
            //获取离线/(未读)消息的数量
            if (msgs[data.userId] && msgs[data.userId][data.teacherId]) {
                studentsInfo[data.userId][data.teacherId].offLineMsgNum = msgs[data.userId][data.teacherId];
                data.offLineMsgNum =  msgs[data.userId][data.teacherId];
                console.log('offLineMsgNum : ' + msgs[data.userId][data.teacherId]);
            }
            if (systemSocketsFromUser[data.teacherId]) {
                //判断当前上线用户的身份
                for (var client in systemSocketsFromUser[data.teacherId]) {
                    systemSocketsFromUser[data.teacherId][client].emit('studentOnline', data);
                }
            }
        } else {
            flag[data.instanceId]++;
        }
    } else {
        synergy[data.instanceId][data.userId] = data.userName;
        if (systemSocketsFromUser[data.teacherId]) {
            //判断当前上线用户的身份
            for (client in systemSocketsFromUser[data.teacherId]) {
                systemSocketsFromUser[data.teacherId][client].emit('synergyOperate', data);
            }
        }
    }
};

exports.handleStudentsProgress = function (data, socket) {
    if (socket.isSynergy === undefined) {
        studentsInfo[socket.studentId][socket.currentTeacherId][socket.instanceId].progress = data.progress;
        if (systemSocketsFromUser[socket.currentTeacherId]) {
            for (var client in systemSocketsFromUser[socket.currentTeacherId]) {
                systemSocketsFromUser[socket.currentTeacherId][client].emit('studentProgress', {
                    userId : socket.studentId,
                    progress : data.progress,
                    courseId : socket.courseId,
                    courseName : data.courseName,
                    instanceId : socket.instanceId
                });
            }
        }
    }
};

exports.handleStudentOnlineTimeChange = function (data, socket) {
    if (socket.isSynergy === undefined) {
        studentsInfo[socket.studentId][socket.currentTeacherId][socket.instanceId].onlineTime = data.onlineTime;
        if (systemSocketsFromUser[socket.currentTeacherId]) {
            for (var client in systemSocketsFromUser[socket.currentTeacherId]) {
                systemSocketsFromUser[socket.currentTeacherId][client].emit('studentOnlineTimeChange', {
                    userId : socket.studentId,
                    onlineTime : data.onlineTime,
                    courseId : socket.courseId,
                    courseName : data.courseName,
                    instanceId : socket.instanceId
                });
            }
        }
    }
};

exports.handleStudentsOffline = function (socket) {
    if (socket.isSynergy === undefined) {
        if (flag[socket.instanceId] > 1) {
            flag[socket.instanceId]--;
        } else if (flag[socket.instanceId] !== undefined) {
            delete flag[socket.instanceId];
        }
        if (flag[socket.instanceId] === undefined) {
            if (studentsInfo[socket.studentId] && studentsInfo[socket.studentId][socket.currentTeacherId]) {
                if (studentsInfo[socket.studentId][socket.currentTeacherId][socket.instanceId]) {
                    delete studentsInfo[socket.studentId][socket.currentTeacherId][socket.instanceId];
                }
                if (isEmpty(studentsInfo[socket.studentId][socket.currentTeacherId])) {
                    delete studentsInfo[socket.studentId][socket.currentTeacherId];
                }
            }
            if (systemSocketsFromUser[socket.currentTeacherId]) {
                for (var client in systemSocketsFromUser[socket.currentTeacherId]) {
                    systemSocketsFromUser[socket.currentTeacherId][client].emit('studentOffline', {
                        userId : socket.studentId,
                        courseId : socket.courseId,
                        instanceId : socket.instanceId
                    });
                }
            }
        }
    } else {
        try{
            delete synergy[socket.instanceId][socket.userId];
        } catch (e) {
            console.log('删除协同操作列表成员出错！');
        }
        if (systemSocketsFromUser[socket.currentTeacherId]) {
            for (client in systemSocketsFromUser[socket.currentTeacherId]) {
                systemSocketsFromUser[socket.currentTeacherId][client].emit('exitSynergyOperate', {
                    userId : socket.studentId,
                    instanceId : socket.instanceId
                });
            }
        }
    }
};

exports.handleStudentsHelp = function (socket, data) {
    if (systemSocketsFromUser[socket.currentTeacherId]) {
        for (var client in systemSocketsFromUser[socket.currentTeacherId]) {
            systemSocketsFromUser[socket.currentTeacherId][client].emit('help', {
                userId : socket.studentId,
                courseId : socket.courseId,
                instanceId : data.instanceId
            });
        }
    }
};

exports.handleStudentsCancelHelp = function (socket) {
    if (systemSocketsFromUser[socket.currentTeacherId]) {
        for (var client in systemSocketsFromUser[socket.currentTeacherId]) {
            systemSocketsFromUser[socket.currentTeacherId][client].emit('cancelHelp', {
                userId : socket.studentId,
                courseId : socket.courseId
            });
        }
    }
};

exports.handleTeacherOpenMonitor = function (data, socket) {
    var initInfo = {};     //用来初始化当前老师进入的监控页面所需要的信息,以学生的ID为索引
    //从studentsInfo中获取需要反馈到data.teacherId处的信息，并存到initInfo中
    for (var studentId in studentsInfo) {
        //studentsInfo[student]里面有userId,userName,userAvatar,offlineMsg等4个确定的属性
        //以及多个 teacherId 属性 , studentsInfo[studentId][teacherId]存储的信息是老师初始化监控页面
        //所需要的学生的当前所学习的课程信息
        if (studentsInfo[studentId][data.teacherId]) {
            //更新studentsInfo[studentId][teacherId]中offLineMsgNum
            if (msgs[studentId] && msgs[studentId][data.teacherId]) {
                studentsInfo[studentId][data.teacherId].offLineMsgNum = msgs[studentId][data.teacherId];
            } else if(studentsInfo[studentId][data.teacherId].offLineMsgNum){
                delete studentsInfo[studentId][data.teacherId].offLineMsgNum;
            }
            //studentsInfo[studentId][teacherId]中存储的是当前学生正在学习的teacherId
            //所对应的老师的名下的课程的学习信息
            //当有offLineMsgNum的时候 courseList里面还含有该属性
            initInfo[studentId] = {};
            initInfo[studentId].courseList = studentsInfo[studentId][data.teacherId];
            initInfo[studentId].userId = studentId;
            initInfo[studentId].userName = studentsInfo[studentId].userName;
            initInfo[studentId].userAvatar = studentsInfo[studentId].userAvatar;
            initInfo[studentId].synergy = {};
            for (var instanceId in synergy) {
                if (synergy[instanceId].userId === studentId) {
                    initInfo[studentId].synergy[instanceId] = synergy[instanceId];
                }
            }
        }
    }
    // if (systemSocketsFromUser[data.teacherId]) {
    //     for (var client in systemSocketsFromUser[data.teacherId]) {
    //         systemSocketsFromUser[data.teacherId][client].emit('init', initInfo);
    //     }
    // } 初始化时不应该向所有客户端发送Init事件。。回去需要更改
    socket.emit('init', initInfo);
};

exports.handleTeacherResolveHelp = function (data) {
    if (systemSocketsFromUser[data.teacherId]) {
        for (var client in systemSocketsFromUser[data.teacherId]) {
            systemSocketsFromUser[data.teacherId][client].emit('resolveHelp', {
                userId : data.userId,
                courseId : data.courseId
            });
        }
    }
};

exports.handleTerminalInfo = function (data, socket) {
    socket.tpId = data.tpId;
};

exports.handleOffMsg = function (socket) {
    if (systemSocketsFromUser[socket.currentTeacherId]) {
        //判断当前上线用户的身份
        for (var client in systemSocketsFromUser[socket.currentTeacherId]) {
            systemSocketsFromUser[socket.currentTeacherId][client].emit('offMsg', {
                userId: socket.userId
            });
        }
    }
};

