/**
 * Created by admin on 2016/3/16.
 */
var sessionMessage = {};               //存放当前页面所有的会话信息
var clientSockets = {};                //当前客户端的所有套接字连接
var chatOutsideSessionMessage = {};    //存放当前窗口外未被写入到其他聊天窗口的会话信息,消息存储以用户名为索引
var chatUser = document.getElementById('chat-user');                //获取chat-user元素
var groupSessionMembers = {};                                       //用来存储每个群会话的群成员
var recorder;
var chatRoom = document.getElementsByClassName('chatRoom')[0];
window.URL = window.URL || window.webkitURL;

function showChat(element) {
    var userToName = element.children[1].innerHTML;             //获取接收会话用户的用户名
    var userToId = element.getAttribute('id');                  //获取接收会话用户的ID
    var preUserToName = chatUser.getAttribute('data-currentUserToName');         //获取上一个聊天窗口的用户名
    var type = element.getAttribute('type');                    //获取会话的类型
    var groupMemberButton = document.getElementById('groupMemberButton');  //获取群成员按钮
    var chatContents = $("#chat-contents");
    if (document.getElementById('name' + userToId) !== null) {
        var unReadMsgBadge = getNextElement(document.getElementById('name' + userToId));    //获得当前聊天对象的未读消息标志
        console.log(unReadMsgBadge);
        if (unReadMsgBadge) {
            unReadMsgBadge.parentNode.removeChild(unReadMsgBadge);                         //将当前聊天对象的未读消息标志移除
        }
    }
    //转换回来
    userToId = idTable[userToId];
    //如果与当前会话对象的连接未建立，则创建套接字连接
    if (clientSockets[userToId] === undefined) {
        socketConnect(userId, userToName, userToId);
    }
    //如果上一个聊天窗口的用户名与目前打开的聊天窗口的用户名不一致
    if (preUserToName !== userToName) {
        if (preUserToName !== undefined) {
            sessionMessage[preUserToName] = chatContents.html();     //将上个窗口的会话消息存储起来
        }
        //给chatUser设置data-currentUserToId属性,值为接收会话用户的ID
        chatUser.setAttribute('data-currentUserToId', userToId);
        chatUser.children[0].innerHTML = userToName;                        //在窗口最上方显示当前聊天对象的用户名
        chatUser.setAttribute('data-currentUserToName', userToName);        //给chatUser设置该属性
        chatContents.html("");                                      //将聊天窗口的内容置空
        //当会话类型为group 群组会话时，添加群成员按钮
        if (type === 'group') {
            if (groupMemberButton === null) {
                groupMemberButton = '<button id="groupMemberButton" class="btn-groupMember" title="点击查看群成员列表" onclick="showGroupMembers()"><i class="fa fa-user"></i></button>';
                chatUser.children[0].style.left = '40px';
                chatUser.insertAdjacentHTML('beforeEnd', groupMemberButton);
            }
            chatUser.children[0].setAttribute('title',userToName);                //设置title属性
            //使用bootstrap的弹出框做提示
            //chatUser.children[0].setAttribute('data-content',userToName);       //悬浮弹出具体信息
            //chatUser.children[0].setAttribute('data-placement','bottom');       //弹出窗口位于下方
            //$(".chat-userToName").popover({
            //    trigger: 'hover'
            //});
            manageSessionGroupMemberList(userToId);
        } else {
            if (groupMemberButton !== null) {
                groupMemberButton.parentNode.removeChild(groupMemberButton);
                chatUser.children[0].style.left = 0;
            }
            if (chatUser.children[0].getAttribute('title')) {
                chatUser.children[0].attributes.removeNamedItem('title');
            }
            //$(".chat-userToName").popover('destroy');
            //chatUser.children[0].attributes.removeNamedItem('data-content');
            //chatUser.children[0].attributes.removeNamedItem('data-placement');
        }
        //如果有当前会话对象的未读消息
        if (chatOutsideSessionMessage[userToName] !== undefined) {
            //console.log('chatOutsideSessionMessage');
            sessionMessage[userToName] = sessionMessage[userToName] + chatOutsideSessionMessage[userToName];
            delete chatOutsideSessionMessage[userToName];
        }
        chatContents.html(sessionMessage[userToName]);               //将页面存在期间与该对象的会话消息添加的聊天窗口中
    }
    //滚动到底部
    chatContents.scrollTop(chatContents.height());

    if ($('#session-interface').is(':hidden')) {
        showSessionInterface();
    }
    if ($('.chatRoom').is(':hidden')) {
        adjustUI();
    }
}

