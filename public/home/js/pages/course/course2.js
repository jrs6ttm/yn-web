/**
 * Created by tfz on 12/28/16.
 */
var Database = function(courseId,view){
    this.courseId = courseId;
    this.view = view;
    this.courseData = '';
    this.courseInfo = '';
    this.orgData = '';
    this.instanceDatas = '';
    this.detailDes = [
        {name:'工作情境描述',value:'workSituation',icon:'1'},
        {name:'学习任务',value:'workTask',icon:'2'},
        {name:'学习目标',value:'goal',icon:'3'},
        {name:'学习内容',value:'content',icon:'4'},
        {name:'重难点',value:'difficulty',icon:'5'},
        {name:'教学组织形式与教学方法',value:'organizationForm',icon:'6'},
        {name:'考核标准',value:'assessmentStandards',icon:'7'},
        {name:'教学条件',value:'teachingCondition',icon:'8'},
        {name:'教学时间安排',value:'schedule',icon:'9'},
        {name:'工作对象',value:'target',icon:'10'},
        {name:'工作与教学用具',value:'tool',icon:'11'},
        {name:'工作要求',value:'workRequirement',icon:'12'}
    ];
};
Database.prototype = {
    selectCourse : function(instanceId,orgId,next){
        var me = this;
        if(orgId){
            sendMessage('post',newProcessEnginePort,'course/getUserGroupInfo',{userId:userData.id,courseOrgId:orgId},function(resData){
                if(!resData.processDefinitionId){
                    $.MsgBox.Alert('选课失败',resData.errorMsg,function(){
                        location.reload();
                    });
                }else{
                    var data = {
                        courseName : me.courseData.courseName,
                        courseId : me.courseData.courseId,
                        courseCompleteId : me.courseId + '@' + instanceId,
                        teacherId : me.courseData.courseCreator.id,
                        teacherName : me.courseData.courseCreator.username,
                        statement : 'on',
                        selectedTime : new Date().getTime(),
                        completedTime : null,
                        processDefinitionId : resData.processDefinitionId,
                        lrnScnOrgId:orgId,
                        lastTasks:0
                    };
                    sendMessage('post',playerPort,'/saveInstance',data,function(){
                        next();
                    });
                }
            });
        }else{
            sendMessage('post',newProcessEnginePort,'course/deploy',{ecgeditorHost: ecgeditorPort.substring(7),courseInstanceId :me.courseId+'@'+instanceId,bpmnInstanceId :me.courseId,isCooperation:'0'},function(resData){
                if(!resData.processDefinitionId){
                    $.MsgBox.Alert('选课失败',resData.errorMsg,function(){
                        location.reload();
                    });
                }else{
                    var data = {
                        courseName : me.courseData.courseName,
                        courseId : me.courseData.courseId,
                        courseCompleteId : me.courseId+'@'+instanceId,
                        teacherId : me.courseData.courseCreator.id,
                        teacherName : me.courseData.courseCreator.username,
                        statement : 'on',
                        selectedTime : new Date().getTime(),
                        completedTime : null,
                        processDefinitionId : resData.processDefinitionId,
                        lrnScnOrgId:null,
                        lastTasks:'1'
                    };
                    sendMessage('post',playerPort,'/saveInstance',data,function(){
                        next();
                    });
                }
            });
        }
    },
    removeNoId : function(data){
        $.ajax({
            url: playerPort + '/course/remNoId',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data)
        });
    },
    getLastSelectData : function(resData,next){
        var me = this;
        var studyArr = [];
        var lastArr = [];
        var dataArr = [];
        var orgStudyArr = [];
        var i;
        for(i=0;i<resData.length;i++){
            if(!resData[i].courseCompleteId || !resData[i].processDefinitionId){
                me.removeNoId(resData[i]);
            }else{
                dataArr.push(resData[i]);
            }
        }
        for(i = 0;i < dataArr.length;i++){
            if(dataArr[i].statement == 'on'){
                if(dataArr[i].lastTasks == '1'){
                    studyArr.push(dataArr[i]);
                }else{
                    orgStudyArr.push(dataArr[i]);
                }
            }else{
                lastArr.push(dataArr[i]);
            }
        }
        me.instanceDatas = studyArr;
        me.orgInstanceDatas = orgStudyArr;
        me.lastCourseArr = lastArr;
        next();
    },
    getInstanceData : function(next){
        var me = this;
       /* if(me.orgId){
            sendMessage('get',playerPort,'/getInstance?courseId='+me.courseId+'&orgId='+me.orgId,'',function(resData){
                if(resData.length){
                    me.getLastSelectData(resData,function(lastIndex){
                        next(lastIndex);
                    });
                }else{
                    next();
                }
            });
        }else{*/
        sendMessage('get',playerPort,'/getInstance?courseId='+me.courseId,'',function(resData){
            me.getLastSelectData(resData,function(){
                next();
            });
        });
        /*}*/
    },
    getOrgData : function(next){
        var me = this;
        me.orgData = '';
        $.getJSON(orgPort + '/CourseOrg/getMyOrgedCourses?userId='+userData.id+'&INSTANCE_ID ='+ me.courseId +'&jsonCallBack=?',function(data){
            $(data).each(function(i,d){
                if(d.STATUS == '1'){
                    me.orgData = d;
                }
            });
            next();
        });
    },
    getCourseInfo : function(next){
        var me = this;
        sendMessage('get',playerPort,'/getCourseInfo?courseId='+me.courseId,'',function(courseInfo){
            me.courseInfo = courseInfo;
            next();
        });
    },
    getCourseData : function(next){
        var me = this;
        sendMessage('get',ecgeditorPort,'/getSingleCourseInfo?courseId='+me.courseId,'',function(data){
            sendMessage('get',playerPort,'/addViewTimes?courseId='+me.courseId,'',function(){});
            me.courseData = data.data;
            next();
        });
    }
};

