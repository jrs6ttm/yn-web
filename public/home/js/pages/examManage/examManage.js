/**
 * Created by lijiemoop on 3/29/2016.
 */
/**
 * Created by lijiemoop on 3/25/2016.
 * PAGE HOME
 */
;(function($){

    var StudyManage = function(vals){
        var me = this;

        //?????????
        me.classDatas = [{name:'全部课程',defaultRow:2,defaultCol:4,messageUrl:'/getAllCourses?isPublished=true'}];
        me.eles = [];
    };

    StudyManage.prototype = {

        showExamList : function(){
            var me = this;

            var watchTasks = createEle('iframe');
            watchTasks.src = ecgeditorPort + '/searchExamLogs';
            $(watchTasks).css({width: '100%', height: 1015, scrolling: 'no', border: 0});
            $('._page_view').append(watchTasks);

        },
        //??
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
            else{
                $(me.eles[index].listCon).empty();
                var courses = [];
                $(me.classDatas[index].courses[val]).each(function(i,course){
                    var coursePlace  = createEle('div');coursePlace.className = 'col-xs-6 col-md-' + 12/me.classDatas[index].defaultCol;$(coursePlace).css({height:300});
                    var courseCon    = createEle('div');courseCon.className = '_home_courseCon _block';coursePlace.appendChild(courseCon);
                    var courseImg_a  = createEle('a');courseImg_a.href = '#studyManage/'+course.courseId;courseCon.appendChild(courseImg_a);
                    var courseImg    = createEle('img');courseImg.title = courseImg.alt = course.courseName;courseImg.src = './images/home/course.png';courseImg.className = 'img-thumbnail _home_courseImg';courseImg_a.appendChild(courseImg);
                    var courseName_a = createEle('a');courseName_a.href = '#studyManage/'+course.courseId;courseCon.appendChild(courseName_a);
                    var courseName   = createEle('h4');courseName.title = courseName.innerHTML = course.courseName;courseName_a.appendChild(courseName);
                    var courseDes    = createEle('p');courseDes.title = courseDes.innerHTML = course.courseDescpt;courseCon.appendChild(courseDes);

                    courses[i] = {
                        courseCon    : courseCon,
                        coursePlace  : coursePlace,
                        courseImg_a  : courseImg_a,
                        courseImg    : courseImg,
                        courseName_a : courseName_a,
                        courseName   : courseName,
                        courseDes    : courseDes
                    };
                    me.eles[index].listCon.appendChild(coursePlace);
                });
            }

            me.eles[index].courses = courses;
            me.eles[index].currentPage = val;
        },


        //????
        createCourseEles : function(index,elData,next){
            var me = this;

            var container  = createEle('div');container.className = 'container';

            var header     = createEle('div');header.className = '_home_header page-header';container.appendChild(header);
            var headerText = createEle('h2');headerText.innerHTML = elData.name;header.appendChild(headerText);

            var listCon    = createEle('div');listCon.className = 'row';container.appendChild(listCon);
            var pageGroup  = createEle('div');pageGroup.className = '_home_pageGroup';container.appendChild(pageGroup);
            var pagePrv    = createEle('a');pagePrv.innerHTML = '上一页';pagePrv.href = 'javascript:void(0);';pagePrv.addEventListener("click",function(){me.changePage(index,'prv')});pageGroup.appendChild(pagePrv);
            var pages      = [];
            $(elData.courses).each(function(i){

                pages[i] = createEle('a');pages[i].href = 'javascript:void(0);';$(pages[i]).css({padding:4});
                pages[i].innerHTML = i+1;
                pages[i].addEventListener("click",function(){me.changePage(index,i)});
                pageGroup.appendChild(pages[i]);
            });
            var pageNext = createEle('a');pageNext.innerHTML = '下一页';pageNext.href = 'javascript:void(0);';pageNext.addEventListener("click",function(){me.changePage(index,'next')});pageGroup.appendChild(pageNext);

            me.eles[index] = {
                currentPage : 0,
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


        //??
        setPageDevide : function(arr,defaultNumbPerPage){
            var me = this;

            var temArrClass = [];
            var pages = Math.ceil(arr.length/defaultNumbPerPage);

            for(i = 0;i < pages;i++){
                if(i < pages - 1){
                    temArrClass[i] = [];
                    for(j = 0;j < defaultNumbPerPage;j++){
                        temArrClass[i].push(arr[i*8+j]);
                    }
                }
                else{
                    temArrClass[i] = [];
                    for(j = 0;j < arr.length - defaultNumbPerPage*i;j++){
                        temArrClass[i].push(arr[i*8+j]);
                    }
                }
            }
            return temArrClass;
        },


        //???????????
        getCourses : function(oneClassification,next){
            var me = this;

            sendMessage('get',ecgeditorPort,oneClassification.messageUrl,'',function(data){
                oneClassification.courses = me.setPageDevide(data.data,oneClassification.defaultRow*oneClassification.defaultCol);
                next();
            });
        },

        init : function(vals){
            var me = this;

            me.courseId = vals[0]?vals[0]:'';

            var headerCon       = createEle('div');headerCon.className = "_course_headerCon";
            var courseNameCon   = createEle('div'); courseNameCon.className = "container _course_courseNameCon";headerCon.appendChild(courseNameCon);
            var courseName      = createEle('div');courseName.className = "page-header";courseName.innerHTML = '试题管理';courseNameCon.appendChild(courseName);

            $('._page_view').append(headerCon);


            /*if(me.courseId){*/
            me.showExamList();
            /*}
             else{
             var initAClass = function(index){
             if(index === me.classDatas.length) return;

             me.getCourses(me.classDatas[index],function(){
             me.createCourseEles(index,me.classDatas[index],function(){
             $('._page_view').append(me.eles[index].container);
             me.changePage(index,0);
             initAClass(index+1);
             });
             });
             };
             var index = 0;
             initAClass(index);
             }*/
        }
    };

    window['StudyManage'] = StudyManage;

})($);