//将群成员列表添加到页面中
function manageSessionGroupMemberList(roomId) {
    var sessionGroupMember;                         //群组成员列
    var sessionGroupMembersList = document.getElementById('session-group-members-list');
    //console.log(sessionGroupMembersList);
    console.log(groupSessionMembers[roomId]);
    sessionGroupMembersList.innerHTML = '';
    var localGroupSessionMembers = groupSessionMembers;        //设置一局部变量，将groupSessionMembers的值传递过来
    var newUser;
    for (var group in localGroupSessionMembers) {
        //从groupSessionMembers找到当前群组成员列表
        if (group === roomId) {
            //遍历当前群组成员
            for (var user in localGroupSessionMembers[group]) {
                if (idTable[user] === undefined) {
                    newUser = generateId();
                    idTable[user] = newUser;
                    idTable[newUser] = user;
                }
                console.log(user);
                if (document.getElementById('groupMember' + user) === null) {
                    if (user === userId) {
                        sessionGroupMember = '<li id=groupMember' + idTable[user] + ' class="list-group-item session-single" onclick="openChatFromSessionGroupMemberList(this)" title="该用户是自己哦!">' +
                            '<img src="images/' + localGroupSessionMembers[group][user] + '.jpg" class="session-user-img" onerror="imgLoadError(this)"><p class="session-single-name" style="color:#f00">' +
                            localGroupSessionMembers[group][user] + '</p><p class="session-single-content"></p></li>';
                    } else {
                        sessionGroupMember = '<li id=groupMember' + idTable[user] + ' class="list-group-item session-single" onclick="openChatFromSessionGroupMemberList(this)">' +
                            '<img src="images/' + localGroupSessionMembers[group][user] + '.jpg" class="session-user-img" onerror="imgLoadError(this)"><p class="session-single-name">' +
                            localGroupSessionMembers[group][user] + '</p><p class="session-single-content"></p></li>';
                    }
                    sessionGroupMembersList.insertAdjacentHTML('afterBegin', sessionGroupMember);
                }
            }
        }
    }
}

function searchGroupMember(key) {
    var userToId = chatUser.getAttribute('data-currentUserToId');
    var pattern = new RegExp(key, 'i');
    var sessionGroupMembersList = document.getElementById('session-group-members-list');
    var sessionGroupMember;
    var cancelInputButton = document.getElementById('cancelInputButton');
    if (key === '') {
        //if (cancelInputButton !== null) {
        //    searchInput.removeChild(cancelInputButton);
        //}
        try {
            cancelInputButton.style.display = 'none';
        } catch (e) {

        }
    } else {
        //if (cancelInputButton === null) {
        //    cancelInputButton = '<i id="cancelInputButton" class="fa fa-close cancel-input-button" onclick="cancelInput(this)"></i>';
        //    searchInput.insertAdjacentHTML('beforeEnd', cancelInputButton);
        //}
        try {
            cancelInputButton.style.display = 'block';
        } catch (e) {

        }
    }
    sessionGroupMembersList.innerHTML = '';
    for (var group in groupSessionMembers) {
        //从groupSessionMembers找到当前群组成员列表
        if (group === userToId) {
            //遍历当前群组成员
            for (var user in groupSessionMembers[group]) {
                if(pattern.test(groupSessionMembers[group][user])) {
                    if (document.getElementById('groupMember' + user) === null) {
                        if (user === userId) {
                            sessionGroupMember = '<li id=groupMember' + idTable[user] + ' class="list-group-item session-single" onclick="openChatFromSessionGroupMemberList(this)" title="该用户是自己哦!">' +
                                '<img src="images/' + groupSessionMembers[group][user] + '.jpg" class="session-user-img" onerror="imgLoadError(this)"><p class="session-single-name" style="color:#f00">' +
                                groupSessionMembers[group][user] + '</p><p class="session-single-content"></p></li>';
                        } else {
                            sessionGroupMember = '<li id=groupMember' + idTable[user] + ' class="list-group-item session-single" onclick="openChatFromSessionGroupMemberList(this)">' +
                                '<img src="images/' + groupSessionMembers[group][user] + '.jpg" class="session-user-img" onerror="imgLoadError(this)"><p class="session-single-name">' +
                                groupSessionMembers[group][user] + '</p><p class="session-single-content"></p></li>';
                        }
                        sessionGroupMembersList.insertAdjacentHTML('afterBegin', sessionGroupMember);
                    }
                }
            }
        }
    }
}

function cancelInput(element, flag) {
    element.parentNode.children[1].value = '';
    if (flag === undefined) {
        searchGroupMember('');
    } else {
        search('');
    }
}

function showGroupMembers() {
    var sessionInterface = document.getElementById('session-interface');
    var sessionGroupMembers = document.getElementById('session-group-members');
    sessionInterface.style.display = 'none';
    sessionGroupMembers.style.display = 'block';
}

