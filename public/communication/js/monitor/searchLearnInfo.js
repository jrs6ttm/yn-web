/**
 * Created by admin on 2016/11/23.
 */
/******界面渲染*****
 *
 */

function getRecordCard(info) {
    var item = '',
        start = (data.current_page - 1) * data.count_of_page,
        time, year, month, date, hour, minute, seconds,
        action;

    info.forEach(function(result, i) {
        i += start + 1;
        time = new Date(parseInt(result.optTime));
        year = time.getFullYear();
        month = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1;
        date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
        hour = time.getHours();
        minute = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
        seconds = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
        if (result.subtaskName) {
            action = result.subtaskName + ' / ' + result.taskName
        } else {
            action = result.taskName;
        }
        time = year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + seconds;
        if (result.link) {
            if (result.link.toLowerCase().indexOf('pageoffice://') === 0) {
                item += '<tr><td>' + i + '</td><td>' + time +  '</td><td>' + result.userName + '</td><td>' + result.optDes + '</td><td>' + action
                    + '</td><td>' + result.optType + '</td><td><a href="' + result.link + '">' + result.optResult + '</td><td>' + (result.note || '') + '</td></tr>';
            } else {
                item += '<tr><td>' + i + '</td><td>' + time +  '</td><td>' + result.userName + '</td><td>' + result.optDes + '</td><td>' + action + '</td><td>' +
                    result.optType + '</td><td><a href="' + result.link + '" target="_blank">' + result.optResult + '</td><td>' + (result.note || '') + '</td></tr>';
            }
        } else {
            item += '<tr><td>' + i + '</td><td>' + time +  '</td><td>' + result.userName + '</td><td>' + result.optDes + '</td><td>' + action
                + '</td><td>' + result.optType + '</td><td>' + result.optResult + '</td><td>' + (result.note || '') + '</td></tr>';
        }
    });
    return '<thead><tr style="background-color : #eeeeee">' +
        '<th style="width: 50px">序号</th><th style="width: 150px; cursor: pointer" id="operateTime">操作时间</th><th style="min-width: 100px">操作人员</th><th style="min-width: 100px">操作说明</th>' +
        '<th style="min-width: 150px; max-width: 260px">学习活动</th><th style="min-width: 100px">操作类型</th><th style="min-width: 100px">操作结果</th><th style="min-width: 100px">备注说明</th></thead><tbody>'
        + item + '</tbody>';
}

function getSelectCard(data) {
    var item = '<option value="all">全部所有</option>';
    data.forEach(function(result) {
        if (result.USER_ID) {
            item += '<option value="' + result.USER_ID + '">' + result.NAME + '</option>';
        } else if (result.uid) {
            item += '<option value="' + result.synid + '">' + (result.displayname || result.uid) + '</option>';
        } else if (typeof result === 'string') {
            item += '<option>' + result + '</option>';
        }
    });
    return item;
}

function getTreeCard(data) {
    var card  = '';
    if(data){
        if (data.children && data.children.length) {
            card = '<li><i class="_icon"></i><span data-id="' + data.id + '" title="'+ data.name + '">' + data.name +  '</span><ul>';
            //当children 是对象时
            //for (var i in data.children) {
            //    card += getTreeCard(data[i]);
            //}
            //当children 是数组时
            data.children.forEach(function(item) {
                card += getTreeCard(item);
            });
            card += '</ul></li>';
        } else {
            card = '<li><i></i><span data-id="' + data.id + '">' + data.name + '</span></li>';
        }
    }
    return card;
}

function render(ele, html){
    ele.innerHTML = '';
    ele.insertAdjacentHTML('beforeEnd', html);
}

function refreshCurrentRecord(value) {
    var count = data.count_of_page,
        page;
    value ? page = value : page = data.current_page;
    data.current_record = data.record.slice((page - 1) * count, page * count);
}


/******从服务端获取数据*****
 *
 */

function getStudentInfo(orgId, flag) {
    var callback = {
        success: function(info) {
            info = zh(info);
            //console.log(info);
            data.select_student = info;
            count();
        },
        error: function(info) {
            //console.log(info);
            count();
            console.log('获取学生列表出错!');
        }
    };
    if (flag === 'org') {
        $.ajax({
            url: '/CourseOrg/optCourseOrgUser/searchUsers',
            type: 'get',
            data: {
                LRNSCN_ORG_ID: orgId
            },
            success: callback.success,
            error: callback.error
        });
    } else {
        $.ajax({
            url: '/findStudents?courseId='+data.courseId,
            type: 'get',
            success: callback.success,
            error: callback.error
        });
    }
}

function getCourseTree(arr) {
    $.ajax({
        url: '/getCourseTree',
        type: 'post',
        data: {
            courseIds: JSON.stringify(arr)
        },
        success: function(info) {
            if (info.error) {
                eventer.emit('getCourseTree_error', info.error);
            } else {
                data.tree = info;
                data.current_tree = data.tree;
            }
            count();
            //console.log(info);
        },
        error: function(info) {
            count();
            //console.log(info);
        }
    })
}

