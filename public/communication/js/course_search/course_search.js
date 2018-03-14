/**
 * Created by admin on 2016/12/19.
 */

/******DOM元素以及变量准备****
 *
 */

var count_of_page = q('#count_of_page'),
    search = q('#search'),
    loading = q('.loading')[0],
    current_page = q('#current_page'),
    page_counts = q('#page_counts'),
    body = q('._body')[0],
    rightMenu = q('#rightMenu'),
    lastCountOfPage = 10,
    eventer = new Eventer(),
    data = {};

/****数据监测*****
 *
 */

defineProp(data, 'org_courses', [], function(value) {

});

defineProp(data, 'manage_courses', [], function(value) {

});

defineProp(data, 'learn_courses', [], function(value) {

});

defineProp(data, 'type', 'learn', function(value) {
    if (value === 'learn') {
        data.course_list = data.learn_courses || [];
    } else if (value === 'manage') {
        data.course_list = data.manage_courses || [];
    } else if (value === 'org') {
        data.course_list = data.org_courses || [];
    }
    $('._type span[data-type=' + value + ']')
        .siblings().removeClass('_active')
        .end().addClass('_active');
});

defineProp(data, 'init', 3, function(value) {
    if (value === 0) {
        eventer.emit('init');
    }
});

defineProp(data, 'course_list', [], function(value) {
    resetPageCounts();
    data.current_page = 1;
});

defineProp(data, 'current_course_list', [], function(value) {
    renderCourseList();
});

defineProp(data, 'count_of_page', 10, function(value) {
    resetPageCounts();
    count_of_page.value = value;

    resetCurrentPage(Math.ceil(data.current_page * lastCountOfPage / value));
    lastCountOfPage = value;
});

defineProp(data, 'page_counts', 1, function(value) {
    page_counts.innerHTML = value;
});

defineProp(data, 'current_page', 1, function(value) {
    current_page.innerHTML = value;
    resetCurrentCourseList();
});


/*****自定义事件监听****
 *
 */

eventer.on('init', function(value) {
    data.type = 'learn';
    if (loading.parentNode) {
        loading.parentNode.removeChild(loading);
    }
});

eventer.on('init_config', function(value) {
    data.config = value;
    loadingData(value);
});

eventer.on('init_error', function(value) {
    console.log(value);
});

eventer.on('org_courses', function(value) {
    data.org_courses = value;
    data.init--;
});

eventer.on('manage_courses', function(value) {
    data.manage_courses = value;
    data.init--;
});

eventer.on('learn_courses', function(value) {
    data.learn_courses = value;
    data.init--;
});

/*****DOM事件监听****
 *
 */

$('._container')
    .on('change', '#count_of_page', function() {
        data.count_of_page = this.value;
    })
    .on('click', '#first_page', function() {
        data.current_page = 1;
    })
    .on('click', '#prev_page', function() {
        if (data.current_page === 1) {
            alert('当前已是第一页！');
        } else {
            data.current_page--;
        }
    })
    .on('click', '#next_page', function() {
        if (data.current_page === data.page_counts) {
            alert('当前已是最后一页！');
        } else {
            data.current_page++;
        }
    })
    .on('click', '#last_page', function() {
        data.current_page = data.page_counts;
    })
    .on('click', '._type span[data-type]', function() {
        data.type = this.getAttribute('data-type');
    });

document.addEventListener('click', function() {
    rightMenu.style.display = 'none';
});

window.addEventListener('load', function() {
    getMode();
});

search.addEventListener('keyup', function(event) {
   if (event.keyCode === 13) {
       if (this.value >= 1 && this.value <= data.page_counts) {
           data.current_page = this.value;
       }
   }
});

/****数据处理*****
 *
 */

function count() {
    if (data.init > 0) {
        data.init--;
    }
}

function resetCurrentCourseList() {
    var start, end;
    if (!data.course_list.error) {
        if (data.current_page >= 1 && data.current_page <= data.page_counts) {
            start = (data.current_page - 1) * data.count_of_page;
            end = data.current_page * data.count_of_page;
            data.current_course_list = data.course_list.slice(start, end);
        }
    } else {
        data.current_course_list = false;
    }
}

function resetCurrentPage(value) {
    if (value > 0) {
        data.current_page = value > data.page_counts ? (data.page_counts || 1) : value;
    } else {
        data.current_page = data.current_page > data.page_counts ? (data.page_counts || 1) : (data.current_page || 1);
    }
}

function resetPageCounts() {
    if (data.course_list && data.course_list.length) {
        data.page_counts = Math.ceil(data.course_list.length / data.count_of_page);
    }
}

/*****数据排序***
 *
 */

function sort(a, b) {
    return a - b < 0 ? 1 : -1;
}

/******从服务端获取数据****
 *
 */

function getMode() {
    $.ajax({
        url: './config',
        type: 'get',
        success: function(info) {
            eventer.emit('init_config', info);
        },
        error: function(info) {
            eventer.emit('init_error', info);
        }
    });
}

