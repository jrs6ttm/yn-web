/**
 * Created by 78462 on 2017/2/4.
 */
;
(function($, tool) {
    var $personalMenu, $modal, login_btn, reg_btn;
    var login = {}, reg = {}, modal = {}, password, password_repeat;
    var q = tool.q, zh = tool.zh, Eventer = tool.Eventer, defineProp = tool.defineProp;
    var vm = {
        /**
         * 与服务器数据交互
         */
        fetch: {
            permission: function() {
                $.post(config.permission, {}, function(data) {
                    data = zh(data);
                    if (data.status) {
                        vm.header.render(data);
                    }
                });
            },
            login: function(data) {
                console.log(data);
            },
            reg: function(data) {
                console.log(data);
            },
            checkEmail: function(data, ele) {
                console.log(data);
            },
            checkUserName: function(data, ele) {
                console.log(data);
            }
        },
        header: {
            template: _.template($('#header-template').html()),
            render: function(data) {
                document.body.insertAdjacentHTML('afterBegin', this.template(data));
            }
        },
        sign_modal: {
            template:  _.template($('#sign-modal-template').html()),
            render: function(data) {
                document.body.insertAdjacentHTML('afterBegin', this.template(data));
            }
        },
        event: new Eventer(),
        watch: function(prop, init, callback) {
            defineProp(this, prop, init, callback);
        },
        DOMListener: function() {
            /**
             * DOM事件监听
             */
            $(document)
                .on('click', '#modal .close-modal', function() {
                    modal.display = 0;
                })
                .on('click', '#header a.item', function() {
                    if (this.id === 'personal') {
                        $personalMenu = $personalMenu || $('#personal-list');
                        $personalMenu.toggle();
                    } else {
                        modal.active = this.id;
                        modal.display = 1;
                    }
                })
                .on('click', '#sign span[data-to]', function() {
                    modal.active = this.getAttribute('data-to').split('-')[1];
                })
                .on('click', '#sign .modal-submit-btn', function(event) {
                    var form = this.parentNode,
                        data = {};
                    data.userName = form['userName'].value;
                    data.password = form['password'].value;
                    if (this.id === 'login-btn') {
                        vm.fetch.login(data);
                    } else {
                        data.email = form['email'].value;
                        vm.fetch.reg(data);
                    }
                    event.preventDefault();
                    event.stopPropagation();
                })
                .on('blur', '#modal-login input[placeholder]', function() {
                    if (!this.value) return inputErrorTips(this, true);
                    var name = this.name;
                    login[name] = test(name, this.value);
                    inputErrorTips(this, login[name]);
                })
                .on('blur', '#modal-reg input', function() {
                    if (!this.value) return inputErrorTips(this, true);
                    var name = this.name;
                    reg[name] = test(name, this.value);
                    inputErrorTips(this, login[name]);
                    if (name === 'password') {
                        var password_repeat =  $(this.parentNode).next().children()[0];
                        if (!password_repeat.value) return;
                        reg.password_repeat = test('password_repeat', password_repeat.value);
                        inputErrorTips(password_repeat, reg.password_repeat);
                    } else if (name === 'email' && reg[name]) {
                        vm.fetch.checkEmail({email: this.value}, this);
                    } else if (name === 'userName' && reg[name]) {
                        vm.fetch.checkUserName({userName: this.value}, this);
                    }
                });
        },
        /**
         * 初始化
         */
        init: function() {
            this.fetch.permission();
            this.sign_modal.render();
            this.DOMListener();
            $modal = $('#modal');
            login_btn = q('#login-btn');
            reg_btn = q('#reg-btn');
            var $email = $modal.find('input[name=email]');
            AutoComplete($email[0]);
        }
    };

    /**
     * 数据监测
     */

    //初始值0，默认隐藏模态框。
    defineProp(modal, 'display', 0, function(value) {
        value ? $modal.show() : $modal.hide();
    });
    //初始值'login',默认激活的是登录。
    defineProp(modal, 'active', 'login', function(value) {
        $('#modal-' + value).find('p.error-tips').html('')
            .end().find('input[placeholder]').val('')
            .end().show()
            .siblings('form').hide();
        $modal.find('[data-to="modal-' + value + '"]').addClass('active-title')
            .siblings().removeClass('active-title');
    });
    //表单预检测
    defineProp(login, 'status', false, function(value) {
        value ? login_btn.removeAttribute('disabled') : login_btn.setAttribute('disabled', 'disabled');
    });
    defineProp(login, 'userName', false, function(value) {
        login.status = value && login.password;
    });
    defineProp(login, 'password', false, function(value) {
        login.status = login.userName && value;
    });
    defineProp(reg, 'status', false, function(value) {
        value ? reg_btn.removeAttribute('disabled') : reg_btn.setAttribute('disabled', 'disabled');
    });
    defineProp(reg, 'email', false, function(value) {
        reg.status = value && reg.userName && reg.password && reg.password_repeat;
    });
    defineProp(reg, 'userName', false, function(value) {
        reg.status = value && reg.email && reg.password && reg.password_repeat;
    });
    defineProp(reg, 'password', false, function(value) {
        reg.status = value && reg.email && reg.userName && reg.password_repeat;
    });
    defineProp(reg, 'password_repeat', false, function(value) {
        reg.status = value && reg.email && reg.userName && reg.password;
    });


    vm.init();

    /**
     * 表单检测、错误提示以及邮箱补全
     */

    function test(name, value) {
        return name === 'email' ? testEmail(value) : (name === 'userName' ? testUserName(value) : (name === 'password_repeat' ? testPasswordRepeat(value) : testPassword(value)));
    }

    function testEmail(value) {
        var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        return reg.test(value);
    }

    function testUserName(value) {
        return value.length < 21 && /^\w+$/.test(value);
    }

    function testPassword(value) {
        password = value;
        return value.length > 5 && value.length < 16 && /^\w+$/.test(value);
    }

    function testPasswordRepeat(value) {
        password_repeat = value;
        return value === password;
    }

    function inputErrorTips(ele, flag, msg) {
        var $tips = $(ele).next();
        if (msg) {
            $tips.html(msg);
        } else {
            if (!flag) {
                $tips.html($tips.data('error'));
            } else {
                $tips.html('');
            }
        }
    }

    function AutoComplete(selector){
        var elt = $(selector);
        var autoComplete,autoLi;
        var lists = [],
            $container,
            email = ['qq.com', '163.com', '126.com', 'gmail.com', 'sina.com', 'aliyun.com', 'hotmail.com', 'sohu.com', 'vip.126.com', 'vip.163.com', 'vip.qq.com',
                'vip.sina.com', 'sina.cn', 'msn.com', 'outlook.com', 'live.com', 'live.cn', 'yahoo.com.cn', 'yahoo.cn', 'yahoo.com.tw', '21.com.cn', 'tom.com'];
        lists.push('<ul class="email-auto">');
        for (var i = 0; i < email.length; i++) {
            lists.push('<li hz="@' + email[i] + '"><>');
        }
        lists.push('</ul>');

        $container = $(selector.parentNode);
        $container.append(lists.join(''));

        autoComplete = $container.find('.email-auto');
        autoComplete.data('elt',elt);
        autoLi = autoComplete.find('li');
        autoLi.mouseover(function(){
            $(this).siblings().filter('.hover').removeClass('hover');
            $(this).addClass('hover');
        }).mouseout(function(){
            $(this).removeClass('hover');
        }).mousedown(function(){
            autoComplete.data('elt').val($(this).text()).change();
            autoComplete.hide();
        });
        //用户名补全+翻动
        elt.keyup(function(e){
            if(/13|38|40|116/.test(e.keyCode) || this.value == ''){
                return false;
            }
            var username = this.value;
            if(username.indexOf('@') == -1){
                autoComplete.hide();
                return false;
            }
            autoLi.each(function(){
                this.innerHTML = username.replace(/\@+.*/,'') + $(this).attr('hz');
                if(this.innerHTML.indexOf(username) >= 0){
                    $(this).show();
                }else{
                    $(this).hide();
                }
            }).filter('.hover').removeClass('hover');
            autoComplete.show();
            if(autoLi.filter(':visible').length == 0){
                autoComplete.hide();
            }else{
                autoLi.filter(':visible').eq(0).addClass('hover');
            }
        }).keydown(function(e){
            if(e.keyCode == 38){ //上
                autoLi.filter('.hover').prev().addClass('hover').next().removeClass('hover');
            }else if(e.keyCode == 40){ //下
                autoLi.filter('.hover').next().addClass('hover').prev().removeClass('hover');
            }else if(e.keyCode == 13){ //Enter
                autoLi.filter('.hover').mousedown();
                e.preventDefault();	//如有表单，阻止表单提交
            }
        }).focus(function(){
            autoComplete.data('elt',$(this));
        }).blur(function(){
            autoComplete.hide();
        });
    }
})(jQuery, common);










