/**
 * Created by admin on 2016/12/20.
 */

/******界面渲染*****
 *
 */

function getCourseCard(obj) {
    var des;
    if (obj.imgSrc === undefined || obj.imgSrc === '') {
        obj.imgSrc = '/communication/images/course.png';
    }
    if (obj.statement === undefined) {
        des = '';
    } else {
        if (obj.statement === 'on') {
            des = '学习中';
        } else if (obj.statement === 'off') {
            des = '已学完';
        }
    }
    return '<div class="_home_courseCon _course" data-courseId="' + obj.courseId + '"><label class="status-description">' + des + '</label><a href="' +
        data.config.coursePlayer + 'course#' + obj.courseId + '" target="_blank"><img class="_home_courseImg img-thumbnail"' + 'alt="' + obj.courseName + '" title="' + obj.courseName +
        '" src="' + obj.imgSrc + '" onerror="this.src=' + "'/communication/images/error.jpg'" +'"></a><h4 title="' + obj.courseName + '">' + obj.courseName + '</h4></div>';
}


/******从服务端获取数据****
 *
 */

function loadingData() {
    $.ajax({
        url: data.config.ecgeditor + '/getInstanceByUser',
        type: 'get',
        data: {
            userId: data.config.userId,
            isPublished: true,
            isCooperation: false
        },
        success: function(info) {
            info = zh(info);
            info.data = info.data || [];
            info.data = info.data.sort(function (a, b) {
                return sort(new Date(a.publishModifyTime), new Date(b.publishModifyTime));
            });
            eventer.emit('manage_courses', info.data);
        },
        error: function(info) {
            eventer.emit('manage_courses', {
                error: info
            });
        }
    });
    $.ajax({
        url: '/getNoOrgByUser',
        type: 'get',
        data: {
            userId : data.config.userId || ''
        },
        success: function(info) {
            info = zh(info);
            if (!info.error) {
                info.data = info.data || [];
                info.data = info.data.sort(function(a, b) {
                    return sort(a.selectedTime, b.selectedTime);
                });
                eventer.emit('learn_courses', info.data);
            } else {
                eventer.emit('learn_courses', {
                    error: info.error
                });
            }
        },
        error: function(info) {
            eventer.emit('learn_courses', {
                error: info
            });
        }
    });
}

/******初始化****
 *
 */

data.init = 2;