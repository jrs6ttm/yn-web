/**
 * Created by lijiemoop on 2/23/2016.
 */
//工作台

;(function($){
    var workBench = function(work,index,container,metaCon,taskId,checkModel,courseName,player){
        var me = this;

        me.work       = work;
        me.index      = index;
        me.container  = container;
        me.metaCon    = metaCon;
        me.taskId     = taskId;
        me.checkModel = checkModel;
        me.courseName = courseName;
        me.uuid       = '';
        me.player     = player;
        $.ajax({
            url: playerPort + '/saveCourse',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({nodeType:'learnAct',courseId:work.taskId,name:work.taskName.replace(/<[^>]+>/g,""),parentId:me.taskId})
        }).done(function(res){
        }).fail(function(e){});

        var description = createEle('div');$(description).append(me.displayDes(work.taskDescription));
        container.appendChild(description);

        switch(work.toolType){
            case 'textArea':
                me.initTextArea(function(){
                    return me;
                });break;
            case 'choose':
                me.initChoose(function(){
                    return me;
                });break;
            case 'VM':
                me.initVM(function(){
                    return me;
                });break;
            default :
                me.initPageOffice(work.toolType);
                break;
        }
    };

    workBench.prototype = {
        initPageOffice : function(type){
            var me = this;

            if(me.checkModel || me.player.isLast){
                var pageOfficeBtn = createEle('a');pageOfficeBtn.innerHTML = '查看文件';
                $(pageOfficeBtn).click(function(){
                    window.location.href = 'pageoffice://|'+newProcessEnginePort+'/NKTOForMyDemo/MyNTKODemo/MyFirstWordEditor.jsp?path='+ecgeditorPort2+'/office/' + userData.id +'/&fileName='+me.work.input.templateId.split('/')[1]+'&permission=r&userName='+userData.name;
                });
                me.container.appendChild(pageOfficeBtn);
            }else{
                var pageOfficeBtn = createEle('a');pageOfficeBtn.innerHTML = '编辑文件';
                $(pageOfficeBtn).click(function(){
                    window.location.href = 'pageoffice://|'+newProcessEnginePort+'/NKTOForMyDemo/MyNTKODemo/MySecondWordEditor.jsp?upLoadPath='+ecgeditorPort2+'/office/' + userData.id + '/&downLoadPath='+ecgeditorPort2+'/office/'+me.work.input.templateId.split('/')[0]+'/&fileName='+me.work.input.templateId.split('/')[1]+'&permission=rw&userName='+userData.name;
                });
                me.container.appendChild(pageOfficeBtn);
            }
        },

        getFocus : function(){
            var me = this;

            $('.getFrame').focus();
        },

        displayDes : function(str){
            var me = this;

            var strs = [],
                retString = createEle('p');
            strs = str.split("#");
            for(i=0;i<strs.length;i++){
                $(retString).append(strs[i]);
            }
            return retString;
        },

        changeToLink : function(str){
            var me = this;

            if(str.split(']')[1] != undefined){
                var id = str.split('[')[1].split(';')[0];
                var type = str.split(';')[1].split(']')[0];
                var name = str.split(']')[1].split('#')[0];
                if(type === 'mp3'||type === 'mp4'){
                    str = createEle('a');$(str).css({cursor:'pointer'});str.onclick = function(){new ShowMeta(type,id,me.metaCon)};str.innerHTML = name;
                } else {
                    str = createEle('a');$(str).css({cursor:'pointer'});str.onclick = function(){new ShowMeta(type,id,me.metaCon)};str.innerHTML = name;
                }
            }
            return str;
        },

        openVM : function(self) {
            var me = this;

            $(me.VMCon).css({background:'#fff'});

            $(me.VMRoomWindow).children('.p_VMCon').empty().append('<div><button id="ctrlAltDelete">Ctrl-Alt-Delete</button>&nbsp;<button id="share">分享</button>&nbsp;<button id="halt">重启</button></div>'+
                '</br>'+
                '<div id="display" height="768px" tabindex="-100" width="1024px"></div>');

            var getUrlParameter = function getUrlParameter(sParam) {
                var sPageURL = decodeURIComponent(window.location.search.substring(1)),
                    sURLVariables = sPageURL.split('&'),
                    sParameterName,
                    i;

                for (i = 0; i < sURLVariables.length; i++) {
                    sParameterName = sURLVariables[i].split('=');

                    if (sParameterName[0] === sParam) {
                        return sParameterName[1] === undefined ? true : sParameterName[1];
                    }
                }
            };
            var vmuuid = 'uuid=' + me.uuid;
            var vmname = getUrlParameter("vmname");
            var read_only = getUrlParameter("read_only");
            var guac;
            var keyLogs = new Array();

            function checkKey(key){
                for(var n=0;n<keyLogs.length;n++){
                    if(keyLogs[n] === key){
                        return n;
                    }
                    return -1;
                }
            }

            function clearKeyLogs(){
                for(var n = 0;n < keyLogs.length;n++){
                    guac.sendKeyEvent(0,keyLogs[n]);
                }
                keyLogs = new Array();
            }

            function initConsole() {
                // Get display div from document
                var display = document.getElementById("display");

                // Instantiate client, using an HTTP tunnel for communications.
                guac = new Guacamole.Client(
                    new Guacamole.HTTPTunnel(VM2Port + "/ConsoleService/tunnel")
                );

                // Add client to display div
                display.appendChild(guac.getDisplay().getElement());

                // Error handler
                guac.onerror = function (error) {
                    document.getElementById("display").innerHTML = "";
                    keyLogs = new Array();
                    //initConsole();
                };

                // Connect
                guac.connect(vmuuid + '&read_only=' + read_only);

                // Disconnect on close
                window.onunload = function () {
                    guac.disconnect();
                    keyLogs = new Array();
                };

                // Mouse
                var mouse = new Guacamole.Mouse(display);

                mouse.onmousedown =
                    mouse.onmouseup =
                        mouse.onmousemove = function (mouseState) {
                            guac.sendMouseState(mouseState);
                            display.focus();
                        };
                mouse.onmouseout = function(mouseState){
                    clearKeyLogs();
                }

                // Keyboard
                var keyboard = new Guacamole.Keyboard(display);

                keyboard.onkeydown = function (keysym) {
                    keyLogs.push(keysym);
                    guac.sendKeyEvent(1, keysym);
                };

                keyboard.onkeyup = function (keysym) {
                    var index = checkKey(keysym);
                    if(index > -1){
                        keyLogs.splice(index,1);
                        guac.sendKeyEvent(0, keysym);
                    }
                };
            }
            initConsole();
            /* ]]> */
            var ctrlAltDelete = document.getElementById("ctrlAltDelete");
            ctrlAltDelete.onclick = function () {
                var KEYSYM_CTRL = 65507;
                var KEYSYM_ALT = 65513;
                var KEYSYM_DELETE = 65535;
                guac.sendKeyEvent(0, KEYSYM_DELETE);
                guac.sendKeyEvent(0, KEYSYM_ALT);
                guac.sendKeyEvent(0, KEYSYM_CTRL);
                guac.sendKeyEvent(1, KEYSYM_CTRL);
                guac.sendKeyEvent(1, KEYSYM_ALT);
                guac.sendKeyEvent(1, KEYSYM_DELETE);

            };

            $(document).ready(function () {
                $("body").click(function (e) {
                    if ($(e.target).attr('id') === "display") {

                    } else {
                        clearKeyLogs();
                    }
                });
            });

            function onBlur() {
                clearKeyLogs();
            }

            window.onblur = onBlur;

            var share = document.getElementById("share");
            share.onclick = function(){
                prompt("只读分享",window.location+"?read_only=true");
            };


            var halt = document.getElementById("halt");
            halt.onclick = function(){
                $.ajax({
                    url: VMPort + "/XenServerVM-WebService/courseAPI",
                    type: "post",
                    dataType: "json",
                    data: {command: "powerVM",hostIP:VM3Port,vmuuid:me.uuid,action:'poweroff'},
                    success: function (strData) {
                        if(strData){
                            $.ajax({
                                url: VMPort + "/XenServerVM-WebService/courseAPI",
                                type: "post",
                                dataType: "json",
                                data: {command: "powerVM",hostIP:VM3Port,vmuuid:me.uuid,action:'poweron'},
                                success: function (strData) {

                                    alert(strData);
                                }
                            });


                        }
                    }
                });
            }
        },

        getProgess : function(uuid){//uuid:创建课程的任务id

            var me = this;

            $.ajax({
                url:VMPort + "/XenServerVM-WebService/courseAPI",
                type:"post",
                dataType:"json",
                data: {command: "getTaskProgess", taskID:uuid},
                success: function (strData) {
                    $('._player_vm_create').css({backgroundPosition:'100% '+strData.progress+'%'}).html(strData.progress + '%');
                    if(strData.progress!="100")
                        setTimeout(me.getProgess(uuid),1000);
                    else{
                        if(me.player.VMId){
                            $.cookie(me.player.VMId, '', { expires: -1 }); // 删除 cookie
                        }

                        $.ajax({
                            url: VMPort + "/XenServerVM-WebService/courseAPI",
                            type: "post",
                            dataType: "json",
                            data: {command: "queryCourseUserVMS",userID: userData.id},
                            success: function (strData) {
                                for(var i=0;i<strData.length;i++){
                                    //这里要判断role，为1的uuid才应该记录下来，让学习者连接

                                    me.uuid = strData[i].uuid;
                                    $('._player_vm_create').unbind('click').html('点击打开远程电脑').click(function(){
                                        me.openVM(this);
                                    });


                                }
                            }
                        });

                        $.MsgBox.Alert('连接成功','远程电脑连接成功！');
                    }
                }

            })

        },

        createVM : function(){
            var me = this;
            $('._player_vm_create').unbind('click').html('正在连接远程电脑...');
            if( me.work.input.VMId === '' || me.work.input.VMId === ''){
                $('._player_vm_create').html('远程电脑设置有误');
            }
            else{
                checkLog(function(){
                    me.player.VMId = me.work.input.VMId;
                    $.ajax({
                        url: VMPort + "/XenServerVM-WebService/courseAPI",
                        type: "post",
                        dataType: "json",
                        data: {command: "startCourse", userID:  userData.id, courseID: me.work.input.VMId, groupID: -1},
                        success: function (strData) {
                            // alert(strData);//开启课程任务的taskid
                            $.cookie(me.work.input.VMId, strData);//key:value|课程id：创建课程的任务id
                            me.getProgess(strData);
                        }
                    });
                    /*}*/
                });
            }
        },

        initVM : function(next){
            var me = this;

            $(me.container).append('<p style="color :red;">请点击右上角"<span class="imooc-icon">&#xe956<span>"按钮打开远程电脑</p>');

            if(!($('._player_VMSwitch').length)){
                var VMSwitch     = createEle('div');VMSwitch.className = "_player_VMSwitch imooc-icon";VMSwitch.innerHTML = '&#xe956';VMSwitch.title = '远程电脑';$(me.player.toolBarCon).append(VMSwitch);
                var VMRoomWindow = createEle('div');VMRoomWindow.className = '_player_VMRoomWindow';$('._page_view').append(VMRoomWindow);

                me.VMRoomWindow = VMRoomWindow;

                $(VMSwitch).click(function() {
                    $(VMRoomWindow).data("kendoWindow").open();

                });

                function onClose() {

                }

                $(VMRoomWindow).kendoWindow({
                    width: "1035px",
                    height: "830px",
                    title: "远程电脑",
                    minWidth:"1035px",
                    minHeight:"830px",
                    visible: false,
                    actions: [
                        "Close"
                    ],
                    resize:function(e){
                    },
                    close: onClose
                }).data("kendoWindow").center().close();

                var VMCon = createEle('div');$(VMCon).css({width:'100%',height:705,background:'#dfdfdf',position:'relative'});VMCon.className = "p_VMCon";VMRoomWindow.appendChild(VMCon);
                me.VMCon = VMCon;

                $.ajax({
                    url: VMPort + "/XenServerVM-WebService/courseAPI",
                    type: "post",
                    dataType: "json",
                    data: {command: "queryCourseUserVMS",userID: userData.id},
                    success: function (strData) {
                        var createVM = createEle('div');
                        createVM.className = '_player_vm_create';
                        if(me.player.VMId && $.cookie(me.player.VMId)){//这里的VMId指的是课程id，实际的创建虚拟机taskid是$.cookie(me.player.VMId)
                            
                            me.getProgess($.cookie(me.player.VMId));

                        }else{
                            
                            createVM.innerHTML = '点击连接远程电脑';
                            $(createVM).css({padding:0,display:'block',width:'60%',height:'100px',fontSize:'30px',textAlign:'center',cursor:'pointer',lineHeight:'100px',border:0,color:'#fff',position:'absolute',left:'50%',marginLeft:'-30%',top:'50%',borderRadius:'20px',marginTop:-50,background:'#7f7f7f'});VMCon.appendChild(createVM);
                            $(createVM).click(function(){
                                me.createVM();
                            });
                        }
                        var length = strData.length;
                        for(var i=0;i<length;i++){
                            //这里要判断role，为1的uuid才应该记录下来，让学习者连接
                            if(strData[i].courseID.toString() === me.work.input.VMId){//me.work.input.VMId
                                if(strData[i].role === 1){
                                    me.player.VMId = me.work.input.VMId;
                                    me.uuid = strData[i].uuid;
                                    $('._player_vm_create').unbind('click').html('点击打开远程电脑').click(function(){
                                        me.openVM(this);
                                    });
                                }
                            }
                            else{
                                $.ajax({
                                    url: VMPort + "/XenServerVM-WebService/courseAPI",
                                    type: "post",
                                    dataType: "json",
                                    data: {command: "shutdownVM",userID:userData.id,vmuuid:strData[i].uuid,force:true},
                                    success: function (strData) {
                                    }
                                });
                            }
                        }
                    }
                });
            }

            /*if(me.work.input.VMId < 10000){
             sendMessage('get',VMPort,'/inquiryUserVm?userId=' + userData.id,'',function(checkData){
             if(!checkData.err){
             if(checkData.info === 'novm'){
             var openVM = createEle('div');openVM.className = '_player_vm_create';openVM.innerHTML = '打开远程电脑';$(openVM).css({padding:0,display:'block',width:'60%',height:'100px',fontSize:'30px',textAlign:'center',cursor:'pointer',lineHeight:'100px',border:0,color:'#fff',position:'absolute',left:'50%',marginLeft:'-30%',top:'50%',borderRadius:'20px',marginTop:-50,background:'#7f7f7f'});VMCon.appendChild(openVM);
             $(openVM).click(function(){
             me.openVM(this,checkData.openUrl);
             });
             }
             else{
             if(me.work.input.VMId === checkData.VMid){
             var openVM = createEle('div');openVM.className = '_player_vm_create';openVM.innerHTML = '打开远程电脑';$(openVM).css({padding:0,display:'block',width:'60%',height:'100px',fontSize:'30px',textAlign:'center',cursor:'pointer',lineHeight:'100px',border:0,color:'#fff',position:'absolute',left:'50%',marginLeft:'-30%',top:'50%',borderRadius:'20px',marginTop:-50,background:'#7f7f7f'});VMCon.appendChild(openVM);
             $(openVM).click(function(){
             me.openVM(this,checkData.openUrl);
             });
             }
             else{
             var createVM = createEle('div');createVM.className = '_player_vm_create';createVM.innerHTML = '点击连接远程电脑';$(createVM).css({padding:0,display:'block',width:'60%',height:'100px',fontSize:'30px',textAlign:'center',cursor:'pointer',lineHeight:'100px',border:0,color:'#fff',position:'absolute',left:'50%',marginLeft:'-30%',top:'50%',borderRadius:'20px',marginTop:-50,background:'#7f7f7f'});VMCon.appendChild(createVM);
             $(createVM).click(function(){
             me.createVM();
             });
             }
             }
             }
             else{
             var openVM = createEle('div');openVM.className = '_player_vm_create';openVM.innerHTML = '服务器异常';$(openVM).css({padding:0,display:'block',width:'60%',height:'100px',fontSize:'30px',textAlign:'center',cursor:'pointer',lineHeight:'100px',border:0,color:'#fff',position:'absolute',left:'50%',marginLeft:'-30%',top:'50%',borderRadius:'20px',marginTop:-50,background:'#7f7f7f'});VMCon.appendChild(openVM);
             }
             });
             }
             else{*/


            /*}*/

        },

        initChoose : function(next){
            var me = this;

            if(!me.checkModel || me.player.isLast){
                var choose = createEle('iframe');choose.src = examPort + '/exam/myExam?examID='+me.work.input.questionId;$(choose).css({width:'100%',height:650,scrolling:'no',border:0});me.container.appendChild(choose);
            }
            else{
                var choose = createEle('iframe');choose.src = examPort + '/exam/viewmyExam?examID='+me.work.input.questionId;$(choose).css({width:'100%',height:650,scrolling:'no',border:0});me.container.appendChild(choose);
            }
            
            next();
        },
        //富文本
        initTextArea : function(next){
            var me = this;

            var textArea = createEle('div');textArea.id = 'textArea'+me.index;
            me.container.appendChild(textArea);
            initEditor('#textArea'+me.index,{width:'100%',height:550,lang:'zh-CN'});

            me.textArea = $('#textArea'+me.index);
            me.textArea.summernote('code','');

            if(!(me.checkModel || me.player.isLast)){
                var saveBtn = createEle('button');saveBtn.innerHTML = '保存';saveBtn.className = 'btn btn-primary pull-right';
                saveBtn.onclick = function(){
                    $.ajax({
                        url: playerPort + '/findFiles?courseInstId='+me.player.courseId.split('@')[1]+'&taskId='+me.work.taskId,
                        method: 'GET'
                    }).done(function (resData) {
                        if(resData.length){
                            var fileId = resData[0].fileId;
                            var sendData = {
                                fileName : fileId,
                                fileType : 'html',
                                content : me.textArea.summernote('code')
                            };
                            $.ajax({
                                url: filePort + '/file/sys_save_txt',
                                method: 'POST',
                                contentType: 'application/json',
                                data: JSON.stringify(sendData)
                            }).done(function () {
                                $.ajax({
                                    url: playerPort + '/saveFile',
                                    method: 'POST',
                                    contentType: 'application/json',
                                    data: JSON.stringify({courseInstId:me.player.courseId.split('@')[1],taskId:me.work.taskId,updateTime:new Date().getTime(),fileId:fileId,fileName:me.work.output.name,fileUrl:'',fileType:'html'})
                                }).done(function () {
                                    $.MsgBox.Alert('保存成功','文档保存成功！');
                                }).fail(function(){
                                    console.log('fail');
                                })

                            }).fail(function(){
                                console.log('fail');
                            });
                        }else{
                            var fileId = uuid();
                            var sendData = {
                                fileName : fileId,
                                fileType : 'html',
                                content : me.textArea.summernote('code')
                            };
                            $.ajax({
                                url: filePort + '/file/sys_save_txt',
                                method: 'POST',
                                contentType: 'application/json',
                                data: JSON.stringify(sendData)
                            }).done(function () {
                                $.ajax({
                                    url: playerPort + '/saveFile',
                                    method: 'POST',
                                    contentType: 'application/json',
                                    data: JSON.stringify({courseInstId:me.player.courseId.split('@')[1],taskId:me.work.taskId,updateTime:new Date().getTime(),fileId:fileId,fileName:me.work.output.name,fileUrl:'',fileType:'html'})
                                }).done(function () {
                                    $.MsgBox.Alert('保存成功','文档保存成功！');
                                }).fail(function(){
                                    console.log('fail');
                                })

                            }).fail(function(){
                                console.log('fail');
                            });
                        }
                        
                    }).fail(function(){
                        console.log('fail');
                    })
                };
                me.container.appendChild(saveBtn);
            }

            var myTextBtn = createEle('a');myTextBtn.innerHTML = '查看保存内容';myTextBtn.className = 'btn btn-defult pull-right';myTextBtn.onclick = function(){

                $.ajax({
                    url: playerPort + '/findFiles?courseInstId='+me.player.courseId.split('@')[1]+'&taskId='+me.work.taskId,
                    method: 'GET'
                }).done(function (resData) {
                    if(resData.length){
                        $.ajax({
                            url: filePort + '/file/sys_get_txt?fileName='+resData[0].fileId+'.html',
                            method: 'GET'
                        }).done(function (resData) {
                            me.textArea.summernote('code',resData)
                        }).fail(function(){
                            console.log('fail');
                        });
                    }else{
                        alert('no file saved');
                    }
                    
                }).fail(function(){
                    console.log('fail');
                })
                

            };

            var preTextBtn = createEle('a');preTextBtn.innerHTML = '查看预设内容';preTextBtn.className = 'btn btn-defult pull-right';preTextBtn.onclick = function(){

                if(me.work.input.inputWay === 'DB' || me.work.input.inputWay === 'previous' || me.work.input.inputWay === 'upload'){
                    sendMessage('get',soursePort,'/OfficeTransfer/richTextHandler?materialsId='+me.work.input.templateId,'',function(data) {
                        if (data === "找不到指定的文件" || data === '') {
                            me.textArea.summernote('code', '');
                        }
                        else {
                            me.textArea.summernote('code', data);
                        }
                    });
                }
                else{
                    me.textArea.summernote('code', '');
                }

            };

            me.container.appendChild(myTextBtn);
            me.container.appendChild(preTextBtn);

            if(me.checkModel || me.player.isLast){
                $(myTextBtn).click();
            }
            else{
                $(preTextBtn).click();
            }

        }
    };

    window['WorkBench'] = workBench;
})($);


