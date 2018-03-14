/**
 * Created by admin on 2016/3/8.
 */
var systemSocketsFromUser = {};  //以用户为索引的套接字索引表，包含所有套接字
var systemSocketsFromChat = {};  //以房间号为索引的套接字索引表，只包含拥有roomId属性的套接字
var isEmpty = require('../lib/testFunction').isEmpty;

exports.addUserSocket = function (data, socket){
    //如果有roomId属性，则将socket放到以房间号为索引的套接字索引表中
    if (data.roomId) {
        if (systemSocketsFromChat[data.roomId] instanceof Object) {
            if (systemSocketsFromChat[data.roomId][data.userId] instanceof Object) {
                systemSocketsFromChat[data.roomId][data.userId][socket.id] = socket;
            } else {
                systemSocketsFromChat[data.roomId][data.userId] = {};
                systemSocketsFromChat[data.roomId][data.userId][socket.id] = socket;
            }
        } else {
            systemSocketsFromChat[data.roomId] = {};
            systemSocketsFromChat[data.roomId][data.userId] = {};
            systemSocketsFromChat[data.roomId][data.userId][socket.id] = socket;
        }
    }
    //所有的套接字都将放到以用户为索引的套接字索引表中，进行集中管理
    if (systemSocketsFromUser[data.userId] instanceof Object) {
        systemSocketsFromUser[data.userId][socket.id] = socket;
    }else{
        systemSocketsFromUser[data.userId] = {};
        systemSocketsFromUser[data.userId][socket.id] = socket;
    }
};

exports.removeUserSocketBySocketId = function (socket) {
    if (systemSocketsFromUser[socket.userId]){
        if (systemSocketsFromUser[socket.userId][socket.id]) {
            delete systemSocketsFromUser[socket.userId][socket.id];
        }
        if (isEmpty(systemSocketsFromUser[socket.userId])) {
            delete systemSocketsFromUser[socket.userId];
        }
    }
    //如果socket里面有roomId属性
    if (systemSocketsFromChat[socket.roomId]) {
        if (systemSocketsFromChat[socket.roomId][socket.userId] && systemSocketsFromChat[socket.roomId][socket.userId][socket.id]) {
            delete systemSocketsFromChat[socket.roomId][socket.userId][socket.id];
        }
        if (isEmpty(systemSocketsFromChat[socket.roomId][socket.userId])) {
            delete systemSocketsFromChat[socket.roomId][socket.userId];
        }
    }
};

exports.systemSocketsFromUser = systemSocketsFromUser;
exports.systemSocketsFromChat = systemSocketsFromChat;