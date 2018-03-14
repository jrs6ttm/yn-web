/**
 * Created by admin on 2016/11/4.
 */

(function (window) {
    var coursesInfoByTeacher = [];
    var coursesInfoByStudent = [];
    var resultInfo = [];
    var i, card, pageCounts, flag = 2;
    var searchResult = document.getElementsByClassName('searchResult')[0];
    var bottomTip = document.getElementsByClassName('bottomTip')[0];
    var paging = document.getElementById('countOfPage');
    var currentPage =  document.getElementById('currentPage');
    //var cancelInputBtn = document.getElementById('cancelInputBtn');
    var rolesEle = document.getElementsByClassName('searchAction')[0];
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

    $('input[type="radio"]').click(function() {
        //if (roles.length === 1) {
        //    return;
        //}
        setRoleValue(this.value);
        queryCourse();
    });


    //$(document).keydown(bindEvent);



    /*
     处理函数
     */

    function createResultCard(courseId, courseName, imgSrc, status) {
        var des;
        if (imgSrc === undefined || imgSrc === '') {
            imgSrc = '/communication/images/course.png';
        }
        if (status === true) {
            des = '';
        } else if (status === false){
            des = '';
        } else if (status === 'on') {
            des = '学习中';
        } else if (status === 'off') {
            des = '已学完';
        }
        return '<div class="col-lg-3 col-md-4 col-xs-6 col-sm-6 searchResultInfo">' +
            '<div class="_home_courseCon _block" data-status="' + status + '"  data-courseId="' + courseId +
            '"><label class="status-description">' + des + '</label><a href="' +
            coursePlayer + 'courses/' + courseId + '" target="_blank"><img class="_home_courseImg img-thumbnail"' + 'alt="' + courseName + '" title="' + courseName +
            '" src="' + imgSrc + '" onerror="this.src=' + "'/communication/images/error.jpg'" +'"></a><a href="' + coursePlayer + 'courses/' + courseId +
            '" target="_blank"><h4 title="' + courseName + '">' + courseName + '</h4></a></div></div>';
    }

    function showCard(value) {
        var count = parseInt(paging.value) + value;
        searchResult.innerHTML = '';
        pageCounts = Math.ceil(resultInfo.length / parseInt(paging.value));
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
                if (resultInfo[i].statement === undefined) {
                    card = createResultCard(resultInfo[i].courseId, resultInfo[i].courseName, '', resultInfo[i].isPublished);
                } else {
                    card = createResultCard(resultInfo[i].courseId, resultInfo[i].courseName, '', resultInfo[i].statement);
                }
                searchResult.insertAdjacentHTML('beforeEnd', card);
            }
        }
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
        //    if (data.courseName.indexOf(key) !== -1) {
        //        arr[i] = coursesInfo[j];
        //        i++;
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
        resultInfo.error = coursesInfo.error;
        pageCounts = Math.ceil(resultInfo.length / parseInt(paging.value));
        currentPage.innerText = '1';
        refresh(0);
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

    function loadingData() {
        $.ajax({
            url: ecgeditor + '/getInstanceByUser',
            type: 'get',
            data: {
                userId: userId,
                isPublished: true,
                isCooperation: false
            },
            success: function(data) {
                data.data = data.data || [];
                data.data.forEach(function(result) {
                    if (courseObj[result.courseId] === undefined) {
                        courseObj[result.courseId] = true;
                        if (result.isPublished) {
                            coursesInfoByTeacher.push(result);
                        }
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
        //$.ajax({
        //    url: ecgeditor + '/getInstanceByUser',
        //    type: 'get',
        //    data: {
        //        userId: userId,
        //        isPublished: false
        //    },
        //    success: function(data) {
        //        console.log(data);
        //        data.data = data.data || [];
        //        data.data.forEach(function(result) {
        //            if (courseObj[result.courseId] === undefined) {
        //                courseObj[result.courseId] = true;
        //                coursesInfoByTeacher.push(result);
        //            }
        //        });
        //
        //        flag--;
        //        console.log(data);
        //        if (loading.parentNode && flag === 0) {
        //            searcher.emit('init', {});
        //        }
        //    },
        //    error: function(data) {
        //        flag--;
        //        if (loading.parentNode && flag === 0) {
        //            searcher.emit('init', {});
        //            console.log(data);
        //        }
        //    }
        //});
        $.ajax({
            url: '/getNoOrgByUser',
            type: 'get',
            data: {
                userId : userId || ''
            },
            success: function(data) {
                coursesInfoByStudent = data.data || [];
                flag--;
                console.log(data);
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