function showSessionInterface() {
    var sessionInterface = document.getElementById('session-interface');
    var sessionGroupMembers = document.getElementById('session-group-members');
    sessionGroupMembers.style.display = 'none';
    sessionInterface.style.display = 'block';
}

//建立通讯连接

function openChatFromSessionGroupMemberList(element) {
    var elementId = element.getAttribute('id');
    var userToId = elementId.slice(11,elementId.length);
    var userToName = element.children[1].innerHTML;
    var imgSrc = element.children[0].getAttribute('src');
    if (userId === idTable[userToId]) {
        alert('不能和自己建立通讯连接!');
        return;
    }
    openChat(userToId, userToName, imgSrc);
}

function openChatByBadge(element) {
    var userToName = element.parentNode.children[1].innerHTML;
    //获取带前缀name的用户需要连接的会话对象的Id
    var userToBadge = element.parentNode.children[1].getAttribute('id');
    var imgSrc = element.parentNode.children[0].getAttribute('src');
    //获得用户需要连接的会话对象的Id -- userToId
    var userToId = userToBadge.slice(4,userToBadge.length);
    openChat(userToId, userToName, imgSrc);
}

function openChat(userToId, userToName, src) {
    var imgSrc;
    var userSessionList = document.getElementById('session-list');
    var userSession;
    if (userToId === userId) {
        return ;
    }
    if (src) {
        imgSrc = src;
    } else {
        imgSrc = getPrevElement(document.getElementById('name' + userToId)).getAttribute('src')
    }

    if (document.getElementById(userToId) === null) {
        userSession = '<li id=' + userToId + ' class="list-group-item session-single" onclick="showChat(this)" type="peer" >' +
            '<img src="'+ imgSrc +'" class="session-user-img" onerror="imgLoadError(this)"><p class="session-single-name" title="' +
            userToName + '">' + userToName + '</p><p class="session-single-content"></p></li>';
    } else {
        userSession = document.getElementById(userToId);
    }
    if (userSession.nodeType !== undefined) {
        insertAt(userSessionList, userSession, 0);
        showChat(userSession);
    } else {
        userSessionList.insertAdjacentHTML('afterBegin', userSession);
        showChat(document.getElementById(userToId));
    }
}


