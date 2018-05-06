/**
 * Created by admin on 2017/1/10.
 */

var table_template = q('#table-template').innerHTML;
var select_template = q('#select-template').innerHTML;
var button_template = q('#button-template').innerHTML;
var table_result = _.template(table_template);
var select_result = _.template(select_template);
var button_result = _.template(button_template);
var score, comment,
    tbody = q('tbody')[0],
    loading = q('.loading')[0],
    container = q('._container')[0],
    btnContainer = q('#button-container'),
    cover = document.createElement('div'),
    select_student = q('#select-student');

cover.className = 'cover';


/**
 * DOM事件监听
 */
$(document)
    .on('dblclick', '.edit', function() {
        $(this).removeClass('edit')
            .addClass('editing');
        this.children[1].style.height = $(this).height() + 'px';
        this.children[1].focus();
    })
    .on('blur', '.editing input', function() {
        var parent = this.parentNode,
            taskId = parent.getAttribute('data-taskId'),
            ruleId = parent.getAttribute('data-ruleId'),
            value = parseInt(this.value);
        if (value === database.score[taskId][ruleId].myScore) {
            $(parent).removeClass('editing')
                .addClass('edit');
            return;
        }
        if (isNaN(value)) {
            value = 0;
        } else {
            if (value < 0) {
                value = 0
            } else if (value >= (database.score[taskId][ruleId].score || 0)) {
                value = (database.score[taskId][ruleId].score || 0);
            }
        }
        database.score[taskId][ruleId].myScore = value;
        this.value = value;
        parent.children[0].innerHTML = value;
        $(parent).removeClass('editing')
            .addClass('edit');
    })
    .on('blur', '.editing textarea', function() {
        if (database.comment !== this.value) {
            database.comment = this.value;
        }
        $(this.parentNode).removeClass('editing')
            .addClass('edit');
    })
    .on('change', '#select-student', function() {
        var ele = this.selectedOptions[0];
        if (ele !== this.options[0]) {
            database.userId = ele.getAttribute('data-userId');
            database.procInstId = ele.getAttribute('data-procInstId');
        } else {
            emptyUI();
        }
    })
    .on('click', '#submit', function() {
        changeCoverTips('提交评价中...');
        appendCover();
        saveTotalScore();
    });

var database = {};
    database.score = {};
    database.instanceInfo = {};

/**
 * 数据劫持监听
 */
defineProp(database, 'students', [], function(value) {

});

defineProp(database, 'select_student', [], function(value) {
    renderSelect(value);
});

defineProp(database, 'procInstId', '', function(value) {
    if (!value) {
        return emptyUI();
    }
    changeCoverTips('获取学生评价表中...');
    appendCover();
    getTableInfo(value, database.userId);
});

defineProp(database, 'comment', '', function(value) {
    if (comment && comment.children) comment.children[0].innerHTML = value;
});

defineProp(database, 'totalScore', 0, function(value) {
   if (score && score.innerHTML !== undefined) score.innerHTML = value;
});

defineProp(database, 'init', 2, function(vlaue) {
    if (vlaue === 0 && loading.parentNode) loading.parentNode.removeChild(loading);
});

defineProp(database, 'orgId', '', function(value) {
    getStudentInfo(value);
    getInstanceInfo(value);
});

/**
 *数据处理
 */

function pathAssembly(path, userId, userName) {
    var flag = /(.html|.htm)$/.test(path),
        result = '',
        arr = path.split('/'),
        fileName = arr[arr.length - 1].split('.')[0],
        prefix = 'http://www.xuezuowang.com/index.php/apps/courseplayer/viewTxt/',
        officePrefix = 'pageoffice://|http://newengine.xuezuowang.com/NKTOForMyDemo/MyNTKODemo/MyFirstWordEditor.jsp?path=authoring2.xuezuowang.com/load/loadPdfFile%3Fsource%3Dpgofc%26ownerId%3Dsystem%26path%3D/';
    if (flag) {
        result = prefix + fileName + '/' + userId;
    } else {
        result = officePrefix + 'user_file/'+ userName +'_sys_file/&permission=r' + '&fileName=' + fileName + '&userName=' + userName;
    }
    return result;
}

function newTab(file) {
    return /(.html|.htm)$/.test(file) ? '_blank' : '';
}

function count() {
    database.init--;
}

function process(data) {
    data.forEach(function(item) {
        var taskId = item.taskId,
            taskTotalScore = q('#'+ taskId);
        database.score[taskId] = database.score[taskId] || {};
        defineProp(database.score[taskId], 'total', 0, function(value) {
            taskTotalScore.innerHTML = value;
            var totalScore = 0;
            for (var taskId in database.score) {
                totalScore += (parseInt(database.score[taskId].total) || 0);
            }
            database.totalScore = totalScore;
        });
        if (item.scoreRules && typeof item.scoreRules.forEach === 'function') {
            item.scoreRules.forEach(function(item) {
                var score = parseInt(item.myScore) || 0;
                database.score[taskId][item.id] = {
                    score: item.score
                };
                defineProp(database.score[taskId][item.id], 'myScore', score, function(value) {
                    countScore(taskId);
                    saveRuleScore(taskId, item.id, value);
                });
            });
        }
        countScore(taskId);

        function countScore(taskId) {
            var total = 0;
            for (var ruleId in database.score[taskId]) {
                total +=  (parseInt(database.score[taskId][ruleId].myScore) || 0)
            }
            database.score[taskId].total = total;
        }
    });
}

