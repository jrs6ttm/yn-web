/**
 * Created by lijiemoop on 1/18/2017.
 */
var data = {};
data.loaded = false;
data.courseInfo = {courseName:'1',courseId:'8ac545a0-d7dc-11e6-bc17-773772a2250d'};
data.defaultCountPerPage = 10;

var leftCon,
    rightCon,
    mainCon,
    pageCon,
    courseNameCon,
    orgCon,
    courseOrgCon,
    usersCon
    //searchBtn
;

window.addEventListener('message',function(e) {
    data.courseInfo = e.data;
    changeCourse();
    loadPage();
});

var search = function(next){
    if($(usersCon).find('._pro_selectContent').html() == '请选择')return;
    try {
        $.post('/coursePro/search',{courseId:data.courseInfo.courseId,users:$(usersCon).find('._pro_selectContent').html(),type:'1'},function(data){
            next(data);
        });
    } catch(e) {
        console.dir(e);
    }
};

resetTable = function(){

    var changePage = function(val){
        var tbody = $(mainCon).find('tbody'),
            tr,
            td;
        tbody.empty();
        var thisPageData = data.pageArr[val];
        $(thisPageData).each(function(i,e){
            tr = document.createElement('tr');
            tbody.append(tr);
            $(data.title).each(function(j,t){
                td = document.createElement('td');
                td.innerHTML = td.title = e[t];
                tr.appendChild(td);
            });
        });
    };

    var createTable = function(result){
        var title = ['序号'];
        for(var t in result[0]){
            if(result[0].hasOwnProperty(t)) title.push(t);
        }
        data.title = title;
        var table = document.createElement('table');table.className = 'table table-striped table-hover';mainCon.appendChild(table);
        var thead = document.createElement('thead');table.appendChild(thead);
        var tbody = document.createElement('tbody');table.appendChild(tbody);
        var tr = document.createElement('tr');thead.appendChild(tr);
        var th;
        $(title).each(function(i,one){
            th = document.createElement('th');th.innerHTML = th.title = one;tr.appendChild(th);
        });
    };

    var setPageDivide = function(arr){
        if(!arr) return false;
        var temArrClass = [], i,j;
        var pages = Math.ceil(arr.length/data.defaultCountPerPage);
        for(i = 0;i < pages;i++){
            if(i < pages - 1){
                temArrClass[i] = [];
                for(j = 0;j < data.defaultCountPerPage;j++){
                    temArrClass[i].push(arr[i*data.defaultCountPerPage+j]);
                }
            } else{
                temArrClass[i] = [];
                for(j = 0;j < arr.length - data.defaultCountPerPage*i;j++){
                    temArrClass[i].push(arr[i*data.defaultCountPerPage+j]);
                }
            }
        }
        return temArrClass;
    };

    var createPages = function(result){
        var array = [];
        $(result).each(function(i,r){
            r['序号'] = i + 1;
            array.push(r);
        });
        data.pageArr = setPageDivide(array);
        var totlePage = data.pageArr.length;
        var setDivideSelect = document.createElement('select');
        var n5 = document.createElement('option');n5.innerHTML = '5';if(data.defaultCountPerPage == 5) n5.selected = true;
        var n10 = document.createElement('option');n10.innerHTML = '10';if(data.defaultCountPerPage == 10) n10.selected = true;
        var n20 = document.createElement('option');n20.innerHTML = '20';if(data.defaultCountPerPage == 20) n20.selected = true;
        $(setDivideSelect).append(n5).append(n10).append(n20);

        var firstPage = document.createElement('a');firstPage.innerHTML = '首页';
        var prePage = document.createElement('a');prePage.innerHTML = '上一页';
        var pageCont = document.createElement('a');pageCont.className = '_page_number';pageCont.innerHTML = '1';pageCont.page = 0;
        var totleCont = document.createElement('a');totleCont.className = '_page_number';totleCont.innerHTML = totlePage;
        var nextPage = document.createElement('a');nextPage.innerHTML = '下一页';
        var lastPage = document.createElement('a');lastPage.innerHTML = '尾页';
        var setGoToPage = document.createElement('input');setGoToPage.type = 'text';

        $(setDivideSelect).on('change',function(){
            data.defaultCountPerPage = $(this).val();
            createPages(array);
        });

        $(firstPage).click(function(){
            if(pageCont.page == 0) return;
            changePage(0);
            pageCont.innerHTML = '1';
            pageCont.page = 0;
        });

        $(prePage).click(function(){
            if(pageCont.page<1) return;
            pageCont.page = pageCont.page - 1;
            changePage(pageCont.page);
            pageCont.innerHTML = pageCont.page+1;
        });

        $(nextPage).click(function(){
            if(!(pageCont.page<totlePage-1)) return;
            pageCont.page = pageCont.page + 1;
            changePage(pageCont.page);
            pageCont.innerHTML = pageCont.page+1;
        });

        $(lastPage).click(function(){
            if(pageCont.page == totlePage-1) return;
            changePage(totlePage-1);
            pageCont.innerHTML = totlePage;
            pageCont.page = totlePage-1;
        });

        $(setGoToPage).on('change',function(){
            if(!setGoToPage.value) return;
            var page = setGoToPage.value - 1;
            if(page<0) return;
            if(!(page<totlePage)) return;
            pageCont.page = page;
            changePage(pageCont.page);
            pageCont.innerHTML = pageCont.page+1;
            setGoToPage.value = null;
        });

        $(pageCon).empty().append('每页').append(setDivideSelect).append('记录').append(firstPage).append(prePage).append(pageCont).append('/').append(totleCont).append(nextPage).append(lastPage).append('转到第').append(setGoToPage).append('页');
        changePage(0);
    };

    if(data.lastTable == $(usersCon).find('._pro_selectContent').html()) return;
    data.lastTable = $(usersCon).find('._pro_selectContent').html();
    search(function(result){
        $(mainCon).empty();
        $(pageCon).empty();
        if(result.length){
            createTable(result);
            createPages(result);
        }else{
            var p = document.createElement('p');p.innerHTML = '没有查询出相关数据！_(:з」∠)_';
            $(mainCon).append(p);
        }
    });
};

