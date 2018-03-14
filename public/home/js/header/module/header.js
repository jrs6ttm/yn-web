/**
 * Created by 78462 on 2017/2/7.
 */
;
var Bus = Bus || new common.Eventer();
(function($, tool) {
    var $personalMenu, $roleMenu;
    var q = tool.q, zh = tool.zh, Eventer = tool.Eventer, defineProp = tool.defineProp;
    var dataBase = {};
    var vm = {
        fetch: {
            permission: function() {
                $.ajax({
                    url: config.permission.url,
                    type: config.permission.type,
                    dataType: 'json'
                }).done(function(data) {
                    if (data.status != 200) {
                        return vm.render(data);
                    }
                    dataBase.permission = data;
                    //加入静态的个人菜单
                    data.personal.splice(0, 0, config.menu.personal);
                    data.roles.some(function(item, index) {
                        if (item.depUserID === data.userData.depUserID) {
                            data.defaultRoleIndex = index;
                            return true;
                        }
                    });
                    vm.render(data);
                });
            },
            logout: function() {
                $.ajax({
                    url: config.logout.url,
                    type: config.logout.type,
                    dataType: 'json'
                }).done(function(data) {
                    data.status == 200 ? window.location.href = '/' : void 0;
                });
            },
            updateUserInfo: function(data) {
                $.ajax({
                    url: config.updateUserInfo.url,
                    type: config.updateUserInfo.type,
                    data: data,
                    dataType: 'json'
                }).done(function(data) {
                    data.status == 200 ? console.log('更新成功') : console.log('更新失败');
                });
            },
            changeRole: function(data) {
                $.ajax({
                    url: config.changeRole.url,
                    type: config.changeRole.type,
                    data: data,
                    dataType: 'json'
                }).done(function(data) {
                    data.status == 200 ? window.location.reload() : console.log('更新失败');
                });
            }
        },
        template: _.template($('#header-template').html()),
        render: function(data) {
            document.body.insertAdjacentHTML('afterBegin', this.template(data));
        },
        event: new Eventer(),
        watch: function(prop, init, callback) {
            defineProp(this, prop, init, callback);
        },
        DOMListener: function() {
            $(document)
                .on('click', '#header div.item', function() {
                    var id = this.id;
                    if (id === 'personal') {
                        $personalMenu = $personalMenu || $('#personal-list');
                        $personalMenu.toggle().css({'width': $personalMenu.prev('.item').width()+60,'right':(document.documentElement.clientWidth - 1140)/2 + 85});
                    } else if (id === 'role') {
                        $roleMenu = $roleMenu || $('#roles-list');
                        $roleMenu.toggle().css({'width': $roleMenu.prev('.item').width()+60});
                    } else {
                       Bus.emit('sign_modal', {
                           status: id,
                           display: 1
                       });
                    }
                })
                .on('click', '#logout', function() {
                    vm.fetch.logout();
                })
                .on('click', '#roles-list a', function() {
                    var index = parseInt(this.getAttribute('data-index'));
                    var data = {
                        depUserID: Bus.dataBase.permission.roles[index].depUserID
                    };
                    if (data.depUserID === Bus.dataBase.permission.userData.depUserID) {
                        return;
                    }
                    vm.fetch.changeRole(data);
                })
        },
        init: function() {
            this.fetch.permission();
            this.DOMListener();
            Bus.dataBase = dataBase;
        }
    };

    vm.init();
})(jQuery, common);