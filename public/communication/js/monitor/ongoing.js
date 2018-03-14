/**
 * Created by admin on 2016/8/19.
 */
//    var data = {
//        "userId": "J960DGV0",
//        "datas": [{
//            "LRNSCN_ORG_ID": "a29586c0-6074-11e6-a234-bd6a0d946d8b",
//            "TEACHER_ID": "J960DGV0",
//            "TEACHER_NAME": "user19",
//            "ORG_USER_ID": "J960DGV0",
//            "ORG_USER_NAME": "user19",
//            "BEGIN_TIME": "2016-08-17 08:59:18",
//            "END_TIME": "2016-08-17 08:59:18",
//            "LRN_AREA_ID": "001",
//            "LRN_AREA_NAME": "SQL注入系列教程",
//            "INSTANCE_ID": "001002",
//            "INSTANCE_NAME": "SQL注入进阶篇",
//            "MIN_GROUP": "1",
//            "MAX_GROUP": "1",
//            "MIN_MEMBER": "1",
//            "MAX_MEMBER": "1",
//            "REMARK": null,
//            "ISVALID": "1",
//            "STATUS": "0",
//            "CREATOR_ID": "J960DGV0",
//            "CREATOR_GID": "",
//            "CREATOR_GID_NAME": "",
//            "LSTUPDDATE": "2016-08-17 08:59:18",
//            "LSTUPDID": "J960DGV0"
//        }]
//    };

