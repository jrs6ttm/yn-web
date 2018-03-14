var systemSocketsFromUser = require('./SocketPollService').systemSocketsFromUser;
exports.sendDataToWebConsole = function(userId,tpId,consoleStdout) {
    // zhangwei todo
    // 测试URL=/console?tpId=uuid1|uuid2
    console.log('userId：',userId);
    console.log('tpId：',tpId);
    console.log('consoleStdout：',consoleStdout);
    for (var clients in systemSocketsFromUser) {
        if (clients === userId) {
            //console.log('clients' + ' ' + clients);
            for (var client in systemSocketsFromUser[clients]) {
                if ((systemSocketsFromUser[clients][client].room === undefined) && (systemSocketsFromUser[clients][client].tpId === tpId)){
                    systemSocketsFromUser[clients][client].emit('message', consoleStdout);
                }
            }
        }
    }
};