//开启套接字连接
function socketConnect(userId, userToName, userToId) {
    var socket = io.connect(socketPort);
    console.log(socketPort);
    console.log(userToId);
    console.log(socket);
    var type = document.getElementById(idTable[userToId]).getAttribute("type");
    var child = document.getElementById(idTable[userToId]);
    var parent = document.getElementById("session-list");
    var userInfo;

    if (type === 'group') {
        userInfo = {
            userId : userId,
            userName : userName,
            roomId : userToId,
            userToName : userToName
        };
    } else if ((type === 'peer') && (userToId !== userId)) {
        userInfo = {
            userId : userId,
            userName : userName,
            userToId : userToId,
            userToName : userToName
        };
    }

    socket.on('connect', function () {
        socket.emit('socketType', {
            type : 'chat'
        });
        socket.emit('userInformation', userInfo);
    });

    //console.log(type);
    clientSockets[userToId] = socket;

    //id转换
    userToId = idTable[userToId];

    if (type === 'group') {
        console.log("emit room!");

        socket.on('online', function (data) {
            var currentUserToId = chatUser.getAttribute('data-currentUserToId');
            var content;
            var prompt;
            var chatContent = document.getElementById('chat-contents');
            console.log(currentUserToId);
            console.log('room peer online!');
            groupSessionMembers[data.userToId] = data.users;
            manageSessionGroupMemberList(data.userToId);
            insertAt(parent, child, 0);
            if (data.userId === userId) {
                content = getOnlinePromptMsg(false, false, true);
                prompt = '系统消息：你进入了课程讨论组';
            } else {
                content = getOnlinePromptMsg(data.userName, true);
                prompt = '系统消息：' + data.userName + '进入了课程讨论组'
            }
            child.children[2].innerHTML = prompt;
            child.children[2].setAttribute('title', prompt);
            if (currentUserToId === data.userToId) {
                $("#chat-contents").append(content);
            } else {
                if (chatOutsideSessionMessage[data.userToName] !== undefined) {
                    chatOutsideSessionMessage[data.userToName] = chatOutsideSessionMessage[data.userToName] + content;
                } else {
                    chatOutsideSessionMessage[data.userToName] = content;
                }
                console.log(chatOutsideSessionMessage[data.userToName]);
            }
            chatContent.scrollTop = chatContent.scrollHeight;
        });

        socket.on('say', function (data) {
            var currentUserToId = chatUser.getAttribute('data-currentUserToId');
            var chatContent = document.getElementById('chat-contents');
            var chatContents = $("#chat-contents");
            var time = getTimePromptMsg(data.time);
            var content;
            var resource;
            var arr = [];
            console.log('group say!');
            console.log(data);

            insertAt(parent, child, 0);

            switch (data.type) {
                case 'text' : content = getTextMsg(child, data.userId, data.userName, data.msg);
                    break;
                case 'audio' : arr = getAudioMsg(child, data.userId, data.userName, data.msg);
                    content = arr[0];
                    resource = arr[1];
                    break;
                case 'image' : arr = getImageMsg(child, data.userId, data.userName, data.msg);
                    content = arr[0];
                    resource = arr[1];
                    break;
                default : content = getTextMsg(child, data.userId, data.userName, data.msg);
            }

            if (currentUserToId === data.userToId) {
                if (data.time) {
                    chatContents.append(time);
                }
                chatContents.append(content);
                if (resource) {
                    $('.audio[src="' + resource  +'"]').Audio();
                }
            } else {
                if (chatOutsideSessionMessage[data.userToName] === undefined) {
                    chatOutsideSessionMessage[data.userToName] = '';
                }
                if (data.time) {
                    chatOutsideSessionMessage[data.userToName] = chatOutsideSessionMessage[data.userToName] + time;
                }
                chatOutsideSessionMessage[data.userToName] = chatOutsideSessionMessage[data.userToName] + content;

                console.log(chatOutsideSessionMessage[data.userToName]);
            }

            chatContent.scrollTop = chatContent.scrollHeight;
        });

        socket.on('offline', function (data) {
            var currentUserToId = chatUser.getAttribute('data-currentUserToId');
            var content = getOfflinePromptMsg(data.userName, true);
            var chatContent = document.getElementById('chat-contents');
            groupSessionMembers[data.userToId] = data.users;
            manageSessionGroupMemberList(data.userToId);
            console.log('room peer offline!');
            insertAt(parent, child, 0);
            child.children[2].innerHTML = '系统消息：' + data.userName + '离开了课程讨论组';
            child.children[2].setAttribute('title', '系统消息：' + data.userName + '离开了课程讨论组');
            if (currentUserToId === data.userToId) {
                $("#chat-contents").append(content);
            } else {
                if (chatOutsideSessionMessage[data.userToName] !== undefined) {
                    chatOutsideSessionMessage[data.userToName] = chatOutsideSessionMessage[data.userToName] + content;
                } else {
                    chatOutsideSessionMessage[data.userToName] = content;
                }
                console.log(chatOutsideSessionMessage[data.userToName]);
            }
            chatContent.scrollTop = chatContent.scrollHeight;
        });

    } else if ((type === 'peer') &&(userToId !== userId)) {
        console.log("emit peer!");


        //判断当前连接用户是否在线
        //----用户在线指的是用户与当前用户建立起了套接字连接，若未建立套接字连接则默认为不在线
        socket.on('userToIsOnline', function () {
            //child.children[1].style.color = '#ff0000';                    //将会话列表处用户名变成红色
            var flag = child.getElementsByTagName('i')[0];
            if (flag === undefined) {
                flag = '<i class="online" title="当前用户与你建立了通讯连接"></i>';
                child.insertAdjacentHTML('beforeEnd', flag);
            }
        });

        socket.on('online', function (data) {
            var chatContent, content, currentUserToId, flag;
            //data.userId指的是发送信息的人的ID，data.userToId指的是接收信息的人的ID
            if (data.userId !== userId) {                //如果上线的不是自己，进行操作
                currentUserToId = chatUser.getAttribute('data-currentUserToId');
                content = getOnlinePromptMsg(data.userName);
                chatContent = document.getElementById('chat-contents');
                console.log('peer online!');
                insertAt(parent, child, 0);
                //child.children[1].style.color = '#ff0000';                    //将会话列表处用户名变成红色
                flag = child.getElementsByTagName('i')[0];
                if (flag === undefined) {
                    flag = '<i class="online" title="当前用户与你建立了通讯连接"></i>';
                    child.insertAdjacentHTML('beforeEnd', flag);
                }
                child.children[2].innerHTML = '系统消息：' + data.userName + '上线了';
                child.children[2].setAttribute('title', '系统消息：' + data.userName + '上线了');
                if (currentUserToId === data.userId) {
                    $("#chat-contents").append(content);
                } else {
                    if (chatOutsideSessionMessage[data.userName] !== undefined) {
                        chatOutsideSessionMessage[data.userName] = chatOutsideSessionMessage[data.userName] + content
                    } else {
                        chatOutsideSessionMessage[data.userName] = content;
                    }
                    console.log(chatOutsideSessionMessage[data.userName]);
                }
                chatContent.scrollTop = chatContent.scrollHeight;
            }
        });

        socket.on('say', function (data) {
            var currentUserToId = chatUser.getAttribute('data-currentUserToId');
            var target = document.getElementById('name' + idTable[data.userId]);
            var chatContent = document.getElementById('chat-contents');
            var time = getTimePromptMsg(data.time);
            var content, resource, unReadMsg;
            var arr = [];
            var chatContents = $("#chat-contents");
            console.log(data.msg instanceof Blob);
            if (target !== null) {
                if (getNextElement(target) === null) {
                    var unReadMsgBadge = '<span class="badge" onclick="openChatByBadge(this)" style="float:right"></span>';
                    target.insertAdjacentHTML('afterEnd', unReadMsgBadge);
                }
                unReadMsg = getNextElement(target);
            }
            insertAt(parent, child, 0);

            switch (data.type) {
                case 'text' : content = getTextMsg(child, data.userId, data.userName, data.msg);
                    break;
                case 'audio' : arr = getAudioMsg(child, data.userId, data.userName, data.msg);
                    content = arr[0];
                    resource = arr[1];
                    break;
                case 'image' : arr = getImageMsg(child, data.userId, data.userName, data.msg);
                    content = arr[0];
                    resource = arr[1];
                    break;
                default : content = getTextMsg(child, data.userId, data.userName, data.msg);
            }

            if ((currentUserToId === data.userId) || (currentUserToId === data.userToId)) {
                if (data.time) {
                    chatContents.append(time);
                }
                chatContents.append(content);
                if (resource) {
                    $('.audio[src="' + resource +'"]').Audio();
                }
                if ($('.chatRoom').is(':hidden')) {
                    unReadMsg.innerHTML = parseInt((unReadMsg.innerHTML || 0)) + 1;
                }
            } else {
                //如果会话的发出者并不是自己，---存在自己打开相同的页面与同一个人建立多条连接的情况
                if (userId !== data.userId) {
                    try{
                        unReadMsg.innerHTML = parseInt((unReadMsg.innerHTML || 0)) + 1;
                    } catch(e) {

                    }
                    if (chatOutsideSessionMessage[data.userName] === undefined) {
                        chatOutsideSessionMessage[data.userName] = '';
                    }
                    if (data.time) {
                        chatOutsideSessionMessage[data.userName] = chatOutsideSessionMessage[data.userName] + time;
                    }
                    chatOutsideSessionMessage[data.userName] = chatOutsideSessionMessage[data.userName] + content;
                    //console.log(chatOutsideSessionMessage[data.userName]);
                } else {
                    if (chatOutsideSessionMessage[data.userToName] === undefined) {
                        chatOutsideSessionMessage[data.userToName] = '';
                    }
                    if (data.time) {
                        chatOutsideSessionMessage[data.userToName] = chatOutsideSessionMessage[data.userToName] + time;
                    }
                    chatOutsideSessionMessage[data.userToName] = content;
                    //console.log(chatOutsideSessionMessage[data.userToName]);
                }
            }

            chatContent.scrollTop = chatContent.scrollHeight;
        });

        socket.on('offline', function (data) {
            var currentUserToId = chatUser.getAttribute('data-currentUserToId');
            var content = getOfflinePromptMsg(data.userName);
            var chatContent = document.getElementById('chat-contents');
            console.log('peer offline!');
            insertAt(parent, child, 0);
            //child.children[1].style.color = '#000000';
            child.removeChild(child.lastChild);
            child.children[2].innerHTML = '系统消息：' + data.userName + '下线了';
            child.children[2].setAttribute('title', '系统消息：' + data.userName + '下线了');
            if (currentUserToId === data.userId) {
                $("#chat-contents").append(content);
            } else {
                if (chatOutsideSessionMessage[data.userName] !== undefined) {
                    chatOutsideSessionMessage[data.userName] = chatOutsideSessionMessage[data.userName] + content;
                } else {
                    chatOutsideSessionMessage[data.userName] = content;
                }
                console.log(chatOutsideSessionMessage[data.userName]);
            }
            chatContent.scrollTop = chatContent.scrollHeight;
        });

        socket.on('offlineMsg', function (data) {
            //没有使用amqp时候实现的data.msg是一个数组，使用amqp后发过来的data.msg是一个字符串，产生多次offlineMsg事件
            console.log('offlineMsg');
            var currentUserToId = chatUser.getAttribute('data-currentUserToId');
            var chatContent = document.getElementById('chat-contents');
            var time, content, resource, arr;
            var chatContents = $("#chat-contents");
            //console.log('offlineMsg');
            switch (data.type) {
                case 'time' : content = getTimePromptMsg(data.msg.substring(5));
                    break;
                case 'text' : content = getTextMsg(child, data.userId, data.userName, data.msg.substring(5));
                    break;
                case 'audio' : arr = getAudioMsg(child, data.userId, data.userName, data.msg);
                    content = arr[0];
                    resource = arr[1];
                    break;
                //未压缩时
                //case 'image' : arr = getImageMsg(child, data.userId, data.userName, data.msg);
                //    content = arr[0];
                //    break;
                case 'image' : arr = getImageMsg(child, data.userId, data.userName, data.msg.substring(5));
                    content = arr[0];
                    break;
                default : content = getTextMsg(child, data.userId, data.userName, data.msg);
            }
            if (currentUserToId === data.userId) {
                chatContents.append(content);
                if (resource) {
                    $('.audio[src="' + resource +'"]').Audio();
                }
            } else {
                if (chatOutsideSessionMessage[data.userName] === undefined) {
                    chatOutsideSessionMessage[data.userName] = '';
                }
                chatOutsideSessionMessage[data.userName] = content;
            }
            chatContent.scrollTop = chatContent.scrollHeight;
        });
    }
}

