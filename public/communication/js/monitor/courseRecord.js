/**
 * Created by admin on 2016/12/13.
 */
/******界面渲染*****
 *
 */

function getCourseCard(info) {
    var card = '';
    info.forEach(function(item) {
        var src = '/communication/images/course.png';
        var time = new Date(item.createTime),
            year, month, date, hour, minute, second;

        year = time.getFullYear();
        month = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1;
        date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
        hour = time.getHours();
        minute = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
        second = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
        time = year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
        if (item.fileIcon && item.fileIcon !== 'undefined') {
            src = zh(item.fileIcon).sourceF;
        }
        card += '<div class="course left" data-course="' + item.courseId + '">' +
            '<img src="' + src + '">' +
            '<h4>' +
                '<span class="ellipsis" title="' + item.courseName +  '">' + item.courseName + '</span>' +
                '<span>' + time + '</span>' +
            '</h4>' +
            '<span>' + item.courseCreator.username + '</span>' +
            '</div>';
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

function getMode() {
    $.ajax({
        url: './config',
        type: 'get',
        success: function(info) {
            data.config = info;
            eventer.emit('init_config', info.ecgeditor);
        },
        error: function(data) {
            eventer.emit('init_error');
            console.log(data);
        }
    });
}

function getCourseInfo(path) {
    $.ajax({
        url: path,
        type: 'get',
        data: {
            userId: data.config.userId,
            isPublished: true,
            isCooperation: false
        },
        success: function(info) {
            info = zh(info);
            process(info.data);
            eventer.emit('init', info.data.length);
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
    info.sort(function(a,b) {
        var time1 = +(new Date(a.createTime)),
            time2 = +(new Date(b.createTime));
        return time1 - time2 < 0 ? 1 : -1;
    });
    data.courses = info;
}


/******DOM元素以及变量准备****
 *
 */

var $container = $('.container'),
    courses = q('.courses')[0],
    modal = q('.modal')[0],
    background = q('.background')[0],
    loading = q('.loading')[0],
    eventer = new Eventer(),
    data = {},
    mode = 'dev';



/****数据监测*****
 *
 */

defineProp(data, 'courses', [], function(value) {
    var card = getCourseCard(value);
    render(courses, card);
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

eventer.on('init_config', function(path) {
    getCourseInfo(path + '/getInstanceByUser');
});

eventer.on('init_error', function() {
    console.log('init_error');
});

/*****DOM事件监听*****
 *
 */

//background.addEventListener('click', function() {
//    closeModal();
//});

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
getMode();
