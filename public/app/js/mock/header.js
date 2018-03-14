/**
 * Created by 78462 on 2017/2/4.
 */
var data = {
    status: 200,
    err: '',
    nav: {
        coursePlayer: {
            url: '',
            blank: 1,
            name: '主页'
        },
        ecgeditorTool: {
            url: '/app#monitor/unorgmonitor',
            blank: 1,
            name: '易能易编'
        },
        org: {
            url: '',
            blank: 1,
            name: '组织机构管理'
        }
    },
    personal: {
        personal: {
            url: '',
            name: '个人',
            svg: '/app/img/svg/personal.svg'
        },
        users: {
            url: '',
            name: '用户',
            svg: '/app/img/svg/users.svg'
        },
        manage: {
            url: '',
            name: '管理',
            svg: '/app/img/svg/admin.svg'
        },
        files: {
            url: '',
            name: '云文件',
            svg: '/app/img/svg/files.svg'
        },
        picture: {
            url: '',
            name: '相册',
            svg: '/app/img/svg/picture.svg'
        },
        monitor: {
            url: '',
            name: '课程监控',
            svg: '/app/img/svg/admin.svg'
        },
        course: {
            url: '',
            name: '我的课程',
            svg: '/app/img/svg/course.svg'
        },
        logout: {
            url: '',
            name: '注销',
            svg: '/app/img/svg/logout.svg'
        }
    },
    userData: {
        name: 'user1'
    }
};
Mock.mock(/\/org.xuezuowang.com\/org\/getInfo/, data);