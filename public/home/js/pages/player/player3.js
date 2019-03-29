var submitMyForm1;
var sendTag = false;
var Database = function (courseId,view,next) {
    var me = this;
    this.view = view;
    if(!this.view.viewMode)this.processController = '';
    this.courseId = courseId;
    this.courseData = '';
    this.currActionData = '';
    this.VMId = '';
    this.subTasks = [];
    this.lastTasks = [];
    this.onlineTime = 0;
    this.basicInfo = [
        {name:'学习目标',value:'goal'},
        {name:'学习内容',value:'content'},
        {name:'引导问题',value:'guideQuestion'},
        {name:'教学重难点',value:'teachingDifficulty'},
        {name:'工作要求',value:'workRequirement'},
        {name:'单元考核标准',value:'teachingCheck'}
    ];
    /*this.fakeData = {
        "currTask":{
            "assignee":"P8RL1RE6",
            "taskInfo":{
                "data":{
                    "output":{"name":"任务报告.doc","requirement":true,"type":"file"},
                    "input":{"optType":"private","fileName":"任务报告.doc","userName":"张龙龙","userId":"P8RL1RE6","fileId":"0d7bf49b-6604-44da-a71d-34e3b244d5f2"},
                    "isHuPing":"0",
                    "taskDescription":"请写一份报告，并提交。",
                    "taskName":"写报告",
                    "toolType":"office",
                    "taskId":"usertask1_role-id-123456"
                },
                "taskDefinKey":"usertask1_role-id-123456",
                "taskName":"写报告",
                "taskId":"225122"
            }
        },
        "roleId":"role_id_123456",
        "members":"3",
        "groupId":"dfbf5630-8ecc-11e6-bcf0-4bee824d6fb1",
        "courseStatus":"start",
        "roleName":"评论",
        "currSubTask":{
            "subId":"subprocess1",
            "subName":"基于互评的任务",
            "basicInfo":"这是本任务的基本信息2。",
            "controlType":[],
            "knowledge":[{"topic":"常用弱口令","link":[{"id":"e4dfbd93-b149-49c6-a32a-6a505b608e86","name":"常用弱口令.docx","description":"【知识】4-1 常用弱口令.docx","fileType":"docx"}]}],
            "skill":[],
            "studySituation":[]
        },
        "isCooperation":true,
        "roleCid":"dfc1a020-8ecc-11e6-bcf0-4bee824d6fb1",
        "userId":"P8RL1RE6",
        "courseOrgId":"cbf85160-8ecc-11e6-bcf0-4bee824d6fb1"
    };*/
    if(me.view.viewMode){
        me.resetLastTasks(function(){
            me.getCourseData(function(){
                me.view.renderBaseBlock(function(){
                    me.view.resetSelf(function(){
                        next();
                    });
                });
            });
        });
    }
};
Database.prototype = {
    findFile : function(instanceId,taskId,next){
        var me = this;
        sendMessage('get',playerPort,'/findFile?courseInstId='+instanceId+'&taskId='+taskId,'',function(resData){
            next(resData);
        });
    },
    saveEvaluation : function(grade,comment,next){
        var me = this;
        if(!grade && !comment){
            $.MsgBox.Alert('评价失败','没有评价内容！');
        }else{
            var sendData = {
                grade : grade,
                comment : comment,
                courseId : me.courseId.split('@')[0],
                instanceId : me.courseId.split('@')[1]
            };
            $.ajax({
                url: playerPort + '/evaluateCourse',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(sendData)
            }).done(function(){
                next();
            }).fail(function () {
                console.log('evaluateCourse fail!');
            });
            
        }
    },
    saveOption : function(optionData){
        var me = this;
        if(!me.view.viewMode) {
            sendMessage('post',playerPort,'/saveOption',optionData,function(){});
        }
    },
    getPreFile : function(filePath,next){
        sendMessage('post',newProcessEnginePort,'fileManager/fileContentRead',{userId:userData.id,filePath:filePath},function(resData){
            //if(resData.substr(0, 3) != '<!D'){
                next(resData);
            //}
        });
    },
    getTxtFile : function(taskId,next){
        var me = this;
        me.findFile(me.courseId.split('@')[1],taskId,function(data){
            if(data.length){
                sendMessage('post',newProcessEnginePort,'fileManager/fileContentRead',{userId:userData.id,fileId:data[data.length-1].fileId,createType:'study'},function(resData){
                    if(resData.substr(0, 3) != '<!D'){
                        next(resData);
                    }
                });
            }else{
                if(!me.view.viewMode){
                    $.MsgBox.Alert('没找到文件','您还没有保存文件！');
                }
                return '';
            }
        });
    },
	saveTxtFile : function(fileId,content,workData){
		var me = this;
		sendMessage('post',newProcessEnginePort,'fileManager/studyFileUploadByContent',
					{userId: userData.id, fileId:workData.input.fileId, fileName:workData.output.name, fileStr:content},
					function(result){
                        if(result){
							result = JSON.parse(result);
							if (result.errorMsg) {
								me.view.showNotification(result.errorMsg,'error');
							}else{
								sendMessage('post',playerPort,'/saveFile',{courseInstId:me.courseId.split('@')[1],taskId:workData.taskId,updateTime:new Date().getTime(),fileId:workData.input.fileId,fileName:workData.output.name,fileUrl:workData.input.filePath,fileType:workData.output.name.indexOf(".jm") > 0?"jm":"html"},function(){
									me.view.showNotification('保存成功~','success');
								});
							}
						}else{
							me.view.showNotification('保存时出现问题!','error');
						}
						
                    });
	   
    },
    saveTxtFile_old : function(fileId,content,workData){
		var me = this;
        var formData = new FormData();
        formData.append("userId",  userData.id);
        formData.append("fileId",workData.input.fileId);
        formData.append("fileName",workData.input.fileName);
        //formData.append("createType","study");
        formData.append("fileStr",content);
	
		//结合jquery上传文件方式
		$.ajax({
            url: newProcessEnginePort + 'fileManager/studyFileUploadByContent', 
            type: "POST",
            contentType: 'multipart/form-data',
            data: formData,
            async: true,
            cache: false,
            processData: false, //告诉jQuery不要去处理发送的数据
            success: function(result) {
                var result = this.response;
                if(result){
                    result = JSON.parse(result);
                }
                if (result.errorMsg) {
                    me.view.showNotification(result.errorMsg,'error');
                }else{
                    sendMessage('post',playerPort,'/saveFile',{courseInstId:me.courseId.split('@')[1],taskId:workData.taskId,updateTime:new Date().getTime(),fileId:fileId,fileName:workData.output.name,fileUrl:workData.input.filePath,fileType:workData.output.name.endWith("jm")?"jm":"html"},function(){
                        me.view.showNotification('保存成功~','success');
                    });
                }
            },
			error: function(error){
				me.view.showNotification('保存时出现问题!','error');
			}
        });
		
	   /*
        var xhr = new XMLHttpRequest();
        path = newProcessEnginePort + 'fileManager/fileUpload';
        xhr.open('post', path, true);
        xhr.onload = function(e){
            if (this.status == 200) {
                var result = this.response;
                if(result){
                    result = JSON.parse(result);
                }
                if (result.errorMsg) {
                    me.view.showNotification(result.errorMsg,'error');
                }else{
                    sendMessage('post',playerPort,'/saveFile',{courseInstId:me.courseId.split('@')[1],taskId:workData.taskId,updateTime:new Date().getTime(),fileId:fileId,fileName:workData.output.name,fileUrl:workData.input.filePath,fileType:'html'},function(){
                        me.view.showNotification('保存成功~','success');
                    });
                }
            }else{
				me.view.showNotification('保存时出现问题!','error');
			}
        };
        xhr.send(formData);
        */
    },
    getGroupData : function(next){
        var me = this;
        sendMessage('post',newProcessEnginePort,'course/getUserGroupInfo',{userId:userData.id,courseOrgId:me.courseData.lrnScnOrgId},function(groupData){
            me.groupData = groupData;
            next();
        });
    },
    isSubTaskExist : function(subId){
        var me = this;
        var isExist = false;
        $(me.subTasks).each(function(i,subTask){
            if(subId == subTask.subId) isExist = true;
        });
        return isExist;
    },
    saveCurrData : function(next){
        var me = this;
        if(me.currActionData){
            sendMessage('post',playerPort,'/saveLastTasks',{courseId : me.courseId , task : JSON.stringify(me.currActionData)},function(){
                me.lastTasks.push(me.currActionData);
                next();
            });
        }else{
            next();
        }
        
    },
    saveCourseClass : function(actionData){
        var me = this;
        if(actionData.currSubTask){
            sendMessage('post',playerPort,'/saveCourse',{nodeType:'learnAtn',courseId:me.courseId.split('@')[0]+'_'+actionData.currSubTask.subId,name:actionData.currSubTask.subName,parentId:me.courseId.split('@')[0]},function(){});
            sendMessage('post',playerPort,'/saveCourse',{nodeType:'learnAct',courseId:me.courseId.split('@')[0]+'_'+actionData.currTask.taskInfo.taskDefinKey,name:actionData.currTask.taskInfo.taskName,parentId:me.courseId.split('@')[0]+'_'+actionData.currSubTask.subId},function(){});
        }else{
            sendMessage('post',playerPort,'/saveCourse',{nodeType:'learnAtn',courseId:me.courseId.split('@')[0]+'_'+actionData.currTask.taskInfo.taskDefinKey,name:actionData.currTask.taskInfo.taskName,parentId:me.courseId.split('@')[0]},function(){});
        }
    },
    saveCurrAction : function(actionData,next){
        var me = this;
        me.saveCourseClass(actionData);
        me.saveCurrData(function(){
            me.processController.checkState(actionData,next);
        });
    },
    resetLastTasks : function(next){
        var me = this;
        //me.lastTasks = [me.fakeData,me.fakeData2];next();return;
        sendMessage('get',playerPort,'getLastTasks?courseId='+me.courseId,'',function(data){
            if(data){
                //兼容旧课程的旧资料链接问题
                data = data.replace(/ec_engine/, "yn-engine").replace(/\/NKTOForMyDemo\/MyNTKODemo\/MyFirstWordEditor\.jsp/, "/yn-engine/pageOffice/redirect.jsp");

                var arr = data.split('^^');
                arr.pop();
                me.lastTasks = arr;
                next();
            }else{
                next();
            }
        });
    },
    getCourseData : function(next) {
        var me = this;
        sendMessage('get',playerPort,'/getInstance?courseCompleteId='+me.courseId,'',function(resData){
            var lastIndex = 0;
            for (var i = 1; i < resData.length; i++) {
                if (resData[i].selectedTime - resData[lastIndex].selectedTime > 0) {
                    lastIndex = i;
                }
            }
            var data = me.courseData = resData[lastIndex];
            next(data);
        });
    },
    dealActionData : function(currActionData,next){
        var me = this;
        me.currActionData = currActionData;//this.fakeData;
        next();
    },
    init : function(){
    }
};

