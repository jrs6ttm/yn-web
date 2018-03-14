/**
 * Created by admin on 2016/11/28.
 */
/******界面渲染*****
 *
 */

function getCourseCard(info) {
    var card = '';
    info.forEach(function(item) {
        var src = '/communication/images/course.png';
        if (item.FILE_ICON) {
            src = item.FILE_ICON;
        }
        card += '<div class="course left" data-org="' + item.LRNSCN_ORG_ID + '" data-course="' + item.INSTANCE_ID + '">' +
                    '<img src="' + src + '">' +
                    '<h4>' +
                        '<span class="ellipsis" title="' + item.INSTANCE_NAME + '">' + item.INSTANCE_NAME + '</span>' +
                        '<span>' + item.CREATE_DATE + '</span></h4>' +
                     '<span>' + item.TEACHER_NAME + '</span>' +
                 '</div>';
    });
    return card;
}

function getSelectCard(info) {
    var card = '<option value="all">所有课程</option>';
    info.forEach(function(item) {
        card += '<option value="' + item.id + '">' + item.name + '</option>';
    });
    return card;
}

function render(ele, html){
    ele.innerHTML = '';
    ele.insertAdjacentHTML('beforeEnd', html);
}

function openModal() {
    modal.style.display = 'block';
    background.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
    background.style.display = 'none'
}

/******从服务端获取数据****
 *
 */

function getCourseInfo() {
    $.ajax({
        url: '/CourseOrg/optCourseOrg/search',
        type: 'get',
        success: function(info) {
            info = zh(info);
            info.datas = info.datas || [];
            process(info.datas);
            eventer.emit('init', info.datas.length);
            console.log(info.datas);
        },
        error: function(data) {
            eventer.emit('init_error');
            console.log(data);
        }
    });
}

/******数据处理****
 *
 */

function process(info) {
    var courses = {},
        map = {};
    info.sort(function(a,b) {
        var time1 = +(new Date(a.CREATE_DATE)),
            time2 = +(new Date(b.CREATE_DATE));
        return time1 - time2 < 0 ? 1 : -1;
    });
    data.all_instance = info;
    data.current_instance = data.all_instance;
    info.forEach(function(item) {
        var id = item.INSTANCE_ID,
            name = item.INSTANCE_NAME;
        if (courses[id] === undefined) {
            courses[id] = name;
        }
        map[id] =  map[id] || [];
        map[id].push(item);
    });
    data.courses = courses;
    data.map = map;

}


/******DOM元素以及变量准备****
 *
 */

var $container = $('.container'),
    courses = q('.courses')[0],
    select = q('#courses'),
    modal = q('.modal')[0],
    background = q('.background')[0],
    loading = q('.loading')[0],
    eventer = new Eventer(),
    data = {},
    mode = 'dev';



/****数据监测*****
 *
 */

defineProp(data, 'current_instance', [], function(value) {
    var card = getCourseCard(value);
    render(courses, card);
});

defineProp(data, 'all_instance', {}, function(value) {
    console.log('set all_instance');
});

defineProp(data, 'courses', {}, function(value) {
    var arr = [];
    var card;
    for(var i in value) {
        arr.push({
            id : i,
            name : value[i]
        });
    }
    card = getSelectCard(arr);
    render(select, card);
});

defineProp(data, 'map', {}, function(value) {

});

defineProp(data, 'select_course', 'all', function(value) {
    select.value = value;
    value === 'all' ? data.current_instance = data.all_instance : data.current_instance = data.map[value];
});

/*****自定义事件监听*****
 *
 */

eventer.on('init', function(length) {
    if (loading.parentNode) {
        loading.parentNode.removeChild(loading);
    }
    console.log('init %s', length);
});

eventer.on('init_error', function() {
    console.log('init_error');
});

/*****DOM事件监听*****
 *
 */

select.addEventListener('change', function() {
    data.select_course = this.value;
});

$container.on('click', '.course.left', function() {
    var data = {},
        subUrl = window.location.href;
    data.orgId = this.getAttribute('data-org');
    data.courseId = this.getAttribute('data-course');
    openModal();
    postMessage(data, subUrl);
});

q('._close')[0].addEventListener('click', function() {
    closeModal();
});

/*****通讯*****
 *
 */

function postMessage(data, url) {
    window.frames[0].postMessage(data, url);
}


/*****初始化*****
 *
 */
getCourseInfo();

