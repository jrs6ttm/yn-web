/**
 * Created by lijiemoop on 6/14/2016.
 */
/**
 * Created by lijiemoop on 2/18/2016.
 * PAGE Home
 */
;(function($){
    var Home = function(){
        var me = this;
        me.thisCourseId ='begin';
        me.getCoursesUrl = '';
        me.eles = {};
    };

    Home.prototype = {
        findChildByParentId : function(arr,id){
            var me = this;
            var categoryTrees = [];
            $(arr).each(function(i,one){
                if(one.courseTypeParentId == id){
                    if(one.levelIndex != '3'){
                        categoryTrees.push({
                            id: one.courseTypeId,
                            name: one.courseTypeDes,
                            content: me.findChildByParentId(arr,one.courseTypeId)
                        })
                    }else{
                        categoryTrees.push({
                            id: one.courseTypeId,
                            name: one.courseTypeDes
                        })
                    }
                }
            });
            return categoryTrees;
        },
        newCategoryTrees : function(arr){
            var me = this;
            var categoryTrees = [];
            
            $(arr).each(function(i,one){
                if(one.levelIndex == '1'){
                    categoryTrees.push({
                        id: one.courseTypeId,
                        name: one.courseTypeDes,
                        content: me.findChildByParentId(arr,one.courseTypeId)
                    })
                }
            });
            
            return categoryTrees;
        },
        changePage : function(val){
            var me = this;
            if(val === 'prv'){
                if(me.eles.currentPage > 0){
                    me.changePage(me.eles.currentPage - 1);
                    return;
                }
                else{
                    return;
                }
            }
            else if(val === 'next'){
                if(me.eles.currentPage < me.coursesData.length - 1){
                    me.changePage(me.eles.currentPage + 1);
                    return;
                }
                else{
                    return;
                }
            }
            else if(val === me.eles.currentPage){
                return;
            }else{
                $(me.eles.listCon).empty();
                var courses = [],courseImg;
                $(me.coursesData[val]).each(function(i,course){
                    var coursePlace  = createEle('div');coursePlace.className = '_home_coursePlace';
                    var courseCon    = createEle('a');courseCon.className = '_home_courseCon _block';courseCon.href = playerPort + '/situation#'+course.courseId;coursePlace.appendChild(courseCon);
                    var courseImg_a  = createEle('div');courseCon.appendChild(courseImg_a);$(courseImg_a).css({borderBottom:'1px solid #d8e1ea',width:'100%',height:189,overflow:'hidden',margin:0,padding:0});
                    if(course.fileIcon && course.fileIcon != 'undefined'&& course.fileIcon != 'null'){
                        courseImg    = createEle('img');courseImg.title = courseImg.alt = course.courseName;courseImg.src = filePort + JSON.parse(course.fileIcon).filePath;courseImg.className = '_home_courseImg';courseImg_a.appendChild(courseImg);
                    }else{
                        courseImg    = createEle('img');courseImg.title = courseImg.alt = course.courseName;courseImg.src = '/home/img/home/course.png';courseImg.className = '_home_courseImg';courseImg_a.appendChild(courseImg);
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
                    me.eles.listCon.appendChild(coursePlace);
                });
                $(me.eles.pages).each(function(i,page){
                    page.className = '_home_pageNum';
                });
            }

            me.eles.courses = courses;
            me.eles.currentPage = val;
            me.eles.pages[me.eles.currentPage ? me.eles.currentPage : 0].className = '_home_pageCurr';
        },


        //组装元素
        createCourseEles : function(name,next){
            var me = this;

            $(me.courseCon).empty();

            var container  = createEle('div');container.className = '';

            // var header     = createEle('div');header.className = '_home_header page-header';container.appendChild(header);
            // var headerText = createEle('h2');headerText.innerHTML = name;header.appendChild(headerText);

            var listCon    = createEle('div');listCon.className = '_home_listCon';container.appendChild(listCon);
            var pageGroup  = createEle('div');pageGroup.className = '_home_pageGroup';container.appendChild(pageGroup);
            var pagePrv    = createEle('a');pagePrv.className = '_home_pagePrv';pagePrv.innerHTML = '上一页';pagePrv.href = 'javascript:void(0);';pagePrv.addEventListener("click",function(){me.changePage('prv')});pageGroup.appendChild(pagePrv);
            var pages      = [];
            $(me.coursesData).each(function(i){
                pages[i] = createEle('a');pages[i].href = 'javascript:void(0);';
                pages[i].innerHTML = i+1;pages[i].className = '_home_pageNum';
                pages[i].addEventListener("click",function(){me.changePage(i)});
                pageGroup.appendChild(pages[i]);
            });
            var pageNext = createEle('a');pageNext.className = '_home_pageNext';pageNext.innerHTML = '下一页';pageNext.href = 'javascript:void(0);';pageNext.addEventListener("click",function(){me.changePage('next')});pageGroup.appendChild(pageNext);
            if(me.coursesData.length <= 1) $(pageGroup).hide();
            me.eles = {
                currentPage : '',
                container   : container,
                // header      : header,
                // headerText  : headerText,
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

            if(!arr) return false;
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

        initSmallClass : function(content,id){
            var me = this;
            if(me.thisCourseId == id || me.thisCourseId == 'begin') return;
            me.thisCourseId = id;
            var allCourseBtnC = createEle('div');allCourseBtnC.className = '_home_smallClass';$(me.smallClassCon).empty().append(allCourseBtnC);
            var allCourseBtn = createEle('a');allCourseBtn.className = '_home_smallType';allCourseBtn.innerHTML = '全部课程';$(allCourseBtn).attr('data-id',id);$(allCourseBtnC).append(allCourseBtn);

            var lines;
            $(allCourseBtn).click(function(event){
                $('._home_smallType.active').removeClass('active');
                $(this).addClass('active');
                me.initAClass('/getAllModelCourses?isPublished=true&fileType=course_design&categoryId='+ $(this).attr('data-id') +'&ctClass=2');
                event.stopPropagation();
                event.preventDefault();
            });
            $(allCourseBtn).click();
            if(!content) return;
            lines = Math.ceil((content.length+2)/4);
            var smallClass,a;
                $(content).each(function(i,con){
                if(content.length > 11){
                    if(i<10){
                        smallClass = createEle('div');smallClass.className = '_home_smallClass';$(me.smallClassCon).append(smallClass);
                        a = createEle('a');a.innerHTML = con.name;a.className = '_home_smallType';$(a).attr('data-id',con.id);$(smallClass).append(a);
                        $(a).click(function(event){
                            $('._home_smallType.active').removeClass('active');
                            $(this).addClass('active');
                            me.initAClass('/getAllModelCourses?isPublished=true&fileType=course_design&categoryId='+ $(this).attr('data-id') +'&ctClass=3');
                            event.stopPropagation();
                            event.preventDefault();
                        });
                    }else{
                        smallClass = createEle('div');smallClass.className = '_home_smallClass';$(me.smallClassCon).append(smallClass);
                        a = createEle('a');a.innerHTML = con.name;a.className = '_home_smallType';$(a).attr('data-id',con.id);$(smallClass).append(a);$(smallClass).hide();
                        $(a).click(function(event){
                            $('._home_smallType.active').removeClass('active');
                            $(this).addClass('active');
                            me.initAClass('/getAllModelCourses?isPublished=true&fileType=course_design&categoryId='+ $(this).attr('data-id') +'&ctClass=3');
                            event.stopPropagation();
                            event.preventDefault();
                        });
                    }
                }else{
                    var smallClass = createEle('div');smallClass.className = '_home_smallClass';$(me.smallClassCon).append(smallClass);
                    var a = createEle('a');a.innerHTML = con.name;a.className = '_home_smallType';$(a).attr('data-id',con.id);$(smallClass).append(a);
                    $(a).click(function(event){
                        $('._home_smallType.active').removeClass('active');
                        $(this).addClass('active');
                        me.initAClass('/getAllModelCourses?isPublished=true&fileType=course_design&categoryId='+ $(this).attr('data-id') +'&ctClass=3');
                        event.stopPropagation();
                        event.preventDefault();
                    });
                }
            });
            if(content.length > 11){
                var moreCourseBtnC = createEle('div');moreCourseBtnC.className = '_home_smallClass';$(me.smallClassCon).append(moreCourseBtnC);
                var moreCourseBtn = createEle('a');moreCourseBtn.innerHTML = '更多';$(moreCourseBtnC).append(moreCourseBtn);
                var hideMoreBtnC = createEle('div');hideMoreBtnC.className = '_home_smallClass';$(me.smallClassCon).append(hideMoreBtnC);
                var hideMoreBtn = createEle('a');hideMoreBtn.innerHTML = '收起';$(hideMoreBtnC).append(hideMoreBtn);$(hideMoreBtnC).hide();

                $(moreCourseBtn).click(function(){
                    $(this).parent().hide();
                    $(hideMoreBtnC).show();
                    $('._home_moreClass').show();
                    $('._home_smallClassCon').animate({height:lines*30+10},200);
                });

                $(hideMoreBtn).click(function(){
                    $(this).parent().hide();
                    $(moreCourseBtnC).show();
                    $('._home_moreClass').hide();
                    $('._home_smallClassCon').animate({height:100},200);
                });
            }
        },

        initAddedClass : function(content,se,name2,name1){
            var me = this;

            var addedClassCon = createEle('ul');addedClassCon.className = '_home_addedClassCon _hover';$(se).append(addedClassCon);

            $(content).each(function(i,con){
                var addedClass = createEle('li');addedClass.className = '_home_addedClass';addedClass.title = con.name;$(addedClassCon).append(addedClass);
                var addedClassP = createEle('p');addedClassP.innerHTML = con.name;addedClass.appendChild(addedClassP);
                if(!me.small){
                    me.initSmallClass(con.content,con.id);
                    me.small = true;
                    $(addedClass).addClass('_se_active');
                    $(me.rootCon).empty().append(/*name1 + '&nbsp;>&nbsp;' +*/ name2 + '&nbsp;>&nbsp;' + con.name);
                }
                $(addedClass).click(function(event){
                    $('._home_select.active').removeClass('active');
                    $(this).closest('._home_select').addClass('active');
                    if($(this).hasClass('_se_active')) {
                        event.stopPropagation();
                        event.preventDefault();
                        return;
                    }
                    $('._se_active').removeClass('_se_active');
                    $(this).addClass('_se_active');
                    $(me.rootCon).empty().append(/*name1 + '&nbsp;>&nbsp;' + */name2 + '&nbsp;>&nbsp;' + con.name);
                    me.initSmallClass(con.content,con.id);
                    event.stopPropagation();
                    event.preventDefault();
                });
                $(addedClass).hover(function(){
                    $(this).css({color:'#010101'});
                    //middleClassSelector.innerHTML = con.name;
                    // middleClassActive.innerHTML = '△';
                    // $(selectList).hide();
                },function(){
                    $(this).css({color:'#737373'});
                });
            });
        },

        initSelectClass : function(content,name1){
            var me = this;

            var middleClassCon = createEle('ul');middleClassCon.className = '_home_middleClassCon';$(me.leftCon).empty().append(middleClassCon);
            // var middleClassSelector = createEle('select');middleClassSelector.className = '_home_middleClassSelector';middleClassSelector.vlaue = content[0].name;$(middleClassCon).append(middleClassSelector);
            // var middleClassActive = createEle('div');middleClassActive.className = '_home_middleClassActive';middleClassActive.innerHTML = '△';$(middleClassCon).append(middleClassActive);
            // var selectList = createEle('div');$(middleClassCon).append(selectList);

            // $(middleClassSelector).hover(function(){
            //     $(selectList).show();
            //     middleClassActive.innerHTML = '▽';
            // },function(){
            //
            // });
            //
            //
            // $(selectList).hide().hover(function(){
            //
            // },function(){
            //     middleClassActive.innerHTML = '△';
            //     $(this).hide();
            // });
            var select = me.AllCourseBtn = createEle('li');select.title = '热门课程';select.className = '_home_select';$(middleClassCon).append(select);
            var selectP = createEle('p');selectP.innerHTML = '热门课程';select.appendChild(selectP);
            $(select).click(function(event){
                $('._home_select.active').removeClass('active');
                $(this).addClass('active');
                $('._home_rootCon').empty().append('热门课程');
                me.initTopClass('/getAllModelCourses?isPublished=true&fileType=course_design','热门课程');
                event.stopPropagation();
                event.preventDefault();
            });
            $(select).hover(function(){
                $(this).css({color:'#010101'});
                //middleClassSelector.innerHTML = con.name;
                // middleClassActive.innerHTML = '△';
                // $(selectList).hide();

            },function(){
                $(this).css({color:'#737373'});
            });
            
            $(content).each(function(i,con){
                var select = createEle('li');select.title = con.name;select.className = '_home_select';$(middleClassCon).append(select);
                var selectP = createEle('p');selectP.innerHTML = con.name;select.appendChild(selectP);
                $(select).hover(function(){
                    $(this).css({color:'#010101'});
                    //middleClassSelector.innerHTML = con.name;
                    // middleClassActive.innerHTML = '△';
                    // $(selectList).hide();

                },function(){
                    $(this).css({fontWeight:'400',color:'#737373'});
                });
                me.initAddedClass(con.content,select,con.name,name1);
                $(select).click(function(event){
                    $('._home_select.active').removeClass('active');
                    $(this).addClass('active');
                    $('._home_rootCon').empty().append(con.name);
                    me.initTopClass('/getAllModelCourses?isPublished=true&fileType=course_design&categoryId='+ con.id +'&ctClass=1',con.name);
                    event.stopPropagation();
                    event.preventDefault();
                });
            });

            //me.initAddedClass(content[0].content);
        },

        //create boxes
        createClasses : function(){
            var me = this;

            var topClassCon = createEle('div');topClassCon.className = 'container _home_topClassCon';me.topClassCon = topClassCon;$(topClassCon).hide();
            var bottleClassCon = createEle('div');bottleClassCon.className = 'container _home_bottleClassCon';me.bottleClassCon = bottleClassCon;
            var leftCon = createEle('div');leftCon.className = 'col-sm-3 _home_leftCon';me.leftCon = leftCon;
            var rightCon = createEle('div');rightCon.className = 'col-sm-9 _home_rightCon';me.rightCon = rightCon;
            var rootCon = createEle('div');rootCon.className = '_home_rootCon';$(me.rightCon).append(rootCon);me.rootCon = rootCon;
            var smallClassCon = createEle('div');smallClassCon.className = '_home_smallClassCon';$(me.rightCon).append(smallClassCon);me.smallClassCon = smallClassCon;
            var courseCon = createEle('div');courseCon.className = 'col-sm-12';me.courseCon = courseCon;$(me.rightCon).append(courseCon);$(courseCon).css({"padding":0})
            
            me.topClass = [];

            var categoryTrees;
            sendMessage('get',playerPort,'/getCourseType','',function(courseType){
                categoryTrees = me.newCategoryTrees(courseType);
                me.AllClass = [{name:'职业领域',content:categoryTrees},{name:'学校',content:''},{name:'企事业单位',content:''}];
                $(me.AllClass).each(function(i,cla){
                    var topClassName = createEle('div');topClassName.title = topClassName.innerHTML = cla.name;topClassName.className = '_home_topClassName pull-left';topClassCon.appendChild(topClassName);
                    $(topClassName).click(function(){
                        $('._home_topClassName').removeClass('active');
                        $(this).addClass('active');
                        me.initSelectClass(cla.content,cla.name);
                    });
                    me.topClass.push(topClassName);
                });

                me.topClass[0].click();

                $('._page_view').append(topClassCon).append(bottleClassCon);
                $(bottleClassCon).append(leftCon);
                $(bottleClassCon).append(rightCon);
                $(me.AllCourseBtn).click();
            });
        },
        initAClass : function(url){
            var me = this;
            if(me.getCoursesUrl == url)return;
            me.getCoursesUrl = url;
            $('._home_smallClassCon').show();
            me.getCourses(url,function(){
                me.createCourseEles(me.classDatas,function(){
                    $(me.courseCon).append(me.eles.container);
                    me.changePage(0);
                });
            });
        },
        initTopClass : function(url){
            var me = this;
            if(me.getCoursesUrl == url)return;
            me.getCoursesUrl = url;
            me.thisCourseId = 'top';
            $('._home_smallClassCon').hide();
            $('._home_addedClass._se_active').removeClass('_se_active');
            me.getCourses(url,function(){
                me.createCourseEles(me.classDatas,function(){
                    $(me.courseCon).append(me.eles.container);
                    me.changePage(0);
                });
            });
        },
        
        //拿到一个分类的所有课程
        getCourses : function(url,next){
            var me = this;

            sendMessage('get',ecgeditorPort,url,'',function(data){
                me.coursesData = me.setPageDevide(data.data,6);
                if(!me.coursesData) {
                    $(me.courseCon).empty().append('<p style="text-align: center">该分类还没有课程，敬请期待！</p>');
                    return;
                }
                next();
            });
        },
        init : function(){
            var me = this;
            var titleCon = createEle('div');titleCon.className = '_home_titleCon';
            var titleMain = createEle('div');titleMain.className = '_home_titleMain';titleCon.appendChild(titleMain);
            var titleMainH4 = createEle('h4');titleMainH4.innerHTML = '学做网简介';titleMain.appendChild(titleMainH4);
            var titleMainP = createEle('p');titleMainP.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;学做网是用学习设计的思想和技术开发的在线教育平台，全方位支持工学结合在线课程的设计、开发、实施、评估，和共享。特别支持职教学生在应用的情境中通过任务驱动，以工作过程为导向，学习相关知识和技能，同时能够运用所学的知识与技能解决问题、完成任务，并在应用中评估学习效果。';titleMain.appendChild(titleMainP);
            var titleListCon = createEle('div');titleListCon.className = '_home_titleListCon';
            var titleListC = createEle('div');titleListC.className = '_home_titleListC';titleListCon.appendChild(titleListC);
            $('._page_view').append(titleCon).append(titleListCon);

            me.createClasses();
        }
    };

    window['Home'] = Home;
})($);