var ProcessController = function (database,view) {
    this.database = database;
    this.view = view;
    this.isOrg = '';
    this.userOnlineInfo = '';
    //this.courseSocket = io.connect( processEnginePort);
	this.courseSocket = null;
    this.processSocket = '';
    this.studySocketInited = false;

    this.init();
};
ProcessController.prototype = {
    checkIfComplete : function(next){
        var me = this;
        var taskInfo = me.database.currActionData.currTask.taskInfo.data;
        if(taskInfo.output.requirement || true){
            switch (taskInfo.toolType){
                case 'textArea':
                    me.database.findFile(me.database.courseId.split('@')[1],taskInfo.taskId,function(resData){
                        if (resData.length){
                            next(true);
                        }else{
                            next(false);
                        }
                    });
                    break;
                case 'choose':
                    sendMessage('get',examPort,'/exam/checkMyExamCompleted?id='+ me.database.currActionData.currTask.taskInfo.data.input.questionId+'&userID='+userData.id,'',function(resData){
                        if(resData){
                            if(resData.status){
                                if(resData.data == 1 || resData.data == '1'){
                                    sendMessage('get',examPort,'/exam/score?examID='+ me.database.currActionData.currTask.taskInfo.data.input.questionId+'&userID='+userData.id,'',function(data){
                                        if(data.status == '200'){
                                            me.database.saveOption({
                                                userId : userData.id,
                                                userName : userData.name,
                                                optDes : '完成试题',
                                                optResult : '试题得分:'+data.datas.score+'/'+data.datas.total,
                                                optType : '完成试题',
                                                courseId : me.database.courseId.split('@')[0],
                                                courseName : me.database.courseData.courseName,
                                                instanceId : me.database.courseId.split('@')[1],
                                                orgId : me.isOrg?me.database.courseData.lrnScnOrgId:'',
                                                taskId : me.database.currActionData.currSubTask?me.database.courseId.split('@')[0]+'_'+me.database.currActionData.currTask.taskInfo.taskDefinKey:'',
                                                taskName : me.database.currActionData.currSubTask?me.database.currActionData.currTask.taskInfo.taskName:'',
                                                subtaskId : me.database.currActionData.currSubTask?me.database.courseId.split('@')[0]+'_'+me.database.currActionData.currSubTask.subId:me.database.courseId.split('@')[0]+'_'+me.database.currActionData.currTask.taskInfo.taskDefinKey,
                                                subtaskName : me.database.currActionData.currSubTask?me.database.currActionData.currSubTask.subName:me.database.currActionData.currTask.taskInfo.taskName,
                                                link : ''
                                            });
                                            next(true);
                                            return;
                                        }else{
                                            next(true);
                                        }
                                    });
                                }
                            }
                        }
                        next(false);
                    });
                    break;
                case 'VM':next(true);
                    break;
                case 'comment':next(true);
                    break;
                default:next(true);return;
                    if(me.database.currActionData.currTask.taskInfo.data.input.errorMsg) return next(false);
                    $.ajax({
                        url: playerPort + '/checkPageOffice',
                        method: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify({fileId:me.database.currActionData.currTask.taskInfo.data.input.fileId,instanceId:me.database.courseId.split('@')[1],taskId:me.database.currActionData.currSubTask?me.database.courseId.split('@')[0]+'_'+me.database.currActionData.currTask.taskInfo.taskDefinKey:'',subtaskId:me.database.currActionData.currSubTask?'':me.database.courseId.split('@')[0]+me.database.currActionData.currTask.taskInfo.taskDefinKey})
                    }).done(function(data){
                        if(data){
                            me.database.saveOption({
                                userId : userData.id,
                                userName : userData.name,
                                optDes : '保存文件《'+ me.database.currActionData.currTask.taskInfo.data.output.name + '》',
                                optResult : '保存了文件《'+ me.database.currActionData.currTask.taskInfo.data.output.name + '》',
                                optType : '保存文件',
                                courseId : me.database.courseId.split('@')[0],
                                courseName : me.database.courseData.courseName,
                                instanceId : me.database.courseId.split('@')[1],
                                orgId : me.isOrg?me.database.courseData.lrnScnOrgId:'',
                                taskId : me.database.currActionData.currSubTask?me.database.courseId.split('@')[0]+'_'+me.database.currActionData.currTask.taskInfo.taskDefinKey:'',
                                taskName : me.database.currActionData.currSubTask?me.database.currActionData.currTask.taskInfo.taskName:'',
                                subtaskId : me.database.currActionData.currSubTask?me.database.courseId.split('@')[0]+'_'+me.database.currActionData.currSubTask.subId:me.database.courseId.split('@')[0]+'_'+me.database.currActionData.currTask.taskInfo.taskDefinKey,
                                subtaskName : me.database.currActionData.currSubTask?me.database.currActionData.currSubTask.subName:me.database.currActionData.currTask.taskInfo.taskName,
                                //link : 'pageoffice://|'+newProcessEnginePort+'MyNTKODemo/MyFirstWordEditor.jsp?path='+ecgeditorPort2 + escape('/load/loadPdfFile?source=pgofc&ownerId=system&path=/user_file/'+userData.name+'_sys_file/')+'&fileName='+me.database.currActionData.currTask.taskInfo.data.input.fileName+'&permission=r&userName='+userData.name
								link : 'pageoffice://|'+newProcessEnginePort+'pageOffice/editFile.jsp?filePath='+me.database.currActionData.currTask.taskInfo.data.input.filePath+'&fileName='+me.database.currActionData.currTask.taskInfo.data.input.fileName+'&permission=r&userName='+userData.name+'&userId='+userData.id
							});
                        }
                        next(data);
                    }).fail(function(){
                        console.log('checkPageOffice fail!');
                        next(false);
                    });
            }
        }else{
            next(true);
        }
    },
    studySocketInit : function(){
        var me = this;
        if(me.studySocketInited) return;
        me.processSocket = io.connect(studyPort);
        me.processSocket.on('connect', function () {
            me.processSocket.emit('socketType', {
                type : 'learning'
            });
            if(me.isOrg){
                me.userOnlineInfo = {
                    userId: userData.id,
                    userName: userData.name,
                    userAvatar: userData.name + '.jpg',
                    courseName: me.database.courseData.courseName,
                    teacherId: me.database.groupData.orgUserId,
                    courseId: me.database.courseId.split('@')[0],
                    instanceId: me.database.courseId,
                    orgId: me.database.courseData.lrnScnOrgId
                };
            }else{
                me.userOnlineInfo = {
                    userId: userData.id,
                    userName: userData.name,
                    userAvatar: userData.name + '.jpg',
                    courseName: me.database.courseData.courseName,
                    teacherId: me.database.courseData.teacherId,
                    courseId: me.database.courseId.split('@')[0],
                    instanceId: me.database.courseId
                };
            }
            me.processSocket.emit('studentOnline', me.userOnlineInfo);
        });
        setInterval(function () {
            me.database.onlineTime++;
            me.processSocket.emit('studentOnlineTimeChange', {
                onlineTime : me.database.onlineTime
            });
        }, 60000);
    },
    closeVM : function(next){
        var me = this;
        if(me.database.VMId){
            $.ajax({
                url: VMPort + "/XenServerVM-WebService/courseAPI",
                type: "post",
                dataType: "json",
                data: {command: "queryCourseUserVMS",userID: userData.id},
                success: function (strData) {
                    var have = false;
                    for(var i=0;i<strData.length;i++){
                        //这里要判断role，为1的uuid才应该记录下来，让学习者连接
                        if(strData[i].courseID.toString() === me.database.VMId){
                            have = true;
                            $.ajax({
                                url: VMPort + "/XenServerVM-WebService/courseAPI",
                                type: "post",
                                dataType: "json",
                                data: {command: "shutdownVM",userID:userData.id,vmuuid:strData[i].uuid,force:true},
                                success: function () {
                                    next();
                                }
                            });
                        }
                    }
                    if(!have){
                        next();
                    }
                }
            });
        }else{
            next();
        }
    },
    endCourse : function(){
        var me = this;
		me.closeCourseSocket(); 
		if (me.processSocket) {   
			me.processSocket.close();//调用后台afterConnectionClosed方法
			me.processSocket = null; 
		} 
        //me.courseSocket.close();
        //me.processSocket.close();
        me.database.saveOption({
            userId : userData.id,
            userName : userData.name,
            optDes : '结束课程《'+ me.database.courseData.courseName + '》',
            optResult : '结束了课程《'+ me.database.courseData.courseName + '》',
            optType : '结束课程',
            courseId : me.database.courseId.split('@')[0],
            courseName : me.database.courseData.courseName,
            instanceId : me.database.courseId.split('@')[1],
            orgId : me.isOrg?me.database.courseData.lrnScnOrgId:'',
            taskId : '',
            taskName : '',
            subtaskId : '',
            subtaskName : '',
            link : ''
        });
        var sendData = this.database.courseData;
        sendData.statement = 'off';
        sendData.completedTime = new Date().getTime();
        sendData.courseCompleteId = me.database.courseId;
        sendMessage('post',playerPort,'/updateInstance',sendData,function(){
            me.closeVM(function(){
                location.reload();
            });
        });
    },
    checkState : function(actionData,next){
        var me = this;
        if(actionData.errorMsg){
            me.endCourse();
        }else if(actionData.courseStatus != 'end'){
            next();
        }else{
            me.endCourse();
        }
    },
	getCourseDataFromEngine : function(sendData){
		var me = this;
		sendMessage('post', newProcessEnginePort, 'course/study',{studyStr : JSON.stringify(sendData)},function(courseData){
            var actionData = JSON.parse(courseData);
			
			if(actionData){
				if(actionData.courseStatus == 'end'){
					alert('恭喜，您的课程学习完了!');
					me.database.saveCurrData(function(){
						me.endCourse();
					});
				}else if(actionData.infoMsg){
					alert(actionData.infoMsg);
				}else if(actionData.errorMsg){
					alert(actionData.errorMsg);
					me.database.saveCurrData(function(){
						me.endCourse();
					});
				}else{
					sendTag = false;
					/*
					me.userOnlineInfo = {
						progress: actionData.currTask.taskInfo.taskName,
						courseName: me.database.courseData.courseName
					};
					me.processSocket.emit('studentProgress', me.userOnlineInfo);
					*/
					me.database.saveOption({
						userId : userData.id,
						userName : userData.name,
						optDes : '进入活动《'+ actionData.currTask.taskInfo.taskName + '》',
						optResult : '-',
						optType : '进入活动',
						courseId : me.database.courseId.split('@')[0],
						courseName : me.database.courseData.courseName,
						instanceId : me.database.courseId.split('@')[1],
						orgId : me.isOrg?me.database.courseData.lrnScnOrgId:'',
						taskId : actionData.currSubTask?me.database.courseId.split('@')[0]+'_'+actionData.currTask.taskInfo.taskDefinKey:'',
						taskName : actionData.currSubTask?actionData.currTask.taskInfo.taskName:'',
						subtaskId : actionData.currSubTask?me.database.courseId.split('@')[0]+'_'+actionData.currSubTask.subId:me.database.courseId.split('@')[0]+'_'+actionData.currTask.taskInfo.taskDefinKey,
						subtaskName : actionData.currSubTask?actionData.currSubTask.subName:actionData.currTask.taskInfo.taskName,
						link : ''
					});
					me.database.saveCurrAction(actionData,function(){
						me.database.dealActionData(actionData,function(){
							me.view.addSideBar();
						});
					});
				}
			}
        });
	},
    sendCourseSocket : function (outPut) {
        var me = this;
        var sendData;
        sendTag = true;
        setTimeout('if(sendTag){globalView.showNotification("正在获取下一个活动数据，请稍候~","info")}',5000);
        setTimeout('if(sendTag){globalView.showNotification("获取任务出了些问题，请刷新一下试试","error")}',30000);
        //me.view.showNotification('正在获取下一个活动数据，请稍候~','info');
        if(me.isOrg){
            sendData = {
                courseInstanceId : me.database.courseId,
                processDefinitionId : me.database.courseData.processDefinitionId,
                isSingle : 0,
                assignee : userData.id,
                taskId : me.database.currActionData?me.database.currActionData.currTask.taskInfo.taskId:'',
                output : outPut,
                isCooperation:true,
                courseOrgId:me.database.courseData.lrnScnOrgId,
                members:me.database.groupData.members,
                groupId:me.database.groupData.groupId,
                roleCid:me.database.groupData.roleCid,
                roleId:me.database.groupData.roleId,
                roleName:me.database.groupData.roleName,
                userName : userData.name
            };
            $(me.view.eles.submitWork).unbind('click');
			
			if (me.courseSocket && me.courseSocket.readyState == 1) {   
	            me.courseSocket.send(JSON.stringify(sendData));//调用后台handleTextMessage方法
	        } else {  
	            alert("你的课堂连接已断开!");  
	        }			
        }else{
            sendData = {
                courseInstanceId : me.database.courseId,
                processDefinitionId : me.database.courseData.processDefinitionId,
                isSingle : 1,
                assignee : userData.id,
                userName : userData.name,
                taskId : me.database.currActionData?me.database.currActionData.currTask.taskInfo.taskId:'',
                output : outPut
            };
            $(me.view.eles.submitWork).unbind('click');
			
			me.getCourseDataFromEngine(sendData);
			/*
			if (me.courseSocket && me.courseSocket.readyState == 1) {   
	            me.courseSocket.send(JSON.stringify(sendData));//调用后台handleTextMessage方法
	        } else {  
	            alert("你的课堂连接已断开!");  
	        } 
			*/
        }
    },
    submitCurAction : function(){
        var me = this;
        var outPut;
        if(me.database.currActionData){
            me.checkIfComplete(function(isComplete){
                if(isComplete){
                    me.database.saveOption({
                        userId : userData.id,
                        userName : userData.name,
                        optDes : '完成活动《'+ me.database.currActionData.currTask.taskInfo.taskName + '》',
                        optResult : '完成了活动《'+ me.database.currActionData.currTask.taskInfo.taskName + '》',
                        optType : '完成活动',
                        courseId : me.database.courseId.split('@')[0],
                        courseName : me.database.courseData.courseName,
                        instanceId : me.database.courseId.split('@')[1],
                        orgId : me.isOrg?me.database.courseData.lrnScnOrgId:'',
                        taskId : me.database.currActionData.currSubTask?me.database.courseId.split('@')[0]+'_'+me.database.currActionData.currTask.taskInfo.taskDefinKey:'',
                        taskName : me.database.currActionData.currSubTask?me.database.currActionData.currTask.taskInfo.taskName:'',
                        subtaskId : me.database.currActionData.currSubTask?me.database.courseId.split('@')[0]+'_'+me.database.currActionData.currSubTask.subId:me.database.courseId.split('@')[0]+'_'+me.database.currActionData.currTask.taskInfo.taskDefinKey,
                        subtaskName : me.database.currActionData.currSubTask?me.database.currActionData.currSubTask.subName:me.database.currActionData.currTask.taskInfo.taskName,
                        link : ''
                    });
                    switch (me.database.currActionData.currTask.taskInfo.data.output.type){
                        case 'file' :
                            outPut = {
                                type : 'file',
                                fileId : me.database.currActionData.currTask.taskInfo.data.input.fileId,
                                fileName : me.database.currActionData.currTask.taskInfo.data.input.fileName
                            };
                            break;
                        case 'string' :
                            outPut = {
                                type : 'string',
                                toUserId : 'testToUserName',
                                toUserName : 'testToUserName',
                                comment : 'testComment'
                            };
                            break;
                        default :
                            break;
                    }
                    me.sendCourseSocket(outPut);
                }else{
                    $.MsgBox.Alert('还有任务没完成','请完成任务!');
                }
            });
        }else{
            me.sendCourseSocket();
        }
    },
    initCoopSocket : function(next){
        var me = this;
        //var socketUser;
        //var socketRole;
        //var socketGroup;
        this.database.getGroupData(function(){
			me.courseSocket = new SockJS(processEnginePort+ "?userId="+userData.id + "&userName="+userData.name);
			me.courseSocket.onopen = function(evnt) {
				console.log("你已进入课堂!");
				//console.log(evnt);
				me.submitCurAction();
				next();
			};
			me.courseSocket.onmessage = function(evnt) {
				var actionData = JSON.parse(evnt.data);
				//console.log("收到服务器的消息:" + actionData);
				//console.log(evnt);
				if(actionData){
					if(actionData.courseStatus == 'end'){
						alert('恭喜，您的课程学习完了!');
						me.database.saveCurrData(function(){
							me.endCourse();
						});
					}else if(actionData.infoMsg){
						alert(actionData.infoMsg);
					}else if(actionData.errorMsg){
						alert(actionData.errorMsg);
						me.database.saveCurrData(function(){
							me.endCourse();
						});
					}else if(actionData.studyMsg){
						me.database.saveCurrData(function(){
                                me.database.currActionData = '';
                                alert(data.msg);
                        });
					}else if(actionData.taskMsg){
						var sendData = {
                            courseInstanceId : me.database.courseId,
                            processDefinitionId : me.database.courseData.processDefinitionId,
                            assignee : userData.id,
                            taskId : '',
                            isCooperation:true,
                            courseOrgId:me.database.courseData.lrnScnOrgId,
                            members:me.database.groupData.members,
                            groupId:me.database.groupData.groupId,
                            roleCid:me.database.groupData.roleCid,
                            roleId:me.database.groupData.roleId,
                            roleName:me.database.groupData.roleName,
                            userName : userData.name
                        };
						if (me.courseSocket && me.courseSocket.readyState == 1) {   
							me.courseSocket.send(JSON.stringify(sendData));//调用后台handleTextMessage方法
						} else {  
							alert("你的课堂连接已断开!");  
						}
					}else{
						sendTag = false;
						/*
						me.studySocketInit();
						me.studySocketInited = true;
						if(me.view.chatAble && !me.chatInited){
							me.view.initChatRoom();
						}
						me.userOnlineInfo = {
							progress: actionData.currTask.taskInfo.taskName,
							courseName: me.database.courseData.courseName
						};
						me.processSocket.emit('studentProgress', me.userOnlineInfo);
						*/
						me.database.saveOption({
							userId : userData.id,
							userName : userData.name,
							optDes : '进入活动《'+ actionData.currTask.taskInfo.taskName + '》',
							optResult : '-',
							optType : '进入活动',
							courseId : me.database.courseId.split('@')[0],
							courseName : me.database.courseData.courseName,
							instanceId : me.database.courseId.split('@')[1],
							orgId : me.isOrg?me.database.courseData.lrnScnOrgId:'',
							taskId : actionData.currSubTask?me.database.courseId.split('@')[0]+'_'+actionData.currTask.taskInfo.taskDefinKey:'',
							taskName : actionData.currSubTask?actionData.currTask.taskInfo.taskName:'',
							subtaskId : actionData.currSubTask?me.database.courseId.split('@')[0]+'_'+actionData.currSubTask.subId:me.database.courseId.split('@')[0]+'_'+actionData.currTask.taskInfo.taskDefinKey,
							subtaskName : actionData.currSubTask?actionData.currSubTask.subName:actionData.currTask.taskInfo.taskName,
							link : ''
						});
						me.database.saveCurrAction(actionData,function(){
							me.database.dealActionData(actionData,function(){
								me.view.addSideBar();
							});
						});
					}
				}
				
			};
			me.courseSocket.onerror = function(evnt) {
				console.log("进入课堂出错!");
				console.log(evnt);
			};
			me.courseSocket.onclose = function(evnt) {
				//alert(evnt.code + " : " + evnt.reason);
				if(evnt.code == 1000){
					console.log("你已主动退出课堂!");
					console.log(evnt);
				}
				if(evnt.code == 1002){
					console.log("无法进入课堂!");
					console.log(evnt);
				}
				if(evnt.code == 1006){
					console.log("课堂服务器连接中断!");
					console.log(evnt);
				}
			};
        });
    },
    initSoloSocket : function(next){
        var me = this;
		me.submitCurAction();
        next();
		
		/*
		me.studySocketInit();
		me.studySocketInited = true;
		if(me.view.chatAble && !me.chatInited){
			me.view.initChatRoom();
		}
		me.chatInited = true;
		*/
    },
	closeCourseSocket : function(){
		var me = this;
		
		if (me.courseSocket) {   
			me.courseSocket.close();//调用后台afterConnectionClosed方法
			me.courseSocket = null; 
		}
	},
    checkIfEnd : function(next){
        var me = this;
        if(me.database.courseData.statement == 'off'){
            $.MsgBox.Alert('课程结束','课程结束，将返回课程首页！',function(){
                window.location = playerPort + "/";
            });
        }else{
            next();
        }
    },
    init : function(){
        var me = this;
        me.database.getCourseData(function(courseData){
            me.checkIfEnd(function(){
                me.view.renderBaseBlock(function(){
                    me.isOrg = courseData.lrnScnOrgId?true:false;
                    if(me.isOrg){
                        me.view.resetSelf(function(){
                            me.database.resetLastTasks(function(){
                                me.view.initSideBar();
                                me.initCoopSocket(function(){});
                            });
                        });
                        
                    }else{
                        me.view.resetSelf(function(){
                            me.database.resetLastTasks(function(){
                                me.view.initSideBar();
                                me.initSoloSocket(function(){});
                            });
                        });
                    }

                });
            });
        });
    }
};