function getOptions(orgId, userId, supTaskId, taskId) {
    loadingBtn.className = '_loading';
    if (userId === 'all') {
        userId = '';
    }
    var info = {
        orgId: orgId || '',
        courseId: data.courseId || '',
        userId: userId || ''
    };
    if (supTaskId) {
        info.subtaskId = supTaskId;
    }
    if (taskId) {
        info.taskId = taskId;
    }
    $.ajax({
        url: '/findOptionsByOrgId',
        type: 'get',
        data: info,
        success: function(info) {
            //console.log(info);
            if (info.error) {
                eventer.emit('getOptions_error', info.error);
            } else {
                data.all_record = info;
                resetCurrentPage(1);
            }
            loadingBtn.className = '_refresh';
            count();
        },
        error: function(info) {
            //console.log(info);
            count();
        }
    });
}

function process(info) {
    info.sort(function(a,b) {
        var time1 = +(new Date(a.optTime)),
            time2 = +(new Date(b.optTime));
        if (data.sort === 1) {
            return time1 - time2 < 0 ? 1 : -1;
        } else if (data.sort === -1){
            return time1 - time2 > 0 ? 1 : -1;
        }
    });
    return info;
}

/******DOM元素以及变量准备****
 *
 */


var $tree = $('#record-tree'),
    table = q('.table')[0],
    select_student = q('#select_student'),
    select_type = q('#select_type'),
    first_page = q('#first_page'),
    prev_page = q('#prev_page'),
    current_page = q('#current_page'),
    page_counts = q('#page_counts'),
    next_page = q('#next_page'),
    last_page = q('#last_page'),
    count_of_page = q('#count_of_page'),
    search = q('#search'),
    loadingBtn = q('#search_course_info'),
    loading = q('.loading')[0],
    body = q('body')[0],
    _body = q('._body')[0],
    tips,
    last_page_counts = 10,
    eventer = new Eventer(),
    data = {
        courseId : ''
    };

    tips = document.createElement('h1');
    tips.className = 'tips';
    tips.innerHTML = '没有可显示的记录！';

/****数据监测*****
 *
 */

defineProp(data, 'init', 3, function(value) {
   if (value === 0) {
       eventer.emit('init');
   }
});

defineProp(data, 'sort', 1, function(value) {
    if (data.record.reverse) {
        data.record = data.record.reverse();
    }
});

defineProp(data, 'all_record', [], function(value) {
    adjustRecord();
});

defineProp(data, 'record', [], function(value) {
    data.page_counts = Math.ceil(value.length / data.count_of_page);
    resetCurrentPage();
});

defineProp(data, 'current_record', [], function(value) {
    render(table, getRecordCard(value));
    if (value.length === 0) {
        if (tips.parentNode !== _body) {
            _body.appendChild(tips);
        }
    } else {
        if (tips.parentNode === _body) {
            _body.removeChild(tips);
        }
    }
});

defineProp(data, 'current_node_id', '', function(value) {
    adjustRecord();
});

defineProp(data, 'current_node_type', 0, function(value) {

});

defineProp(data, 'select_student', [], function(value) {
    render(select_student, getSelectCard(value));
    data.current_student = data.current_student;
});

defineProp(data, 'current_student', 'all', function(value) {
    select_student.value = value;
    adjustRecord();
});

defineProp(data, 'select_type', [], function(value) {
    render(select_type, getSelectCard(value));
});

defineProp(data, 'current_type', 'all', function(value) {
    adjustRecord();
});

defineProp(data, 'current_tree', [], function(value) {
    var card = '<ul class="_course">';
    $tree.html('');
    if (value && value.forEach) {





        value.forEach(function(data) {
            card += getTreeCard(data);
        });
    }
    card += '</ul>';
    $tree.append(card);
});

defineProp(data, 'count_of_page', 10, function(value) {
    count_of_page.value = value;
    data.page_counts = Math.ceil(data.record.length / value);

    resetCurrentPage(Math.ceil(data.current_page  * last_page_counts / value));
    last_page_counts = value;
});

defineProp(data, 'page_counts', 1, function(value) {
    page_counts.innerHTML = value;
});

defineProp(data, 'current_page', 1, function(value) {
    current_page.innerHTML = value;
    refreshCurrentRecord();
});


/****数据处理*****
 *
 */

function count() {
    if (data.init > 0) {
        data.init--;
    }
}

function adjustRecord() {
    data.record = filterType(filterNode(filterStudent(data.all_record || [])));
}

function filterStudent(arr) {
    if (data.current_student === 'all') {
        return arr;
    } else {
        return arr.filter(function(item) {
            if (data.current_student.indexOf('user') === 0) {
                return item.userName === data.current_student;
            }else {
                return item.userId === data.current_student;
            }
        });
    }
}

