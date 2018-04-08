/**
 * Created by lijiemoop on 2/16/2016.
 * PAGE HOME
 */
;(function($){
    var Situation = function(){
        var me = this;
        //参数设置、变量定义
        me.eles = {};
        me.detailDes = [
            {name:'课程导读',value:'courseGuide',icon:'8'},
            {name:'适用对象',value:'suitableUser',icon:'10'},
            {name:'典型工作任务描述',value:'typicalTaskDes',icon:'1'},
            {name:'课程目标',value:'courseGoal',icon:'3'},
            {name:'课程内容',value:'courseContent',icon:'4'},
            {name:'工作对象',value:'workTarget',icon:'5'},
            {name:'工具、工作方法与工作组织方式',value:'tool',icon:'11'},
            {name:'工作要求',value:'workRequirement',icon:'12'},
            {name:'职业资格标准',value:'vocationalStandard',icon:'7'},
            {name:'课时数',value:'courseLength',icon:'9'},
            {name:'教师介绍',value:'aboutProfessor',icon:'6'},
            {name:'工作过程',value:'workProcess',icon:'2'}
        ];
        me.classDatas = [{name:'课程列表',defaultRow:1,defaultCol:3,messageUrl:'/getAllCourses?isPublished=true'}];
        me.eles = [];
    };
    Situation.prototype = {
        //翻页
        changePage : function(index,val){
            var me = this;

            if(val === 'prv'){
                if(me.eles[index].currentPage > 0){
                    me.changePage(index,me.eles[index].currentPage-1);
                    return;
                }
                else{
                    return;
                }
            }
            else if(val === 'next'){
                if(me.eles[index].currentPage < me.classDatas[index].courses.length - 1){
                    me.changePage(index,me.eles[index].currentPage+1);
                    return;
                }
                else{
                    return;
                }
            }
            else if(val === me.eles[index].currentPage){
                return;
            }else{
                var courseImg;
                $(me.eles[index].listCon).empty();
                var courses = [];
                $(me.classDatas[index].courses[val]).each(function(i,course){
                    var coursePlace  = createEle('div');coursePlace.className = '_situation_coursePlace' ;
                    var courseCon    = createEle('a');courseCon.href = playerPort + '/course#'+course.courseId;courseCon.className = '_situation_courseCon _block';coursePlace.appendChild(courseCon);
                    /*$(courseCon).hover(function(){
                        $(this).addClass('_block');
                    },function(){
                        $(this).removeClass('_block');
                    });*/
                    var courseImg_a  = createEle('div');courseCon.appendChild(courseImg_a);
                    if(course.fileIcon && course.fileIcon != 'undefined'&& course.fileIcon != 'null'){
                        courseImg    = createEle('img');courseImg.title = courseImg.alt = course.courseName;courseImg.src = filePort + 'fileManager/fileRead?userId=' +JSON.parse(course.fileIcon).ownerId +'&filePath='+JSON.parse(course.fileIcon).filePath;courseImg.className = '_situation_courseImg';courseImg_a.appendChild(courseImg);
                    }
                    else{
                        courseImg    = createEle('img');courseImg.title = courseImg.alt = course.courseName;courseImg.src = '/home/img/home/course.png';courseImg.className = '_situation_courseImg';courseImg_a.appendChild(courseImg);
                    }
                    var courseName   = createEle('h4');courseName.title = courseName.innerHTML = course.courseName;courseCon.appendChild(courseName);
                    var courseDes    = createEle('p');courseDes.title = courseDes.innerHTML = course.courseCreator.username;courseCon.appendChild(courseDes);

                    courses[i] = {
                        courseCon    : courseCon,
                        coursePlace  : coursePlace,
                        courseImg_a  : courseImg_a,
                        courseImg    : courseImg,
                        courseName   : courseName,
                        courseDes    : courseDes
                    };
                    me.eles[index].listCon.appendChild(coursePlace);
                });
                $(me.eles[index].pages).each(function(i,page){
                    page.className = '_home_pageNum';
                });
            }

            me.eles[index].courses = courses;
            me.eles[index].currentPage = val;
            me.eles[index].pages[me.eles[index].currentPage ? me.eles[index].currentPage : 0].className = '_home_pageCurr';
        },

        //组装元素
        createCourseEles : function(index,elData,next){
            var me = this;

            var container  = createEle('div');container.className = '_situation_courses';

            var header     = createEle('div');header.className = '_situation_header';container.appendChild(header);
            var icon       = createEle('span');icon.className = '_imooc-icon';$(icon).css({'backgroundImage':'url("/home/img/home/course-icon/course-icon4.png")'});
            var headerText = createEle('h3');$(headerText).append(icon).append(elData.name);header.appendChild(headerText);

            var listCon    = createEle('div');listCon.className = '';container.appendChild(listCon);
            var pageGroup  = createEle('div');pageGroup.className = '_home_pageGroup';container.appendChild(pageGroup);
            var pagePrv    = createEle('a');pagePrv.className = '_home_pagePrv';pagePrv.innerHTML = '上一页';pagePrv.href = 'javascript:void(0);';pagePrv.addEventListener("click",function(){me.changePage(index,'prv')});pageGroup.appendChild(pagePrv);
            var pages      = [];
            $(elData.courses).each(function(i){
                pages[i] = createEle('a');pages[i].href = 'javascript:void(0);';
                pages[i].innerHTML = i+1;pages[i].className = '_home_pageNum';
                pages[i].addEventListener("click",function(){me.changePage(index,i)});
                pageGroup.appendChild(pages[i]);
            });
            var pageNext = createEle('a');pageNext.className = '_home_pageNext';pageNext.innerHTML = '下一页';pageNext.href = 'javascript:void(0);';pageNext.addEventListener("click",function(){me.changePage(index,'next')});pageGroup.appendChild(pageNext);
            if(elData.courses.length <= 1) $(pageGroup).hide();
            me.eles[index] = {
                currentPage : '',
                container   : container,
                header      : header,
                headerText  : headerText,
                listCon     : listCon,
                pageGroup   : pageGroup,
                pagePrv     : pagePrv,
                pageNext    : pageNext,
                pages       : pages
            };

            if(next){
                next();
            }
        },

        //分页
        setPageDevide : function(arr,defaultNumbPerPage){
            var me = this;

            if(!arr) return;
            if(!arr.length) return;
            for(i=0;i<arr.length;i++){
                sendMessage('post',playerPort,'/saveCourse',{nodeType:'learnScn',courseId:arr[i].courseId,name:arr[i].courseName,parentId:me.courseId,imageUrl:((arr[i].fileIcon && arr[i].fileIcon != 'undefined'&& arr[i].fileIcon != 'null')?filePort + 'fileManager/fileRead?userId=' +JSON.parse(arr[i].fileIcon).ownerId +'&filePath='+JSON.parse(arr[i].fileIcon).filePath:'/home/img/home/course.png')},function(){});
            }

            var temArrClass = [];
            var pages = Math.ceil(arr.length/defaultNumbPerPage);

            for(i = 0;i < pages;i++){
                if(i < pages - 1){
                    temArrClass[i] = [];
                    for(j = 0;j < defaultNumbPerPage;j++){
                        temArrClass[i].push(arr[i*defaultNumbPerPage+j]);
                    }
                }
                else{
                    temArrClass[i] = [];
                    for(j = 0;j < arr.length - defaultNumbPerPage*i;j++){
                        temArrClass[i].push(arr[i*defaultNumbPerPage+j]);
                    }
                }
            }
            return temArrClass;
        },

        //拿到一个分类的所有课程
        getCourses : function(oneClassification,next){
            var me = this;

            var isTeacher = getIsTeacher();
            if(isTeacher){
                sendMessage('get',ecgeditorPort,'/getCoursesOfCourse?fileId='+me.courseId+'&isPublished=true','',function(data){
                    oneClassification.courses = me.setPageDevide(data.data,oneClassification.defaultRow*oneClassification.defaultCol);
                    if(!data.data) return;
                    if(!data.data.length) return;
                    next();
                });
            }else{
                sendMessage('get',ecgeditorPort,'/getCoursesOfCourse?fileId='+me.courseId+'&isPublished=true&isLearnable=1','',function(data){
                    oneClassification.courses = me.setPageDevide(data.data,oneClassification.defaultRow*oneClassification.defaultCol);
                    if(!data.data) return;
                    if(!data.data.length) return;
                    next();
                });
            }
        },

        createCourseEle : function(){
            var me = this;
            var description = (me.courseData.detailDes && me.courseData.detailDes != 'undefined')?JSON.parse(me.courseData.detailDes):[];

            var headerCON       = createEle('div');headerCON.className = "_course_headerCon";
            var headerCon       = createEle('div');headerCON.appendChild(headerCon);
            //var imgCon          = createEle('div');imgCon.className = '_course_headerImgCon';headerCon.appendChild(imgCon);
           /* var courseImg       = createEle('img');
            if(me.courseData.fileIcon && me.courseData.fileIcon != 'undefined'&& me.courseData.fileIcon != 'null'){
                courseImg.title = courseImg.alt = me.courseData.courseName;courseImg.src = filePort + 'fileManager/fileRead?userId=' +JSON.parse(me.courseData.fileIcon).ownerId +'&filePath='+JSON.parse(me.courseData.fileIcon).filePath;courseImg.className = '_situation_courseImg';imgCon.appendChild(courseImg);
            }else{
                courseImg.title = courseImg.alt = me.courseData.courseName;courseImg.src = '/home/img/home/course.png';courseImg.className = '_situation_courseImg';imgCon.appendChild(courseImg);
            }*/
            var courseNameCon   = createEle('div'); courseNameCon.className = "_course_courseNameCon";headerCon.appendChild(courseNameCon);
            var courseName      = createEle('div');courseName.className = "";courseName.innerHTML = me.courseData.courseName;courseNameCon.appendChild(courseName);

            var bodyCon         = createEle('div');bodyCon.className = "_course_bodyCon _block";
            var detailDescCon   = createEle('div');detailDescCon.className = "_course_detailDescCon";bodyCon.appendChild(detailDescCon);

            var contain,head,con,icon;
            $(me.detailDes).each(function(i,des){
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


            me.eles = {
                headerCon       : headerCon,
                courseNameCon   : courseNameCon,
                courseName      : courseName,
                bodyCon         : bodyCon,
                detailDescCon   : detailDescCon
            };

            $("._page_view").append(headerCON).append(bodyCon);
        },
        //获取课程信息
        getCourseData : function(courseId,next,nnext){
            var me = this;

            sendMessage('get',ecgeditorPort,'/getAllModelCourses/?isOut=true&fileType=course_design','',function(data){
                for( i = 0;i<data.data.length;i++){
                    if(data.data[i].courseId === me.courseId){
                        next(data.data[i]);
                        nnext();
                    }
                }
            });
        },

        init : function(vals){
            var me = this;

            me.courseId = vals[0];

            var initAClass = function(index){
                if(index === me.classDatas.length) return;

                me.getCourses(me.classDatas[index],function(){
                    me.createCourseEles(index,me.classDatas[index],function(){
                        $(me.eles.bodyCon).append(me.eles[index].container);
                        me.changePage(index,0);
                        initAClass(index+1);
                    });
                });
            };

            var index = 0;

            me.getCourseData(vals[0].split('@')[0],function(course){
                sendMessage('post',playerPort,'/saveCourse',{nodeType:'learnLy',courseId:me.courseId,name:course.courseName,parentId:null,imageUrl:((course.fileIcon && course.fileIcon != 'undefined'&& course.fileIcon != 'null')?JSON.parse(course.fileIcon).sourceF:'/home/img/home/course.png')},function(){});
                sendMessage('get',playerPort,'/addViewTimes?courseId='+me.courseId,'',function(){});
                me.courseData = course;
                me.createCourseEle();
            },function(){
                initAClass(index);
            });

        }
    };
    window['Situation'] = Situation;
})($);