function initEle() {
    score = q('#score');
    comment = q('#comment');
}

function renderSelect(data) {
    select_student.innerHTML = select_result({
        data: data
    });
}

function renderTable(data) {
    data.estimationItems = data.estimationItems || [];
    data.summarize = data.summarize || {};
    tbody.innerHTML = table_result({
        data: data.estimationItems,
        summarize: data.summarize
    });
    btnContainer.innerHTML = button_result({
        flag: data.estimationItems.length
    });
}

function changeCoverTips(tips) {
    cover.innerHTML = tips ? '<div>' + tips + '</div>' : '';
}

function appendCover() {
    container.appendChild(cover);
}

function removeCover() {
    if (cover.parentNode) {
        cover.parentNode.removeChild(cover);
    }
}

function emptyUI() {
    tbody.innerHTML = '';
    btnContainer.innerHTML = '';
}

function refreshUI(data) {
    renderTable(data);
    initEle();
    process(data.estimationItems);
    removeCover();
}

/**
 *与服务端的数据交互
 */

function getTableInfo(id, userId) {
    var callback = {
        success: function(data) {
            data = zh(data);
            refreshUI(data);
        },
        error: function(data) {
            changeCoverTips('获取学生评分表出错!');
            setTimeout(function() {
                removeCover();
            }, 2000);
        }
    };
    $.ajax({
        url: config.newengine + 'course/getMyEstimation',
        type: 'get',
        dataType: 'json',
        data: {
            procInstId: id,
            userId: userId
        },
        success: callback.success,
        error: callback.error
    });
}

function getStudentInfo(orgId) {
    var callback = {
        success: function(data) {
            data = zh(data);
            database.students = data;
            database.select_student = data;
            count();
        },
        error: function(data) {
            count();
            console.log('获取学生列表出错!');
        }
    };
    $.ajax({
        url: '/CourseOrg/optCourseOrgUser/searchUsers',
        type: 'get',
        dataType: 'json',
        data: {
            LRNSCN_ORG_ID: orgId
        },
        success: callback.success,
        error: callback.error
    });
}

function getInstanceInfo(orgId) {
    var callback = {
        success: function(data) {
            if (data.forEach) {
                data.forEach(function(item) {
                    database.instanceInfo[item.userId] = item.statement;
                });
            } else {
                console.log('课程播放器那边返回来的数据出错了！')
            }
            count();
        },
        error: function(data) {
            count();
            console.log('获取课程状态失败!');
        }
    };
    $.ajax({
        url: './getUsersByOrgId',
        type: 'post',
        dataType: 'json',
        data: {
            orgId: orgId
        },
        success: callback.success,
        error: callback.error
    });
}

function saveRuleScore(taskId, ruleId, score) {
    var callback = {
        success: function(data) {
            console.log(data);
        },
        error: function(data) {
            console.log('评分保存失败!');
        }
    };
    $.ajax({
        url: config.newengine + 'course/setScoreToEstimationItem',
        type: 'post',
        data: {
            userId: database.userId,
            procInstId: database.procInstId,
            taskId: taskId,
            scoreId: ruleId,
            myScore: score
        },
        success: callback.success,
        error: callback.error
    });
}

function saveTotalScore() {
    var callback = {
        success: function(data) {
            changeCoverTips('评价保存成功!');
            setTimeout(function() {
                removeCover();
            }, 2000);
            console.log(data);
        },
        error: function(data) {
            changeCoverTips('评价保存失败!');
            setTimeout(function() {
                removeCover();
            }, 2000);
            console.log('评价保存失败!');
        }
    };
    // 往李杰那存
    //$.ajax({
    //    url: config.coursePlayer + '/saveScore',
    //    type: 'post',
    //    data: {
    //        userId: database.userId,
    //        orgId: database.orgId,
    //        score: database.totalScore,
    //        comment: database.comment
    //    },
    //    success: callback.success,
    //    error: callback.error
    //});
    $.ajax({
        url: config.newengine + 'course/setSummarize ',
        type: 'post',
        data: {
            procInstId: database.procInstId,
            userId: database.userId,
            sumScore: database.totalScore,
            comment: database.comment
        },
        success: callback.success,
        error: callback.error
    });
}


/**
 * 初始化UI
 */
window.addEventListener('message', function(e) {
    var data = e.data || {};
    if (database.orgId === data.orgId) {
        return;
    }
    if (data.orgId) {
        database.orgId = data.orgId;
        emptyUI();
    }
});

if (config.mode === 'dev') {
    database.orgId = '1234';
}

