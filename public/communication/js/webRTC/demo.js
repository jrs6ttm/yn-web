/**
 * Created by hzjw on 2016/8/1.
 */
var videos = document.getElementById("videos");
var sendBtn = document.getElementById("send-message");
var msgs = document.getElementById("chat-content");
var sendFileBtn = document.getElementById("send-file-button");
var files = document.getElementById("files");
var rtc = WebRTC({
    'userId' : userId,
    'userName' : userName
});


/**********************************************************/
sendBtn.onclick = function(event){
    var msgIpt = document.getElementById("chat-input"),
        msg = msgIpt.innerHTML,
        p = document.createElement("p");
    p.innerText = "me: " + msg;
    //广播消息
    rtc.broadcast(msg);
    msgIpt.innerHTML = "";
    msgs.appendChild(p);
};

sendFileBtn.onclick = function(event){
    //分享文件
    rtc.shareFile("file-select");
};

$('#videos').on('mouseover', 'video', function(e) {
    $(this).prev().stop().fadeIn(600);
})
    .on('mouseout', 'video', function(e) {
        $(this).prev().stop().fadeOut(600);
    })
    .on('click', 'video', function(e) {
        console.log(this.parentNode.getAttribute('class'));
        if (this.parentNode.getAttribute('class') === 'me') {
            return;
        }
        var org = $(this.parentNode),
            orgChildren = org.children(),
            meParent = $('.me'),
            me = meParent[0].children[1],
            meChildren = meParent.children();
        org.append(meChildren);
        meParent.append(orgChildren);
        this.src = this.src;
        me.src = me.src;
    });
/**********************************************************/



//对方同意接收文件
rtc.on("send_file_accepted", function(sendId, socketId, file){
    var p = document.getElementById("sf-" + sendId);
    p.innerText = "对方接收" + file.name + "文件，等待发送";

});
//对方拒绝接收文件
rtc.on("send_file_refused", function(sendId, socketId, file){
    var p = document.getElementById("sf-" + sendId);
    p.innerText = "对方拒绝接收" + file.name + "文件";
});
//请求发送文件
rtc.on('send_file', function(sendId, socketId, file){
    var p = document.createElement("div");
    p.innerText = "请求发送" + file.name + "文件";
    p.id = "sf-" + sendId;
    files.appendChild(p);
});
//文件发送成功
rtc.on('sended_file', function(sendId, socketId, file){
    var p = document.getElementById("sf-" + sendId);
    p.parentNode.removeChild(p);
});
//发送文件碎片
rtc.on('send_file_chunk', function(sendId, socketId, percent, file){
    var p = document.getElementById("sf-" + sendId);
    p.innerText = file.name + "文件正在发送: " + Math.ceil(percent) + "%";
});
//接受文件碎片
rtc.on('receive_file_chunk', function(sendId, socketId, fileName, percent){
    var p = document.getElementById("rf-" + sendId);
    p.innerText = "正在接收" + fileName + "文件：" +  Math.ceil(percent) + "%";
});
//接收到文件
rtc.on('receive_file', function(sendId, socketId, name){
    var p = document.getElementById("rf-" + sendId);
    p.parentNode.removeChild(p);
});
//发送文件时出现错误
rtc.on('send_file_error', function(error){
    console.log(error);
});
//接收文件时出现错误
rtc.on('receive_file_error', function(error){
    console.log(error);
});
//接受到文件发送请求
rtc.on('receive_file_ask', function(sendId, socketId, fileName, fileSize){
    var p;
    if (window.confirm(socketId + "用户想要给你传送" + fileName + "文件，大小" + fileSize + "B,是否接受？")) {
        rtc.sendFileAccept(sendId);
        p = document.createElement("p");
        p.innerText = "准备接收" + fileName + "文件";
        p.id = "rf-" + sendId;
        files.appendChild(p);
    } else {
        rtc.sendFileRefuse(sendId);
    }
});
//成功创建WebSocket连接
rtc.on("connected", function(socket) {
    //创建本地视频流
    rtc.createStream({
        "video": true,
        "audio": true
    });
});
//创建本地视频流成功
rtc.on("stream_created", function(stream) {
    document.getElementById('me').src = URL.createObjectURL(stream);
    document.getElementById('me').play();
});
//创建本地视频流失败
rtc.on("stream_create_error", function() {
    alert("create stream failed!");
});
//接收到其他用户的视频流
rtc.on('pc_add_stream', function(stream, socketId, userName) {
    var newVideo = document.createElement("video"),
        container = document.createElement("div"),
        tips = document.createElement('div'),
        id = "other-" + socketId;
    container.setAttribute("class", "other");
    tips.setAttribute("class", "tips");
    tips.innerText = userName;
    newVideo.setAttribute("autoplay", "autoplay");
    newVideo.setAttribute("id", id);
    container.appendChild(tips);
    container.appendChild(newVideo);
    videos.appendChild(container);
    rtc.attachStream(stream, id);
});
//删除其他用户
rtc.on('remove_peer', function(socketId) {
    var video = document.getElementById('other-' + socketId).parentNode;
    if(video){
        video.parentNode.removeChild(video);
    }
});
//接收到文字信息
rtc.on('data_channel_message', function(channel, socketId, message, userName){
    var p = document.createElement("p");
    p.innerText = userName + ": " + message;
    msgs.appendChild(p);
});

//收到重复进入房间的消息
rtc.on('repeat_enter', function() {
   alert('你已在其他地方进入该房间！');
});

//房间人数已满
rtc.on('repeat_enter', function() {
   alert('每个房间人数上限6人，该房间人数已满');
});

//连接WebSocket服务器
rtc.connect('', 'demo', userId, userName);
rtc.on('socket_closed', function(){
    console.log('closed');
});