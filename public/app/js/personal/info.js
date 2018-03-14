/**
 * Created by 78462 on 2017/2/13.
 */
(function($, tool) {
    var q = tool.q, zh = tool.zh, Eventer = tool.Eventer, defineProp = tool.defineProp;
    var newPassword, newPasswordClone, passwordContainer, container = q('#container');
    var full_name, full_name_value, email, email_value, org_code, org_code_value, org_full_des, org_full_des_value, org_short_des, org_short_des_value,
        legal_person, legal_person_value, tel1, tel1_value, tel2, tel2_value, address, address_value, email_address, email_address_value;
    var vm = {
        fetch: {
            getUserInfo: function() {
                $.ajax({
                    url: config.getUserInfo.url,
                    type: config.getUserInfo.type,
                    dataType: 'json'
                }).done(function (data) {
                    vm.personRender(data.datas);
                    data.datas.type == 2 ? vm.fetch.getEnterpriseInfo() : void 0;
                });
            },
            updateUserInfo: function(data, ele) {
                $.ajax({
                    url: config.updateUserInfo.url,
                    type: config.updateUserInfo.type,
                    data: data,
                    dataType: 'json'
                }).done(function(data) {
                    if (data.status == 200) {
                        ele.className = 'success-tips';
                        ele.innerHTML = '更新成功';
                        return;
                    }
                    ele.className = 'error-tips';
                    ele.innerHTML = '更新失败，原因：' + data.err;
                });
            },
            getEnterpriseInfo: function() {
                $.ajax({
                    url: config.getEnterpriseInfo.url,
                    type: config.getEnterpriseInfo.type,
                    dataType: 'json'
                }).done(function (data) {
                   data.status == 200 ? vm.enterpriseRender(data.datas) : void 0;
                });
            },
            updateEnterpriseInfo: function(data, ele) {
                $.ajax({
                    url: config.updateEnterpriseInfo.url,
                    type: config.updateEnterpriseInfo.type,
                    data: data,
                    dataType: 'json'
                }).done(function(data) {
                    if (data.status == 200) {
                        ele.className = 'success-tips';
                        ele.innerHTML = '更新成功';
                        return;
                    }
                    ele.className = 'error-tips';
                    ele.innerHTML = '更新失败，原因：' + data.err;
                });
            }
        },
        event: new Eventer(),
        watch: function(prop, init, callback) {
            defineProp(this, prop, init, callback);
        },
        personTemplate: _.template(q('#person-info-template').innerHTML),
        personRender: function(data) {
            container.insertAdjacentHTML('beforeEnd', this.personTemplate(data));
            this.personEleInstantiate();
        },
        personEleInstantiate: function() {
            full_name = q('#full-name');
            full_name_value = q('#full-name-value');
            email = q('#email');
            email_value = q('#email-value');
            newPassword = q('#new-password');
            newPasswordClone = q('#new-password-clone');
            passwordContainer = newPassword.parentNode;
        },
        enterpriseTemplate:  _.template(q('#enterprise-info-template').innerHTML),
        enterpriseRender: function(data) {
            container.insertAdjacentHTML('beforeEnd', this.enterpriseTemplate(data));
            this.enterpriseEleInstantiate();
        },
        enterpriseEleInstantiate: function(){
            org_code = q('#org-code');
            org_code_value = q('#org-code-value');
            org_full_des = q('#org-full-des');
            org_full_des_value = q('#org-full-des-value');
            org_short_des = q('#org-short-des');
            org_short_des_value = q('#org-short-des-value');
            legal_person = q('#legal-person');
            legal_person_value = q('#legal-person-value');
            tel1 = q('#tel1');
            tel1_value = q('#tel1-value');
            tel2 = q('#tel2');
            tel2_value = q('#tel2-value');
            address = q('#address');
            address_value = q('#address-value');
            email_address = q('#email-address');
            email_address_value = q('#email-address-value');
        },
        DOMListener: function() {
            $(document)
                .on('click', '.show-password', function() {
                    vm.password_show = !vm.password_show;
                })
                .on('click', '.pencil', function() {
                    $(this.parentNode).toggleClass('editing');
                    $(this).next().focus();
                })
                .on('input', '#new-password, #new-password-clone', function() {
                    vm.password = this.value;
                })
                .on('blur', 'input', function() {
                    var id = this.id, value = this.value;
                    this.parentNode.className = '';
                    if (!value) {
                        return;
                    }
                    var person = false;
                    var data = {};
                    var tips = this.nextElementSibling;
                    switch (id) {
                        case 'full-name':
                            person = true;
                            if (vm.full_name === value) return;
                            vm.full_name = data.displayname = value;
                            break;
                        case 'email':
                            person = true;
                            if (vm.email === value) return;
                            vm.email = data.email = value;
                            break;
                        case 'new-password':
                            person = true;
                            data.password = value;
                            tips = tips.nextElementSibling;
                            break;
                        case 'new-password-clone':
                            person = true;
                            data.password = value;
                            break;
                        case 'org-code':
                            if (vm.org_code === value) return;
                            vm.org_code = data.orgCode = value;
                            break;
                        case 'org-full-des':
                            if (vm.org_full_des === value) return;
                            vm.org_full_des = data.orgFullDes = value;
                            break;
                        case 'org-short-des':
                            if (vm.org_short_des === value) return;
                            vm.org_short_des = data.orgShortDes = value;
                            break;
                        case 'legal-person':
                            if (vm.legal_person === value) return;
                            vm.legal_person = data.legalPerson = value;
                            break;
                        case 'tel1':
                            if (vm.tel1 === value) return;
                            vm.tel1 = data.tel1 = value;
                            break;
                        case 'tel2':
                            if (vm.tel2 === value) return;
                            vm.tel2 = data.tel2 = value;
                            break;
                        case 'address':
                            if (vm.address === value) return;
                            vm.address = data.address = value;
                            break;
                        case 'email-address':
                            if (vm.email_address === value) return;
                            vm.email_address = data.emailAdress = value;
                            break;
                    }
                    person ? vm.fetch.updateUserInfo(data, tips) : vm.fetch.updateEnterpriseInfo(data, tips);
                })
        },
        dataListener: function() {
            this.watch('full_name', '', function(value) {
                full_name_value.innerHTML = full_name.value = value;
            });
            this.watch('email', '', function(value) {
                email_value.innerHTML = email.value = value;
            });
            this.watch('password', '', function(value) {
                newPassword.value = newPasswordClone.value = value;
            });
            this.watch('password_show', false, function(value) {
                passwordContainer.className = value ? 'show' : '';
            });
            this.watch('org_code', '', function(value) {
                org_code_value.innerHTML = org_code.value = value;
            });
            this.watch('org_full_des', '', function(value) {
                org_full_des_value.innerHTML =  org_full_des.value = value;
            });
            this.watch('org_short_des', '', function(value) {
                org_short_des_value.innerHTML = org_short_des.value = value;
            });
            this.watch('legal_person', '', function(value) {
                legal_person_value.innerHTML = legal_person.value = value;
            });
            this.watch('tel1', '', function(value) {
                tel1_value.innerHTML = tel1.value = value;
            });
            this.watch('tel2', '', function(value) {
                tel2_value.innerHTML = tel2.value = value;
            });
            this.watch('address', '', function(value) {
               address_value.innerHTML = address.value = value;
            });
            this.watch('email_address', '', function(value) {
                email_address_value.innerHTML = email_address.value = value;
            });
        },
        init: function() {
            this.fetch.getUserInfo();
            this.dataListener();
            this.DOMListener();
        }
    };

    vm.init();
})(jQuery, common);