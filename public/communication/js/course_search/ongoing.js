/**
 * Created by admin on 2016/12/19.
 */

/******界面渲染*****
 *
 */
function getCourseCard(obj) {
    if (!obj.FIEL_ICON) {
        obj.FIEL_ICON = '/communication/images/course.png';
    }
    var des = '';
    switch(obj.STATUS) {
        case '0' : des = '组织中';
            break;
        case '1' : des = '已组织';
            break;
        case '2' : des = '学习中';
            break;
    }
    obj.CREATOR_ORGID_NAME = obj.CREATOR_ORGID_NAME || null;
    obj.BEGIN_TIME = obj.BEGIN_TIME || null;
    obj.END_TIME = obj.END_TIME || null;
    obj.TEACHER_NAME = obj.TEACHER_NAME || null;
    if (des) {
        var template = "<div><label>课程组织机构：</label><span>" + obj.CREATOR_ORGID_NAME + "</span></div>" +
            "<div><label>课程组织老师：</label><span>" + obj.ORG_USER_NAME + "</span></div>" +
            "<div><label>课程负责老师：</label><span>" + obj.TEACHER_NAME + "</span></div>" +
            "<div><label class='left'>课程组织时间：</label><div><div>" + obj.BEGIN_TIME + "</div><div>" + obj.END_TIME + "</div></div></div>";
        return '<div class="_home_courseCon _course" data-status="' + obj.STATUS + '" data-orgId="' + obj.LRNSCN_ORG_ID +'" data-courseId="' + obj.INSTANCE_ID +
            '" data-toggle="popover" data-placement="top" data-trigger="hover" data-html=true data-content="' + template + '"><a href="' +
            data.config.coursePlayer + 'course#' + obj.INSTANCE_ID  +  '" target="_blank"><label class="status-description">' + des + '</label><img class="_home_courseImg img-thumbnail"' + 'alt="' + obj.INSTANCE_NAME + '" title="' + obj.INSTANCE_NAME +
            '" src="' + obj.FIEL_ICON + '" onerror="this.src=' + "'/communication/images/error.jpg'" +'"><h4 title="' + obj.INSTANCE_NAME + '">' + obj.INSTANCE_NAME + '</h4></a></div>';
    } else {
        return '';
    }
}


/******从服务端获取数据****
 *
 */

function loadingData(config) {
    $.ajax({
        url: '/CourseOrg/optCourseOrg/search',
        type: 'get',
        data: {
            TEACHER_ID: config.userId
        },
        success: function(info) {
            info = zh(info);
            info.datas = (info.datas || []).filter(function (item) {
                return item.STATUS !== '3';
            });
            info.datas = info.datas.sort(function(a, b) {
                return sort(new Date(a.BEGIN_TIME), new Date(b.BEGIN_TIME));
            });
            eventer.emit('manage_courses', info.datas);
        },
        error: function(info) {
            eventer.emit('manage_courses', {
                error: info
            });
        }
    });
    $.ajax({
        url: '/CourseOrg/optCourseOrg/search',
        type: 'get',
        data: {
            ORG_USER_ID: config.userId
        },
        success: function(info) {
            info = zh(info);
            info.datas = (info.datas || []).filter(function(item) {
                return item.STATUS !== '3';
            });
            info.datas = info.datas.sort(function(a, b) {
                return sort(new Date(a.BEGIN_TIME), new Date(b.BEGIN_TIME));
            });
            eventer.emit('org_courses', info.datas);
        },
        error: function(info) {
            eventer.emit('org_courses', {
                error: info
            });
        }
    });
    $.ajax({
        url: '/CourseOrg/getMyOrgedCourses',
        type: 'get',
        data: {
            userId : config.userId
        },
        success: function(info) {
            info = zh(info);
            info = (info || []).filter(function(item) {
                return item.STATUS !== '3';
            });
            info = info.sort(function(a, b) {
                return sort(new Date(a.BEGIN_TIME), new Date(b.BEGIN_TIME));
            });
            eventer.emit('learn_courses', info);
        },
        error: function(info) {
            eventer.emit('learn_courses', {
                error: info
            });
        }
    });
}

/*******DOM事件监听******
 *
 */

$('._container').on('contextmenu', 'div._course', function(event) {
    showRightMenu(event.originalEvent);
    editorMenu(this);
});