/******界面渲染*****
 *
 */

function renderCourseList() {
    var value = data.current_course_list;
    var courseList = '';
    if (value === false) {
        courseList += '<div style="height: 250px"><h1 class="_tips">获取信息失败！</h1></div>';
    } else {
        if (value.forEach) {
            if (value.length === 0) {
                courseList += '<div style="height: 250px"><h1 class="_tips">没有可显示的记录！</h1></div>';
            } else {
                value.forEach(function(item) {
                    courseList += getCourseCard(item);
                });
            }
        }
    }
    body.innerHTML = '';
    body.insertAdjacentHTML('beforeEnd', courseList);
    $('[data-toggle="popover"]').popover();
}

function showRightMenu(event) {
    event = event || window.event; //处理event事件对象兼容性

    rightMenu.style.display = "block";
    rightMenu.style.left = event.clientX + "px";
    rightMenu.style.top = event.clientY + "px";

    event.stopPropagation();
    event.preventDefault();
}

function editorMenu(ele) {
    var status = ele.getAttribute('data-status'),
        courseId = ele.getAttribute('data-courseId'),
        orgId = ele.getAttribute('data-orgId'),
        userId = data.config.userId,
        coursePlayer = data.config.coursePlayer,
        a0 = rightMenu.children[0].children[0],
        a1 = rightMenu.children[1].children[0],
        a2 = rightMenu.children[2].children[0];

    if (data.type === 'learn') {
        switch (status) {
            case '0' :
                rightMenu.style.display = 'none';
                a0.href = '/CourseOrg/opt?LRNSCN_ORG_ID=' + orgId + '&optType=look';
                a0.style.display = 'none';
                a1.style.display = 'none';
                a1.innerHTML = '';
                a1.href = '#';
                a2.style.display = 'none';
                a2.innerHTML = '';
                a2.href = '#';
                break;
            case '1' :
                a0.href = '/CourseOrg/opt?LRNSCN_ORG_ID=' + orgId + '&optType=look';
                a0.style.display = 'none';
                a1.style.display = 'block';
                a1.innerHTML = '继续学习';
                a1.href = coursePlayer + 'courses/' + courseId;
                a2.style.display = 'none';
                a2.innerHTML = '';
                a2.href = '#';
                break;
            case '2' :
                a0.href = '/CourseOrg/opt?LRNSCN_ORG_ID=' + orgId + '&optType=look';
                a0.style.display = 'none';
                a1.style.display = 'block';
                a1.innerHTML = '继续学习';
                a1.href = coursePlayer + 'courses/' + courseId;
                a2.style.display = 'block';
                a2.innerHTML = '查看学习状态';
                a2.href = coursePlayer + 'courses/' + courseId;
                break;
            case '3' :
                a0.href = '/CourseOrg/opt?LRNSCN_ORG_ID=' + orgId + '&optType=look';
                a0.style.display = 'block';
                a1.style.display = 'block';
                a1.innerHTML = '再次组织课程';
                a1.href = '#';
                a2.style.display = 'block';
                a2.innerHTML = '查看学习状态';
                a2.href = coursePlayer + 'courses/' + courseId;
                break;
        }
    } else if (data.type === 'org') {
        switch (status) {
            case '0' :
                a0.href = '/CourseOrg/opt?LRNSCN_ORG_ID=' + orgId + '&optType=look';
                a0.style.display = 'block';
                a1.style.display = 'block';
                a1.innerHTML = '再次组织课程';
                a1.href = '/CourseOrg/search?userId=' + userId;
                a2.style.display = 'block';
                a2.innerHTML = '继续组织课程';
                a2.href = '/CourseOrg/opt?LRNSCN_ORG_ID=' + orgId + '&optType=edit';
                break;
            case '1' :
                a0.href = '/CourseOrg/opt?LRNSCN_ORG_ID=' + orgId + '&optType=look';
                a0.style.display = 'block';
                a1.style.display = 'block';
                a1.innerHTML = '再次组织课程';
                a1.href = '/CourseOrg/search?userId=' + userId;
                a2.style.display = 'none';
                a2.innerHTML = '';
                a2.href = '#';
                break;
            case '2' :
                a0.href = '/CourseOrg/opt?LRNSCN_ORG_ID=' + orgId + '&optType=look';
                a0.style.display = 'block';
                a1.style.display = 'block';
                a1.innerHTML = '再次组织课程';
                a1.href = '#';
                a2.style.display = 'block';
                a2.innerHTML = '查看学习状态';
                a2.href = '#';
                break;
            case '3' :
                a0.href = '/CourseOrg/opt?LRNSCN_ORG_ID=' + orgId + '&optType=look';
                a0.style.display = 'none';
                a1.style.display = 'block';
                a1.innerHTML = '查看学习状态';
                a1.href = coursePlayer + 'courses/' + courseId;
                a2.style.display = 'none';
                a2.innerHTML = '';
                a2.href = '#';
                break;
        }
    } else if (data.type === 'manage') {
        rightMenu.style.display = 'none';
    }
}