/*
 事件绑定
 */
//消息发送
$("#sendMessage").click(sendMessage);

//打开webRTC页面
document.getElementById('webRTC').addEventListener('click', startWebRTC);

//录制音频文件并通过socket传播出去
//录制音频并转换成WAV格式
document.getElementById('record').addEventListener('mousedown', startRecording);
//录制完毕后通过socket将文件发送到其他客户端
document.getElementById('record').addEventListener('mouseup', stopRecord);

//添加Emoji表情
document.getElementById('emoji').addEventListener('click', function() {

});

//发送图片
document.getElementById('image').addEventListener('click', function() {
    var img = document.getElementsByClassName('image-select')[0];
    img.click();
});

//document.getElementsByClassName('image-select')[0].addEventListener('change', function() {
//    var url = convertToURL(this.files[0]);
//    var imgEle = '<img src="' + url + '" class="message-img" />';
//    var chatInput = $('#chat-input');
//    console.log(chatInput.children('img')[0]);
//    chatInput.append(imgEle);
//});

document.getElementsByClassName('image-select')[0].addEventListener('change', function() {
    sendImage(this);
    this.value = '';
});

//查看大图
$('#chat-contents').on('click', 'img.message-image', function(event) {
    $(this).picbox();
    $('#pbImage').attr('src', this.src).css('display', 'block');
});

