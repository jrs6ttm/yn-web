var courseTree = $('#courseTree');
var info = [
    {
        'text' : 'SQL注入基础学习[2016-12-06]',
        'children' : [
            {
                'text' : 'SQL基本语法',
                'children' :  [
                    {
                        'text' : 'SQL语法构成',
                        'children' : [
                            'SQL语句基础知识',
                            'SQL函数练习',
                            'SQL语句常用技术',
                            'SQL语句注入原理'
                        ]
                    },
                    'SQL语法常用语法'
                ]
            },
            'SQL注入基础',
            'SQL注入防御'
        ]
    },
    {
        'text' : 'SQL注入基础学习[2015-12-06]',
        'children' : [
            {
                'text' : 'SQL基本语法',
                'children' :  [
                    {
                        'text' : 'SQL语法构成',
                        'children' : [
                            'SQL语句基础知识',
                            'SQL函数练习',
                            'SQL语句常用技术',
                            'SQL语句注入原理'
                        ]
                    },
                    'SQL语法常用语法'
                ]
            },
            'SQL注入基础',
            'SQL注入防御'
        ]
    },
    {
        'text' : 'SQL注入基础学习[2015-12-28]',
        'children' : [
            {
                'text' : 'SQL基本语法',
                'children' :  [
                    {
                        'text' : 'SQL语法构成',
                        'children' : [
                            'SQL语句基础知识',
                            'SQL函数练习',
                            'SQL语句常用技术',
                            'SQL语句注入原理'
                        ]
                    },
                    'SQL语法常用语法'
                ]
            },
            'SQL注入基础',
            'SQL注入防御'
        ]
    }
];

var studentInfo = [
    {
        
    }
];

courseTree.jstree({
    "plugins" : ["types","json_data"],
    "core" : {
        'themes': {
            //将dots设置为false 树形结构显示的时候就不会有小圆点了！！！
            'dots': false
        },
        'data' : info
    },
    "types": {
        "default":{
            "icon": "fa fa-file-text-o"
        },
        "folder": {
            "icon": "fa fa-folder-o"
        },
        "js" : {
            "icon": "fa fa-file-code-o"
        },
        "json" : {
            "icon": "fa fa-file-code-o"
        }
    }
});

courseTree.on('click','.jstree-anchor', function (e) {
    var instance = $.jstree.reference(this),
        path = instance.get_path(this);
    document.getElementById('learningCourseInfo').innerText = path[0] || '';
    document.getElementById('learningScenarioInfo').innerText = path[1] || '';
    document.getElementById('learningActiveInfo').innerText = path[2] || '';
    document.getElementById('learningActionInfo').innerText = path[3] || '';
});