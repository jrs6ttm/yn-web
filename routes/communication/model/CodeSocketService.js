/**
 * Created by Eamonn on 2016/3/18.
 */
var systemSocketsFromChat = require('./SocketPollService').systemSocketsFromChat;
var systemSocketsFromUser = require('./SocketPollService').systemSocketsFromUser;
exports.handleCodeMessage = function (msg,data,socket) {
    for (var clients in systemSocketsFromChat) {
        if (clients === socket.roomId) {
            for (var client in systemSocketsFromChat[clients]) {
                if(client !== socket.userId){
                    for (var userSocket in systemSocketsFromChat[clients][client]) {
                        systemSocketsFromChat[clients][client][userSocket].emit(msg, data);
                    }
                }
            }
        }
    }
};

exports.handlePermission = function (msg,data,socket) {
    for (var user in systemSocketsFromUser) {
        for (var client in systemSocketsFromUser[user]) {
            //console.log(systemSocketsFromUser[user][client].userId);
            if(systemSocketsFromUser[user][client].userId === data.userId){
                console.log(msg,systemSocketsFromUser[user][client].userId);
                systemSocketsFromUser[user][client].emit(msg,data);
            }
        }
    }
    //for (var clients in systemSocketsFromChat) {
    //    if (clients === socket.roomId) {
    //        for (var client in systemSocketsFromChat[clients]) {
    //            if(client !== socket.userId){
    //                for (var userSocket in systemSocketsFromChat[clients][client]) {
    //                    if(systemSocketsFromChat[clients][client][userSocket].userName === data.userName){
    //                        console.log(userSocket);
    //                        systemSocketsFromChat[clients][client][userSocket].emit(msg, data);
    //                    }
    //                }
    //            }
    //        }
    //    }
    //}
};