$('#sendMessageMethodBtn').on('click', 'a', function () {
    var check;
    var ele;
    var that = this;
    var mode = that.getAttribute('data-mode');

    if (that.children[0] === undefined) {
        check = '<i class="fa fa-check right-icon"></i>';
        that.insertAdjacentHTML('beforeEnd', check);
        that.setAttribute('data-sendMethod', '1');
    }
    if (mode === 'Enter') {
        ele = getNextElement(that.parentNode).children[0].children[0];
    } else {
        ele = getPrevElement(that.parentNode).children[0].children[0];
    }
    ele.parentNode.setAttribute('data-sendMethod', '0');
    ele.parentNode.removeChild(ele);
});

$(document).keydown(sendMessageMethod);

function sendMessage() {
    //获取要发送的消息
    var chatInput = $("#chat-input");
    var msg = chatInput.html();
    msg = msg.trim();
    if (msg == "") return;
    console.log(msg);
    var currentUserName = chatUser.getAttribute('data-currentUserToName');
    var currentUserToId = chatUser.getAttribute('data-currentUserToId');
    //发送请求信息
    clientSockets[currentUserToId].emit('say', {
        userId : userId,
        userName : userName,
        userToId : currentUserToId,
        userToName : currentUserName,
        msg : msg,
        type : 'text'
    });
    //console.log(currentUserToId);
    chatInput.html("").focus();
}

/*
未压缩
 */
//function sendImage(target) {
//    if (window.File && window.FileReader && window.FileList && window.Blob) {
//        // Great success! All the File APIs are supported.
//    } else {
//        alert('The File APIs are not fully supported in this browser.');
//        return;
//    }
//    var reader = new FileReader();
//    console.log(target.files[0].size);
//    reader.readAsArrayBuffer(target.files[0]);
//    reader.onloadend = function() {
//        if (!reader.result) {
//            return;
//        }
//        var currentUserName = chatUser.getAttribute('data-currentUserToName');
//        var currentUserToId = chatUser.getAttribute('data-currentUserToId');
//        //发送请求信息
//        clientSockets[currentUserToId].emit('say', {
//            userId : userId,
//            userName : userName,
//            userToId : currentUserToId,
//            userToName : currentUserName,
//            msg : reader.result,
//            type : 'image'
//        });
//        console.log('发送图片消息');
//    }
//}

/*
压缩
 */
