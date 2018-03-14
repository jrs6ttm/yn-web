/**
 * Created by 78462 on 2017/2/7.
 */
;
var Bus = Bus || new common.Eventer();      //消息总线，用于组件之间通信
(function($, tool) {
    var $modal, login_btn, reg_btn, enterpriseName, sign_global_error;
    var login = {}, reg = {}, modal = {}, password, password_repeat;
    var q = tool.q, zh = tool.zh, Eventer = tool.Eventer, defineProp = tool.defineProp;
    var vm = {
        fetch: {
            login: function(data) {
                $.ajax({
                    url: config.login.url,
                    type: config.login.type,
                    data: data,
                    dataType: 'json'
                }).done(function(data) {
                    var obj = {};
                    var hash = window.location.hash.slice(1);
                    var keys = hash.split('&');
                    keys.forEach(function(item) {
                       var arr = item.split('=');
                        obj[arr[0]] = arr[1];
                    });
                    data.status == 200 ? (obj['redirect_url'] ? window.location.href = decodeURIComponent(obj['redirect_url']) : window.location.reload())
                        : sign_global_error.innerHTML = data.err;
                });
            },
            reg: function(data) {
                var enterpriseName = (data.type == 1);
                $.ajax({
                    url: config.reg.url,
                    type: config.reg.type,
                    data: data,
                    dataType: 'json'
                }).done(function(resData) {
                    if (resData.status != 200) {
                        return sign_global_error.innerHTML = resData.err;
                    }else{
                        sign_global_error.innerHTML = '';
                        if(confirm('注册成功，是否立即登录？')){
                            vm.fetch.login(data);
                        }else{
                            modal.display = 0;
                        }
                    }
                    /* if (enterpriseName) {
                     sign_global_error.innerHTML = '账号正在审核中，稍后将关闭注册框';
                     setTimeout(function() {
                     sign_global_error.innerHTML = '';
                     if(confirm('注册成功，是否立即登录？')){
                     vm.fetch.login(data);
                     }else{
                     modal.display = 0;
                     }
                     }, 3000);
                     return;
                     }*/
                });
            },
            checkEmail: function(data, ele) {
                $.ajax({
                    url: config.checkEmail.url,
                    type: config.checkEmail.type,
                    data: data,
                    dataType: 'json'
                }).done(function(data) {
                    if (data.status == 406) {
                        inputErrorTips(ele, '', '邮箱已被注册');
                        reg.email = false;
                    } else if (data.status == 200) {
                        inputErrorTips(ele, true);
                        reg.email = true;
                    } else {
                        inputErrorTips(ele, '', data.err);
                        reg.email = false;
                    }
                });
            },
            checkUserName: function(data, ele) {
                if(!(/^[\w\_]{1,24}$/).test(data.username)){
                    inputErrorTips(ele, '', '用户名为1-24位数字，字母或符号');
                }
                $.ajax({
                    url: config.checkUserName.url,
                    type: config.checkUserName.type,
                    data: data,
                    dataType: 'json'
                }).done(function(data) {
                    if (data.status == 405) {
                        inputErrorTips(ele, '', '用户名已被注册');
                        reg.userName = false;
                    } else if (data.status == 200) {
                        inputErrorTips(ele, true);
                        reg.userName = true;
                    } else {
                        inputErrorTips(ele, '', data.err);
                        reg.userName = false;
                    }
                });
            },
            checkEnterpriseName: function(data, ele) {
                $.ajax({
                    url: config.checkEnterpriseName.url,
                    type: config.checkEnterpriseName.type,
                    data: data,
                    dataType: 'json'
                }).done(function(data) {
                    if (data.status == 407) {
                        inputErrorTips(ele, '', '企业名已被注册');
                        reg.enterpriseName = false;
                    } else if (data.status == 200) {
                        inputErrorTips(ele, true);
                        reg.enterpriseName = true;
                    } else {
                        inputErrorTips(ele, '', data.err);
                        reg.enterpriseName = false;
                    }
                });
            }
        },
        template:  _.template($('#sign-modal-template').html()),
        render: function(data) {
            document.body.insertAdjacentHTML('afterBegin', this.template(data));
        },
        event: new Eventer(),
        watch: function(prop, init, callback) {
            defineProp(this, prop, init, callback);
        },
        DOMListener: function() {
            $(document)
                .on('click', '#modal .close-modal', function() {
                    modal.display = 0;
                })
                .on('click', '#sign span[data-to]', function() {
                    $('#sign-global-error').empty();
                    modal.active = this.getAttribute('data-to').split('-')[1];
                })
                .on('click', '#sign .modal-submit-btn', function(event) {
                    var form = this.parentNode,
                        data = {};
                    data.username = form['userName'].value;
                    data.password = form['password'].value;
                    if (this.id === 'login-btn') {
                        vm.fetch.login(data);
                    } else {
                        data.email = form['email'].value;
                        data.type = form['type'].checked ? 1 : 0;
                        data.type ? data.orgfulldes = form['enterpriseName'].value : void 0;
                        vm.fetch.reg(data);
                    }
                    event.preventDefault();
                    event.stopPropagation();
                })
                .on('input', '#modal-login input[placeholder]', function() {
                    if (!this.value) return inputErrorTips(this, true);
                    var name = this.name;
                    login[name] = test(name, this.value);
                    inputErrorTips(this, login[name]);
                })
                .on('change', '#modal-reg input[placeholder]', function() {
                    if (!this.value) return inputErrorTips(this, true);
                    var name = this.name;
                    reg[name] = test(name, this.value);
                    inputErrorTips(this, reg[name]);
                    if (name === 'password') {
                        var password_repeat =  $(this.parentNode).next().children()[0];
                        if (!password_repeat.value) return;
                        reg.password_repeat = test('password_repeat', password_repeat.value);
                        inputErrorTips(password_repeat, reg.password_repeat);
                    } else if (name === 'email' && reg[name]) {
                        vm.fetch.checkEmail({email: this.value}, this);
                    } else if (name === 'userName' && reg[name]) {
                        vm.fetch.checkUserName({username: this.value}, this);
                    } else if (name === 'enterpriseName' && reg[name]) {
                        vm.fetch.checkEnterpriseName({orgfulldes: this.value}, this);
                    }
                })
                .on('click', '#modal-reg input[name="type"]', function() {
                   this.checked ? reg.type = 1 : reg.type = 0;
                });
        },
        init: function() {
            watchData();
            this.render();
            this.DOMListener();
            $modal = $('#modal');
            login_btn = q('#login-btn');
            reg_btn = q('#reg-btn');
            enterpriseName = q('#enterpriseName');
            sign_global_error = q('#sign-global-error');
            var $email = $modal.find('input[name=email]');
            AutoComplete($email[0]);
            Bus.on('sign_modal', function(data) {
                if (data.status !== undefined) {
                    modal.active = data.status
                }
                if (data.display !== undefined) {
                    modal.display = data.display;
                }
            });
        }
    };

    vm.init();

    window.login = login;
    window.reg = reg;

    /**
     * 数据监测
     */

    function watchData() {
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
            checkLoginStatus();
        });
        defineProp(login, 'password', false, function(value) {
            checkLoginStatus();
        });
        defineProp(reg, 'status', false, function(value) {
            value ? reg_btn.removeAttribute('disabled') : reg_btn.setAttribute('disabled', 'disabled');
        });
        defineProp(reg, 'email', false, function(value) {
            checkRegStatus();
        });
        defineProp(reg, 'userName', false, function(value) {
            checkRegStatus();
        });
        defineProp(reg, 'password', false, function(value) {
            checkRegStatus();
        });
        defineProp(reg, 'password_repeat', false, function(value) {
            checkRegStatus();
        });
        defineProp(reg, 'enterpriseName', true, function(value) {
            checkRegStatus();
        });
        defineProp(reg, 'type', 0, function(value) {
            enterpriseName.style.display = value ?  'block' : 'none';
            enterpriseName.children[0].value = '';
            reg.enterpriseName = value ? false : true;
        });
    }

    /**
     * 表单检测、错误提示以及邮箱补全
     */

    function checkLoginStatus() {
        login.status = login.userName && login.password;
    }

    function checkRegStatus() {
        if (reg.type) {
            return reg.status = reg.email && reg.userName && reg.password && reg.password_repeat && reg.enterpriseName;
        }
        return reg.status = reg.email && reg.userName && reg.password && reg.password_repeat;
    }

    function test(name, value) {
        return name === 'email' ? testEmail(value) : ((name === 'userName' || name === 'enterpriseName') ? testUserName(value) : (name === 'password_repeat' ? testPasswordRepeat(value) : testPassword(value)));
    }

    function testEmail(value) {
        var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/;
        return reg.test(value);
    }

    function testUserName(value) {
        return value.length < 21 && value.length > 0;
    }

    function testPassword(value) {
        password = value;
        return value.length > 5 && value.length < 19 && /^\w+$/.test(value);
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










