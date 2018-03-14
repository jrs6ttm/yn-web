/**
 * Created by admin on 2016/3/8.
 */

var ConsoleService = require('../model/ConsoleService');
var ChatSocketService = require('../model/ChatSocketService');
var CodeSocketService = require('../model/CodeSocketService');
var SocketsPollService = require('../model/SocketPollService');
var MonitorService = require('../model/MonitorService');

/*
 webRTC 变量
 */
var rooms = {};
var users = {};

var createServer2ServerListener = function(){

    var ampq = require('amqplib/callback_api');
    ampq.connect('amqp://testmq:testmq@192.168.1.188:5672',function(err,conn){
        if(!err){
            conn.createChannel(function(err,ch){
                if(!err){
                    var q = 'webConsole';
                    ch.assertQueue(q, {durable: true});
                    ch.consume(q,function(msg){
                        if(msg){
                            var jsonData = JSON.parse(msg.content.toString());
                            ConsoleService.sendDataToWebConsole(jsonData.userId,jsonData.tpId,jsonData.data);
                        }
                    },{noAck:true});
                } else {
                    console.log('没有成功创建信道!');
                }
            });
        } else {
            console.log('没有成功创建连接!');
        }
    });
};


var codeCoopSocketEvent = function(socket){

    socket.on('userInformation', function (data) {
        SocketsPollService.addUserSocket(data, socket);
        ChatSocketService.handleChatingOnline(data, socket);
    });

    socket.on('codeMessage',function(data){
        //console.log('codeMessage',data);
        CodeSocketService.handleCodeMessage('codeMessage',data,socket);
    });
    socket.on('cursorMessage',function(data){
        console.log('cursorMessage',data);
        CodeSocketService.handleCodeMessage('cursorMessage',data,socket);
    });
    socket.on('saveSuccess',function(data){
        //console.log('saveSuccess',data);
        CodeSocketService.handleCodeMessage('saveSuccess',data,socket);
    });
    socket.on('updatePms',function(data){
        //console.log('updatePms',data);
        CodeSocketService.handlePermission('updatePms',data);
    });
    socket.on('addPms',function(data){
        //console.log('addPms',data);
        CodeSocketService.handlePermission('addPms',data);
    });

    //用户下线时
    socket.on('disconnect', function () {
        SocketsPollService.removeUserSocketBySocketId(socket);
        //若 users 对象中保存了该用户名
        ChatSocketService.handleChatingOffline(socket);
    });
};

var chatSocketEvent = function (socket) {

    socket.on('userInformation', function (data) {
        SocketsPollService.addUserSocket(data, socket);
        ChatSocketService.handleChatingOnline(data, socket);
    });

    //聊天会话消息传输
    socket.on('say', function (data) {
        console.log(data);
        ChatSocketService.handleChatingSay(data, socket);
    });

    //用户下线时
    socket.on('disconnect', function () {
        SocketsPollService.removeUserSocketBySocketId(socket);
        //若 users 对象中保存了该用户名
        ChatSocketService.handleChatingOffline(socket);
    });
};

var learningSocketEvent = function (socket) {
    socket.on('userInformation', function (data) {
        SocketsPollService.addUserSocket(data, socket);
    });

    //学生发出求助请求
    socket.on('help', function (data) {
        console.log('help');
        MonitorService.handleStudentsHelp(socket,data);
    });

    //学生给老师发送消息
    socket.on('offMsg', function () {
        console.log('offMsg');
        MonitorService.handleOffMsg(socket);
    });

    //学生取消求助请求或者老师处理该请求时
    socket.on('cancelHelp', function () {
        console.log('cancelHelp');
        MonitorService.handleStudentsCancelHelp(socket);
    });

    //用户下线时
    socket.on('disconnect', function () {
        SocketsPollService.removeUserSocketBySocketId(socket);
        //学生退出当前学习的课程
        MonitorService.handleStudentsOffline(socket);
    });

    //进入课程立即发送
    socket.on('studentOnline', function (data) {
        console.log('studentOnline');
        console.log(data);
        SocketsPollService.addUserSocket(data, socket);
        MonitorService.handleStudentsOnline(data, socket);
    });

    //学生学习进度变化
    socket.on('studentProgress', function (data) {
        MonitorService.handleStudentsProgress(data, socket);
    });

    //学生学习时间变化
    socket.on('studentOnlineTimeChange', function(data) {
        MonitorService.handleStudentOnlineTimeChange(data, socket);
    });
};