function sendImage(target) {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
    } else {
        alert('The File APIs are not fully supported in this browser.');
        return;
    }
    lrz(target.files[0], {
        width: 800
    })
        .then(function(result) {
            if (!result.base64) {
                return;
            }
            var currentUserName = chatUser.getAttribute('data-currentUserToName');
            var currentUserToId = chatUser.getAttribute('data-currentUserToId');
            //发送请求信息
            clientSockets[currentUserToId].emit('say', {
                userId : userId,
                userName : userName,
                userToId : currentUserToId,
                userToName : currentUserName,
                msg : result.base64,
                type : 'image'
            });
            console.log('发送图片消息');
        });
}

//function convertToURL(target) {
//    console.log(typeof target);
//    console.log(target);
//    var url = window.URL.createObjectURL(target);
//    return url;
//}

function startWebRTC() {
    var result = confirm('启动视频聊天');
    if (result){
        window.open('/communication/webRTC', '_blank');
    }
}

//发送语音之前，创建一个音频上下文audioContext，并将整个构造好的实例对象赋值给recorder
function startRecording() {
    if (recorder === undefined) {
        Recorder.get(function (rec) {
            recorder = rec;
            recorder.start();
        });
    } else {
        recorder.start();
    }
    //Recorder.flag = true;
    //setTimeout(function () {
    //    if (Recorder.flag = true) {
    //        stopRecord();
    //    }
    //}, 60000);
}

function stopRecord(){
    //获取要发送的消息
    var msg = recorder.getBlob();
    if (!msg) return;
    console.log(msg.constructor);
    var currentUserName = chatUser.getAttribute('data-currentUserToName');
    var currentUserToId = chatUser.getAttribute('data-currentUserToId');
    //发送请求信息
    clientSockets[currentUserToId].emit('say', {
        userId : userId,
        userName : userName,
        userToId : currentUserToId,
        userToName : currentUserName,
        msg : msg,
        type : 'audio'
    });
    console.log('发送音频消息');
}

/*
 生成聊天样式内容
 */

//系统时间消息
function getTimePromptMsg(msg) {
    return '<div class="chat-system-message">' + msg + '</div>';
}

//系统上线提示
function getOnlinePromptMsg(msg, flag, peer) {
    if (peer) {
        return '<div class="chat-system-message">系统消息：你进入了课程讨论组</div>';
    } else if (flag) {
        return '<div class="chat-system-message">系统消息：' + msg + '进入了课程讨论组</div>';
    }
    return '<div class="chat-system-message">系统消息：' + msg + '上线了</div>';
}

//系统下线提示
function getOfflinePromptMsg(msg, flag) {
    if (flag) {
        return '<div class="chat-system-message">系统消息：' + msg + '离开了课程讨论组</div>';
    }
    return '<div class="chat-system-message">系统消息：' + msg + '下线了</div>';
}


//对聊天文本信息进行操作，并返回元素样式字符串5
function getTextMsg(ele, id, name, msg) {
    ele.children[2].innerHTML = msg;
    ele.children[2].setAttribute('title', msg);
    if (id !== userId) {
        return '<div class="chat-contents-fBlock"><div class="chat-contents-user">' + name +
            '</div><div class="chat-contents-fMessage"> ' + msg + '</div>';
    }
    return '<div class="chat-contents-block"><div class="chat-contents-user">' + name +
        '</div><div class="chat-contents-message"> ' + msg + '</div>';
}

//对聊天音频信息进行操作，并返回聊天音频信息样式以及video数据源的url
function getAudioMsg(ele, id, name, msg) {
    var data = new Blob([msg], { type: 'audio/wav' });
    //var data = msg;
    var resource;
    var arr= [];
    console.log(msg.constructor);
    ele.children[2].innerHTML = '[语音]';
    ele.children[2].setAttribute('title', '[语音]');
    if (window.URL) {
        window.URL = window.URL || window.webkitURL;
        resource = window.URL.createObjectURL(data);
        if (id !== userId) {
            arr.push('<div class="chat-contents-fBlock"><div class="chat-contents-user">' + name +
                '</div><div class="chat-contents-fMessage"><audio class="audio" controls src=' + resource + '></audio></div>');
        } else {
            arr.push('<div class="chat-contents-block"><div class="chat-contents-user">' + name +
                '</div><div class="chat-contents-message"><audio class="audio" controls src=' + resource + '></audio></div>');
        }
        arr.push(resource);
        return arr;
    } else {
        return [];
    }
}

/*
未压缩时候的接收方式
 */