var changeCourse = function(){
    if(data.loaded){
        $(courseNameCon).find('._pro_selectContent').html(data.courseInfo.courseName);
    }
};

var getSession = function(next){
    $.post('/coursePro/getSession',{courseId:'1',users:JSON.stringify(['1','2']),type:'1'},function(userData){
        data.userData = userData;
        next();
    });
};
(function(){
    var findChild = function(orgs,id){
        var hasChild = false;
        var childs = [];
        $(orgs).each(function(i,org){
            if(org.parentId == id){
                childs.push({
                    id:org.orgID,
                    name:org.orgFullDes,
                    child:findChild(orgs,org.orgID)
                });
                hasChild = true;
            }
        });
        if(hasChild) return childs;
        return undefined;
    };

    var orgToTree = function(orgs){
        var tree = {};
        $(orgs).each(function(i,org){
            if(!org.parentId){
                tree = {
                    id:org.orgID,
                    name:org.orgFullDes,
                    child:findChild(orgs,org.orgID)
                }
            }
        });
        return tree;
    };

    var getOrgChild = function(i,next){
        if(i == data.orgInfo.length){
            next();
        }else{
            $.get('/org/Ajax_getOrgTree_read', {id: data.orgInfo[i].orgID}, function(result) {
                data.orgInfo[i] = orgToTree(JSON.parse(result));
                getOrgChild(i+1,next)
            });
        }
    };

    getSession(function(){
        $.get('/org/Ajax_getUserOrg', {userId: data.userData.id}, function(result) {
            if(result.status == '404'){
                console.log(result.err);
            }else {
                data.orgInfo = result.datas;
                getOrgChild(0,function(){
                    loadPage();
                });
            }
        });
    });
})();

var getOrgStudent = function(orgId,next){
    var params = {deptid: orgId, roleType:1, userID:'', name:''};
    $.get('/org/Ajax_depUserRead_V3', params, function(result) {
        next(result);
    });
};