var View = function (courseId,viewMode) {
    this.viewMode = viewMode?true:false;
    this.checkMode = false;
    this.database = '';
    this.sideBarIsOpen = true;
    this.windowHeight = 900;
    this.windowWidth = 1500;
    this.changeWidth = 1450;
    this.eles = {};
    this.chatAble = true;
    this.render(courseId);
};
View.prototype = {
    initChatRoom : function(){
        var me = this;
        var chatSwitch = createEle('div');chatSwitch.className = '_player2_toolBtn';me.eles.toolsCon.appendChild(chatSwitch);me.eles.chatSwitch = chatSwitch;
        var chatSwitchI = createEle('i');chatSwitchI.title = '聊天窗口';chatSwitchI.innerHTML = '&#xe96c';chatSwitchI.className = 'imooc-icon';chatSwitch.appendChild(chatSwitchI);
        var chatRoomWindow = createEle('div');chatRoomWindow.className = '_player2_chatRoomWindow';$('._page_view').append(chatRoomWindow);
        var chatFrame;
        if(me.database.courseData.lrnScnOrgId){
            chatFrame = createEle('iframe');chatFrame.className = '_player_chatFrame';chatFrame.src = studyPort + '/communication/chat.html?userId='+userData.id+'&userName='+userData.name+'&socketPort='+studyPort.substring(7)+'&courseId='+me.database.courseData.lrnScnOrgId+'&courseName='+me.database.courseData.courseName+'&teacherId='+me.database.courseData.teacherId+'&teacherName='+me.database.courseData.teacherName;$(chatRoomWindow).append(chatFrame);
        }else{
            chatFrame = createEle('iframe');chatFrame.className = '_player_chatFrame';chatFrame.src = studyPort + '/communication/chat.html?userId='+userData.id+'&userName='+userData.name+'&socketPort='+studyPort.substring(7)+'&courseId='+me.database.courseId.split('@')[0]+'&courseName='+me.database.courseData.courseName+'&teacherId='+me.database.courseData.teacherId+'&teacherName='+me.database.courseData.teacherName;$(chatRoomWindow).append(chatFrame);
        }
        $(chatSwitch).click(function() {
            $(chatRoomWindow).data("kendoWindow").open();
        });
        function onClose() {}
        $(chatRoomWindow).kendoWindow({
            width: "800px",
            height: "600px",
            title: "聊天窗口",
            minWidth:"800px",
            minHeight:"600px",
            maxWidth:"800px",
            maxHeight:"600px",
            visible: false,
            resizeAble : false,
            actions: [
                "Close"
            ],
            resize:function(e){
            },
            close: onClose
        }).data("kendoWindow").center().close();
    },
    initEvaluation : function(){
        var me = this;
        var i;
        var evaluationSwitch = createEle('div');evaluationSwitch.className = '_player2_toolBtn';me.eles.toolsCon.appendChild(evaluationSwitch);me.eles.evaluationSwitch = evaluationSwitch;
        var evaluationSwitchI = createEle('i');evaluationSwitchI.title = '评价课程';evaluationSwitchI.className = 'glyphicon glyphicon-edit';evaluationSwitch.appendChild(evaluationSwitchI);
        var evaluationWindow = createEle('div');evaluationWindow.className = '_player2_evaluationWindow';$(me.eles.mainCon).append(evaluationWindow);
        if(me.database.courseData.isEvaluated){
            $(evaluationSwitch).click(function() {
                me.showNotification('您已经评价过该课程啦~','info');
            });
            return;
        }
        function onClose() {

        }
        $(evaluationSwitch).click(function() {
            $(evaluationWindow).data("kendoWindow").open();
        });
        $(evaluationWindow).kendoWindow({
            width: "500px",
            height: "400px",
            title: "评价课程",
            visible: true,
            resizable : false,
            actions: [
                "Close"
            ],
            animation : false,
            draggable : false,
            resize:function(e){
            },
            close: onClose
        }).data("kendoWindow").center().close();
        var evaluationHeader = createEle('div');evaluationHeader.innerHTML = '您的评价是对我们最大的支持！';evaluationHeader.className = '_player2_evaluationHeader';$(evaluationWindow).append(evaluationHeader);
        var courseGradeCon = createEle('div');courseGradeCon.className = '_player2_courseGradeCon';$(evaluationWindow).append(courseGradeCon);
        var courseGradeTitle = createEle('div');courseGradeTitle.innerHTML = '评分：';courseGradeTitle.className = '_player2_evaluationTitle';$(courseGradeCon).append(courseGradeTitle);
        var courseGradeContent = createEle('div');courseGradeContent.className = '_player2_evaluationContent';$(courseGradeCon).append(courseGradeContent);
        var courseCommentCon = createEle('div');courseCommentCon.className = '_player2_courseCommentCon';$(evaluationWindow).append(courseCommentCon);
        var courseCommentTitle = createEle('div');courseCommentTitle.innerHTML = '评价：';courseCommentTitle.className = '_player2_evaluationTitle';$(courseCommentCon).append(courseCommentTitle);
        var courseCommentContent = createEle('div');courseCommentContent.className = '_player2_evaluationContent';$(courseCommentCon).append(courseCommentContent);
        var courseCommentInput = createEle('textarea');$(courseCommentInput).attr('maxlength','200');courseCommentInput.placeholder = '您对本课程有什么想说的么？（200字以内）';courseCommentInput.className = '_player2_courseCommentInput';$(courseCommentContent).append(courseCommentInput);
        var evaluationSubmit = createEle('a');evaluationSubmit.innerHTML = '提交';evaluationSubmit.className = '_player2_evaluationSubmit btn btn-sm btn-primary pull-left';$(evaluationWindow).append(evaluationSubmit);
        for(i=0;i<5;i++){
            $(courseGradeContent).append('<div class="evaluationStars"><i class="glyphicon glyphicon-star"></i></div>')
        }
        $('.evaluationStars').each(function(index,star){
            $(star).hover(function(){
                courseGradeContent.value = index + 1;
                $('.evaluationStars').css({color:'#dfdfdf'});
                for(i=0;i<=index;i++){
                    $('.evaluationStars').eq(i).css({color:'red'});
                }
            });
        });
        $(evaluationSubmit).click(function(){
            $.MsgBox.Confirm('确认提交','确认要提交此评价吗？',function(){
                me.database.saveEvaluation(courseGradeContent.value,courseCommentInput.value,function(){
                    me.showNotification('评价课程成功~','info');
                    $(evaluationWindow).data("kendoWindow").close();
                    $(evaluationSwitch).unbind('click').click(function(){
                        me.showNotification('您已经评价过该课程啦~','info');
                    });
                });
            },function(){});
        });
    },
    showNotification : function(msg,type){
        var me = this;
        $('.k-widget.k-notification').remove();
        var staticNotification = $(me.eles.notification).kendoNotification({
            appendTo: "._player2_notificationCon",
            autoHideAfter : 3000
        }).data("kendoNotification");
        staticNotification.show(msg, type);
    },
    initForm : function(workData,content){
        var me = this;

        if(workData.errorMsg){
            alert(workData.errorMsg);
            return;
        }
        sendMessage('get',newProcessEnginePort,'form/getFormRun?cId='+workData.input.formId,'',function(data){
            $(content).append(data.formHtml);
            if(!me.checkMode && !me.viewMode){
                var saveBtn = createEle('button');saveBtn.innerHTML = '提交';saveBtn.className = 'btn btn-primary pull-left';content.appendChild(saveBtn);
                saveBtn.onclick =  function(){
                    submitMyForm(newProcessEnginePort,workData.input.formId,function(formId){
                        if(formId && formId != 'error'){
                            me.showNotification('保存文件成功~','success');
                        }
                    });
                };
            }
        });
    },
    initMindMap : function(workData,content){
        var me = this;

        var jm_open_mmp = function (content, data) {
            //add tool
            var toolBox = document.createElement('div');
            toolBox.setAttribute('style', 'position: fixed;z-index:1001');
            toolBox.innerHTML = '<style>ul.ec-jm-tool li{display: inline;  box-sizing: border-box;}ul.ec-jm-tool li a:hover{background-color:#1ABC9C;color:white}ul.ec-jm-tool li a{position: relative;float: left;padding: 6px 12px;margin-left: -1px;color: #337ab7;text-decoration: none;background-color: #fff;border: 1px solid #ddd;cursor: pointer;}</style>' +
            '<ul class="ec-jm-tool" style="display: inline-block;border-radius: 4px;  margin: 15px 15px;padding: 0;"> ' +
            '<li><span class="imooc-icon" style="cursor:default;position: relative;float: left;padding: 6px 12px;color: #959595;text-decoration: none;background-color: #F7F7F7;border: 1px solid #ddd;">&#xe995</span></li> ' +
            '<li title="插入下级主题[快捷键：Insert]"><a class="imooc-icon" onclick="jm_add_child_node()">&#xe9bc</a></li> ' +
            '<li title="插入同级主题[快捷键：Enter]"><a class="imooc-icon" onclick="jm_add_bro_node()">&#xea47</a></li> ' +
            '<li title="编辑内容[快捷键：F2或双击]"><a class="imooc-icon" onclick="jm_edit_node()">&#xe905</a></li> ' +
            '<li title="删除节点[快捷键：Delete]"><a class="imooc-icon" onclick="jm_remove_node()">&#xe9ac</a></li> ' +
            '<li title="放大画布"><a class="imooc-icon" onclick="jm_zoom_in()">&#xe987</a></li> ' +
            '<li title="缩小画布"><a class="imooc-icon" onclick="jm_zoom_out()">&#xe988</a></li> ' +
            '<li title="全部展开"><a class="imooc-icon" onclick="jm_expand_all()">&#xe9bf</a></li> ' +
            '<li title="全部收起"><a class="imooc-icon" onclick="jm_collapse_all()">&#xe9c0</a></li> ' +
            '</ul>';
            content.appendChild(toolBox);
            //create and open
            var mind = (data)?(data):null;
            var options = {
                container: content,
                editable: true,
                theme:'greensea'
            };
            var jm = new jsMind(options);
            jm.show(mind);
            return jm;
        };

        if(!me.checkMode && !me.viewMode){
            var jm;
            me.database.getPreFile(workData.input.filePath,function(preText){
                jm = jm_open_mmp(content,JSON.parse(preText));
                var saveBtn = createEle('button');saveBtn.innerHTML = '保存';saveBtn.className = 'btn btn-primary pull-left';content.appendChild(saveBtn);
                saveBtn.onclick = function(){
                    me.database.findFile(me.database.courseId.split('@')[1],workData.taskId,function(resData){
                        if(workData.input.errorMsg){
                            alert(workData.input.errorMsg);
                        }else{
                            me.database.saveOption({
                                userId : userData.id,
                                userName : userData.name,
                                optDes : '保存思维导图《'+ workData.output.name + '》',
                                optResult : '保存了思维导图《'+ workData.output.name + '》',
                                optType : '保存思维导图',
                                courseId : me.database.courseId.split('@')[0],
                                courseName : me.database.courseData.courseName,
                                instanceId : me.database.courseId.split('@')[1],
                                orgId : me.processController.isOrg?me.database.courseData.lrnScnOrgId:'',
                                taskId : me.database.currActionData.currSubTask?me.database.courseId.split('@')[0]+'_'+me.database.currActionData.currTask.taskInfo.taskDefinKey:'',
                                taskName : me.database.currActionData.currSubTask?me.database.currActionData.currTask.taskInfo.taskName:'',
                                subtaskId : me.database.currActionData.currSubTask?me.database.courseId.split('@')[0]+'_'+me.database.currActionData.currSubTask.subId:me.database.courseId.split('@')[0]+'_'+me.database.currActionData.currTask.taskInfo.taskDefinKey,
                                subtaskName : me.database.currActionData.currSubTask?me.database.currActionData.currSubTask.subName:me.database.currActionData.currTask.taskInfo.taskName,
                                link : ''
                            });
                            //me.showNotification('正在保存思维导图，请稍候~','info');
                            me.database.saveTxtFile(resData.length?resData[0].fileId:workData.input.filePath.split('/')[workData.input.filePath.split('/').length-1].split('.')[0],JSON.stringify(jm.get_data('node_array')),workData);
                        }
                    });
                };
            });

        }else{
            me.database.findFile(me.database.courseId.split('@')[1],workData.taskId,function(resData){
                if(workData.input.errorMsg){
                    alert(workData.input.errorMsg);
                }else{
                    me.database.getTxtFile(workData.taskId,function(myText){
                        var jm = jm_open_mmp(content,JSON.parse(myText));
                    });
                }
            });
        }
    },
    initPageOffice : function(workData,content,type){
        var me = this;
        var pageOfficeBtn;
        if(!me.checkMode && !me.viewMode){
            pageOfficeBtn = createEle('a');pageOfficeBtn.innerHTML = '编辑文件';
            $(pageOfficeBtn).click(function(){
                if(workData.input.errorMsg){
                    alert(workData.input.errorMsg);
                }else{
                    var permission = 'rw';
                    console.log('pageoffice://|'+newProcessEnginePort+'pageOffice/editFile.jsp?filePath='+workData.input.filePath+'&fileName='+workData.input.fileName+'&permission='+permission+'&userName='+userData.name+'&userId='+userData.id)
                    window.location.href = 'pageoffice://|'+newProcessEnginePort+'pageOffice/editFile.jsp?filePath='+workData.input.filePath+'&fileName='+workData.input.fileName+'&permission='+permission+'&userName='+userData.name+'&userId='+userData.id;
                }
            });
            $(content).append(pageOfficeBtn);
        }else{
            pageOfficeBtn = createEle('a');pageOfficeBtn.innerHTML = '查看文件';
            $(pageOfficeBtn).click(function(){
                if(workData.input.errorMsg){
                    alert(workData.input.errorMsg);
                }else{
                    var permission = 'r';
                    console.log('pageoffice://|'+newProcessEnginePort+'pageOffice/editFile.jsp?filePath='+workData.input.filePath+'&fileName='+workData.input.fileName+'&permission='+permission+'&userName='+userData.name+'&userId='+userData.id);
                    window.location.href = 'pageoffice://|'+newProcessEnginePort+'pageOffice/editFile.jsp?filePath='+workData.input.filePath+'&fileName='+workData.input.fileName+'&permission='+permission+'&userName='+userData.name+'&userId='+userData.id;
                }
            });
            $(content).append(pageOfficeBtn);
        }
    },
    initComment : function(workData,content){
        var me = this;
    },
    initLinkOnly : function(workData,content){
        var me = this;
        var linkBtn;
        linkBtn = createEle('a');
        linkBtn.target='_blank';
        console.log(3, workData.input)

        linkBtn.href = decodeURIComponent(workData.input.remoteLabInfo.url);
        linkBtn.innerHTML = workData.input.remoteLabInfo.name;
        $(content).append(linkBtn);
    },
    openVM : function(self) {
        var me = this;
        $(me.eles.VMRoomWindow).children('.p_VMCon').empty().append('<div><button id="ctrlAltDelete">Ctrl-Alt-Delete</button>&nbsp;<button id="share">分享</button>&nbsp;<button id="halt">重启</button></div>'+
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
            };
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
        $(share).css({display:'none'});
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
        };
        $(halt).css({display:'none'});
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
                    if(me.database.VMId){
                        $.cookie(me.database.VMId, '', { expires: -1 }); // 删除 cookie
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
        });
    },
    createVM : function(){
        var me = this;
        $('._player_vm_create').unbind('click').html('正在连接远程电脑...');
        if( me.database.VMId === ''){
            $('._player_vm_create').html('远程电脑设置有误');
        }
        else{
            checkLog(function(){
                $.ajax({
                    url: VMPort + "/XenServerVM-WebService/courseAPI",
                    type: "post",
                    dataType: "json",
                    data: {command: "startCourse", userID:  userData.id, courseID: me.database.VMId, groupID: -1},
                    success: function (strData) {
                        // alert(strData);//开启课程任务的taskid
                        $.cookie(me.database.VMId, strData);//key:value|课程id：创建课程的任务id
                        me.getProgess(strData);
                    }
                });
            });
        }
    },
    initVM : function(workData,content){
        var me = this;
        me.database.VMId = workData.input.VMId;
            $(content).append('<p style="color :red;">请点击右边"<span class="imooc-icon">&#xe956<span>"按钮打开远程电脑</p>');
        if(!($('._player2_VMSwitch').length)){
            var VMSwitch = createEle('div');VMSwitch.className = '_player2_toolBtn _player2_VMSwitch';me.eles.toolsCon.appendChild(VMSwitch);me.eles.VMSwitch = VMSwitch;
            var VMSwitchI = createEle('div');VMSwitchI.title = '远程电脑';VMSwitchI.className = 'imooc-icon';VMSwitchI.innerHTML = '&#xe956';VMSwitch.appendChild(VMSwitchI);
            var VMRoomWindow = createEle('div');VMRoomWindow.className = '_player2_VMRoomWindow';$('._page_view').append(VMRoomWindow);
            var VMCon = createEle('div');$(VMCon).css({width:'100%',height:705,background:'#dfdfdf',position:'relative'});VMCon.className = "p_VMCon";VMRoomWindow.appendChild(VMCon);
            var createVM = createEle('div');
            createVM.className = '_player_vm_create';
            $(createVM).css({padding:0,display:'block',width:'60%',height:'100px',fontSize:'30px',textAlign:'center',cursor:'pointer',lineHeight:'100px',border:0,color:'#fff',position:'absolute',left:'50%',marginLeft:'-30%',top:'50%',borderRadius:'20px',marginTop:-50,background:'#7f7f7f'});VMCon.appendChild(createVM);
            me.eles.VMRoomWindow = VMRoomWindow;
            $(VMSwitch).click(function() {
                $(VMRoomWindow).data("kendoWindow").open();

            });
            function onClose() {}
            $(VMRoomWindow).kendoWindow({
                width: "1024px",
                height: "815px",
                title: "远程电脑",
                minWidth:"1024px",
                minHeight:"815px",
                visible: false,
                actions: [
                    "Close"
                ],
                resize:function(e){
                },
                close: onClose
            }).data("kendoWindow").center().close();
            me.eles.VMCon = VMCon;
            $.ajax({
                url: VMPort + "/XenServerVM-WebService/courseAPI",
                type: "post",
                dataType: "json",
                data: {command: "queryCourseUserVMS",userID: userData.id},
                success: function (strData) {
                    if(me.database.VMId && $.cookie(me.database.VMId)){//这里的VMId指的是课程id，实际的创建虚拟机taskid是$.cookie(me.player.VMId)
                        me.getProgess($.cookie(me.database.VMId));
                    }else{
                        createVM.innerHTML = '点击连接远程电脑';
                        $(createVM).click(function(){
                            me.createVM();
                        });
                    }
                    var length = strData.length;
                    for(var i=0;i<length;i++){
                        //这里要判断role，为1的uuid才应该记录下来，让学习者连接
                        if(strData[i].courseID.toString() === workData.input.VMId){//me.work.input.VMId
                            if(strData[i].role === 1){
                                me.database.VMId = workData.input.VMId;
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
    },
    initChoose : function(workData,content){
        var me = this;
        var choose;
        if(!me.checkMode && !me.viewMode){
            choose = createEle('iframe');choose.src = examPort + '/exam/myExam?examID='+workData.input.questionId;$(choose).css({width:'100%',height:650,scrolling:'no',border:0});$(content).append(choose);
        }
        else{
            choose = createEle('iframe');choose.src = examPort + '/exam/viewmyExam?examID='+workData.input.questionId;$(choose).css({width:'100%',height:650,scrolling:'no',border:0});$(content).append(choose);
        }
    },
    initTextArea : function(workData,content){
        var me = this;
        var textArea = createEle('div');textArea.id = 'textArea';
        content.appendChild(textArea);
        initEditor('#textArea',{width:'100%',height:me.windowHeight - 265,lang:'zh-CN'});
        if(!me.checkMode && !me.viewMode){
            var saveBtn = createEle('button');saveBtn.innerHTML = '保存';saveBtn.className = 'btn btn-primary pull-left';content.appendChild(saveBtn);
            saveBtn.onclick = function(){
                me.database.findFile(me.database.courseId.split('@')[1],workData.taskId,function(resData){
                    if(workData.input.errorMsg){
                        alert(workData.input.errorMsg);
                    }else{
                        me.database.saveOption({
                            userId : userData.id,
                            userName : userData.name,
                            optDes : '保存文件《'+ workData.output.name + '》',
                            optResult : '保存了文件《'+ workData.output.name + '》',
                            optType : '保存文件',
                            courseId : me.database.courseId.split('@')[0],
                            courseName : me.database.courseData.courseName,
                            instanceId : me.database.courseId.split('@')[1],
                            orgId : me.processController.isOrg?me.database.courseData.lrnScnOrgId:'',
                            taskId : me.database.currActionData.currSubTask?me.database.courseId.split('@')[0]+'_'+me.database.currActionData.currTask.taskInfo.taskDefinKey:'',
                            taskName : me.database.currActionData.currSubTask?me.database.currActionData.currTask.taskInfo.taskName:'',
                            subtaskId : me.database.currActionData.currSubTask?me.database.courseId.split('@')[0]+'_'+me.database.currActionData.currSubTask.subId:me.database.courseId.split('@')[0]+'_'+me.database.currActionData.currTask.taskInfo.taskDefinKey,
                            subtaskName : me.database.currActionData.currSubTask?me.database.currActionData.currSubTask.subName:me.database.currActionData.currTask.taskInfo.taskName,
                            link : 'http://' + location.hostname + playerPort + '/viewTxt/' + workData.input.filePath.split('/')[workData.input.filePath.split('/').length-1].split('.')[0] + '/' + userData.id
                        });
                        //me.showNotification('正在保存文件，请稍候~','info');
                        me.database.saveTxtFile(resData.length?resData[0].fileId:workData.input.filePath.split('/')[workData.input.filePath.split('/').length-1].split('.')[0],$('#textArea').summernote('code'),workData);
                    }
                });
            };
        }
		if(workData.input.errorMsg){
			$('#textArea').summernote('code', workData.input.errorMsg);
		}else{
			me.database.getPreFile(workData.input.filePath,function(preText){
				$('#textArea').summernote('code',preText);
			});
		}
        
       /* var myTextBtn = createEle('a');myTextBtn.innerHTML = '查看保存内容';myTextBtn.className = 'btn btn-defult pull-left';myTextBtn.onclick = function(){
            me.database.getTxtFile(workData.taskId,function(myText){
                $('#textArea').summernote('code',myText);
            });
        };
        //$(myTextBtn).hide();
        content.appendChild(myTextBtn);
        if(!workData.input.errorMsg){
            if(workData.input.filePath.substr(0, 3) != '<!D'){
                var preTextBtn = createEle('a');preTextBtn.innerHTML = '查看预设内容';preTextBtn.className = 'btn btn-defult pull-left';preTextBtn.onclick = function(){
                    me.database.getPreFile(workData.input.filePath,function(preText){
                        $('#textArea').summernote('code',preText);
                    });
                };
                content.appendChild(preTextBtn);
            }
        }
        if(me.checkMode || me.viewMode){
            $(myTextBtn).click();
        }
        else{
            if(!workData.input.errorMsg){
                if(workData.input.filePath.substr(0, 3) != '<!D') $(preTextBtn).click().hide();
            }
        }*/
    },
    addMainContent : function(data){
        var me = this;
        var workBench = new TabPage([data.taskInfo.data.taskName],me.eles.workBenchCon);
        switch (data.taskInfo.data.toolType){
            case 'textArea':
                me.initTextArea(data.taskInfo.data,workBench.bodys[0]);
                break;
            case 'choose':
                me.initChoose(data.taskInfo.data,workBench.bodys[0]);
                break;
            case 'VM':
                me.initVM(data.taskInfo.data,workBench.bodys[0]);
                break;
            case 'comment':
                me.initComment(data.taskInfo.data,workBench.bodys[0]);
                break;
            case 'mindMap':
                me.initMindMap(data.taskInfo.data,workBench.bodys[0]);
                break;
            case 'form':
                me.initForm(data.taskInfo.data,workBench.bodys[0]);
                break;
            case 'dynamicForm':
                me.initForm(data.taskInfo.data,workBench.bodys[0]);
                break;
            case 'remote':
                console.log(1, data.taskInfo.data)
                me.initLinkOnly(data.taskInfo.data,workBench.bodys[0]);
                break;
            default:
                me.initPageOffice(data.taskInfo.data,workBench.bodys[0],data.taskInfo.data.toolType);
        }
    },
    addDescription : function(data){
        var me = this;
        $(me.eles.basicInfoCon).append('<h4 style="overflow:hidden;white-space: nowrap;text-overflow:ellipsis;" title="'+me.database.courseData.courseName+'-'+data.taskInfo.taskName+'">'+me.database.courseData.courseName+'-'+data.taskInfo.taskName+'</h4>');
        data.taskInfo.data.taskDescription = data.taskInfo.data.taskDescription.replace(/authoring.xuezuowang.com\//g, filePort.substr(7)).replace(/newengine3w.xuezuowang.com/g, newProcessEnginePort.substr(7, newProcessEnginePort.length - 18)); 
	var descriptionTitle = createEle('h4');descriptionTitle.innerHTML = '任务介绍';me.eles.basicInfoCon.appendChild(descriptionTitle);
        var descriptionContent = createEle('p');descriptionContent.innerHTML = data.taskInfo.data.taskDescription;me.eles.basicInfoCon.appendChild(descriptionContent);
    },
    addSubMainContent : function(data){
        var me = this;
        var uls=[], leftPageArr = [],leftPageEles = [];
        if(JSON.parse(data.knowledge) && JSON.parse(data.knowledge) != 'undefined' && JSON.parse(data.knowledge)[0]){
            leftPageArr.push('相关知识');
            uls = [];
            $(JSON.parse(data.knowledge)).each(function(index,know){
                var ul = createEle('ul');ul.className = '_player_meta_ul';ul.innerHTML = know.topic;
                $(know.link).each(function(i,link){
                    var li = createEle('li');li.title = li.innerHTML = link.name;li.className = '_player_meta_li';ul.appendChild(li);
                    li.onclick = function(){
                        if(!me.viewMode){
                            me.database.saveOption({
                                userId : userData.id,
                                userName : userData.name,
                                optDes : '查看资料《'+ link.name + '》',
                                optResult : '-',
                                optType : '查看资料',
                                courseId : me.database.courseId.split('@')[0],
                                courseName : me.database.courseData.courseName,
                                instanceId : me.database.courseId.split('@')[1],
                                orgId : me.processController.isOrg?me.database.courseData.lrnScnOrgId:'',
                                subtaskId : me.database.courseId.split('@')[0]+'_'+data.subId,
                                subtaskName : data.subName,
                                taskId : '',
                                taskName : '',
                                link : ''
                            });
                        }
                        new ShowMeta(link.fileType,link.id,link.ownerId,link.filePath,me.eles.workBenchCon);
                    };
                });
                uls.push(ul);
            });
            leftPageEles.push(uls);
        }
        if(JSON.parse(data.skill) && JSON.parse(data.skill) != 'undefined' && JSON.parse(data.skill)[0]){
            leftPageArr.push('相关技能');
            uls = [];
            $(JSON.parse(data.skill)).each(function(index,skill){
                var ul = createEle('ul');ul.className = '_player_meta_ul';ul.innerHTML = skill.topic;
                $(skill.link).each(function(index,link){
                    var li = createEle('li');li.title = li.innerHTML = link.name;li.className = '_player_meta_li';ul.appendChild(li);
                    li.onclick = function(){
                        if(!me.viewMode){
                            me.database.saveOption({
                                userId : userData.id,
                                userName : userData.name,
                                optDes : '查看资料《'+ link.name + '》',
                                optResult : '-',
                                optType : '查看资料',
                                courseId : me.database.courseId.split('@')[0],
                                courseName : me.database.courseData.courseName,
                                instanceId : me.database.courseId.split('@')[1],
                                orgId : me.processController.isOrg?me.database.courseData.lrnScnOrgId:'',
                                subtaskId : me.database.courseId.split('@')[0]+'_'+data.subId,
                                subtaskName : data.subName,
                                taskId : '',
                                taskName : '',
                                link : ''
                            });
                        }
                        new ShowMeta(link.fileType,link.id,link.ownerId,link.filePath,me.eles.workBenchCon);
                    };
                });
                uls.push(ul);
            });
            leftPageEles.push(uls);
        }
        if(data.situation  && data.situation != 'undefined'){
            leftPageArr.push('学习情境');
        }
        if(leftPageArr.length){
            var Tabs = new TabPage(leftPageArr,me.eles.workBenchCon);
            $(Tabs.bodys).each(function(index,body){
                $(leftPageEles[index]).each(function(i,ele){
                    $(body).append(ele);
                });
            });
        }
    },
    addSubDescription : function(data){
        var me = this;
        $(me.eles.basicInfoCon).append('<h4 style="overflow:hidden;white-space: nowrap;text-overflow:ellipsis;" title="'+me.database.courseData.courseName+'-'+data.subName+'">'+me.database.courseData.courseName+'-'+data.subName+'</h4>');
        var basicInfo = JSON.parse(data.basicInfo);
        if(basicInfo.courseHour && basicInfo.courseHour != 'undefined'){
            var courseHour = createEle('p');courseHour.innerHTML = '课时数：' + data.basicInfo.courseHour.replace(/<[^>]+>/g,"");
            me.eles.basicInfoCon.appendChild(courseHour);
        }
        $(me.database.basicInfo).each(function(i,info){
            if(basicInfo[info.value] && basicInfo[info.value] != 'undefined'){
                var con = createEle('div');
                var head = createEle('h5');head.innerHTML = info.name;con.appendChild(head);
                var body = createEle('p');body.innerHTML = basicInfo[info.value].replace(/<[^>]+>/g,"");con.appendChild(body);
                me.eles.basicInfoCon.appendChild(con);
            }
        });
    },
    lastActionView : function(actionData,viewType,subTask){
        var me = this;
        $('._player2_submitWork').hide();
        switch (viewType){
            case 'subAction':
                if(!me.viewMode) {
                    me.database.saveOption({
                        userId: userData.id,
                        userName: userData.name,
                        optTime: new Date().getTime(),
                        optDes: '查看活动《' + actionData.subName + '》',
                        optResult: '-',
                        optType: '查看活动',
                        courseId: me.database.courseId.split('@')[0],
                        courseName: me.database.courseData.courseName,
                        instanceId: me.database.courseId.split('@')[1],
                        orgId: me.processController.isOrg ? me.database.courseData.lrnScnOrgId : '',
                        subtaskId: me.database.courseId.split('@')[0]+'_'+actionData.subId,
                        subtaskName: actionData.subName,
                        taskId: '',
                        taskName: '',
                        link : ''
                    });
                }
                me.addSubDescription(actionData);
                me.addSubMainContent(actionData);
                break;
            case 'action':
                if(!me.viewMode){
                    me.database.saveOption({
                        userId : userData.id,
                        userName : userData.name,
                        optDes : '查看活动《'+ actionData.taskInfo.taskName + '》',
                        optResult : '-',
                        optType : '查看活动',
                        courseId : me.database.courseId.split('@')[0],
                        courseName : me.database.courseData.courseName,
                        instanceId : me.database.courseId.split('@')[1],
                        orgId : me.processController.isOrg?me.database.courseData.lrnScnOrgId:'',
                        taskId : subTask?me.database.courseId.split('@')[0]+'_'+actionData.taskInfo.taskDefinKey:'',
                        taskName : subTask?actionData.taskInfo.taskName:'',
                        subtaskId : subTask?me.database.courseId.split('@')[0]+'_'+subTask.subId:me.database.courseId.split('@')[0]+'_'+actionData.taskInfo.taskDefinKey,
                        subtaskName : subTask?subTask.subName:actionData.taskInfo.taskName,
                        link : ''
                    });
                }
                me.addDescription(actionData);
                me.addMainContent(actionData);
                break;
            default:
                console.log('actionView err!');
        }
    },
    currActionView : function(actionData,viewType){
        var me = this;
        $('._player2_submitWork').show();
        switch (viewType){
            case 'subAction':
                me.addSubDescription(actionData);
                me.addSubMainContent(actionData);
                break;
            case 'action':
                me.addDescription(actionData);
                me.addMainContent(actionData);
                break;
            default:
                console.log('actionView err!');
        }
    },
    addSideBar : function(){
        var me = this;
        var lastTask;
        lastTask = me.database.lastTasks[me.database.lastTasks.length - 1];
        if(lastTask){
            if(lastTask.currSubTask){
                $('._player2_TasklistCurr').unbind('click').click(function(){
                    if($(this).hasClass('_player2_activeAction'))return;
                    $('._player2_activeAction').removeClass('_player2_activeAction');
                    $(this).addClass('_player2_activeAction');
                    me.checkMode = true;
                    $(me.eles.basicInfoCon).empty();
                    $(me.eles.workBenchCon).empty();
                    me.lastActionView(lastTask.currTask,'action');
                });
                $('._player2_TasklistCurr').removeClass('_player2_TasklistCurr').addClass('_player2_TasklistLast');
                $('.glyphicon-play').removeClass('glyphicon-play').addClass('glyphicon-stop');
                $('._player2_studyNowBox').remove();
            }else{
                $('._player2_subTasklistCurr').unbind('click').click(function(){
                    if($(this).hasClass('_player2_activeAction'))return;
                    $('._player2_activeAction').removeClass('_player2_activeAction');
                    $(this).addClass('_player2_activeAction');
                    me.checkMode = true;
                    $(me.eles.basicInfoCon).empty();
                    $(me.eles.workBenchCon).empty();
                    me.lastActionView(lastTask.currTask,'action');
                });
                $('._player2_subTasklistCurr').removeClass('_player2_subTasklistCurr').addClass('_player2_subTasklistLast');
                $('._player2_studyNowBox').remove();
            }
        }
        if(!me.viewMode && me.database.currActionData){
            var currTaskCon,currTaskSpan,studyNowBox;
            if(me.database.currActionData.currSubTask){
                if(!me.database.isSubTaskExist(me.database.currActionData.currSubTask.subId)){//var index = me.database.subTasks.length;
                    me.database.subTasks.push(me.database.currActionData.currSubTask);
                    var lastSubTaskCon = createEle('div');lastSubTaskCon.className = '_player2_subTasklistCurr';me.eles.sideBarCon.appendChild(lastSubTaskCon);me.eles.sideBarEles.push(lastSubTaskCon);
                    var lastSubTaskSpan = createEle('span');lastSubTaskSpan.title = lastSubTaskSpan.innerHTML = me.database.currActionData.currSubTask.subName.replace(/<[^>]+>/g,"");lastSubTaskCon.appendChild(lastSubTaskSpan);
                    $(lastSubTaskCon).click(function(){
                        if($(this).hasClass('_player2_activeAction'))return;
                        $('._player2_activeAction').removeClass('_player2_activeAction');
                        $(this).addClass('_player2_activeAction');
                        $(me.eles.basicInfoCon).empty();
                        $(me.eles.workBenchCon).empty();
                        me.lastActionView(me.database.currActionData.currSubTask,'subAction','');
                    });
                }
                currTaskCon = createEle('div');currTaskCon.className = '_player2_TasklistCurr';me.eles.sideBarCon.appendChild(currTaskCon);me.eles.sideBarEles.push(currTaskCon);
                var currTaskI = createEle('i');currTaskI.className = 'glyphicon glyphicon glyphicon-play';currTaskCon.appendChild(currTaskI);
                currTaskSpan = createEle('span');currTaskSpan.title = currTaskSpan.innerHTML = me.database.currActionData.currTask.taskInfo.taskName.replace(/<[^>]+>/g,"");currTaskCon.appendChild(currTaskSpan);
                studyNowBox = createEle('div');studyNowBox.innerHTML = '正在学习';studyNowBox.className = '_player2_studyNowBox';currTaskCon.appendChild(studyNowBox);
                $(currTaskCon).click(function(){
                    if($(this).hasClass('_player2_activeAction'))return;
                    $('._player2_activeAction').removeClass('_player2_activeAction');
                    $(this).addClass('_player2_activeAction');
                    me.checkMode = false;
                    $(me.eles.basicInfoCon).empty();
                    $(me.eles.workBenchCon).empty();
                    me.currActionView(me.database.currActionData.currTask,'action');
                });
            }else{
                currTaskCon = createEle('div');currTaskCon.className = '_player2_subTasklistCurr';me.eles.sideBarCon.appendChild(currTaskCon);me.eles.sideBarEles.push(currTaskCon);
                currTaskSpan = createEle('span');currTaskSpan.title = currTaskSpan.innerHTML = me.database.currActionData.currTask.taskInfo.taskName.replace(/<[^>]+>/g,"");currTaskCon.appendChild(currTaskSpan);
                studyNowBox = createEle('div');studyNowBox.innerHTML = '正在学习';studyNowBox.className = '_player2_studyNowBox';currTaskCon.appendChild(studyNowBox);
                $(currTaskCon).click(function(){
                    if($(this).hasClass('_player2_activeAction'))return;
                    $('._player2_activeAction').removeClass('_player2_activeAction');
                    $(this).addClass('_player2_activeAction');
                    me.checkMode = false;
                    $(me.eles.basicInfoCon).empty();
                    $(me.eles.workBenchCon).empty();
                    me.currActionView(me.database.currActionData.currTask,'action');
                });
            }
            if(!me.viewMode){
                $(currTaskCon).click();
            }
            $(me.eles.submitWork).click(function(){
                me.processController.submitCurAction();
            });
        }
    },
    initSideBar : function(){
        var me = this;
        var sideBarCourseName = createEle('div');sideBarCourseName.className = '_player2_sideBarCourseName';sideBarCourseName.innerHTML = sideBarCourseName.title = me.database.courseData.courseName;me.eles.sideBarCon.appendChild(sideBarCourseName);me.eles.sideBarEles.push(sideBarCourseName);
        $(me.database.lastTasks).each(function(i,taskInfoJSON){
            var taskInfo = JSON.parse(taskInfoJSON);
            var lastTaskCon,lastTaskSpan;
            if(taskInfo.currSubTask){
                if(!me.database.isSubTaskExist(taskInfo.currSubTask.subId)){
                    me.database.subTasks.push(taskInfo.currSubTask);
                    var lastSubTaskCon = createEle('div');lastSubTaskCon.className = '_player2_subTasklistLast';me.eles.sideBarCon.appendChild(lastSubTaskCon);me.eles.sideBarEles.push(lastSubTaskCon);
                    var lastSubTaskSpan = createEle('span');lastSubTaskSpan.title = lastSubTaskSpan.innerHTML = taskInfo.currSubTask.subName.replace(/<[^>]+>/g,"");lastSubTaskCon.appendChild(lastSubTaskSpan);
                    $(lastSubTaskCon).click(function(){
                        if($(this).hasClass('_player2_activeAction'))return;
                        $('._player2_activeAction').removeClass('_player2_activeAction');
                        $(this).addClass('_player2_activeAction');
                        $(me.eles.basicInfoCon).empty();
                        $(me.eles.workBenchCon).empty();
                        me.lastActionView(taskInfo.currSubTask,'subAction','');
                    });
                }
                lastTaskCon = createEle('div');lastTaskCon.className = '_player2_TasklistLast';me.eles.sideBarCon.appendChild(lastTaskCon);me.eles.sideBarEles.push(lastTaskCon);
                var lastTaskI = createEle('i');lastTaskI.className = 'glyphicon glyphicon-stop';lastTaskCon.appendChild(lastTaskI);
                lastTaskSpan = createEle('span');lastTaskSpan.title = lastTaskSpan.innerHTML = taskInfo.currTask.taskInfo.taskName.replace(/<[^>]+>/g,"");lastTaskCon.appendChild(lastTaskSpan);
                $(lastTaskCon).click(function(){
                    if($(this).hasClass('_player2_activeAction'))return;
                    $('._player2_activeAction').removeClass('_player2_activeAction');
                    $(this).addClass('_player2_activeAction');
                    me.checkMode = true;
                    $(me.eles.basicInfoCon).empty();
                    $(me.eles.workBenchCon).empty();
                    me.lastActionView(taskInfo.currTask,'action',taskInfo.currSubTask);
                });
            }else{
                lastTaskCon = createEle('div');lastTaskCon.className = '_player2_subTasklistLast';me.eles.sideBarCon.appendChild(lastTaskCon);me.eles.sideBarEles.push(lastTaskCon);
                lastTaskSpan = createEle('span');lastTaskSpan.title = lastTaskSpan.innerHTML = taskInfo.currTask.taskInfo.taskName.replace(/<[^>]+>/g,"");lastTaskCon.appendChild(lastTaskSpan);
                $(lastTaskCon).click(function(){
                    if($(this).hasClass('_player2_activeAction'))return;
                    $('._player2_activeAction').removeClass('_player2_activeAction');
                    $(this).addClass('_player2_activeAction');
                    me.checkMode = true;
                    $(me.eles.basicInfoCon).empty();
                    $(me.eles.workBenchCon).empty();
                    me.lastActionView(taskInfo.currTask,'action');
                });
            }
            if(i == (me.database.lastTasks.length - 1)){
                $(lastTaskCon).click();
            }
        });
    },
    renderBaseBlock : function(next){
        var me = this;
        var mainCon = createEle('div');mainCon.className = "_player2_mainCon";$('._page_view').append(mainCon);me.eles.mainCon = mainCon;
        var basicInfoCon = createEle('div');$(basicInfoCon).css({height:me.windowHeight});basicInfoCon.className = '_player2_basicInfoCon';mainCon.appendChild(basicInfoCon);me.eles.basicInfoCon = basicInfoCon;
        var middleCon = createEle('div');$(middleCon).css({height:me.windowHeight,paddingRight:360,paddingLeft:360});middleCon.className = '_player2_middleCon';mainCon.appendChild(middleCon);me.eles.middleCon = middleCon;
        var workBenchCon = createEle('div');$(workBenchCon).css({height:me.windowHeight - 50});workBenchCon.className = '_player2_workBenchCon';middleCon.appendChild(workBenchCon);me.eles.workBenchCon = workBenchCon;
        var submitWorkCon = createEle('div');submitWorkCon.className = '_player2_submitWorkCon';middleCon.appendChild(submitWorkCon);me.eles.submitWorkCon = submitWorkCon;
        var submitWork = createEle('div');submitWork.className = '_player2_submitWork';submitWork.innerHTML = '提交此任务>>';me.eles.submitWork = submitWork;if(!me.viewMode)submitWorkCon.appendChild(submitWork);
        var rightCon = createEle('div');$(rightCon).css({height:me.windowHeight});rightCon.className = '_player2_rightCon';mainCon.appendChild(rightCon);me.eles.rightCon = rightCon;
        var toolsCon = createEle('div');$(toolsCon).css({height:me.windowHeight});toolsCon.className = '_player2_toolsCon';rightCon.appendChild(toolsCon);me.eles.toolsCon = toolsCon;
        var sideBarCon = createEle('div');$(sideBarCon).css({height:me.windowHeight});sideBarCon.className = '_player2_sideBarCon';rightCon.appendChild(sideBarCon);me.eles.sideBarCon = sideBarCon;
        var sideBarSwitch = createEle('div');sideBarSwitch.className = '_player2_toolBtn';toolsCon.appendChild(sideBarSwitch);me.eles.sideBarSwitch = sideBarSwitch;
        var sideBarSwitchI = createEle('i');sideBarSwitchI.title = '流程目录';sideBarSwitchI.className = 'glyphicon glyphicon-list';sideBarSwitch.appendChild(sideBarSwitchI);
        var notificationCon = createEle('span');notificationCon.className = '_player2_notificationCon';$('._page_view').append(notificationCon);me.eles.notificationCon = notificationCon;
        var notification = createEle('span');$(notification).css({overflow: 'hidden',whiteSpace: 'nowrap',  textOverflow: 'ellipsis'});$('._page_view').append(notification);me.eles.notification = notification;

        if(!me.viewMode) {
            //me.initEvaluation();
        }
        $(sideBarSwitch).click(function(){
            if(me.sideBarIsOpen){
                if(document.documentElement.clientWidth < me.changeWidth){
                    $(middleCon).animate({paddingRight:50},300);
                    //$('._player2_submitWork').animate({marginRight:10},300);
                }
                $(rightCon).animate({right:-310},300);
            }else{
                if(document.documentElement.clientWidth > me.changeWidth){
                    $(middleCon).animate({paddingRight:360},300);
                    //$('._player2_submitWork').animate({marginRight:310},300);
                }
                $(rightCon).animate({right:0},300);
            }
            me.sideBarIsOpen = !me.sideBarIsOpen;
        });
        next();
        me.resizeConHeight();
        me.resizeConWidth(true);
    },
    resetSelf : function(next){
        var me = this;
        me.eles.sideBarEles = [];
        $(me.eles.sideBarCon).empty();
        next();
    },
    resizeConWidth : function(first){
        var me = this;
        var lastWidth = me.windowWidth;
        me.windowWidth = document.documentElement.clientWidth;
        if(me.windowWidth >= me.changeWidth)$(me.eles.middleCon).css({paddingRight:360});
        if(me.windowWidth < me.changeWidth && !me.sideBarIsOpen)$(me.eles.middleCon).css({paddingRight:50});
        if(me.windowWidth < me.changeWidth && me.sideBarIsOpen){
            if(!first && lastWidth < me.changeWidth)return;
            $(me.eles.sideBarSwitch).click();
        }
    },
    resizeConHeight : function(){
        var me = this;
        me.windowHeight = document.documentElement.clientHeight - 155;
        $('._tab_body').css({height:document.documentElement.clientHeight-245});
        $(me.eles.mainCon).css({height:me.windowHeight});
        $(me.eles.basicInfoCon).css({height:me.windowHeight});
        $(me.eles.middleCon).css({height:me.windowHeight});
        $(me.eles.workBenchCon).css({height:me.windowHeight - 50});
        $(me.eles.rightCon).css({height:me.windowHeight});
        $(me.eles.toolsCon).css({height:me.windowHeight});
        $(me.eles.sideBarCon).css({height:me.windowHeight});
    },
    render : function(courseId){
        var me = this;
        me.windowHeight = document.documentElement.clientHeight - 155;
        me.windowWidth = document.documentElement.clientWidth;
        $(window).resize(function() {
            if(me.windowHeight != document.documentElement.clientHeight - 155)me.resizeConHeight();
            if(me.windowWidth != document.documentElement.clientWidth)me.resizeConWidth();
        });
        me.database = new Database(courseId,me,function(){
            me.initSideBar();
        });
        if(!me.viewMode) {
            me.database.processController = me.processController = new ProcessController(me.database, me);
        }
    }
};


var get_selected_nodeid  = function (){
    var _jm = jsMind.current;
    var selected_node = _jm.get_selected_node();
    if(!!selected_node){
        return selected_node.id;
    }else{
        return null;
    }
};
//插入下级节点
var jm_add_child_node = function (){
    var _jm = jsMind.current;
    var selected_node = _jm.get_selected_node(); // as parent of new node
    if(!selected_node){console.log('please select a node first.');return;}

    var nodeid = jsMind.util.uuid.newid();
    var topic = '分支主题';
    var node = _jm.add_node(selected_node, nodeid, topic);
};
//插入同级节点
var jm_add_bro_node = function(){
    var _jm = jsMind.current;
    var selected_node = _jm.get_selected_node();
    if(!!selected_node && !selected_node.isroot){
        var nodeid = jsMind.util.uuid.newid();
        var node = _jm.insert_node_after(selected_node, nodeid, '分支主题');
        if(!!node){
            _jm.select_node(nodeid);
            _jm.begin_edit(nodeid);
        }
    }
};
//编辑一个节点
var jm_edit_node = function (){
    var _jm = jsMind.current;
    var selected_node = _jm.get_selected_node();
    if(!!selected_node){
        _jm.begin_edit(selected_node);
    }
};

//删除一个节点
var jm_remove_node = function (){
    var _jm = jsMind.current;
    var selected_id = get_selected_nodeid();
    if(!selected_id){console.log('please select a node first.');return;}

    _jm.remove_node(selected_id);
};
//放大
var jm_zoom_in = function (){
    var _jm = jsMind.current;
    _jm.view.zoomIn();
};
//缩小
var jm_zoom_out = function (){
    var _jm = jsMind.current;
    _jm.view.zoomOut();
};
//全部展开
var jm_expand_all = function (){
    var _jm = jsMind.current;
    _jm.expand_all();
};
//全部收起
var jm_collapse_all = function (){
    var _jm = jsMind.current;
    _jm.collapse_all();
};

var ec_link = function(userId,filePath,me){
    console.log(me);
    if(!userId || !filePath){
        window.open($(me).attr('data-href'));

    }else{
        var type = filePath.split('.')[1];

        var link = filePort + 'fileManager/fileRead?userId='+ userId + '&filePath='+ filePath;
        //tfz170630===
        if((type=='doc')||(type=='docx')||(type=='ppt')||(type=='pptx')||(type=='xls')||(type=='xlsx')){
            window.open($(me).attr('data-href'));
            return;
        }
        //===
        if(type != 'mp4'){
            window.open(link);
            return;
        }
        window.open('/video?filePath='+filePath+'&userId='+userId);
    }

   /* var blank,container,closeBtn;
    blank = createEle('div');$(blank).css({'top':'0','position':'fixed','width':'100%','height':'100%','background':'rgba(0,0,0,.5)','zIndex':'11111'});$('body').append(blank);
    closeBtn = createEle('span');closeBtn.innerHTML = '×';$(blank).append(closeBtn);$(closeBtn).css({'cursor':'pointer','position':'absolute','right':'0','top':'0','width':'50px','height':'50px','fontSize':'36px','color':'#fff','opacity':'.7','textAlign':'center','lineHight':'50px'}).mouseover(function(){
        $(this).css({'opacity':'1'});
    }).mouseout(function(){
        $(this).css({'opacity':'.7'});
    }).click(function(){
        $(this).parent().remove();
    });
    $(blank).click(function(){
        $(this).remove();
    });
    container = createEle('div');$(container).css({'position':'relative','width':'64%','height':'100%','margin':'0 auto','background':'#fff','overflowY':'hidden'});$(blank).append(container);
    $(container).click(function(){
        return false;
    });*/


    /*video.init($(container),{
        sourceF : filePath,
        name : '视频资料',
        des : '',
        userId : userId
    },'play');*/

};
