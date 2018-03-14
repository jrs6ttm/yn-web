/**
 * Created by 78462 on 2017/2/7.
 */
;
var Bus = Bus || new common.Eventer();
(function($, tool) {
    var menu = {}, subMenu = {}, init;
    var timer1 = setInterval(function(){
        var obj = Bus.dataBase.permission;
        if (obj) {
            (obj.nav.concat(obj.personal)).forEach(function(item) {
                item.funs.length ? menu[item.appid] = item : void 0;
            });
            init = true;
            clearInterval(timer1);
        }
    }, 200);
    var q = tool.q, zh = tool.zh, Eventer = tool.Eventer, defineProp = tool.defineProp;
    var mode = config.mode;
    var vm = {
        fetch: {

        },
        template: _.template($('#app-template').html()),
        render: function(data) {
            document.body.insertAdjacentHTML('afterBegin', this.template(data));
        },
        event: new Eventer(),
        watch: function(prop, init, callback) {
            defineProp(this, prop, init, callback);
        },
        DOMListener: function() {
            window.addEventListener('load', function() {
                hash();
            });
            window.addEventListener('hashchange', function() {
               hash();
            });
            $(document)
                .on('click', '#app-nav li', function() {
                    vm.subMenu = this.id;
                });
        },
        dataListener: function() {
            this.watch('menu', '', function(value) {
                var app = q('#app');
                if (init) {
                    if (typeof menu[value] === 'object') {
                        refreshApp(app, menu[value].funs);
                    }
                } else {
                    var defer = function() {
                        setTimeout(function() {
                            if (typeof menu[value] === 'object') {
                                refreshApp(app, menu[value].funs);
                            } else {
                                defer();
                            }
                        }, 100);
                    };
                    defer();
                }
            });
            this.watch('subMenu', '', function(value) {
                q('#iframe').src = config[vm.menu][mode] + subMenu[value].url;
                $('#' + value).addClass('active')
                    .siblings().removeClass('active');
            });
        },
        init: function() {
            this.dataListener();
            this.DOMListener();
        }
    };

    vm.init();

    function hash() {
        var hash = window.location.hash.slice(2);
        var arr = hash.split('/');
        vm.menu = arr[0];
    }

    function refreshApp(ele, funs) {
        var hash = window.location.hash.slice(2);
        var arr = hash.split('/');
        var activeIndex = 0;
        funs.forEach(function(item, index) {
            subMenu[item.id] = item;
            item.id === arr[1] ? activeIndex = index : void 0;
        });
        removeEle(ele);
        vm.render({
            prefix: '#/' + arr[0],
            origin: config[vm.menu][config.mode],
            activeIndex: activeIndex,
            funs: funs
        });
    }

    function removeEle(ele) {
        (ele && ele.parentNode) ? ele.parentNode.removeChild(ele) : void 0;
    }
})(jQuery, common);