var loadPage = function(){
    if(checkPrepared() && !data.loaded) {
        createEles();
        data.loaded = true;
    }
};

var checkPrepared = function(){
    return (data.courseInfo && data.orgInfo)?true:false;
};

var createEles = function(){
    leftCon = document.createElement('div');leftCon.className = '_pro_leftCon';
    rightCon = document.createElement('div');rightCon.className = '_pro_rightCon';
    mainCon = document.createElement('div');mainCon.className = '_pro_mainCon';rightCon.appendChild(mainCon);
    pageCon = document.createElement('div');pageCon.className = '_pro_pageCon';rightCon.appendChild(pageCon);

    courseNameCon = document.createElement('div');courseNameCon.className = '_pro_selectCon';leftCon.appendChild(courseNameCon);
    orgCon = document.createElement('div');orgCon.className = '_pro_selectCon';leftCon.appendChild(orgCon);
    courseOrgCon = document.createElement('div');courseOrgCon.className = '_pro_selectCon';//leftCon.appendChild(courseOrgCon);
    usersCon = document.createElement('div');usersCon.className = '_pro_selectCon';leftCon.appendChild(usersCon);
    //searchBtn =  document.createElement('div');searchBtn.innerHTML = '查询';searchBtn.className = '_pro_searchBtn btn btn-success btn-xs';leftCon.appendChild(searchBtn);

    $('body').empty().append(leftCon).append(rightCon);

    $('._pro_selectCon').each(function(){
        var name = document.createElement('div');name.className = '_pro_selectName';
        var content = document.createElement('div');content.className = '_pro_selectContent';
        var dropDown = document.createElement('div');dropDown.className = '_pro_dropSelectCon';
        $(this).append(name).append(content).append(dropDown);
    });

    $(courseNameCon).find('._pro_selectName').html('课程名称:');
    $(courseNameCon).find('._pro_selectContent').css({cursor:'default'}).html(data.courseInfo.courseName).attr('title',data.courseInfo.courseName);
    $(orgCon).find('._pro_selectName').html('组织机构:');
    $(orgCon).find('._pro_selectContent').css({cursor:'pointer',borderRadius:'4px'}).hover(function(){$(this).css({border:"1px solid #fff",boxShadow:"0 0 5px #5bc0de"});},function(){$(this).css({border:"0",boxShadow:"0 0 0px rgb(0,0,0)"});}).html('请选择').attr('title','请选择').click(function(){
        if($(orgCon).find('._pro_dropSelectCon').attr('data-open') != 'yes'){
            $(orgCon).find('._pro_dropSelectCon').slideDown().attr('data-open','yes');
        }else{
            $(orgCon).find('._pro_dropSelectCon').slideUp().attr('data-open','no');
        }
    });
    $(orgCon).find('._pro_dropSelectCon').mouseleave(function(){
        $(orgCon).find('._pro_dropSelectCon').slideUp().attr('data-open','no');
    });
    $(courseOrgCon).find('._pro_selectName').html('课程组织:');
    $(courseOrgCon).find('._pro_selectContent').css({cursor:'default'}).html('课程组织').attr('title','课程组织');
    $(usersCon).find('._pro_selectName').html('学习用户:');
    $(usersCon).find('._pro_selectContent').css({cursor:'pointer',borderRadius:'4px'}).hover(function(){$(this).css({border:"1px solid #fff",boxShadow:"0 0 5px #5bc0de"});},function(){$(this).css({border:"0",boxShadow:"0 0 0px rgb(0,0,0)"});}).html('学习用户').attr('title','请选择').click(function(){
        if($(usersCon).find('._pro_selectContent').html() == '该组织下没有用户') return;
        if($(usersCon).find('._pro_dropSelectCon').attr('data-open') != 'yes'){
            $(usersCon).find('._pro_dropSelectCon').slideDown().attr('data-open','yes');
        }else{
            $(usersCon).find('._pro_dropSelectCon').slideUp().attr('data-open','no');
            resetTable();
        }
    });
    $(usersCon).find('._pro_dropSelectCon').mouseleave(function(){
        $(usersCon).find('._pro_dropSelectCon').slideUp().attr('data-open','no');
        resetTable();
    });

    var resetAllUsers = function(){
        if($(usersCon).find('._pro_dropSelectCon').find('span').size() == $('._users_selected').size()){
            $(usersCon).find('._pro_dropSelectCon').find('div').attr('data-selected','yes').html('取消全选').attr('title','取消全选');
        }else{
            $(usersCon).find('._pro_dropSelectCon').find('div').attr('data-selected','no').html('选择全部').attr('title','选择全部');
        }
    };

    var setUserContent = function(){
        var users = [];
        var u =  $('._users_selected');
        if(u.size()){
            u.each(function(){
                users.push($(this).attr('data-id'));
            });
            $(usersCon).find('._pro_selectContent').html(users.toString()).attr('title',users.toString());
        }else{
            $(usersCon).find('._pro_selectContent').html('请选择').attr('title','请选择');
        }
    };

    var reSetUsers = function(id){
        getOrgStudent(id,function(data){
            $(usersCon).find('._pro_dropSelectCon').empty();
            if(!data.length){
                $(usersCon).find('._pro_selectContent').html('该组织下没有用户').attr('title','该组织下没有用户');
            }else{
                $(usersCon).find('._pro_selectContent').html('请选择').attr('title','请选择');
                var all = document.createElement('div');all.innerHTML= all.title = '选择全部';
                $(all).attr('data-selected','no').click(function(){
                    if($(this).attr('data-selected') == 'no'){
                        $(usersCon).find('._pro_dropSelectCon').find('span').removeClass('_users_selected').addClass('_users_selected');
                    }else{
                        $(usersCon).find('._pro_dropSelectCon').find('span').removeClass('_users_selected');
                    }
                    resetAllUsers();
                    setUserContent();
                });
                $(usersCon).find('._pro_dropSelectCon').append(all);
                $(data).each(function(i,one){
                    var span = document.createElement('span');span.innerHTML= span.title = one.userID;
                    var p = document.createElement('p');p.innerHTML = '√';
                    $(span).attr('data-id',one.userID).attr('data-name',one.userID).append(p);
                    $(usersCon).find('._pro_dropSelectCon').append(span);
                    $(span).click(function(){
                        if($(this).hasClass('_users_selected')){
                            $(this).removeClass('_users_selected');
                        }else{
                            $(this).addClass('_users_selected');
                        }
                        resetAllUsers();
                        setUserContent();
                    });
                });
            }
        });
    };

    var initOrgDrop = function(datas,c,index){
        var ul = document.createElement('ul'),nbsp = '&nbsp;',i;
        $(datas).each(function(i,data){
            var li = document.createElement('li');
            var span = document.createElement('span');
            if(index){
                for(i=0;i<index;i++){
                    nbsp = nbsp + '&nbsp;&nbsp;&nbsp;'
                }
            }
            span.innerHTML = nbsp+data.name;
            $(li).append(span).attr('data-id',data.id).attr('data-name',data.name).attr('title',data.name).click(function(){
                if($(this).hasClass('_org_selected')){
                    event.stopPropagation();
                    event.preventDefault();
                    return;
                }
                $('._org_selected').removeClass('_org_selected');
                $(this).addClass('_org_selected');
                $(orgCon).find('._pro_selectContent').html($(this).attr('data-name')).attr('title',$(this).attr('data-name'));
                reSetUsers($(this).attr('data-id'));
                event.stopPropagation();
                event.preventDefault();
            });
            ul.appendChild(li);
            if(data.child){
                initOrgDrop(data.child,$(li),index+1);
            }
        });
        c.append(ul);
    };

    $(orgCon).find('._pro_dropSelectCon').empty();
    initOrgDrop(data.orgInfo,$(orgCon).find('._pro_dropSelectCon'),0);
    $(orgCon).find('._pro_dropSelectCon').find('li').eq(0).click();
};