(function (window) {
    var coursesInfoByTeacher = [];
    var coursesInfoByStudent = [];
    var resultInfo = [];
    var i, card, pageCounts, flag = 3;
    var searchResult = document.getElementsByClassName('searchResult')[0];
    var bottomTip = document.getElementsByClassName('bottomTip')[0];
    //var publishing = document.getElementById('publishing');
    //var published = document.getElementById('published');
    //var learning = document.getElementById('learning');
    //var cancelInputBtn = document.getElementById('cancelInputBtn');
    var paging = document.getElementById('countOfPage');
    var currentPage =  document.getElementById('currentPage');
    var rolesEle = document.getElementsByClassName('searchAction')[0];
    var rightMenu = document.getElementsByClassName('rightMenu')[0];
    var loading = document.getElementsByClassName('loading')[0];
    var role, roles, courseObj = {};


    function Obj() {
        this.events = {};
    }
//绑定事件函数
    Obj.prototype.on = function(eventName, callback) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(callback);
    };
//触发事件函数
    Obj.prototype.emit = function(eventName, _) {
        var events = this.events[eventName],
            args = Array.prototype.slice.call(arguments, 1),
            i, m;

        if (!events) {
            return;
        }
        for (i = 0, m = events.length; i < m; i++) {
            events[i].apply(null, args);
        }
    };

    var searcher = new Obj();

    searcher.on('init', function() {
        queryCourse();
        loading.parentNode.removeChild(loading);
    });

    searcher.on('teacher_error', function() {
        coursesInfoByTeacher.error = true;
    });

    searcher.on('student_error', function() {
        coursesInfoByStudent.error = true;
    });

    roles = ['teacher', 'student'];



    if (roles.length > 1) {
        role = 'teacher';
        rolesEle.style.display = 'block';
    } else if (roles.length = 1) {
        role = roles[0];
        rolesEle.parentNode.removeChild(rolesEle);
    }

    loadingData();


    /*
     事件绑定
     */

    paging.addEventListener('change', function () {
        var value = currentPage.innerText;
        value = parseInt(value) - 1;
        value = value * parseInt(paging.value);
        refresh(value);
    });

    $('.searchResult').on('contextmenu', 'div._home_courseCon._block', function(e) {
        if (role === 'teacher') {
            showRightMenu(e.originalEvent);
            editMenuInTeacher(this, courseOrg);
        } else if (role === 'student') {
            showRightMenu(e.originalEvent);
            editMenuInStudent(this, courseOrg);
        }
    });

    document.getElementById('firstPage').addEventListener('click', function() {
        skipPage(1);
    });

    document.getElementById('lastPage').addEventListener('click', function() {
        skipPage(pageCounts);
    });

    document.getElementById('prevPage').addEventListener('click', function() {
        var value = parseInt(currentPage.innerText);
        if (value === 1) {
            alert('当前页已经是第一页！');
            return;
        }
        skipPage(value - 1);
    });

    document.getElementById('nextPage').addEventListener('click', function() {
        var value = parseInt(currentPage.innerText);
        if (value === pageCounts) {
            alert('当前页已经是最后一页！');
            return;
        }
        skipPage(value + 1);
    });

    //document.getElementsByClassName('litterButton')[0].addEventListener('click', queryCourseByInput);
    //
    //document.getElementsByClassName('searchInput')[1].addEventListener('keyup', function() {
    //    adjustCancelBtn(this);
    //});

    //cancelInputBtn.addEventListener('click', function() {
    //    cancelInput(this);
    //});

    document.addEventListener('click', function() {
        rightMenu.style.display = 'none';
    });

    //$('.searchCheckbox').click(function() {
    //    queryCourse();
    //});

    $('input[type="radio"]').click(function() {
        setRoleValue(this.value);
        queryCourse();
    });

    $(document).keydown(bindEvent);



    /*
     处理函数
     */

    function createResultCard(courseId, courseName, imgSrc, status, orgId, orgName, area, orgTeacher, directTeacher, orgStart, orgEnd, learningStart, learningEnd) {
        if (imgSrc === undefined || imgSrc === '') {
            imgSrc = '/communication/images/course.png';
        }
        var des = '';
        switch(status) {
            case '0' : des = '组织中';
                break;
            case '1' : des = '已组织';
                break;
            case '2' : des = '学习中';
                break;
        }
        orgName = orgName || null;
        orgStart = orgStart || null;
        orgEnd = orgEnd || null;
        orgStart = orgStart || null;
        orgEnd = orgEnd || null;
        directTeacher = directTeacher || null;
        if (des) {
            var template = "<div><label>课程组织机构：</label><span>" + orgName + "</span></div>" +
                "<div><label>课程组织老师：</label><span>" + orgTeacher + "</span></div>" +
                "<div><label>课程负责老师：</label><span>" + directTeacher + "</span></div>" +
                "<div><label>课程组织时间：</label><span>" + orgStart + "</span>-<span>" + orgEnd + "</span></div>";
            var courseCard = '<div class="col-lg-3 col-md-4 col-xs-6 col-sm-6 searchResultInfo">' +
                '<div class="_home_courseCon _block" data-status="' + status + '" data-orgId="' + orgId +'" data-courseId="' + courseId +
                '" data-toggle="popover" data-placement="top" data-trigger="hover" data-html=true data-content="' + template + '"><label class="status-description">' + des + '</label><a href="' +
                coursePlayer + 'courses/' + courseId + '/' + orgId + '" target="_blank"><img class="_home_courseImg img-thumbnail"' + 'alt="' + courseName + '" title="' + courseName +
                '" src="' + imgSrc + '" onerror="this.src=' + "'/communication/images/error.jpg'" +'"></a><a href="' + coursePlayer + 'courses/' + courseId + '/' + orgId +
                '" target="_blank"><h4 title="' + courseName + '">' + courseName + '</h4></a></div></div>';
            return courseCard;
        } else {
            return '';
        }
    }

    function showCard(value) {
        var count = parseInt(paging.value) + value;
        searchResult.innerHTML = '';
        var tips;

        if (resultInfo.error) {
            tips = '<div style="height: 280px"><h1 class="tips">获取信息失败！</h1></div>';
            searchResult.insertAdjacentHTML('beforeEnd', tips);
            return;
        } else if (resultInfo.length === 0) {
            tips = '<div style="height: 280px"><h1 class="tips">没有可显示的记录！</h1></div>';
            searchResult.insertAdjacentHTML('beforeEnd', tips);
            return;
        }

        for (i = value; i < count; i++) {
            if (resultInfo[i] !== undefined) {
                card = createResultCard(resultInfo[i].INSTANCE_ID, resultInfo[i].INSTANCE_NAME, resultInfo[i].FIEL_ICON, resultInfo[i].STATUS, resultInfo[i].LRNSCN_ORG_ID,
                    resultInfo[i].CREATOR_ORGID_NAME, null, resultInfo[i].ORG_USER_NAME, resultInfo[i].TEACHER_NAME, resultInfo[i].BEGIN_TIME, resultInfo[i].END_TIME, null, null);
                searchResult.insertAdjacentHTML('beforeEnd', card);
            }
        }

        $('[data-toggle="popover"]').popover();
    }

    function skipPage(value) {
        if (value < 1) return;
        var currentPage = document.getElementById('currentPage');
        currentPage.innerText = value;
        value = (value - 1) * parseInt(paging.value);
        showCard(value);
    }

    function bindEvent(e) {
        var activeEle = document.activeElement;
        if (e.keyCode === 13) {
            if(activeEle.getAttribute('id') === 'search') {
                skipPage(activeEle.value);
            } else if (activeEle.getAttribute('class') === 'searchInput') {
                queryCourseByInput();
            }
        }
    }

    function queryCourse(key) {
        var i = 0;
        var arr = [];
        var coursesInfo;
        key = key || '';
        if (role === 'teacher') {
            coursesInfo = coursesInfoByTeacher;
        } else if (role === 'student') {
            coursesInfo = coursesInfoByStudent;
        } else {
            coursesInfo = [];
        }
        //coursesInfo.forEach(function(data, j) {
        //    if (publishing.checked && data.STATUS === '0' && data.INSTANCE_NAME.indexOf(key) !== -1) {
        //        arr[i] = coursesInfo[j];
        //        i++;
        //    } else if (published.checked && data.STATUS === '1' && data.INSTANCE_NAME.indexOf(key) !== -1) {
        //        arr[i] = coursesInfo[j];
        //        i++;
        //    } else if (learning.checked && data.STATUS === '2' && data.INSTANCE_NAME.indexOf(key) !== -1){
        //        arr[i] = coursesInfo[j];
        //        i++;
        //    }  else if (!publishing.checked && !published.checked && !learning.checked) {
        //        if (data.INSTANCE_NAME.indexOf(key) !== -1) {
        //            arr[i] = coursesInfo[j];
        //            i++;
        //        }
        //    }
        //});
        arr = coursesInfo;
        //按时间进行排序
        arr.sort(function(a,b) {
            var time1 = +(new Date(a.CREATE_DATE)),
                time2 = +(new Date(b.CREATE_DATE));
            return time1 - time2 < 0 ? 1 : -1;
        });
        resultInfo = arr;
        pageCounts = Math.ceil(resultInfo.length / parseInt(paging.value));
        resultInfo.error = coursesInfo.error;
        currentPage.innerText = '1';
        refresh(0);
        console.log(role);
    }

    function queryCourseByInput() {
        var key = document.getElementsByClassName('searchInput')[1].value;
        key = key.trim();
        queryCourse(key);
    }

    function setPageCounts() {
        document.getElementById('pageCounts').innerText = pageCounts;
    }

    function refresh(value) {
        showCard(value);
        setPageCounts();
    }

    //获取node节点的前一个元素
    function getPrevElement(node){
        if(node.previousSibling){
            if(node.previousSibling.nodeType == 1){
                return node.previousSibling;
            }
            return getPrevElement(node.previousSibling);
        }
        return null;
    }

    //function adjustCancelBtn(ele) {
    //    if (ele.value) {
    //        cancelInputBtn.style.display = 'inline';
    //    } else {
    //        cancelInputBtn.style.display = 'none';
    //    }
    //}
    //
    //function cancelInput(ele) {
    //    var input = getPrevElement(ele);
    //    input.value = '';
    //    ele.style.display = 'none';
    //}

    function showRightMenu(event) {
        event = event || window.event; //处理event事件对象兼容性

        /*
         设置右键菜单的位置
         */
        rightMenu.style.display = "block";
        rightMenu.style.left = event.clientX + "px";
        rightMenu.style.top = event.clientY + "px";
        /*
        取消事件冒泡，并阻止默认事件
         */
        cancelEventBubble(event);
        preventDefault(event);
    }

    function editMenuInTeacher(ele, courseOrg) {
        /*
         对右键菜单进行操作
         */

        var status = ele.getAttribute('data-status');
        var orgId = ele.getAttribute('data-orgId');
        var a0 = rightMenu.children[0].children[0],
            a1 = rightMenu.children[1].children[0],
            a2 = rightMenu.children[2].children[0];

        switch (status) {
            case '0' :
                a0.href = courseOrg + '/CourseOrg/opt?LRNSCN_ORG_ID=' + orgId + '&optType=look';
                a0.style.display = 'block';
                a1.style.display = 'block';
                a1.innerHTML = '再次组织课程';
                a1.href = courseOrg + '/CourseOrg/search?userId=' + userId;
                a2.style.display = 'block';
                a2.innerHTML = '继续组织课程';
                a2.href = courseOrg + '/CourseOrg/opt?LRNSCN_ORG_ID=' + orgId + '&optType=edit';
                break;
            case '1' :
                a0.href = courseOrg + '/CourseOrg/opt?LRNSCN_ORG_ID=' + orgId + '&optType=look';
                a0.style.display = 'block';
                a1.style.display = 'block';
                a1.innerHTML = '再次组织课程';
                a1.href = courseOrg + '/CourseOrg/search?userId=' + userId;
                a2.style.display = 'none';
                a2.innerHTML = '';
                a2.href = '#';
                break;
            case '2' :
                a0.href = courseOrg + '/CourseOrg/opt?LRNSCN_ORG_ID=' + orgId + '&optType=look';
                a0.style.display = 'block';
                a1.style.display = 'block';
                a1.innerHTML = '再次组织课程';
                a1.href = '#';
                a2.style.display = 'block';
                a2.innerHTML = '查看学习状态';
                a2.href = '#';
                break;
        }
    }

    function editMenuInStudent(ele) {
        /*
         对右键菜单进行操作
         */

        var status = ele.getAttribute('data-status');
        var courseId = ele.getAttribute('data-courseId');
        var orgId = ele.getAttribute('data-orgId');
        var a0 = rightMenu.children[0].children[0],
            a1 = rightMenu.children[1].children[0],
            a2 = rightMenu.children[2].children[0];

        switch (status) {
            case '0' :
                rightMenu.style.display = 'none';
                a0.href = courseOrg + '/CourseOrg/opt?LRNSCN_ORG_ID=' + orgId + '&optType=look';
                a0.style.display = 'none';
                a1.style.display = 'none';
                a1.innerHTML = '';
                a1.href = '#';
                a2.style.display = 'none';
                a2.innerHTML = '';
                a2.href = '#';
                break;
            case '1' :
                a0.href = courseOrg + '/CourseOrg/opt?LRNSCN_ORG_ID=' + orgId + '&optType=look';
                a0.style.display = 'none';
                a1.style.display = 'block';
                a1.innerHTML = '继续学习';
                a1.href = coursePlayer + 'courses/' + courseId;
                a2.style.display = 'none';
                a2.innerHTML = '';
                a2.href = '#';
                break;
            case '2' :
                a0.href = courseOrg + '/CourseOrg/opt?LRNSCN_ORG_ID=' + orgId + '&optType=look';
                a0.style.display = 'none';
                a1.style.display = 'block';
                a1.innerHTML = '继续学习';
                a1.href = coursePlayer + 'courses/' + courseId;
                a2.style.display = 'block';
                a2.innerHTML = '查看学习状态';
                a2.href = coursePlayer + 'courses/' + courseId;
                break;
        }
    }

    function loadingData() {
        $.ajax({
            url: courseOrg + '/CourseOrg/optCourseOrg/search',
            type: 'get',
            data: {
                TEACHER_ID: userId
            },
            success: function(data) {
                data.datas = data.datas || [];
                data.datas.forEach(function(result) {
                   if (result.STATUS !== '3' && courseObj[result.LRNSCN_ORG_ID] === undefined) {
                       courseObj[result.LRNSCN_ORG_ID] = true;
                       coursesInfoByTeacher.push(result);
                   }
                });
                flag--;
                if (loading.parentNode && flag === 0) {
                    searcher.emit('init', {});
                }
            },
            error: function(data) {
                flag--;
                searcher.emit('teacher_error');
                if (loading.parentNode && flag === 0) {
                    searcher.emit('init', {});
                }
            }
        });
        $.ajax({
            url: courseOrg + '/CourseOrg/optCourseOrg/search',
            type: 'get',
            data: {
                ORG_USER_ID: userId
            },
            success: function(data) {
                data.datas = data.datas || [];
                data.datas.forEach(function(result) {
                    if (result.STATUS !== '3' && courseObj[result.LRNSCN_ORG_ID] === undefined) {
                        courseObj[result.LRNSCN_ORG_ID] = true;
                        coursesInfoByTeacher.push(result);
                    }
                });
                flag--;
                if (loading.parentNode && flag === 0) {
                    searcher.emit('init', {});
                }
            },
            error: function(data) {
                flag--;
                searcher.emit('teacher_error');
                if (loading.parentNode && flag === 0) {
                    searcher.emit('init', {});
                }
            }
        });
        $.ajax({
            url: courseOrg + '/CourseOrg/getMyOrgedCourses',
            type: 'get',
            data: {
                userId : userId
            },
            success: function(data) {
                data = data || [];
                data.forEach(function(result) {
                    if (result.STATUS !== '3') {
                        coursesInfoByStudent.push(result);
                    }
                });
                flag--;
                if (loading.parentNode && flag === 0) {
                    searcher.emit('init', {});
                }
            },
            error: function(data) {
                flag--;
                searcher.emit('student_error');
                if (loading.parentNode && flag === 0) {
                    searcher.emit('init', {});
                }
            }
        });
    }

    function setRoleValue(value) {
        role = value;
    }

})(window);