;(function($){
    var player = function(){
        var me = this;

        me.basicInfo = [
            {name:'学习目标',value:'goal'},
            {name:'学习内容',value:'content'},
            {name:'引导问题',value:'guideQuestion'},
            {name:'教学重难点',value:'teachingDifficulty'},
            {name:'工作要求',value:'workRequirement'},
            {name:'单元考核标准',value:'teachingCheck'}
        ];

        me.sideBar = {
            lastTasks : [],
            nextTasks : []
        };
        me.leftPage = {};
        me.rightPage = {};

        me.currentPage = {
            taskType : '',
            index    : null
        };

        me.chatAble = true;
    };

    player.prototype = {

        //初始化工作台工具
        initTool : function(index,works){
            var me = this;
            if(works && works != 'undefined'){
                if(index === works.length) return;
                var work = works[index];
                me.workBench.push(new WorkBench(work,index,me.rightPageTab.bodys[index],me.leftPage.container,me.taskId,me.checkModel,me.courseName,me));
                me.initTool(index+1,works);
            }

        },

        //初始化右边（工作台）
        initRightPage : function(data){
            var me = this;

            var tabName = [];
            $(data).each(function(i,work){
                tabName.push(work.taskName);
            });

            me.rightPageTab = new TabPage(tabName,me.rightPage.container);

            me.addLeftClose();

            me.workBench = [];
            if(data != '' || data != undefined){
                me.initTool(0,data);
            }
        },

        addLeftClose : function(){
            var me = this;

            var closeLeftBtn       = createEle('a');closeLeftBtn.className = "_player_closeLeftBtn";me.rightPage.container.appendChild(closeLeftBtn);
            var closeLeftBtn_icon  = createEle('span');closeLeftBtn_icon.className = "glyphicon glyphicon-chevron-left";closeLeftBtn.appendChild(closeLeftBtn_icon);

            $(closeLeftBtn).click(function(){
                closeLeftC();
            });

            var closeLeftC = function(){
                me.rightPage.container.className = '_player_rightPageCon col-xs-12';
                me.rightPage.container.style.marginLeft = '60px';me.rightPage.container.style.paddingRight = '60px';
                me.leftPage.container.style.display = 'none';
                closeLeftBtn_icon.className = 'glyphicon glyphicon-chevron-right';
                $(closeLeftBtn).unbind('click').click(function(){
                    openLeftC();
                });
            };

            var openLeftC = function(){
                me.rightPage.container.className = '_player_rightPageCon col-xs-7';
                me.rightPage.container.style.marginLeft = '0';me.rightPage.container.style.paddingRight = '0';
                me.leftPage.container.style.display = 'block';
                closeLeftBtn_icon.className = 'glyphicon glyphicon-chevron-left';
                $(closeLeftBtn).unbind('click').click(function(){
                    closeLeftC();
                });
            };
        },

        //初始化左边（基本信息、相关知识、相关技能、学习情境）
        initLeftPage : function(data){
            var me = this;

            var uls;
            var leftPageArr = [],leftPageEles = [];
            if(data.basicInfo && data.basicInfo != 'undefined'){
                var eles = [];
                leftPageArr.push('基本信息');
                var title = createEle('h4');title.innerHTML = me.courseName + '&nbsp;>&nbsp;' + data.label.replace(/<[^>]+>/g,"");
                eles.push(title);
                if(data.basicInfo.courseHour && data.basicInfo.courseHour != 'undefined'){
                    var courseHour = createEle('p');courseHour.innerHTML = '课时数：' + data.basicInfo.courseHour.replace(/<[^>]+>/g,"");
                    eles.push(courseHour);
                }
                $(me.basicInfo).each(function(i,info){
                    if(data.basicInfo[info.value] && data.basicInfo[info.value] != 'undefined'){
                        var con = createEle('div');
                        var head = createEle('h5');head.innerHTML = info.name;con.appendChild(head);
                        var body = createEle('p');body.innerHTML = data.basicInfo[info.value].replace(/<[^>]+>/g,"");con.appendChild(body);
                        eles.push(con);
                    }
                });

                leftPageEles.push(eles);
            }
            if(data.knowledge && data.knowledge != 'undefined' && data.knowledge[0]){
                leftPageArr.push('相关知识');
                uls = [];
                $(data.knowledge).each(function(index,know){
                    var ul = createEle('ul');ul.className = '_player_meta_ul';ul.innerHTML = know.topic;
                    $(know.link).each(function(i,link){
                        var li = createEle('li');li.title = li.innerHTML = link.name;li.className = '_player_meta_li';li.onclick = function(){new ShowMeta(link.fileType,link.id,link.ownerId,link.sourceF,me.leftPage.container)};ul.appendChild(li);
                    });
                    uls.push(ul);
                });
                leftPageEles.push(uls);
            }
            if(data.skill      && data.skill     != 'undefined' && data.skill[0]){
                leftPageArr.push('相关技能');
                uls = [];
                $(data.skill).each(function(index,skill){
                    var ul = createEle('ul');ul.className = '_player_meta_ul';ul.innerHTML = skill.topic;
                    $(skill.link).each(function(index,link){
                        var li = createEle('li');li.title = li.innerHTML = link.name;li.className = '_player_meta_li';li.onclick = function(){new ShowMeta(link.fileType,link.id,me.leftPage.container)};ul.appendChild(li);
                    });
                    uls.push(ul);
                });
                leftPageEles.push(uls);
            }
            if(data.situation  && data.situation != 'undefined'){//TODO
                leftPageArr.push('学习情境');
            }

            me.leftPageTab = new TabPage(leftPageArr,me.leftPage.container);

            $(me.leftPageTab.bodys).each(function(index,body){
                $(leftPageEles[index]).each(function(i,ele){
                    $(body).append(ele);
                });
            });

        },
        //初始化Player
        initPlayer : function(taskType,index){
            var me = this;

            $('body').scrollTop(0);

            if(taskType === 'this' && me.currentPage.taskType === 'this'){}
            else if(taskType === me.currentPage.taskType && me.currentPage.index === index){}
            else{
                switch(taskType){
                    case 'last':
                        me.isLast = true;
                        me.initLeftPage(JSON.parse(me.lastTasks[index]).uiMetaData);
                        me.initRightPage(JSON.parse(me.lastTasks[index]).uiMetaData.workbench);
                        break;
                    case 'this':
                        me.isLast = false;
                        me.initLeftPage(me.currentTask.uiMetaData);
                        me.initRightPage(me.currentTask.uiMetaData.workbench);
                }
            }

            me.currentPage.taskType = taskType;
            me.currentPage.index = index != undefined?index:'';
        },

        //拿到之前的task
        getLastTasks : function(next){
            var me = this;

            me.lastTasks = '';
            $.ajax({
                url: playerPort + '/getLastTasks',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({courseId : me.courseId })
            }).done(function (data) {
                if(data){
                    var arr = data.split('^^');
                    arr.pop();
                    me.lastTasks = arr;
                    next();
                }else{
                    next();
                }

            }).fail(function(){
                console.log('select failed')
            });
                /*sendMessage('get','','/getLastTask?courseCompleteId=' + me.courseId,'',function(lastTasks){
                    if(lastTasks && lastTasks != 'undefind'){
                        me.lastTasks = lastTasks;
                        next();
                    }
                    else{
                        me.lastTasks = '';
                        next();
                    }
                });*/


        },

        //初始化sidebar
        initSideBar : function(nextTasks){
            var me = this;

            $(me.sideBar.container).empty();

            $(me.lastTasks).each(function(index,lastTask){
                lastTask = JSON.parse(lastTask);
                me.sideBar.lastTasks[index] = createEle('div');me.sideBar.lastTasks[index].className = '_player_tasklistLast';me.sideBar.container.appendChild(me.sideBar.lastTasks[index]);
                var lastSpan                = createEle('span');$(lastSpan).css({width: 150,height:40,float: 'left',"text-overflow":"ellipsis",overflow:"hidden"});lastSpan.title = lastSpan.innerHTML = lastTask.uiMetaData.label.replace(/<[^>]+>/g,"");me.sideBar.lastTasks[index].appendChild(lastSpan);
                var lastI                   = createEle('i');lastI.className = 'glyphicon glyphicon-ok-circle';me.sideBar.lastTasks[index].appendChild(lastI);
                me.sideBar.lastTasks[index].onclick = function(){me.initPlayer('last',index)};
            });
            if(!me.checkModel){
                me.sideBar.currentTask          = createEle('div');me.sideBar.currentTask.className = '_player_tasklistCurrent';me.initPlayer('this');me.sideBar.container.appendChild(me.sideBar.currentTask);
                var currentSpan                 = createEle('span');$(currentSpan).css({width: 150,height:40,float: 'left',"text-overflow":"ellipsis",overflow:"hidden"});currentSpan.title = currentSpan.innerHTML = me.currentTask.uiMetaData.label.replace(/<[^>]+>/g,"");me.sideBar.currentTask.appendChild(currentSpan);
                var currentI                    = createEle('i');currentI.className = 'imooc-icon';currentI.innerHTML = '&#xea56;';me.sideBar.currentTask.appendChild(currentI);
                me.sideBar.currentTask.onclick  = function(){me.initPlayer('this')};

                if(nextTasks){
                    $(nextTasks).each(function(index,nextTask){
                        me.sideBar.nextTasks[index] = createEle('div');me.sideBar.nextTasks[index].className = '_player_tasklistNext';me.sideBar.container.appendChild(me.sideBar.nextTasks[index]);
                        var nextSpan                = createEle('span');$(nextSpan).css({width: 150,height:40,float: 'left',"text-overflow":"ellipsis",overflow:"hidden"});nextSpan.title = nextSpan.innerHTML = nextTask.label.replace(/<[^>]+>/g,"");me.sideBar.nextTasks[index].appendChild(nextSpan);
                        var nextI                   = createEle('i');nextI.className = 'glyphicon glyphicon-time';me.sideBar.nextTasks[index].appendChild(nextI);
                    });
                }
            }
            

            //TODO 添加课程控制
            var getNextTask = createEle('a');

            if(!me.checkModel){
                if(nextTasks[0]){
                    getNextTask.innerHTML = '进入下一步';
                }
                else{
                    getNextTask.innerHTML = '结束课程';
                }
                getNextTask.className = '_player_getNextTask';$(getNextTask).click(function(){
                    $(this).unbind('click');
                    me.studyCourse(me.processDefinitionId,me.currentTask.uiMetaData.id);
                });
                me.sideBar.container.appendChild(getNextTask);
            }
        },

        //结束课程
        endCourse : function(){
            var me = this;

            me.socket.close();//关闭socket

                //$.ajax({
                //    url: VMPort + "/XenServerVM-WebService/courseAPI",
                //    type: "post",
                //    dataType: "json",
                //    data: {command: "queryCourseUserVMS",userID: userData.id},
                //    success: function (strData) {
                //        var length = strData.length;
                //        for(var i=0;i<length;i++){
                //            //这里要判断role，为1的uuid才应该记录下来，让学习者连接
                //
                //            $.ajax({
                //                url: VMPort + "/XenServerVM-WebService/courseAPI",
                //                type: "post",
                //                dataType: "json",
                //                data: {command: "shutdownVM",userID:userData.id,vmuuid:strData[i].uuid,force:true},
                //                success: function (strData) {
                //                    console.log('close',strData);
                //                }
                //            });
                //
                //        }
                //    }
                //});
            $.ajax({
                url: playerPort + '/course/' + me.courseId.split('@')[0],
                method: 'GET'
            }).done(function (resData) {

                var lastIndex = 0;

                for(i = 1;i < resData.length;i++){
                    if(resData[i].selectedTime - resData[lastIndex].selectedTime > 0){
                        lastIndex = i;
                    }
                }

                var data = resData[lastIndex];
                
                data.statement = 'off';
                data.completedTime = new Date().getTime();
                    $.ajax({
                        url: playerPort + '/course/' + me.courseId,
                        method: 'PUT',
                        contentType: 'application/json',
                        data: JSON.stringify(data)
                    }).done(function (data) {

                            if(me.VMId){
                                $.ajax({
                                    url: VMPort + "/XenServerVM-WebService/courseAPI",
                                    type: "post",
                                    dataType: "json",
                                    data: {command: "queryCourseUserVMS",userID: userData.id},
                                    success: function (strData) {
                                        var have = false;
                                        for(var i=0;i<strData.length;i++){
                                            //这里要判断role，为1的uuid才应该记录下来，让学习者连接
                                            if(strData[i].courseID.toString() === me.VMId){
                                                have = true;
                                                
                                                $.ajax({
                                                    url: VMPort + "/XenServerVM-WebService/courseAPI",
                                                    type: "post",
                                                    dataType: "json",
                                                    data: {command: "shutdownVM",userID:userData.id,vmuuid:strData[i].uuid,force:true},
                                                    success: function (strData) {
                                                        location.reload();
                                                    }
                                                });
                                            }
                                        }

                                        if(!have){
                                            location.reload();
                                        }
                                    }
                                });

                            }else{
                                location.reload();
                            }

                            

                        }).fail(function () {})}).fail(function(){});

               /* });*/

        },



        //处理task
        handleTask : function(nextFigures){
            var me = this;

            /*if(nextFigures.isEnd){
                return;
            }*/

            /*var tempArr=nextFigures.currentTask.uiMetaData.type.split('.');

            if (nextFigures.currentTask.uiMetaData.type === 'bpmn.gateway.general.start'){}
            else if(nextFigures.currentTask.uiMetaData.type === 'bpmn.gateway.general.end'){
                me.endCourse();
            }else if(tempArr.length===3 && tempArr[1]==='gateway'){}
            else{*/
            $('body').scrollTop(0);
            me.currentTask = nextFigures.currentTask;
            me.taskId = me.currentTask.uiMetaData.taskDefinKey;
            $.ajax({
                url: playerPort + '/saveCourse',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({nodeType:'learnAtn',courseId:me.taskId,name:me.currentTask.uiMetaData.label.replace(/<[^>]+>/g,""),parentId:me.courseId.split("@")[0]})
            }).done(function(res){
            }).fail(function(e){});
            window['meta'] = false;

            me.currentPage.taskType = '';

            me.getLastTasks(function(){
                me.initSideBar(nextFigures.nextTasks);
                me.initPlayer('this');
            });
          /*  }*/
        },
        studyCourse : function(processDefinitionId,id){
            var me = this;

            if(me.org){
                var sdata = {
                    courseInstanceId : me.courseId,
                    processDefinitionId : processDefinitionId,
                    assignee : me.orgDatas.roleCid,
                    taskId : id,
                    output : {},
                    isCooperation:true,
                    courseOrgId:me.org,
                    members:me.orgDatas.members,
                    groupId:me.orgDatas.groupId,
                    roleCid:me.orgDatas.roleCid,
                    roleId:me.orgDatas.roleId,
                    roleName:me.orgDatas.roleName,
                    userId:userData.id
                };
                me.socket.emit('study',sdata);
            }else{
                var sdata = {
                    courseInstanceId : me.courseId,
                    processDefinitionId : processDefinitionId,
                    assignee : userData.id,
                    taskId : id,
                    output : {}
                };
                me.socket.emit('study',sdata);
            }

        },

        //连接引擎
        getCourseStart : function(){
            var me = this;

            me.studyCourse(me.processDefinitionId,'');
        },

        //生成播放器框架
        initFrame : function(){
            var me = this;

            var sideBar  = createEle('div');sideBar.className = "_player_sideBar";
            $(sideBar).hover(function(){
                $(this).animate({ marginLeft:0},0);
            },function(){
                $(this).animate({ marginLeft:'-150px'},0);
            });
            var mainCon            = createEle('div');mainCon.className = "_player_mainCon";$(mainCon).css({height:900}) ;$('._page_view').append(sideBar).append(mainCon);

            var leftPageCon        = createEle('div');leftPageCon.className = "_player_leftPageCon col-xs-5";$(leftPageCon).css({height:900}) ;mainCon.appendChild(leftPageCon);
            var rightPageCon       = createEle('div');rightPageCon.className = "_player_rightPageCon col-xs-7";$(rightPageCon).css({height:900}) ;mainCon.appendChild(rightPageCon);
            var toolBarCon         = createEle('div');toolBarCon.className = "_player_toolBarCon";$('._page_view').append(toolBarCon);
            
            if(me.chatAble){
                var chatSwitch     = createEle('div');chatSwitch.className = "_player_chatSwitch imooc-icon";chatSwitch.innerHTML = '&#xe96c';chatSwitch.title = '聊天室';$(toolBarCon).append(chatSwitch);
                me.initChatRoom(chatSwitch);

            }
            
            me.sideBar.container   = sideBar;
            
            me.leftPage.container  = leftPageCon;
            me.rightPage.container = rightPageCon;
            me.toolBarCon          = toolBarCon;
            
            me.haveCon = true;
        },

        initChatRoom : function(chatSwitch){
            var me = this;
            
            var chatRoomWindow = createEle('div');chatRoomWindow.className = '_player_chatRoomWindow';$('._page_view').append(chatRoomWindow);
            var chatFrame = createEle('iframe');chatFrame.className = '_player_chatFrame';chatFrame.src = studyPort + '/communication/chat.html?userId='+userData.id+'&userName='+userData.name;$(chatRoomWindow).append(chatFrame);
            
            $(chatSwitch).click(function() {
                $(chatRoomWindow).data("kendoWindow").open();
            });

            function onClose() {

            }

            $(chatRoomWindow).kendoWindow({
                width: "808px",
                height: "607px",
                title: "聊天室",
                minWidth:"808px",
                minHeight:"607px",
                maxWidth:"808px",
                maxHeight:"607px",
                visible: false,
                actions: [
                    "Close"
                ],
                resize:function(e){
                },
                close: onClose
            }).data("kendoWindow").center().close();

        },

        //拿到课程名称
        getCourseName : function(next){
            var me = this;
            $.ajax({
                url: playerPort + '/course/' + me.courseId.split('@')[0],
                method: 'GET'
            }).done(function (resData) {

                var lastIndex = 0;

                for(i = 1;i < resData.length;i++){
                    if(resData[i].selectedTime- resData[lastIndex].selectedTime > 0){
                        lastIndex = i;
                    }
                }
                var data = resData[lastIndex];

                if(me.checkModel){
                    sendMessage('get', ecgeditorPort, '/getSingleCourseInfo?courseId=' + me.courseId.split('@')[0], '', function (data) {
                        me.courseName = data.data[0].courseName;
                        me.processDefinitionId = data.processDefinitionId;
                        next();
                    });
                }
                else{
                    if(data === 'no user'){
                        $.MsgBox.Alert('请登录','没有用户登录，请登录！',function(){
                            window.location = playerPort + "/";
                        });
                    }else{
                        if(data.statement === 'on') {
                            me.processDefinitionId = data.processDefinitionId;
                            me.studySocket = io.connect(studyPort);
                            me.studySocket.on('connect', function () {
                                me.studySocket.emit('socketType', {
                                    type : 'learning'
                                });
                                console.log('socket is connected');
                                me.courseName = data.courseName;
                                me.processDefinitionId = data.processDefinitionId;
                                me.teacherId = data.teacherId;
                                me.teacherName = data.teacherName;
                                if(me.org){
                                    me.userOnlineInfo = {
                                        userId: userData.id,
                                        userName: userData.name,
                                        userAvatar: userData.name + '.jpg',
                                        courseName: data.courseName,
                                        teacherId: me.orgDatas.orgUserId,
                                        courseId: me.courseId.split('@')[0],
                                        instanceId: me.courseId
                                    };
                                }else{
                                    me.userOnlineInfo = {
                                        userId: userData.id,
                                        userName: userData.name,
                                        userAvatar: userData.name + '.jpg',
                                        courseName: data.courseName,
                                        teacherId: me.teacherId,
                                        courseId: me.courseId.split('@')[0],
                                        instanceId: me.courseId
                                    };
                                }
                                
                                me.studySocket.emit('studentOnline', me.userOnlineInfo);
                            });

                            me.onlineTime = 0;
                            setInterval(function () {
                                me.onlineTime++;
                                me.studySocket.emit('studentOnlineTimeChange', {
                                    onlineTime : me.onlineTime
                                });
                            }, 60000);
                            next();
                        }else{
                            $.MsgBox.Alert('课程结束','课程结束，将返回课程首页！',function(){
                                window.location = playerPort + "/";
                            });

                        }
                    }
                }
            }).fail(function(){
                $.MsgBox.Alert('课程结束','课程结束，将返回课程首页！',function(){
                    window.location = playerPort + "/";
                });
            });


        },
        //初始化
        init : function(vals){
            var me = this;

            me.courseId = vals[0];
            me.checkModel = vals[1] === 'check'?vals[1]:'';
            me.org = (vals[1] && vals[1] != 'check')?vals[1]:'';
            me.isLast = false;

            if(me.checkModel){
                me.getCourseName(function(){
                    me.initFrame();
                   // me.getCourseStart();
                    me.getLastTasks(function(){
                        me.initSideBar();
                        me.initPlayer('last',0);
                    });
                });
                return;
            }

            if(me.org){
                sendMessage('post',newProcessEnginePort,'/ec_engine/course/getUserGroupInfo',{userId:userData.id,courseOrgId:me.org},function(data){
                    me.orgDatas = data;
                    me.getCourseName(function(){
                        me.initFrame();
                        me.socket = io.connect( processEnginePort);
                        me.socket.on('notice_'+ me.orgDatas.groupId + '@' + me.orgDatas.roleCid + '@' + userData.id, function (data) {
                            alert(data.msg);
                        });
                        me.socket.on('study_'+ me.orgDatas.groupId + '@' + me.orgDatas.roleCid, function (data) {
                            if(me.currentTask){
                                $.ajax({
                                    url: playerPort + '/saveLastTasks',
                                    method: 'POST',
                                    contentType: 'application/json',
                                    data: JSON.stringify({courseId : me.courseId , taskData : JSON.stringify(me.currentTask)})
                                }).done(function () {
                                    if(data.errorMsg){
                                        $.ajax({
                                            url: playerPort + '/getCourseOrg/' + me.courseData.courseId + '/' + me.orgId,
                                            method: 'GET'
                                        }).done(function (resData) {
                                            var lastIndex = 0;

                                            for(i = 1;i < resData.length;i++){
                                                if(resData[i].selectedTime - resData[lastIndex].selectedTime > 0){
                                                    lastIndex = i;
                                                }
                                            }

                                            var data = resData[lastIndex];

                                            data.statement = 'off';
                                            data.completedTime = new Date();
                                            $.ajax({
                                                url: playerPort + '/course/' + me.courseId,
                                                method: 'PUT',
                                                contentType: 'application/json',
                                                data: JSON.stringify(data)
                                            }).done(function (data) {
                                                location.reload();
                                            }).fail(function () {})}).fail(function(){});
                                        return;
                                    }
                                    if(data.courseStatus != 'end'){
                                        var nextFigures = {currentTask: {}};
                                        nextFigures.currentTask.inputObj = [];
                                        nextFigures.currentTask.outputObj = [];
                                        nextFigures.currentTask.outputObj = [];
                                        nextFigures.currentTask.uiMetaData = {};
                                        nextFigures.currentTask.uiMetaData.basicInfo = data.currTask.taskInfo.data.basicInfo?JSON.parse(data.currTask.taskInfo.data.basicInfo):'';
                                        nextFigures.currentTask.uiMetaData.controlType = data.currTask.taskInfo.data.controlType?JSON.parse(data.currTask.taskInfo.data.controlType):'';
                                        nextFigures.currentTask.uiMetaData.knowledge = data.currTask.taskInfo.data.knowledge?JSON.parse(data.currTask.taskInfo.data.knowledge):'';
                                        nextFigures.currentTask.uiMetaData.skill = data.currTask.taskInfo.data.skill?JSON.parse(data.currTask.taskInfo.data.skill):'';
                                        nextFigures.currentTask.uiMetaData.situation = data.currTask.taskInfo.data.situation?JSON.parse(data.currTask.taskInfo.data.situation):'';
                                        nextFigures.currentTask.uiMetaData.workbench = data.currTask.taskInfo.data.workbench?JSON.parse(data.currTask.taskInfo.data.workbench):'';
                                        nextFigures.currentTask.uiMetaData.label = data.currTask.taskInfo.taskName;
                                        nextFigures.currentTask.uiMetaData.id = data.currTask.taskInfo.taskId;
                                        nextFigures.currentTask.uiMetaData.taskDefinKey = data.currTask.taskInfo.taskDefinKey;
                                        nextFigures.nextTasks = [];

                                        me.userOnlineInfo = {
                                            progress: nextFigures.currentTask.uiMetaData.label,
                                            courseName: me.courseName
                                        };

                                        me.studySocket.emit('studentProgress', me.userOnlineInfo);

                                        $(data.nextTasks[me.orgDatas.roleCid]).each(function(i,task){
                                            var taskObj = JSON.parse(task);
                                            nextFigures.nextTasks[i] = {};
                                            nextFigures.nextTasks[i] = taskObj.data;
                                            nextFigures.nextTasks[i].label = taskObj.taskName;
                                            nextFigures.nextTasks[i].taskDefinKey = taskObj.taskDefinKey;
                                        });
                                        me.handleTask(nextFigures);
                                    }else{
                                        me.endCourse();
                                    }
                                }).fail(function(){
                                    console.log('select failed')
                                });
                            }else{
                                if(data.errorMsg){
                                    $.ajax({
                                        url: playerPort + '/getCourseOrg/' + me.courseData.courseId + '/' + me.orgId,
                                        method: 'GET'
                                    }).done(function (resData) {
                                        var lastIndex = 0;

                                        for(i = 1;i < resData.length;i++){
                                            if(resData[i].selectedTime - resData[lastIndex].selectedTime > 0){
                                                lastIndex = i;
                                            }
                                        }

                                        var data = resData[lastIndex];

                                        data.statement = 'off';
                                        data.completedTime = new Date();
                                        $.ajax({
                                            url: playerPort + '/course/' + me.courseId,
                                            method: 'PUT',
                                            contentType: 'application/json',
                                            data: JSON.stringify(data)
                                        }).done(function (data) {
                                            location.reload();
                                        }).fail(function () {})}).fail(function(){});
                                    return;
                                }
                                if(data.courseStatus != 'end'){
                                    var nextFigures = {currentTask: {}};
                                    nextFigures.currentTask.inputObj = [];
                                    nextFigures.currentTask.outputObj = [];
                                    nextFigures.currentTask.outputObj = [];
                                    nextFigures.currentTask.uiMetaData = {};
                                    nextFigures.currentTask.uiMetaData.basicInfo = data.currTask.taskInfo.data.basicInfo?JSON.parse(data.currTask.taskInfo.data.basicInfo):'';
                                    nextFigures.currentTask.uiMetaData.controlType = data.currTask.taskInfo.data.controlType?JSON.parse(data.currTask.taskInfo.data.controlType):'';
                                    nextFigures.currentTask.uiMetaData.knowledge = data.currTask.taskInfo.data.knowledge?JSON.parse(data.currTask.taskInfo.data.knowledge):'';
                                    nextFigures.currentTask.uiMetaData.skill = data.currTask.taskInfo.data.skill?JSON.parse(data.currTask.taskInfo.data.skill):'';
                                    nextFigures.currentTask.uiMetaData.situation = data.currTask.taskInfo.data.situation?JSON.parse(data.currTask.taskInfo.data.situation):'';
                                    nextFigures.currentTask.uiMetaData.workbench = data.currTask.taskInfo.data.workbench?JSON.parse(data.currTask.taskInfo.data.workbench):'';
                                    nextFigures.currentTask.uiMetaData.label = data.currTask.taskInfo.taskName;
                                    nextFigures.currentTask.uiMetaData.id = data.currTask.taskInfo.taskId;
                                    nextFigures.currentTask.uiMetaData.taskDefinKey = data.currTask.taskInfo.taskDefinKey;
                                    nextFigures.nextTasks = [];

                                    me.userOnlineInfo = {
                                        progress: nextFigures.currentTask.uiMetaData.label,
                                        courseName: me.courseName
                                    };

                                    me.studySocket.emit('studentProgress', me.userOnlineInfo);

                                    $(data.nextTasks[me.orgDatas.roleCid]).each(function(i,task){
                                        var taskObj = JSON.parse(task);
                                        nextFigures.nextTasks[i] = {};
                                        nextFigures.nextTasks[i] = taskObj.data;
                                        nextFigures.nextTasks[i].label = taskObj.taskName;
                                        nextFigures.nextTasks[i].taskDefinKey = taskObj.taskDefinKey;
                                    });
                                    me.handleTask(nextFigures);
                                }else{
                                    me.endCourse();
                                }
                            }

                        });
                        me.getCourseStart();
                    });
                });
            }else{
                me.getCourseName(function(){
                    me.initFrame();
                    me.socket = io.connect( processEnginePort);
                    me.socket.on('study_'+ me.courseId, function (data) {
                        if(me.currentTask){
                            $.ajax({
                                url: playerPort + '/saveLastTasks',
                                method: 'POST',
                                contentType: 'application/json',
                                data: JSON.stringify({courseId : me.courseId , taskData : JSON.stringify(me.currentTask)})
                            }).done(function () {
                                if(data.errorMsg){
                                    if(me.org){
                                        $.ajax({
                                            url: playerPort + '/getCourseOrg/' + me.courseData.courseId + '/' + me.orgId,
                                            method: 'GET'
                                        }).done(function (resData) {
                                            var lastIndex = 0;

                                            for(i = 1;i < resData.length;i++){
                                                if(resData[i].selectedTime - resData[lastIndex].selectedTime > 0){
                                                    lastIndex = i;
                                                }
                                            }

                                            var data = resData[lastIndex];

                                            data.statement = 'off';
                                            data.completedTime = new Date();
                                            $.ajax({
                                                url: playerPort + '/course/' + me.courseId,
                                                method: 'PUT',
                                                contentType: 'application/json',
                                                data: JSON.stringify(data)
                                            }).done(function (data) {
                                                location.reload();
                                            }).fail(function () {})}).fail(function(){});
                                        return;
                                    }else{
                                        $.ajax({
                                            url: playerPort + '/course/' + me.courseId.split('@')[0],
                                            method: 'GET'
                                        }).done(function (resData) {

                                            var lastIndex = 0;

                                            for(i = 1;i < resData.length;i++){
                                                if(resData[i].selectedTime - resData[lastIndex].selectedTime > 0){
                                                    lastIndex = i;
                                                }
                                            }

                                            var data = resData[lastIndex];

                                            data.statement = 'off';
                                            data.completedTime = new Date();
                                            $.ajax({
                                                url: playerPort + '/course/' + me.courseId,
                                                method: 'PUT',
                                                contentType: 'application/json',
                                                data: JSON.stringify(data)
                                            }).done(function (data) {
                                                location.reload();
                                            }).fail(function () {})}).fail(function(){});
                                        return;
                                    }
                                }
                                if(data.courseStatus != 'end'){
                                    var nextFigures = {currentTask: {}};
                                    nextFigures.currentTask.inputObj = [];
                                    nextFigures.currentTask.outputObj = [];
                                    nextFigures.currentTask.outputObj = [];
                                    nextFigures.currentTask.uiMetaData = {};
                                    nextFigures.currentTask.uiMetaData.basicInfo = data.currTask.taskInfo.data.basicInfo?JSON.parse(data.currTask.taskInfo.data.basicInfo):'';
                                    nextFigures.currentTask.uiMetaData.controlType = data.currTask.taskInfo.data.controlType?JSON.parse(data.currTask.taskInfo.data.controlType):'';
                                    nextFigures.currentTask.uiMetaData.knowledge = data.currTask.taskInfo.data.knowledge?JSON.parse(data.currTask.taskInfo.data.knowledge):'';
                                    nextFigures.currentTask.uiMetaData.skill = data.currTask.taskInfo.data.skill?JSON.parse(data.currTask.taskInfo.data.skill):'';
                                    nextFigures.currentTask.uiMetaData.situation = data.currTask.taskInfo.data.situation?JSON.parse(data.currTask.taskInfo.data.situation):'';
                                    nextFigures.currentTask.uiMetaData.workbench = data.currTask.taskInfo.data.workbench?JSON.parse(data.currTask.taskInfo.data.workbench):'';
                                    nextFigures.currentTask.uiMetaData.label = data.currTask.taskInfo.taskName;
                                    nextFigures.currentTask.uiMetaData.id = data.currTask.taskInfo.taskId;
                                    nextFigures.currentTask.uiMetaData.taskDefinKey = data.currTask.taskInfo.taskDefinKey;
                                    nextFigures.nextTasks = [];

                                    me.userOnlineInfo = {
                                        progress: nextFigures.currentTask.uiMetaData.label,
                                        courseName: me.courseName
                                    };

                                    me.studySocket.emit('studentProgress', me.userOnlineInfo);

                                    $(data.nextTasks[userData.id]).each(function(i,task){
                                        var taskObj = JSON.parse(task);
                                        nextFigures.nextTasks[i] = {};
                                        nextFigures.nextTasks[i] = taskObj.data;
                                        nextFigures.nextTasks[i].label = taskObj.taskName;
                                        nextFigures.nextTasks[i].taskDefinKey = taskObj.taskDefinKey;
                                    });
                                    me.handleTask(nextFigures);
                                }else{
                                    me.endCourse();
                                }
                            }).fail(function(){
                                console.log('select failed')
                            });
                        }else{
                            if(data.errorMsg){
                                if(me.org){
                                    $.ajax({
                                        url: playerPort + '/getCourseOrg/' + me.courseData.courseId + '/' + me.orgId,
                                        method: 'GET'
                                    }).done(function (resData) {
                                        var lastIndex = 0;

                                        for(i = 1;i < resData.length;i++){
                                            if(resData[i].selectedTime - resData[lastIndex].selectedTime > 0){
                                                lastIndex = i;
                                            }
                                        }

                                        var data = resData[lastIndex];

                                        data.statement = 'off';
                                        data.completedTime = new Date();
                                        $.ajax({
                                            url: playerPort + '/course/' + me.courseId,
                                            method: 'PUT',
                                            contentType: 'application/json',
                                            data: JSON.stringify(data)
                                        }).done(function (data) {
                                            location.reload();
                                        }).fail(function () {})}).fail(function(){});
                                    return;
                                }else{
                                    $.ajax({
                                        url: playerPort + '/course/' + me.courseId.split('@')[0],
                                        method: 'GET'
                                    }).done(function (resData) {

                                        var lastIndex = 0;

                                        for(i = 1;i < resData.length;i++){
                                            if(resData[i].selectedTime - resData[lastIndex].selectedTime > 0){
                                                lastIndex = i;
                                            }
                                        }

                                        var data = resData[lastIndex];

                                        data.statement = 'off';
                                        data.completedTime = new Date();
                                        $.ajax({
                                            url: playerPort + '/course/' + me.courseId,
                                            method: 'PUT',
                                            contentType: 'application/json',
                                            data: JSON.stringify(data)
                                        }).done(function (data) {
                                            location.reload();
                                        }).fail(function () {})}).fail(function(){});
                                    return;
                                }
                            }
                            if(data.courseStatus != 'end'){
                                var nextFigures = {currentTask: {}};
                                nextFigures.currentTask.inputObj = [];
                                nextFigures.currentTask.outputObj = [];
                                nextFigures.currentTask.outputObj = [];
                                nextFigures.currentTask.uiMetaData = {};
                                nextFigures.currentTask.uiMetaData.basicInfo = data.currTask.taskInfo.data.basicInfo?JSON.parse(data.currTask.taskInfo.data.basicInfo):'';
                                nextFigures.currentTask.uiMetaData.controlType = data.currTask.taskInfo.data.controlType?JSON.parse(data.currTask.taskInfo.data.controlType):'';
                                nextFigures.currentTask.uiMetaData.knowledge = data.currTask.taskInfo.data.knowledge?JSON.parse(data.currTask.taskInfo.data.knowledge):'';
                                nextFigures.currentTask.uiMetaData.skill = data.currTask.taskInfo.data.skill?JSON.parse(data.currTask.taskInfo.data.skill):'';
                                nextFigures.currentTask.uiMetaData.situation = data.currTask.taskInfo.data.situation?JSON.parse(data.currTask.taskInfo.data.situation):'';
                                nextFigures.currentTask.uiMetaData.workbench = data.currTask.taskInfo.data.workbench?JSON.parse(data.currTask.taskInfo.data.workbench):'';
                                nextFigures.currentTask.uiMetaData.label = data.currTask.taskInfo.taskName;
                                nextFigures.currentTask.uiMetaData.id = data.currTask.taskInfo.taskId;
                                nextFigures.currentTask.uiMetaData.taskDefinKey = data.currTask.taskInfo.taskDefinKey;
                                nextFigures.nextTasks = [];

                                me.userOnlineInfo = {
                                    progress: nextFigures.currentTask.uiMetaData.label,
                                    courseName: me.courseName
                                };

                                me.studySocket.emit('studentProgress', me.userOnlineInfo);

                                $(data.nextTasks[userData.id]).each(function(i,task){
                                    var taskObj = JSON.parse(task);
                                    nextFigures.nextTasks[i] = {};
                                    nextFigures.nextTasks[i] = taskObj.data;
                                    nextFigures.nextTasks[i].label = taskObj.taskName;
                                    nextFigures.nextTasks[i].taskDefinKey = taskObj.taskDefinKey;
                                });
                                me.handleTask(nextFigures);
                            }else{
                                me.endCourse();
                            }
                        }
                        
                    });
                    me.getCourseStart();
                });
            }
        }
    };

    window['Player'] = player;
})($);