//function getImageMsg(ele, id, name, msg){
//    var data = new Blob([msg], { type: 'image/jpeg' });
//    var resource;
//    var arr= [];
//    console.log(msg.constructor);
//    ele.children[2].innerHTML = '[图片]';
//    ele.children[2].setAttribute('title', '[图片]');
//    if (window.URL) {
//        window.URL = window.URL || window.webkitURL;
//        resource = window.URL.createObjectURL(data);
//        if (id !== userId) {
//            arr.push('<div class="chat-contents-fBlock"><div class="chat-contents-user">' + name +
//                '</div><div class="chat-contents-fMessage"><a href="' + resource + '" target="_blank"><img class="message-image"  src=' +
//                resource + ' title="点击查看大图"></img></a></div>');
//        } else {
//            arr.push('<div class="chat-contents-block"><div class="chat-contents-user">' + name +
//                '</div><div class="chat-contents-message"><a href="' + resource + '" target="_blank"><img class="message-image"  src=' +
//                resource + ' title="点击查看大图"></img></a></div>');
//        }
//        arr.push(resource);
//        return arr;
//    } else {
//        return [];
//    }
//}

/*
压缩后
 */
function getImageMsg(ele, id, name, msg){
    var arr= [];
    console.log(msg.constructor);
    ele.children[2].innerHTML = '[图片]';
    ele.children[2].setAttribute('title', '[图片]');

    if (id !== userId) {
        arr.push('<div class="chat-contents-fBlock"><div class="chat-contents-user">' + name +
            '</div><div class="chat-contents-fMessage"><img class="message-image" rel="lightbox-group"  src=' +
            msg + ' title="点击查看大图"></img></div>');
    } else {
        arr.push('<div class="chat-contents-block"><div class="chat-contents-user">' + name +
            '</div><div class="chat-contents-message"><img class="message-image" src=' +
            msg + ' title="点击查看大图"></img></div>');
    }
    return arr;
}

function sendMessageMethod(e) {
    var mode;
    if (document.activeElement.getAttribute('id') === 'chat-input') {
        mode = $('[data-sendMethod=1]')[0].getAttribute('data-mode');
        if (mode === 'Enter') {
            if (e.keyCode === 13 && e.ctrlKey === false){
                sendMessage();
                return false;
            } else if (e.keyCode === 13 && e.ctrlKey === true) {
                if (document.activeElement.innerHTML) {
                    document.activeElement.innerHTML += '<div><br></div>';
                } else {
                    document.activeElement.innerHTML += '<div><br></div><div><br></div>';
                }
                placeCaretAtEnd(document.activeElement);
            }
        } else {
            if (e.ctrlKey === true && e.keyCode === 13) {
                sendMessage();
                return false;
            }
        }
    }
}

/*
初始化emoji
 */

new Emoji({
    emojiArray: ['angry', 'anguished', "astonished", "disappointed",
        "blush", "bowtie",  "cold_sweat", "confounded", "confused",
        "cry", "crying_cat_face",
        "relieved", "satisfied",
        "relaxed", "scream", "scream_cat", "see_no_evil",
        "dizzy_face", "expressionless", "fearful",
        "flushed", "frowning", "full_moon_with_face",
        "grin", "grinning", "heart_eyes", "heart_eyes_cat",
        "hushed", "innocent", "joy", "joy_cat",
        "kissing", "kissing_cat", "kissing_heart",
        "neutral_face", "open_mouth", "pensive", "persevere",
        "rage", "pouting_cat", "sleeping", "sleepy", "smile",
        "kissing_smiling_eyes", "laughing", "mask", "smile_cat", "smiling_imp", "smirk",
        "smiley", "smirk_cat", "sob", "stuck_out_tongue", "weary", "wink", "worried", "yum",
        "sweat_smile", "sweat", "triumph", "unamused",
        "heart", "heavy_exclamation_mark",
        "stuck_out_tongue_closed_eyes", "stuck_out_tongue_winking_eye", "sun_with_face",
        "sunglasses", "tired_face",
        "pill", "v",  "point_up_2", "point_up", "point_down",
        "point_left", "point_right", "poop", "pray", "raised_hands",
        "tada",
        "\\+1", "-1", "balloon", "bicyclist", "beer",
        "bomb", "bouquet", "broken_heart", "clap", "crown", "fire", "ghost", "gift", "gift_heart"],
    textarea: document.getElementById('chat-input'),
    emojiButton: document.getElementById('emoji'),
    emojiContainer: document.getElementById('session-interface')
}).init();

document.getElementById('emoji').addEventListener('click', function(event) {
    var emojiBox = document.getElementById('emojiBox');
    var chatContents = document.getElementById('chat-contents');
    if (emojiBox.style.display === 'block') {
        chatContents.style.bottom = '278px';
    } else {
        chatContents.style.bottom = '128px';
    }
    chatContents.scrollTop = chatContents.scrollHeight;
    console.log(event);
});