function filterNode(arr) {
    if (data.current_node_type === 0) {
        return arr;
    } else if (data.current_node_type === 1) {
        return arr.filter(function(item) {
            return item.subtaskId === data.current_node_id;
        });
    } else if (data.current_node_type === 2) {
        return arr.filter(function(item) {
            return item.taskId === data.current_node_id;
        });
    }
}

function filterType(arr) {
    if (data.current_type === 'all') {
        return arr;
    } else {
        return arr.filter(function(item) {
            return item.optType === data.current_type;
        });
    }
}

function setNodeInfo(id, type) {
    data.current_node_type = type;
    data.current_node_id = id;
}

function resetCurrentPage(value) {
    if (value > 0) {
        data.current_page = value > data.page_counts ? (data.page_counts || 1) : value;
    } else {
        data.current_page = data.current_page > data.page_counts ? (data.page_counts || 1) : (data.current_page || 1);
    }
}

function getNodeGrade(ele) {
    var grandparentNode = findGrandparentNode(ele);
    if (grandparentNode && grandparentNode.className === '_course') {
        return 0;
    } else {
        return getNodeGrade(grandparentNode) + 1;
    }
}

function findGrandparentNode(ele) {
    var pNode = ele.parentNode;
    if (pNode && pNode.parentNode) {
        return pNode.parentNode;
    } else {
        return null;
    }
}

/*****自定义事件监听****
 *
 */

eventer.on('init', function() {
    if (loading.parentNode) {
        loading.parentNode.removeChild(loading);
    }
    console.log('init');
});

eventer.on('init_error', function() {
    console.log('init_error');
});

eventer.on('getOptions_error', function(data) {
   tips.innerHTML = '查询记录失败！';
});

eventer.on('getCourseTree_error', function(data) {

});

/*****DOM事件监听****
*
*/

$tree.on('click', '._icon', function() {
    $(this.parentNode).toggleClass('_open');
}).
    on('click', 'span', function() {
        var id = this.getAttribute('data-id'),
            grade = getNodeGrade(this);
        $tree.find('span._active').removeClass('_active');
        $(this).addClass('_active');
        setNodeInfo(id, grade);
    });

select_student.addEventListener('change', function(){
    //console.log(this.value);
    data.current_student = this.value;
});

select_type.addEventListener('change', function(){
    //console.log(this.value);
    data.current_type = this.value;
    //console.log(this.selectedIndex);
});

count_of_page.addEventListener('change', function() {
    data.count_of_page = this.value;
    //console.log('change');
});

first_page.addEventListener('click', function() {
    data.current_page = 1;
});

prev_page.addEventListener('click', function() {
    if (data.current_page === 1) {
        alert('当前已经是第一页!');
    } else if (data.current_page > 1) {
        data.current_page--;
    }
});

next_page.addEventListener('click', function() {
    if (data.current_page === data.page_counts) {
        alert('当前已经是最后一页!');
    } else if (data.current_page < data.page_counts){
        data.current_page++;
    }
});

last_page.addEventListener('click', function() {
    data.current_page = data.page_counts || 1;
});

loadingBtn.addEventListener('click', function() {
    getOptions(data.orgId);
});

search.addEventListener('keyup', function(event) {
   if (event.keyCode === 13) {
       if (this.value && (this.value <= data.page_counts) && (this.value >= 1)) {
           data.current_page = this.value;
       }
   }
});

$(table).on('click', '#operateTime', function() {
    data.sort === 1 ? data.sort = -1 : data.sort = 1;
});

/*****通讯*****
 *
 */

window.addEventListener('message', function(e) {
    var info = e.data;
    //console.log(info);
    if (loading.parentNode !== body) {
        body.appendChild(loading);
        data.init = 3;
    }
    change(info.courseId, info.orgId, info.userId);
    getOptions(info.orgId);
});

function change(courseId, orgId, userId) {
    if (courseId) {
        data.courseId = courseId;
        getCourseTree([courseId]);
        //getCourseTree(['6da27590-70af-11e6-ba19-53ce6aac1a16']);
    }
    if (orgId) {
        data.orgId = orgId;
        getStudentInfo(orgId, 'org');
    } else {
        getStudentInfo(courseId, 'course');
    }
    if (userId) {
        data.current_student = userId;
    } else {
        data.current_student = 'all';
    }
}


/*****静态数据测试*****
 *
 */

data.select_type = [
    '进入活动',
    '完成活动',
    '查看活动',
    '保存文件',
    '完成试题',
    '结束课程'
];

var polling = setInterval(function() {console.log(data)
    if (data.orgId) {
        getOptions(data.orgId);
    } else if (data.courseId) {
        getOptions();
    }
}, 600000);

//data.select_type = example.types;
//data.record = example.record;
//data.select_student = example.students;
//data.tree = example.tree;
//data.current_tree = example.tree;