var monitorSocketEvent = function (socket) {

    socket.on('userInformation', function (data) {
        SocketsPollService.addUserSocket(data, socket);
    });

    //教师打开监控页面
    socket.on('teacherOpenMonitor', function (data){
        console.log('teacherOpenMonitor');
        MonitorService.handleTeacherOpenMonitor(data, socket);
    });

    //老师处理了求助请求
    socket.on('resolveHelp', function (data) {
        console.log('resolveHelp');
        MonitorService.handleTeacherResolveHelp(data);
    });

    //用户下线时
    socket.on('disconnect', function () {
        SocketsPollService.removeUserSocketBySocketId(socket);
    });
};

var terminalSocketEvent = function (socket) {
    socket.on('terminalInfo', function (data) {
        console.log('terminalInfo',data);
        SocketsPollService.addUserSocket(data, socket);
        MonitorService.handleTerminalInfo(data, socket);
    });
};

var webRTCSocketEvent = function (socket) {

    socket.on('join', function (data) {
        console.log('join');
        var user, room, curRoom, ids = [];

        room = data.room;
        curRoom = rooms[room] = rooms[room] || {};

        for(user in curRoom) {
            curRoom[user].emit('new_peer', {
                socketId : socket.id,
                userId : data.userId,
                userName : data.userName
            });
            ids.push(user);
        }
        if (users[room] === undefined) {
            users[room] = {};
        }
        users[room][data.userId] = data.userName;
        curRoom[socket.id] = socket;

        socket.room = room;
        socket.userId = data.userId;
        socket.emit('peers', {
            connections : ids,
            users : users[room]
        });
    });

    socket.on('ice_candidate', function (data) {
        var soc = getSocket(data.socketId, socket.room);

        if (soc) {
            soc.emit('ice_candidate', {
                label : data.label,
                candidate : data.candidate,
                socketId : socket.id
            });
        }
    });

    socket.on('offer', function (data) {
        var soc = getSocket(data.socketId, socket.room);

        if (soc) {
            soc.emit('offer', {
                sdp : data.sdp,
                socketId : socket.id
            });
        }
    });

    socket.on('answer', function (data) {
        var soc = getSocket(data.socketId, socket.room);

        if (soc) {
            soc.emit('answer', {
                sdp : data.sdp,
                socketId : socket.id
            });
        }
    });

    socket.on('disconnect', function () {
        var id;
        try {
            delete rooms[socket.room][socket.id];
            delete users[socket.room][socket.userId];
        } catch (e) {
            console.log(e);
        }
        for (id in rooms[socket.room]) {
            rooms[socket.room][id].emit('remove_peer', {
                socketId : socket.id
            });
        }
    });

    function getSocket(socketId, socketRoom) {
        if (!rooms[socketRoom]) {
            return;
        }
        return rooms[socketRoom][socketId];
    }
};

var startSocketsConnection = function (server) {
    var io = require('socket.io').listen(server);

    io.sockets.on('connection', function (socket) {
        console.log('socket is connected');

        socket.on('socketType', function (data) {

            console.log(data.type);

            switch (data.type) {
                case 'chat' : chatSocketEvent(socket);
                    break;
                case 'monitor' : monitorSocketEvent(socket);
                    break;
                case 'code' : codeCoopSocketEvent(socket);
                    break;
                case 'terminal' : terminalSocketEvent(socket);
                    break;
                case 'webRTC' : webRTCSocketEvent(socket);
                    break;
                case 'learning' : learningSocketEvent(socket);
                    break;
                default : console.log('socket.type: ' + data.type);
                    console.log(data);
            }
        });

        socket.on('error',function(data) {
            console.log(data);
        });
    });
};
exports.createOnStartSocketServer = function(server){
    createServer2ServerListener();
    startSocketsConnection(server);
};