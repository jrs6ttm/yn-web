/**
 * Created by admin on 2016/3/8.
 */
var users = {};     //存放已经连接到服务器的用户ID
var msgs = {};      //存放离线消息
var systemSocketsFromUser = require('./SocketPollService').systemSocketsFromUser;    //以用户为索引的套接字索引表
var systemSocketsFromChat = require('./SocketPollService').systemSocketsFromChat;    //以房间号为索引的套接字索引表
var isEmpty = require('../lib/testFunction').isEmpty;                                     //检测对象是否为空
var rooms = {};      //存放各个房间中的用户列表
var msgTime = {};    //存放每对连接最近一次会话的时间,时间用毫秒的形式存储
var config = require('../config/config.json');
var Bufferhelper = require('../lib/bufferhelper');

//使用amqp服务总线实现持久化，主要在离线消息处使用
var amqp = require('amqplib/callback_api');
var conn = {};             //amqp传回来的一个连接实例
var channel = {};     //用来存放各个ch实例

amqp.connect(config.rabbitmq[config.runMode], function(err, connInstance) {
    if (err) {
        bail(err);
    }
    conn.conn = connInstance;
});

function bail(err) {
    console.error('error!');
    console.error(err);
}

function publisher(conn, userId, userToId, msg) {
    function on_open(err, ch) {
        if (err !== null) {
            bail(err);
        }
        var q = userId + userToId;
        console.log('publisher' + q);
        ch.assertQueue(q);
        if (msg instanceof Buffer) {
            ch.sendToQueue(q, msg);
        } else {
            ch.sendToQueue(q, new Buffer(msg));
        }
        ch.close();
    }
    //执行中出错说明没能连接上amqp服务器
    try {
        conn.createChannel(on_open);
    } catch (e) {
        console.log(e);
    }
}

function consumer(conn, userId, userToId, callback) {
    function on_open(err, ch) {
        if (err !== null) {
            bail(err);
        }
        var q = userId + userToId;
        channel[q] = ch;
        ch.assertQueue(q);
        ch.consume(q,function(msg) {
            callback(msg,ch);
            console.log('队列：'+ q);
        },{noACK:false});
    }
    //执行中出错说明没能连接上amqp服务器
    try {
        conn.createChannel(on_open);
    } catch (e) {
        console.log(e);
    }
}

exports.handleChatingOnline = function (data, socket) {
    if (data.roomId) {
        socket.userId = data.userId;
        socket.userName = data.userName;
        socket.roomId = data.roomId;
        socket.userToName = data.userToName;
        if (!users[data.userId]) {
            //将用户名添加到 users 对象中
            users[data.userId] = data.userId;
        }
        if (rooms[data.roomId] instanceof Object) {    //rooms[socket.roomId]中存放的为当前房间中的用户列表
            rooms[data.roomId][data.userId] = data.userName;
        } else {
            rooms[data.roomId] = {};
            rooms[data.roomId][data.userId] = data.userName;
        }
        //向用户所处房间里的所有用户广播该用户的上线消息
        if (systemSocketsFromChat[data.roomId]) {   //找到 systemSocketsFromChat 索引表中和当前套接字room属性相同的套接字集合
            //console.log('------------------');
            for (var client in systemSocketsFromChat[data.roomId]) {    //遍历套接字集合中的套接字
                for (var userSocket in systemSocketsFromChat[data.roomId][client]) {    //遍历用户在该房间中所建立的所有连接
                    systemSocketsFromChat[data.roomId][client][userSocket].emit('online', {
                        users: rooms[data.roomId],
                        userId: data.userId,
                        userName: data.userName,
                        userToId: data.roomId,
                        userToName: data.userToName
                    });
                }
            }
        }
    } else if (data.userToId) {
        socket.userId = data.userId;
        socket.userName = data.userName;
        socket.userToId = data.userToId;
        socket.userToName = data.userToName;
        if (!users[data.userId]) {
            //将用户名添加到 users 对象中
            users[socket.userId] = data.userId;
        }
        if (systemSocketsFromUser[data.userToId]) {
            for (client in systemSocketsFromUser[data.userToId]) {
                if (systemSocketsFromUser[data.userToId][client].roomId === undefined) {
                    if (systemSocketsFromUser[data.userToId][client].userToId === data.userId) {
                        systemSocketsFromUser[data.userToId][client].emit('online', {
                            userId : data.userId,
                            userName: data.userName,
                            userToId : data.userToId,
                            userToName : data.userToName
                        });
                        socket.emit('userToIsOnline',{});
                    }
                }
            }
        }
        //if (msgs[data.userToId] && msgs[data.userToId][data.userId]) {
        //    socket.emit('offlineMsg', {
        //        userId: data.userToId,
        //        userName: data.userToName,
        //        userToId: data.userId,
        //        userToName : data.userName,
        //        msg: msgs[data.userToId][data.userId]
        //    });
        //    console.log('离线消息发送');
        //    delete msgs[data.userToId][data.userId];
        //}
        //离线消息推送
        consumer(conn.conn, data.userToId, data.userId, function(msg, ch) {
            //console.log(msg.content instanceof Buffer);
            //console.log(msg);
            //console.log(msg.content.toString());
            var content = msg.content;
            var type = content.toString().slice(0,5);
            console.log(type);
            switch (type) {
                case 'times' :
                    socket.emit('offlineMsg', {
                        userId: data.userToId,
                        userName: data.userToName,
                        userToId: data.userId,
                        userToName : data.userName,
                        msg: content.toString(),
                        type: 'time'
                    });
                    break;
                case 'texts' :
                    socket.emit('offlineMsg', {
                        userId: data.userToId,
                        userName: data.userToName,
                        userToId: data.userId,
                        userToName : data.userName,
                        msg: content.toString(),
                        type: 'text'
                    });
                    break;
                case 'audio' :
                    socket.emit('offlineMsg', {
                        userId: data.userToId,
                        userName: data.userToName,
                        userToId: data.userId,
                        userToName : data.userName,
                        msg: content.slice(5, msg.content.length),
                        type: type
                    });
                    break;
                case 'image' :
                    socket.emit('offlineMsg', {
                        userId: data.userToId,
                        userName: data.userToName,
                        userToId: data.userId,
                        userToName : data.userName,
                        msg: content.slice(5, msg.content.length),
                        type: type
                    });
                    break;
                default :
                    socket.emit('offlineMsg', {
                        userId: data.userToId,
                        userName: data.userToName,
                        userToId: data.userId,
                        userToName : data.userName,
                        msg: content.toString(),
                        type: 'text'
                    });
            }
            ch.ack(msg);
            console.log('离线消息发送');
            try {
                delete msgs[data.userToId][data.userId];
            } catch (e) {
                console.log(e);
            }
        });
        console.log(socket.userName+ '与' + socket.userToName + '建立连接');
    }
};

