/**
 * Created by lijiemoop on 2/18/2016.
 * PAGE COURSE
 */
;(function($){
    var Course = function(){
        var me = this;

        me.eles = {};
        me.detailDes = [
            {name:'工作情境描述',value:'workSituation'},
            {name:'学习任务',value:'workTask'},
            {name:'学习目标',value:'goal'},
            {name:'学习内容',value:'content'},
            {name:'重难点',value:'difficulty'},
            {name:'教学组织形式与教学方法',value:'organizationForm'},
            {name:'考核标准',value:'assessmentStandards'},
            {name:'教学条件',value:'teachingCondition'},
            {name:'教学时间安排',value:'schedule'},
            {name:'工作对象',value:'target'},
            {name:'工作与教学用具',value:'tool'},
            {name:'工作要求',value:'workRequirement'}
        ];

      /*  me.socket = io.connect( processEnginePort);
        me.socket.on('deployCourse',function(resData){

            if(!resData.processDefinitionId){
                $.MsgBox.Alert('选课失败','选课失败！',function(){
                    location.reload();
                });
            }else{
                var data = {
                    courseName : me.courseData.courseName,
                    courseId : me.courseData.courseId,
                    courseCompleteId : me.courseCompleteId,
                    teacherId : me.courseData.courseCreator.id,
                    teacherName : me.courseData.courseCreator.username,
                    statement : 'on',
                    selectedTime : new Date(),
                    completedTime : new Date(),
                    processDefinitionId : resData.processDefinitionId
                };
                $.ajax({
                    url: playerPort + '/course',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(data)
                }).done(function (data) {console.log(data);
                    //$.MsgBox.Confirm('选课成功','选课成功，点击“确认”直接开始课程！',function(){
                    //    window.location.hash =  "#player/" + me.courseData.courseId + '@admin';
                    //},function(){
                    location.reload();
                    // });
                }).fail(function(){
                    console.log('select failed')
                });
            }
            
            
        })*/

    };

    Course.prototype = {
        //判断用户该课程的状态
        // tellCourseState : function(){
        //     var me = this;
        // },


        initSelectButton : function(data,manageBtn,courseName){
            var me = this;

            if(me.courseData.isOple){
                manageBtn.innerHTML = "开始课程";
                $(manageBtn).click(function(){
                    window.location.href = codePort + '/?courseId=' + me.courseData.courseId;
                });
            }
            else{
                if(data.courseCompleteId){
                    me.courseData.courseCompleteId = data.courseCompleteId;
                }
                switch(data.statement){
                    case "on":
                        if(me.courseData.courseCompleteId){
                            courseName.innerHTML += '（已选）';
                            manageBtn.innerHTML = "开始课程";
                            if(me.org && me.courseData.isCooperation){
                                $(manageBtn).click(function(){
                                    window.location =  playerPort + "/player/" + me.courseData.courseCompleteId;
                                });
                            }else{
                                $(manageBtn).click(function(){
                                    window.location =  playerPort + "/player/" + me.courseData.courseCompleteId;
                                });
                            }
                        }else{
                            me.courseCompleteId = me.courseData.courseId + '@' + uuid();


                            manageBtn.innerHTML = "选择课程";
                            $(manageBtn).click(function(){
                                $(manageBtn).unbind('click');
                                me.selectCourse(me.courseCompleteId,me.courseData.courseId);
                            });
                        }
                        break;
                    case "off":
                        if(me.userManage || 1){
                            me.courseCompleteId = me.courseData.courseId + '@' + uuid();
                            courseName.innerHTML += '（已学完）';
                            if(me.org && me.courseData.isCooperation){
                                manageBtn.innerHTML = "已学完";
                                manageBtn.className = 'btn btn-default _course_manageBtn';
                                $(manageBtn).unbind('click');
                            }else{
                                manageBtn.innerHTML = "重新课程";
                                $(manageBtn).click(function(){
                                    $(manageBtn).unbind('click');
                                    me.selectCourse(me.courseCompleteId,me.courseData.courseId);
                                });
                            }
                            
                        }
                        else{
                            courseName.innerHTML += '（已学完）';
                            manageBtn.innerHTML = "查看课程";
                            $(manageBtn).click(function(){
                                window.location =  "#player/" + data.courseCompleteId + '/u';
                            });

                            //manageBtn.className = 'btn btn-default _course_manageBtn';

                            /* manageBtn.innerHTML = "开始课程";
                             $(manageBtn).click(function(){
                             window.location.hash =  "#player/" + me.courseData.courseCompleteId;
                             });*/
                        }
                        break;

                    /* $(manageBtn).click(function(){
                     sendMessage('get','','/selectCourse?courseId=' + me.courseData.courseId,'',function(data){
                     if(data === 'no user'){
                     $.MsgBox.Alert('请登录','没有用户登录，请登录！',function(){
                     location.reload();
                     });
                     }else{
                     if(data.ok){
                     $.MsgBox.Confirm('选课成功','选课成功，点击“确认”直接开始课程！',function(){
                     window.location.hash =  "#player/" + data.courseCompleteId;
                     },function(){
                     location.reload();
                     });
                     }
                     }
                     });
                     });*/
                    default :
                        me.courseCompleteId = me.courseData.courseId + '@' + uuid();
                        manageBtn.innerHTML = "选择课程";
                        $(manageBtn).click(function(){
                            $(manageBtn).unbind('click');
                            me.selectCourse(me.courseCompleteId,me.courseData.courseId);
                        });
                        break;
                }

            }
        },

        selectCourse : function(courseInstanceId,bpmnInstanceId){
            var me = this;

            if(me.org && me.courseData.isCooperation ){
                sendMessage('post',newProcessEnginePort,'/ec_engine/course/getUserGroupInfo',{userId:userData.id,courseOrgId:me.orgId},function(resData){
                    if(!resData.processDefinitionId){
                        $.MsgBox.Alert('选课失败',resData.errorMsg,function(){
                            location.reload();
                        });
                    }else{
                        var data = {
                            courseName : me.courseData.courseName,
                            courseId : me.courseData.courseId,
                            courseCompleteId : me.courseCompleteId,
                            teacherId : me.courseData.courseCreator.id,
                            teacherName : me.courseData.courseCreator.username,
                            statement : 'on',
                            selectedTime : new Date().getTime(),
                            completedTime : null,
                            processDefinitionId : resData.processDefinitionId,
                            lrnScnOrgId:me.orgId
                        };
                        $.ajax({
                            url: playerPort + '/course',
                            method: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify(data)
                        }).done(function (data) {
                            //$.MsgBox.Confirm('选课成功','选课成功，点击“确认”直接开始课程！',function(){
                            //    window.location.hash =  "#player/" + me.courseData.courseId + '@admin';
                            //},function(){
                            window.location.href = playerPort + '/player/' + me.courseCompleteId;
                            // });
                        }).fail(function(){
                            console.log('select failed')
                        });
                    }
                });
            }
            else{
                sendMessage('post',newProcessEnginePort,'/ec_engine/course/deploy',{isCooperation:'0',ecgeditorHost: ecgeditorPort.substring(7),courseInstanceId :courseInstanceId,bpmnInstanceId :bpmnInstanceId},function(resData){
                    if(!resData.processDefinitionId){
                        $.MsgBox.Alert('选课失败',resData.errorMsg,function(){
                            location.reload();
                        });
                    }else{
                        var data = {
                            courseName : me.courseData.courseName,
                            courseId : me.courseData.courseId,
                            courseCompleteId : me.courseCompleteId,
                            teacherId : me.courseData.courseCreator.id,
                            teacherName : me.courseData.courseCreator.username,
                            statement : 'on',
                            selectedTime : new Date().getTime(),
                            completedTime : null,
                            processDefinitionId : resData.processDefinitionId
                        };
                        $.ajax({
                            url: playerPort + '/course',
                            method: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify(data)
                        }).done(function (data) {
                            //$.MsgBox.Confirm('选课成功','选课成功，点击“确认”直接开始课程！',function(){
                            //    window.location.hash =  "#player/" + me.courseData.courseId + '@admin';
                            //},function(){
                            location.reload();
                            // });
                        }).fail(function(){
                            console.log('select failed')
                        });
                    }
                })
            }
        },
        //组装元素
        createCourseEles : function(){
            var me = this;
            
            var description = (me.courseData.detailDes && me.courseData.detailDes != 'undefined')?JSON.parse(me.courseData.detailDes):[];

            var headerCon       = createEle('div');headerCon.className = "_course_headerCon";
            var courseNameCon   = createEle('div'); courseNameCon.className = "container _course_courseNameCon";headerCon.appendChild(courseNameCon);
            var courseName      = createEle('div');courseName.className = "page-header";courseName.innerHTML = me.courseData.courseName;courseNameCon.appendChild(courseName);

            var bodyCon         = createEle('div');bodyCon.className = "container";
            var detailDescCon   = createEle('div');detailDescCon.className = "_course_detailDescCon col-lg-9 col-md-8";bodyCon.appendChild(detailDescCon);

            $(me.detailDes).each(function(i,des){
                if(description[des.value] && description[des.value] != 'undefined'){
                    var head = createEle('h4');head.innerHTML = des.name;
                    var con = createEle('p');con.innerHTML = description[des.value];
                    detailDescCon.appendChild(head);
                    detailDescCon.appendChild(con);
                }

            });

            $.ajax({
                url: playerPort + '/getCourseInfo/' + me.courseInstanceId,
                method: 'GET'
            }).done(function (courseInfo) {
                var manageCon       = createEle('div');manageCon.className = "_course_manageCon col-lg-3 col-md-4";bodyCon.appendChild(manageCon);
                var managePan       = createEle('div');managePan.className = "_course_managePan _block";manageCon.appendChild(managePan);
                var courseOtherInfo = createEle('div');courseOtherInfo.className = "_course_courseOtherInfo";managePan.appendChild(courseOtherInfo);
                var creator         = createEle('p');creator.innerHTML = "老师：" + me.courseData.courseCreator.username;courseOtherInfo.appendChild(creator);
                var chosenTimes     = createEle('p');chosenTimes.innerHTML = "选课人数：" + (courseInfo?courseInfo.studentAmount:0) + "人";courseOtherInfo.appendChild(chosenTimes);
                var evaluation      = createEle('p');evaluation.innerHTML = "评分：" + (courseInfo?parseFloat(courseInfo.grade).toFixed(1):8);courseOtherInfo.appendChild(evaluation);
                //var grade           = createEle('p');grade.innerHTML = "课程难度：" + me.courseData.grade;courseOtherInfo.appendChild(grade);
                var editPan         = createEle('div');editPan.className = "_course_editPan";managePan.appendChild(editPan);
                var manageBtn       = createEle('a');manageBtn.className = "btn btn-success _course_manageBtn";$(manageBtn).unbind('click');

                editPan.appendChild(manageBtn);
                me.eles = {
                    headerCon       : headerCon,
                    courseNameCon   : courseNameCon,
                    courseName      : courseName,
                    bodyCon         : bodyCon,
                    detailDescCon   : detailDescCon,
                    manageCon       : manageCon,
                    managePan       : managePan,
                    courseOtherInfo : courseOtherInfo,
                    creator         : creator,
                    chosenTimes     : chosenTimes,
                    evaluation      : evaluation,
                    //grade           : grade,
                    editPan         : editPan,
                    manageBtn       : manageBtn
                };

                $("._page_view").append(headerCon).append(bodyCon);

                if(!userData){
                    manageBtn.innerHTML = "开始课程";
                    manageBtn.className = 'btn btn-default _course_manageBtn';
                    $(manageBtn).click(function(){
                        $.MsgBox.Alert('用户未登录','请登录之后再开始学习！');
                    });
                    return
                }

                if(me.courseData.isCooperation){
                    var notHaveStudent = true;
                    $(userData.role).each(function(i,role){
                        if(role === 'teacher'){
                            $.getJSON(orgPort + '/CourseOrg/optCourseOrg/search?TEACHER_ID='+userData.id+'&INSTANCE_ID'+me.courseInstanceId+'&jsonCallBack=?',function(data){
                                if(data.datas.length){
                                    $(manageCon).append('<p style="text-align: center"><a href="/index.php/apps/course/" target="_blank">查看已组织的课程</a></p>');
                                }
                                $(manageCon).append('<p style="text-align: center"><a href="'+orgPort+'/CourseOrg/opt?courseId='+me.courseInstanceId+'&optType=save" target="_blank">新组织课程</a></p>');
                            });
                        }

                        if(role === 'student'){
                            notHaveStudent = false;
                            $.getJSON(orgPort + '/CourseOrg/getMyOrgedCourses?userId='+userData.id+'&INSTANCE_ID'+me.courseInstanceId+'&jsonCallBack=?',function(data){
                                if(data.length){
                                    me.org = me.orgId = data[0].LRNSCN_ORG_ID;
                                }
                                if(me.org){
                                    if(data[0].STATUS == '0'){
                                        manageBtn.innerHTML = "开始课程";
                                        manageBtn.className = 'btn btn-default _course_manageBtn';
                                        $(manageBtn).unbind('click').click(function(){
                                            $.MsgBox.Alert('不能开始学习','该课程还在组织中,组织完成后才能学习！');
                                        });
                                        //$(editPan).append('<p style="text-align: center;color: red">*</p>');
                                        return;
                                    }
                                    $.ajax({
                                        url: playerPort + '/getCourseOrg/' + me.courseData.courseId + '/' + me.orgId,
                                        method: 'GET'
                                    }).done(function (resData) {
                                        if(!resData.length){
                                            me.courseCompleteId = me.courseData.courseId + '@' + uuid();
                                            manageBtn.innerHTML = "开始课程";
                                            $(manageBtn).click(function(){
                                                $(manageBtn).unbind('click');
                                                me.selectCourse(me.courseCompleteId,me.courseData.courseId);
                                            });
                                        }else{
                                            var lastIndex = 0;
                                            var dataArr = [];
                                            for(i=0;i<resData.length;i++){
                                                if(!resData[i].courseCompleteId || !resData[i].processDefinitionId){
                                                    $.ajax({
                                                        url: playerPort + '/course/remNoId',
                                                        method: 'POST',
                                                        contentType: 'application/json',
                                                        data: JSON.stringify(resData[i])
                                                    }).done(function (res) {}).fail(function(){});
                                                }else{
                                                    dataArr.push(resData[i]);
                                                }
                                            }
                                            for(i = 1;i < dataArr.length;i++){
                                                if(dataArr[i].selectedTime - dataArr[lastIndex].selectedTime > 0){
                                                    lastIndex = i;
                                                }
                                            }

                                            var data = dataArr[lastIndex];

                                            if(!data.processDefinitionId && data.processDefinitionId != 'undefiend' ){
                                                $.ajax({
                                                    url: playerPort + '/course/' + data.courseCompleteId,
                                                    method: 'DELETE'
                                                }).done(function (res) {
                                                    data = {
                                                        state : 'on/off'
                                                    };
                                                    me.initSelectButton(data,manageBtn,courseName);

                                                }).fail(function(){
                                                    data = {
                                                        state : 'on/off'
                                                    }
                                                });

                                            }else{
                                                me.initSelectButton(data,manageBtn,courseName);
                                            }
                                        }
                                        if(!me.courseData.isPublished && userData.role != 'admin'){
                                            manageBtn.className = 'btn btn-default _course_manageBtn';
                                            $(manageBtn).unbind('click');
                                        }
                                    }).fail(function(){});
                                }else{
                                    manageBtn.innerHTML = "开始课程";
                                    manageBtn.className = 'btn btn-default _course_manageBtn';
                                    $(manageBtn).unbind('click').click(function(){
                                        $.MsgBox.Alert('不能开始学习','该课程为组织课程组织后才能学习！');
                                    });
                                    //$(editPan).append('<p style="text-align: center;color: red">*</p>');
                                }
                            });
                        }
                    });
                    if(notHaveStudent){
                        $(managePan).hide();
                    }
                    return;
                }

                $.ajax({
                    url: playerPort + '/course/' + me.courseData.courseId,
                    method: 'GET'
                }).done(function (resData) {

                    if(!resData.length){
                        me.courseCompleteId = me.courseData.courseId + '@' + uuid();
                        manageBtn.innerHTML = "选择课程";
                        $(manageBtn).click(function(){
                            $(manageBtn).unbind('click');
                            me.selectCourse(me.courseCompleteId,me.courseData.courseId);
                        });
                    }else{
                        var lastIndex = 0;
                        var dataArr = [];
                        for(i=0;i<resData.length;i++){
                            if(!resData[i].courseCompleteId || !resData[i].processDefinitionId){
                                $.ajax({
                                    url: playerPort + '/course/remNoId',
                                    method: 'POST',
                                    contentType: 'application/json',
                                    data: JSON.stringify(resData[i])
                                }).done(function (res) {}).fail(function(){});
                            }else{
                                dataArr.push(resData[i]);
                            }
                        }
                        for(i = 1;i < dataArr.length;i++){
                            if(dataArr[i].selectedTime - dataArr[lastIndex].selectedTime > 0){
                                lastIndex = i;
                            }
                        }

                        var data = dataArr[lastIndex];
                        var lastCourseArr = dataArr;
                        if(data.statement != 'off'){
                            lastCourseArr.splice(lastIndex,1);
                        }
                        if(lastCourseArr.length){
                            var checkPan        = createEle('div');checkPan.className = "_course_editPan";$(checkPan).css({boxShadow:'0 -1px 0 #dfdfdf'});managePan.appendChild(checkPan);
                            var checkSe         = createEle('select');checkSe.className = '_course_checkSe';checkPan.appendChild(checkSe);
                            var checkBt         = createEle('a');checkBt.innerHTML = '查看课程';checkBt.className = 'btn btn-success btn-xs _course_checkBt';checkPan.appendChild(checkBt);
                            $(checkBt).click(function(){
                                window.location =  playerPort + "/player/" + lastCourseArr[checkSe.value].courseCompleteId + '/check';
                            });
                            $(lastCourseArr).each(function(i,course){
                                var option = createEle('option');option.innerHTML = '第'+(i+1)+'次课程';option.value = i;
                                checkSe.appendChild(option);
                            });
                        }


                        if(!data.processDefinitionId && data.processDefinitionId != 'undefiend' ){
                            $.ajax({
                                url: playerPort + '/course/' + data.courseCompleteId,
                                method: 'DELETE'
                            }).done(function (res) {
                                data = {
                                    state : 'on/off'
                                };
                                me.initSelectButton(data,manageBtn,courseName);

                            }).fail(function(){
                                data = {
                                    state : 'on/off'
                                }
                            });

                        }else{
                            me.initSelectButton(data,manageBtn,courseName);
                        }
                    }
                    if(!me.courseData.isPublished && userData.role != 'admin'){
                        manageBtn.className = 'btn btn-default _course_manageBtn';
                        $(manageBtn).unbind('click');
                    }})
                    .fail(function (data) {
                        me.courseCompleteId = me.courseData.courseId + '@' + uuid();


                        manageBtn.innerHTML = "选择课程";
                        $(manageBtn).click(function(){
                            $(manageBtn).unbind('click');
                            me.selectCourse(me.courseCompleteId,me.courseData.courseId);
                        });

                        if(!me.courseData.isPublished && userData.role != 'admin'){
                            manageBtn.className = 'btn btn-default _course_manageBtn';
                            $(manageBtn).unbind('click');
                        }
                    });
            }).fail(function(){
                console.log('select failed')
            });

            
        },
        //获取课程信息
        getCourseData : function(courseId,next){
            var me = this;

            sendMessage('get',ecgeditorPort,'/getSingleCourseInfo?courseId='+courseId,'',function(data){
                $.ajax({
                    url: playerPort + '/addViewTimes/'+data.data[0].courseId,
                    method: 'GET'
                }).done(function(res){
                }).fail(function(e){});
                next(data.data[0]);
            });
        },

        init : function(vals){
            var me = this;
            
            /*if(vals[1]){
                me.org = true;
                me.orgId = vals[1];
            }*/
            me.courseInstanceId = vals[0].split('@')[0];
            me.getCourseData(vals[0].split('@')[0],function(course){
                me.courseData = course;
                me.createCourseEles();
            });
        }
    };

    window['Course'] = Course;
})($);