var View = function(courseId){
    this.database = '';
    this.isTeacher = false;
    this.eles = {};
    
    this.init(courseId);
};
View.prototype = {
    /*initViewCourse : function(lastIndex){
        var me = this;
        var lastCourseArr = me.database.lastCourseArr;
        if(!lastCourseArr) return;
        if(me.database.instanceData.statement != 'off') lastCourseArr.splice(lastIndex,1);
        if(lastCourseArr.length){
            var checkPan        = createEle('div');checkPan.className = "_course_editPan";$(checkPan).css({boxShadow:'0 -1px 0 #dfdfdf'});me.eles.managePan.appendChild(checkPan);me.eles.checkPan = checkPan;
            var checkSe         = createEle('select');checkSe.className = '_course_checkSe';checkPan.appendChild(checkSe);me.eles.checkSe = checkSe;
            var checkBt         = createEle('a');checkBt.innerHTML = '查看课程';checkBt.className = 'btn btn-success btn-xs _course_checkBt';checkPan.appendChild(checkBt);me.eles.checkBt = checkBt;
            $(checkBt).click(function(){
                window.location =  playerPort + "/player#" + lastCourseArr[checkSe.value].courseCompleteId + '/check';
            });
            $(lastCourseArr).each(function(i){
                var option = createEle('option');option.innerHTML = '第'+(i+1)+'次课程';option.value = i;
                checkSe.appendChild(option);
            });
        }
    },*/
  /*  addOrgCourseBtn : function(){
        var me = this;
        $(me.eles.manageCon).append('<p style="text-align: center"><a href="'+orgPort+'/CourseOrg/opt?courseId='+me.database.courseId+'&optType=save" target="_blank">新组织课程</a></p>');
    },*/
    startSelectedOne : function(type,index){
        var me = this;
        var instanceId;
        switch(type){
            case 'startNew':
                instanceId = uuid();
                me.database.selectCourse(instanceId,'',function(){
                    window.location =  playerPort + '/player#' + me.database.courseId + '@' + instanceId;
                });
                break;
            case 'continue':
                window.location =  playerPort + '/player#' + me.database.instanceDatas[index].courseCompleteId;
                break;
            case 'viewCourse':
                window.location =  playerPort + '/player#' + me.database.lastCourseArr[index].courseCompleteId + '/check';
                break;
            case 'startOrg':
                var have = false;
                $(me.database.orgInstanceDatas).each(function(i,d){
                    if(d.lrnScnOrgId === me.database.orgData.LRNSCN_ORG_ID){
                        have = d.courseCompleteId;
                    }
                });
                if(have){
                    window.location =  playerPort + '/player#' + have;
                }else{
                    instanceId = uuid();
                    me.database.selectCourse(instanceId,me.database.orgData.LRNSCN_ORG_ID,function(){
                        window.location =  playerPort + '/player#' + me.database.courseId + '@' + instanceId;
                    });
                }
                break;
            case 'orgCourse':
                window.open(orgPort+'/CourseOrg/opt?courseId='+me.database.courseId+'&optType=save');
                break;
            default:break;
        }
    },
    createStartCourse : function(manageBtn){
        var me = this;console.log(me);
        var lastCourseArr = me.database.lastCourseArr;
        var instanceDatas = me.database.instanceDatas;
        var orgData = me.database.orgData;
        var line = 0,selectCon,selectMain,selectHead,selectDet,selectDet1,selectDet2,sel,selIcon,lastSelected;
        var startCourseCon  = createEle('div');startCourseCon.className = '_course_startCourseCon';$("body").append(startCourseCon);
        var startBack       = createEle('div');startBack.className = 'modal-background';$("body").append(startBack);
        var headerCon       = createEle('div');headerCon.className = '_course_startHeaderCon';startCourseCon.appendChild(headerCon);
        var closeBtn        = createEle('a');closeBtn.innerHTML = '×';headerCon.appendChild(closeBtn);
        var startLeft       = createEle('div');startLeft.className = '_course_startLeft';startCourseCon.appendChild(startLeft);
        var startRight      = createEle('div');startRight.innerHTML = '进入';startRight.className = '_course_startRight';startCourseCon.appendChild(startRight);
        var selectOneToStart = function(_me,type,index){
            if(lastSelected === _me){
                lastSelected = '';
                $(_me).parents('._course_selectCon').removeClass('_selected').find('span').html('&#xea53');
                $(startRight).css({background:'rgb(223,223,223)',cursor:'not-allowed'}).unbind('click');
                return;
            }
            lastSelected = _me;
            $('._course_selectCon').removeClass('_selected').find('span').html('&#xea53');
            $(_me).parents('._course_selectCon').addClass('_selected').find('span').html('&#xea52');
            $(startRight).css({background:'#5cb85c',cursor:'pointer'}).unbind('click').click(function(){
                me.startSelectedOne(type,index);
            });
        };
        
        if(instanceDatas.length){
            line++;
            selectCon = createEle('div');selectCon.className = '_course_selectCon';startLeft.appendChild(selectCon);
            selectMain = createEle('h1');selectCon.appendChild(selectMain);
            selIcon = createEle('span');selIcon.className = 'imooc-icon';selIcon.innerHTML = '&#xea53';selectMain.appendChild(selIcon);
            selectHead = createEle('h4');selectHead.innerHTML = '继续学习';selectCon.appendChild(selectHead);
            selectDet1 = createEle('select');selectCon.appendChild(selectDet1);
            $(instanceDatas).each(function(i,data){
                sel = createEle('option');sel.innerHTML = '选课时间：'+ new Date(data.selectedTime).format("yyyy-MM-dd hh:mm:ss");sel.value = i;
                selectDet1.appendChild(sel);
            });
            $(selectMain).click(function(){
                selectOneToStart(this,'continue',selectDet1.value);
            });
        }else{
			if(!me.database.courseData.isCooperation){
				line++;
				selectCon = createEle('div');selectCon.className = '_course_selectCon';startLeft.appendChild(selectCon);
				selectMain = createEle('h1');selectCon.appendChild(selectMain);
				selIcon = createEle('span');selIcon.className = 'imooc-icon';selIcon.innerHTML = '&#xea53';selectMain.appendChild(selIcon);
				selectHead = createEle('h4');selectHead.innerHTML = '开始课程';selectCon.appendChild(selectHead);
				selectDet = createEle('p');selectDet.innerHTML = '开始一次新的课程';selectCon.appendChild(selectDet);
				$(selectMain).click(function(){
					selectOneToStart(this,'startNew','');
				});
			}
			
			if(orgData){
				line++;
				selectCon = createEle('div');selectCon.className = '_course_selectCon';startLeft.appendChild(selectCon);
				selectMain = createEle('h1');selectCon.appendChild(selectMain);
				selIcon = createEle('span');selIcon.className = 'imooc-icon';selIcon.innerHTML = '&#xea53';selectMain.appendChild(selIcon);
				selectHead = createEle('h4');selectHead.innerHTML = '开始组织课程学习';selectCon.appendChild(selectHead);
				selectDet = createEle('p');selectDet.innerHTML = '学习已经组织好的课程';selectCon.appendChild(selectDet);
				$(selectMain).click(function(){
					selectOneToStart(this,'startOrg','');
				});
			}
		}
        if(lastCourseArr.length){
            line++;
            selectCon = createEle('div');selectCon.className = '_course_selectCon';startLeft.appendChild(selectCon);
            selectMain = createEle('h1');selectCon.appendChild(selectMain);
            selIcon = createEle('span');selIcon.className = 'imooc-icon';selIcon.innerHTML = '&#xea53';selectMain.appendChild(selIcon);
            selectHead = createEle('h4');selectHead.innerHTML = '查看课程';selectCon.appendChild(selectHead);
            selectDet2 = createEle('select');selectCon.appendChild(selectDet2);
            $(lastCourseArr).each(function(i,data){
                sel = createEle('option');sel.innerHTML = '完成时间：'+ new Date(data.completedTime).format("yyyy-MM-dd hh:mm:ss");sel.value = i;
                selectDet2.appendChild(sel);
            });
            $(selectMain).click(function(){
                selectOneToStart(this,'viewCourse',selectDet2.value);
            });
        }
        
        if(me.isTeacher){
            line++;
            selectCon = createEle('div');selectCon.className = '_course_selectCon';startLeft.appendChild(selectCon);
            selectMain = createEle('h1');selectCon.appendChild(selectMain);
            selIcon = createEle('span');selIcon.className = 'imooc-icon';selIcon.innerHTML = '&#xea53';selectMain.appendChild(selIcon);
            selectHead = createEle('h4');selectHead.innerHTML = '组织课程';selectCon.appendChild(selectHead);
            selectDet = createEle('p');selectDet.innerHTML = '组织一次新的课程';selectCon.appendChild(selectDet);
            $(selectMain).click(function(){
                selectOneToStart(this,'orgCourse','');
            });
        }
        if(line == 0){
            manageBtn.innerHTML = "开始课程";
            manageBtn.className = '_canNot _course_manageBtn';
            $(manageBtn).click(function(){
                $.MsgBox.Alert('不能操作','目前用户状态没有相应操作！');
            });
            return;
        }
        if(!me.database.courseData.isCooperation && line == 1){
            selectOneToStart(this,'startNew','');
        }
        $(startCourseCon).css({height:line*60+40,marginTop:'-'+(line*50+40)/2+'px'});
        $(startLeft).css({height:line*60});
        $(startRight).css({height:line*60,lineHeight:(line*60)+'px'});
        console.log(line);
        startBack.onclick = closeBtn.onclick = function(){
            $(startCourseCon).remove();
            $(startBack).remove();
        };
    },
    initManageBtn : function(){
        var me = this;
        var manageBtn = me.eles.manageBtn;
        if(userData && userData.id || true){
            /*if(me.orgId){
                me.database.getOrgData(function(){
                    if(me.database.orgData){
                        if(me.database.orgData[0].STATUS == '0'){
                            manageBtn.innerHTML = "开始课程";
                            manageBtn.className = 'btn btn-default _course_manageBtn';
                            $(manageBtn).unbind('click').click(function(){
                                $.MsgBox.Alert('不能开始学习','该课程还在组织中,组织完成后才能学习！');
                            });
                        }else{
                            me.database.getInstanceData(function(lastIndex){
                                me.initViewCourse(lastIndex);
                                if(me.database.instanceData){
                                    if(me.database.instanceData.statement == 'on'){
                                        me.eles.courseName.innerHTML += '（已组织）';
                                        manageBtn.innerHTML = "开始课程";
                                        $(manageBtn).click(function(){
                                            $(manageBtn).unbind('click');
                                            window.location =  playerPort + "/player#" + me.database.instanceData.courseCompleteId;
                                        });
                                        return;
                                    }else{
                                        manageBtn.innerHTML = "开始课程";
                                        manageBtn.className = 'btn btn-default _course_manageBtn';
                                        $(manageBtn).unbind('click').click(function(){
                                            $.MsgBox.Alert('不能开始学习','该课程为组织课程组织后才能学习！');
                                        });
                                        return;
                                    }
                                }
                                manageBtn.innerHTML = "开始课程";
                                $(manageBtn).click(function(){
                                    var instanceId = uuid();
                                    $(manageBtn).unbind('click');
                                    me.database.selectCourse(instanceId,function(){
                                        window.location =  playerPort + "/player#" + me.database.courseId + '@' + instanceId;
                                    });
                                });
                            });
                        }
                    }else{
                        manageBtn.innerHTML = "开始课程";
                        manageBtn.className = 'btn btn-default _course_manageBtn';
                        $(manageBtn).unbind('click').click(function(){
                            $.MsgBox.Alert('不能开始学习','该课程为组织课程组织后才能学习！');
                        });
                    }
                });
            }else{
                if(me.database.courseData.isCooperation == true){
                    manageBtn.innerHTML = "开始课程";
                    manageBtn.className = 'btn btn-default _course_manageBtn';
                    $(manageBtn).unbind('click').click(function(){
                        $.MsgBox.Alert('不能开始学习','该课程为组织课程组织后才能学习！');
                    });
                    return;
                }
                me.database.getInstanceData(function(lastIndex){
                    me.initViewCourse(lastIndex);
                    if(me.database.instanceData){
                        if(me.database.instanceData.statement == 'on'){
                            me.eles.courseName.innerHTML += '（已选）';
                            manageBtn.innerHTML = "开始课程";
                            $(manageBtn).click(function(){
                                $(manageBtn).unbind('click');
                                window.location =  playerPort + "/player#" + me.database.instanceData.courseCompleteId;
                            });
                            return;
                        }else{
                            me.eles.courseName.innerHTML += '（已学完）';
                            manageBtn.innerHTML = "重新选择";
                            $(manageBtn).click(function(){
                                var instanceId = uuid();
                                $(manageBtn).unbind('click');
                                me.database.selectCourse(instanceId,function(){
                                    $.MsgBox.Confirm('选课成功','选课成功，点击“确认”直接开始课程！',function(){
                                        window.location =  playerPort + "/player#" + me.database.courseId + '@' + instanceId;
                                    },function(){
                                        location.reload();
                                    });
                                });
                            });
                            return;
                        }
                    }
                    manageBtn.innerHTML = "选择课程";
                    $(manageBtn).click(function(){
                        var instanceId = uuid();
                        $(manageBtn).unbind('click');
                        me.database.selectCourse(instanceId,function(){
                            $.MsgBox.Confirm('选课成功','选课成功，点击“确认”直接开始课程！',function(){
                                window.location =  playerPort + "/player#" + me.database.courseId + '@' + instanceId;
                            },function(){
                                location.reload();
                            });
                        });
                    });
                });
            }*/
            manageBtn.innerHTML = "开始课程";
            manageBtn.className = '_course_manageBtn';
            /*var instanceId = uuid();
            $(manageBtn).unbind('click');
            $(manageBtn).click(function(){
                me.database.selectCourse(instanceId,'',function(){
                    window.location =  playerPort + "/player#" + me.database.courseId + '@' + instanceId;
                });
             });*/
            $(manageBtn).click(function(){
                me.createStartCourse(manageBtn);
            });
        }else{
            manageBtn.innerHTML = "开始课程";
            manageBtn.className = '_canNot _course_manageBtn';
            $(manageBtn).click(function(){
                $.MsgBox.Alert('用户未登录','请登录之后再开始学习！');
            });
        }
    },
    createManageEle : function(){
        var me = this;
        var manageCon       = createEle('div');manageCon.className = "_course_manageCon _block";me.eles.bodyCon.appendChild(manageCon);me.eles.manageCon = manageCon;
        var managePan       = createEle('div');managePan.className = "_course_managePan";manageCon.appendChild(managePan);me.eles.managePan = managePan;
        var courseOtherInfo = createEle('div');courseOtherInfo.className = "_course_courseOtherInfo";managePan.appendChild(courseOtherInfo);me.eles.courseOtherInfo = courseOtherInfo;
        var creator         = createEle('p');creator.innerHTML = "课程老师：<span>" + me.database.courseData.courseCreator.username+"</span>";courseOtherInfo.appendChild(creator);me.eles.creator = creator;
        var chosenTimes     = createEle('p');chosenTimes.innerHTML = "选课人数：<span>" + (me.database.courseInfo?me.database.courseInfo.studentAmount:0) +"</span>";courseOtherInfo.appendChild(chosenTimes);me.eles.chosenTimes = chosenTimes;
        var evaluation      = createEle('p');evaluation.innerHTML = "课程评分：<span>" + (me.database.courseInfo?parseFloat(me.database.courseInfo.grade).toFixed(1):8)+"</span>";courseOtherInfo.appendChild(evaluation);me.eles.evaluation = evaluation;
        var editPan         = createEle('div');editPan.className = "_course_editPan";managePan.appendChild(editPan);me.eles.editPan = editPan;
        var manageBtn       = createEle('a');manageBtn.className = "_course_manageBtn";manageBtn.innerHTML = '开始课程';$(manageBtn).unbind('click');editPan.appendChild(manageBtn);me.eles.manageBtn = manageBtn;
        me.database.getOrgData(function(){
            me.setIsTeacher(function(){
                me.database.getInstanceData(function(){
                    me.initManageBtn();
                });
            });
        });
    },
    setIsTeacher : function(next){
        var me = this;
        me.isTeacher = getIsTeacher();
        next();
    },
    createBasicEle : function(){
        var me = this;
        var description = (me.database.courseData.detailDes && me.database.courseData.detailDes != 'undefined')?JSON.parse(me.database.courseData.detailDes):[];
        var headerCON       = createEle('div');headerCON.className = "_course_headerCon";
        var headerCon       = createEle('div');headerCON.appendChild(headerCon);
       /* var imgCon          = createEle('div');imgCon.className = '_course_headerImgCon';headerCon.appendChild(imgCon);
        var courseImg       = createEle('img');
        if(me.database.courseData.fileIcon && me.database.courseData.fileIcon != 'undefined'&& me.database.courseData.fileIcon != 'null'){
            courseImg.title = courseImg.alt = me.database.courseData.courseName;courseImg.src = filePort + 'fileManager/fileRead?userId=' +JSON.parse(me.database.courseData.fileIcon).ownerId +'&filePath='+JSON.parse(me.database.courseData.fileIcon).filePath;courseImg.className = '_situation_courseImg';imgCon.appendChild(courseImg);
        }else{
            courseImg.title = courseImg.alt = me.database.courseData.courseName;courseImg.src = '/home/img/home/course.png';courseImg.className = '_situation_courseImg';imgCon.appendChild(courseImg);
        }*/
        var courseNameCon   = createEle('div'); courseNameCon.className = "_course_courseNameCon";headerCon.appendChild(courseNameCon);me.eles.courseNameCon = courseNameCon;
        var courseName      = createEle('div');courseName.className = "";courseName.innerHTML = me.database.courseData.courseName;courseNameCon.appendChild(courseName);me.eles.courseName = courseName;
        var bodyCon         = createEle('div');bodyCon.className = "_course_bodyCon _block";me.eles.bodyCon = bodyCon;
        var detailDescCon   = createEle('div');detailDescCon.className = "_course_detailDescCon";bodyCon.appendChild(detailDescCon);me.eles.detailDescCon = detailDescCon;
        var contain,head,con,icon;
        $(me.database.detailDes).each(function(i,des){
            if(description[des.value] && description[des.value] != 'undefined'){
                contain = createEle('div');contain.className = '_situation_desContain';
                icon = createEle('span');icon.className = '_imooc-icon';$(icon).css({'backgroundImage':'url("/home/img/home/course-icon/course-icon'+des.icon+'.png")'});
                head = createEle('h4');$(head).append(icon).append(des.name);
                con = createEle('p');con.innerHTML = description[des.value].replace(/<[^(?!br)>]+>/g,"");
                contain.appendChild(head);
                contain.appendChild(con);
                detailDescCon.appendChild(contain);
            }
        });
        $("._page_view").append(headerCON).append(bodyCon);
    },
    init : function(courseId){
        var me = this;
        me.database = new Database(courseId,me);
        me.database.getCourseData(function(){
            me.createBasicEle();
            me.database.getCourseInfo(function(){
                me.createManageEle();
            });
        });
    }
};