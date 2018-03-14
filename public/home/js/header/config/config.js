/**
 * Created by 78462 on 2017/2/4.
 */
var config = {
  login: {
    url: '/app/checkuser',
    type: 'post'
  },
  logout: {
    url: '/app/logout',
    type: 'post'
  },
  reg: {
    url: '/app/adduser',
    type: 'post'
  },
  checkPassword: {
    url: '/app/checkpassword',
    type: 'post'
  },
  checkEmail: {
    url: '/app/checkreguser',
    type: 'post'
  },
  checkUserName: {
    url: '/app/checkreguser',
    type: 'post'
  },
  permission: {
    url: '/app/getsessioninfo',
    type: 'post'
  },
  regEnterpriseUser: {
    url: '/app/adduser',
    type: 'post'
  },
  checkEnterpriseName: {
    url: '/app/checkorgdes',
    type: 'post'
  },
  updateUserInfo: {
    url: '/app/updateuserinfo',
    type: 'post'
  },
  getEnterpriseInfo: {
    url: '/app/getorginfo',
    type: 'post'
  },
  updateEnterpriseInfo: {
    url: '/app/updateorginfo',
    type: 'post'
  },
  changeRole: {
    url: '/app/changerole',
    type: 'post'
  },
  setRole: {
    url: '/app/setuserdefaultorgrole',
    type: 'post'
  },
  //请求路由配置
  personal: {
    dev: window.location.origin,
    joint: window.location.origin,
    prod: window.location.origin
  },
  org: {
    dev: window.location.origin,
    joint: window.location.origin,
    prod: window.location.origin
  },
  courseSearch: {
    dev: window.location.origin,
    joint: window.location.origin,
    prod: window.location.origin
  },
  app: {
    dev: window.location.origin,
    joint: window.location.origin,
    prod: window.location.origin
  },
  //个人菜单-静态项
  menu: {
    personal: {
      appid: 'personal',
      blank: '0',
      funs: [
        {
          id: 'info',
          name: '个人信息',
          url: '/app/personalInfo'
        },
        {
          id: 'myOrg',
          name: '我的组织',
          url: '/org/myOrg'
        }
      ],
      name: '个人',
      position: '0',
      svg: 'personal.svg',
      url: ''
    }
  },
  //roles 测试数据
  roles: [
    {
      org: '武汉职业学院',
      dep: '计算机专业',
      role: '老师',
      roleID: -1,
      depUserID: '-1'
    },
    {
      org: '武汉财贸',
      dep: '财经专业',
      role: '学生',
      roleID: -1,
      depUserID: 666
    }
  ],
  //当前运行模式
  mode: /(xuezuowang.com)$/.test(window.location.hostname) ? 'prod' : (/(learn.com)$/.test(window.location.hostname) ? 'joint' : 'dev')
};