exports.handleChatingSay = function (data, socket) {
    var time = new Date();
    var flag = true;                    //用来判断距离上一次会话消息时间间隔是否超过1分钟
    var bufferhelper = new Bufferhelper();
    var year,
        month,
        date,
        hours,
        minutes,
        seconds;
    console.log('type: ' + typeof data.msg);
    console.log(data.msg instanceof Buffer);
    if (socket.roomId) {
        //console.log(socket.roomId);
        if (msgTime[socket.roomId] === undefined) {
            msgTime[socket.roomId] = time;
        } else if((time - msgTime[socket.roomId]) < 60000){
            flag = false;
        }
        msgTime[socket.roomId] = time;
        hours = time.getHours();
        minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
        seconds = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
        time = hours + ':' + minutes + ':' + seconds;
        //向该用户所在房间的所有用户广播消息
        if (systemSocketsFromChat[socket.roomId]) {     //找到systemSocketsFromChat索引表中room属性和当前套接字room属性相同的套接字集合
            for (var client in systemSocketsFromChat[socket.roomId]) {    //遍历房间中的所有用户名
                for (var userSocket in systemSocketsFromChat[socket.roomId][client]) {  //遍历用户在该房间中所建立的所有连接
                    if (flag) {
                        systemSocketsFromChat[socket.roomId][client][userSocket].emit('say', {
                            userId : data.userId,
                            userName : data.userName,
                            userToId : data.userToId,
                            userToName : data.userToName,
                            msg : data.msg,
                            time : time,
                            type :data.type
                        });
                    } else {
                        systemSocketsFromChat[socket.roomId][client][userSocket].emit('say', data);
                    }
                }
            }
        }
    } else if (socket.userToId) {
        /*if (socket.userToId === socket.userId) {
         return;
         }*/
        var online = false;
        //console.log(socket.userToId);
        if (msgTime[socket.userToId] === undefined) {
            msgTime[socket.userToId] = time;
        } else if((time - msgTime[socket.userToId]) < 60000){
            flag = false;
        }
        //console.log(time - msgTime[socket.userToId]);
        msgTime[socket.userToId] = time;
        hours = time.getHours();
        minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
        seconds = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
        if ((time - msgTime[socket.userToId]) < (24 * 60 * 60 * 1000)) {        //时间相差在24小时内
            //判断当前会话的时间戳与上一次会话的时间戳中的月份中的日期值是否一致
            if (time.getDate() === msgTime[socket.userToId].getDate()) {
                time = hours + ':' + minutes + ':' + seconds;
            }
        } else {
            year = time.getFullYear();
            month = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1;
            date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
            time = year + '/' + month + '/' + date + ' ' + hours + ':' + minutes + ':' + seconds;
        }
        if (systemSocketsFromUser[socket.userToId]) {
            for (client in systemSocketsFromUser[socket.userToId]) {
                if (systemSocketsFromUser[socket.userToId][client].roomId === undefined) {
                    if (systemSocketsFromUser[socket.userToId][client].userToId === socket.userId) {
                        online = true;
                        if (flag) {
                            systemSocketsFromUser[socket.userToId][client].emit('say', {
                                userId : data.userId,
                                userName : data.userName,
                                userToId : data.userToId,
                                userToName : data.userToName,
                                msg : data.msg,
                                time : time,
                                type : data.type
                            });
                        } else {
                            systemSocketsFromUser[socket.userToId][client].emit('say', data);
                        }
                    }
                }
            }
        }
        if (systemSocketsFromUser[socket.userId]) {
            for (client in systemSocketsFromUser[socket.userId]) {
                if (systemSocketsFromUser[socket.userId][client].roomId === undefined) {
                    if (systemSocketsFromUser[socket.userId][client].userToId === socket.userToId) {
                        if (flag) {
                            systemSocketsFromUser[socket.userId][client].emit('say', {
                                userId : data.userId,
                                userName : data.userName,
                                userToId : data.userToId,
                                userToName : data.userToName,
                                msg : data.msg,
                                time : time,
                                type : data.type
                            });
                        } else {
                            systemSocketsFromUser[socket.userId][client].emit('say', data);
                        }
                    }
                }
            }
        }
        if (!online) {                       //两层索引的msgs
            if (flag) {
                publisher(conn.conn, data.userId, data.userToId, 'times' + time);
            }
            if (msgs[data.userId] === undefined) {
                msgs[data.userId] = {};
                msgs[data.userId][data.userToId] = 1;
            } else {
                if (msgs[data.userId][data.userToId] === undefined) {
                    msgs[data.userId][data.userToId] = 1;
                }
                msgs[data.userId][data.userToId] ++;
            }
            if (data.type === 'text') {
                data.msg = 'texts' + data.msg;
            } else {
                bufferhelper.concat(new Buffer(data.type)).concat(data.msg);
                data.msg = bufferhelper.toBuffer();
                console.log(data.msg.constructor);
                console.log(typeof data.msg);
            }
            //将离线消息发到amqp服务器来持久化
            publisher(conn.conn, data.userId, data.userToId, data.msg);
        }
    }
};
exports.handleChatingOffline = function (socket) {
    try{
        channel[socket.userToId + socket.userId].close();
    } catch (e) {
        //console.error(e);
    }
    if (socket.roomId) {
        if (systemSocketsFromChat[socket.roomId]) {
            if (isEmpty(systemSocketsFromChat[socket.roomId][socket.userId])) {
                delete rooms[socket.roomId][socket.userId];
                console.log('offline');
                //console.log(rooms[socket.roomId]);
                for (var clients in systemSocketsFromChat[socket.roomId]) {
                    for (var client in systemSocketsFromChat[socket.roomId][clients]) {
                        systemSocketsFromChat[socket.roomId][clients][client].emit('offline', {
                            users : rooms[socket.roomId],
                            userId : socket.userId,
                            userName : socket.userName,
                            userToId : socket.roomId,
                            userToName : socket.userToName
                        });
                    }
                }
            }
        }
    } else if (socket.userToId) {                       //当一对一的套接字连接中断后，默认为用户下线
        if (isEmpty(systemSocketsFromUser[socket.userId]) && users[socket.userId]) {
            // todo Something
            //从 users 对象中删除该用户名
            delete users[socket.userId];
        }
        var offline = true;
        if (systemSocketsFromUser[socket.userId]) {
            for (client in systemSocketsFromUser[socket.userId]) {
                if (systemSocketsFromUser[socket.userId][client].userToId === socket.userToId) {
                    offline = false;
                }
            }
        }
        if (offline) {
            console.log('通知'+ socket.userToName + ' ' + socket.userName + '下线了' );
            if (systemSocketsFromUser[socket.userToId]) {
                for (client in systemSocketsFromUser[socket.userToId]) {
                    if (systemSocketsFromUser[socket.userToId][client].roomId === undefined) {
                        if (systemSocketsFromUser[socket.userToId][client].userToId === socket.userId) {
                            systemSocketsFromUser[socket.userToId][client].emit('offline',{
                                userId : socket.userId,
                                userName : socket.userName,
                                userToId : socket.userToId,
                                userToName : socket.userToName
                            });
                        }
                    }
                }
            }
        }
    }
};

exports.msgs = msgs;