/**
 * Created by lijiemoop on 2/16/2016.
 */

Date.prototype.format = function(format){
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter
        "S" : this.getMilliseconds() //millisecond
    };

    if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }

    for(var k in o) {
        if(new RegExp("("+ k +")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        }
    }
    return format;
};

function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

//弹出框插件
(function () {
    $.MsgBox = {
        Alert: function (title, msg,callback) {
            GenerateHtml("alert", title, msg);
            if(typeof (callback) == 'function'){
                btn(callback); //alert只是弹出消息，因此没必要用到回调函数callback
            }else{
                btn(); //alert只是弹出消息，因此没必要用到回调函数callback
            }
        },
        Confirm: function (title, msg, callback1,callback2) {
            GenerateHtml("confirm", title, msg);
            btnOk(callback1);
            btnNo(callback2);
        }
    };

    //生成Html
    var GenerateHtml = function (type, title, msg) {

        var _html = "";

        _html += '<div id="mb_box"></div><div id="mb_con"><span id="mb_tit">' + title + '</span>';
        _html += '<a id="mb_ico">×</a><div id="mb_msg">' + msg + '</div><div id="mb_btnbox">';

        if (type == "alert") {
            _html += '<input id="mb_btn_ok" type="button" value="确定" />';
        }
        if (type == "confirm") {
            _html += '<input id="mb_btn_ok" type="button" value="确定" />';
            _html += '<input id="mb_btn_no" type="button" value="取消" />';
        }
        _html += '</div></div>';

        //必须先将_html添加到body，再设置Css样式
        $("body").append(_html); GenerateCss();
    };

    //生成Css
    var GenerateCss = function () {

        $("#mb_box").css({ width: '100%', height: '100%', zIndex: '99999', position: 'fixed',
            filter: 'Alpha(opacity=60)', backgroundColor: 'black', top: '0', left: '0', opacity: '0.4'
        });

        $("#mb_tit").css({ display: 'block', fontSize: '14px', color: '#444', padding: '10px 15px',
            backgroundColor: '#dfdfdf',
            borderBottom: '2px solid #42a5f5', fontWeight: 'bold'
        });

        $("#mb_msg").css({ padding: '20px', lineHeight: '20px',
            borderBottom: '1px dashed #dfdfdf', fontSize: '13px'
        });

        $("#mb_ico").css({ display: 'block', position: 'absolute', right: '10px', top: '9px',
             width: '18px', height: '18px', textAlign: 'center',backgroundColor:'#dfdfdf',color:'7f7f7f',
            lineHeight: '18px', cursor: 'pointer', fontFamily: '微软雅黑',textDecoration:'none',borderRadius:9
        }).hover(function () {
            $(this).css({ backgroundColor: '#bfbfbf',color:'#fff'});
        }, function () {
            $(this).css({ backgroundColor: '#dfdfdf',color:'#337ab7'});
        });

        $("#mb_btnbox").css({ margin: '15px 0 10px 0', textAlign: 'center' });
        $("#mb_btn_ok,#mb_btn_no").css({ width: '85px', height: '30px', color: 'white', border: 'none' });
        $("#mb_btn_ok").css({ backgroundColor: '#42a5f5' }).hover(function(){
            $(this).css({backgroundColor:'#0c80df'});
        },function(){
            $(this).css({backgroundColor:'#42a5f5'});
        });

        $("#mb_btn_no").css({ backgroundColor: '#bdbdbd', marginLeft: '20px' }).hover(function(){
            $(this).css({backgroundColor:'#b0b0b0'});
        },function(){
            $(this).css({backgroundColor:'#bdbdbd'});
        });

        //让提示框居中
        $("#mb_con").css({ width: '400px'}).css({zIndex: '999999', position: 'fixed', backgroundColor: 'White', top: (document.documentElement.clientHeight - $("#mb_con").height()) / 2 + "px", left: (document.documentElement.clientWidth - $("#mb_con").width()) / 2 + "px" });
    };

    var btn = function (callback) {
        $("#mb_btn_ok").click(function () {
            $("#mb_box,#mb_con").remove();
            if (typeof (callback) == 'function') {
                callback();
            }
        });

        $('#mb_box').click(function () {
            $("#mb_box,#mb_con").remove();
            if (typeof (callback) == 'function') {
                callback();
            }
        });
        $("#mb_ico").click(function () {
            $("#mb_box,#mb_con").remove();
            if (typeof (callback) == 'function') {
                callback();
            }
        });
    };

    //确定按钮事件
    var btnOk = function (callback1) {
        $("#mb_btn_ok").click(function () {
            $("#mb_box,#mb_con").remove();
            if (typeof (callback1) == 'function') {
                callback1();
            }
        });
    };

    //取消按钮事件
    var btnNo = function (callback2) {
        $('#mb_box').click(function () {
            $("#mb_box,#mb_con").remove();
            if (typeof (callback2) == 'function') {
                callback2();
            }
        });
        $("#mb_btn_no,#mb_ico").unbind('click').click(function () {
            $("#mb_box,#mb_con").remove();
            if (typeof (callback2) == 'function') {
                callback2();
            }
        });
    }
})();


/*查看资料插件
输入type(资料类型),id(资料id),countainer(容器)
header高度100%,body长宽100%*/
;(function($){
    var showMeta = function(type,id,userId,filePath,container){
        var me = this;

        me.type = type;
        me.id = id;
        me.userId = userId;
        me.filePath = filePath;
        me.container = container;

        me.init();
    };

    showMeta.prototype = {
        closeMe : function(){
            var me = this;

            $(me.meta).remove();
            $(me.editBar).remove();
        },

        createVideo : function(inVideo){
            var me = this;

            var meta = createEle('div');$(meta).css({border:0,paddingLeft:70,marginLeft:-70,marginTop:-880,width:'100%',height:'100%',zIndex:98,position:'absolute',background:'#fff',paddingTop:40});
            me.meta = meta;
            var editBar = createEle('div');$(editBar).css({border:0,paddingLeft:60,marginLeft:-60,marginTop:-880,width:'100%',height:40,zIndex:99,position:'absolute',background:'#f5f5f5',float:'right'});
            me.editBar = editBar;
            var closeBtn = createEle('a');closeBtn.innerHTML = '×';$(closeBtn).css({cursor:'pointer',padding: 0,textAlign:'center',lineHeight:'20px',margin: '10px 0',width:20,height:20,fontSize:20,float:'right',color:'#7f7f7f'});editBar.appendChild(closeBtn);
            $(closeBtn).hover(function(){
                $(this).css({background:'#ddd',color:'#fff'});
            },function(){
                $(this).css({background:'#fff',color:'#7f7f7f'});
            });
            closeBtn.onclick = function(){
                me.closeMe();
                window['meta'] = false;
            };
            me.container.appendChild(editBar);
            me.container.appendChild(meta);
            video.init($(meta),inVideo,'play');
        },

        createIframe : function(src){
            var me = this;

            var meta = createEle('iframe');meta.src = src;$(meta).css({scrolling:'no',border:0,top:40,width:'100%',height:'100%',zIndex:98,position:'absolute',padding:0});
            me.meta = meta;
            var editBar = createEle('div');$(editBar).css({border:0,top:0,width:'100%',height:40,zIndex:99,position:'absolute',background:'#f5f5f5',float:'right'});
            var closeBtn = createEle('a');closeBtn.innerHTML = '×';$(closeBtn).css({cursor:'pointer',padding: 0,textAlign:'center',lineHeight:'20px',margin: '10px 0',width:20,height:20,fontSize:20,float:'right',color:'#7f7f7f'});editBar.appendChild(closeBtn);
            $(closeBtn).hover(function(){
                $(this).css({background:'#ddd',color:'#fff'});
            },function(){
                $(this).css({background:'#fff',color:'#7f7f7f'});
            });
            closeBtn.onclick = function(){
                $(me.meta).remove();
                $(this).parent().remove();
                window['meta'] = false;
            };
            me.container.appendChild(editBar);
            me.container.appendChild(meta);

        },

        init : function(){
            var me = this,
                src;

            if(window['meta']){
                window['meta'].closeMe();
            }

            if(me.type === 'mp4' || me.type == 'wmv'){
                sendMessage('get',ecgeditorPort,'/load/getVideoRes?materialsId=' + me.id,'',function(data){
                    var inVideo = {sourceF:'',name:'',des:''};
                    if(data.videoRes.data.length){
                        inVideo.sourceF = data.videoRes.data[0].sourceF;
                        inVideo.name = data.videoRes.data[0].fileName;
                        inVideo.des = '';
                        me.createVideo(inVideo);
                    }
                    else{
                        inVideo.sourceF = me.filePath;
                        inVideo.name = "视频资料";
                        inVideo.des = '';
                        inVideo.userId = me.userId;
                        me.createVideo(inVideo);
                    }
                });
            }
            else{
                src =  filePort + '/ec_engine/fileManager/fileRead?userId='+me.filePath.split('\\')[0]+'&filePath=' + me.filePath;
                me.createIframe(src);
            }

            window['meta'] = me;
        }
    };

    window['ShowMeta'] = showMeta;
})($);

/*tab页插件
输入:arr(tab页的分页标题的数组),container(tab页的容器),setting(初始化参数)
tab页的header高度40px,body长宽100%*/
;(function($){
    var tabPage = function(arr,container,settings){
        var me = this;

        me.arr = arr;
        me.container = container;
        me.settings = settings;

        me.init();
    };

    tabPage.prototype = {

        addHover : function(ele){
            var me = this;

            $(ele).hover(function(){
                $(this).css({color:'#7f7f7f'});
            },function(){
                $(this).css({color:'#a4abb2'});
            });
        },

        showTabs : function(index){
            var me = this;

            $(me.bodys).each(function(i,body){
                if(i === index){
                    $(body).show();
                }
                else{
                    $(body).hide();
                }
            });

            $(me.titles).each(function(i,title){
                if(i === index){
                    $(title).css({color:'#fff',backgroundColor:'#42a5f5'});
                    $(title).unbind('mouseenter').unbind('mouseleave');
                }
                else{
                    $(title).css({color:'#a4abb2',backgroundColor:'transparent'});
                    me.addHover(title);
                }
            });
        },

        init : function(){
            var me = this;

            $(me.container).empty();
            
            var header   = createEle('div');$(header).css({width:'100%',height:39,background:'#fff',borderBottom:'1px solid #dfdfdf'});$(me.container).append(header);
            var info     = createEle('div');$(me.container).append(info);

            me.header = header;
            me.info   = info;

            var titles = [],bodys = [];

            $(me.arr).each(function(index,arr){
                titles[index] = createEle('a');titles[index].innerHTML = arr;
                $(titles[index]).css({display: 'block',padding: 10,color: '#a4abb2',backgroundColor: 'transparent',textAlign: 'center',height: 40,float:'left',lineHeight: '19px',margin: 0,textDecoration: 'none',cursor: 'pointer'});

                me.addHover(titles[index]);
                bodys[index] = createEle('div');bodys[index].className = '_tab_body';
                $(bodys[index]).css({height:$(me.container).height() - 40,width:'100%',backgroundColor: '#fff',overflowY: 'auto',padding:10}).hide();

                header.appendChild(titles[index]);
                info.appendChild(bodys[index]);
            });

            me.titles = titles;
            me.bodys = bodys;
            $(window).resize(function() {
                $(me.bodys).each(function(i,body){
                    $(body).css({height:document.documentElement.clientHeight-245});
                });
            });

            $(me.titles).each(function(index,title){
                title.onclick = function(){
                    me.showTabs(index);
                }
            });

            me.showTabs(0);
        }
    };

    window['TabPage'] = tabPage;
})($);


//富文本初始化
var initEditor = function(textarea,setting){
    $(textarea).summernote(setting);
    //window[variety] = KindEditor.create(textarea, setting);
};

//document.createElement太麻烦了
var createEle = function(ele){
    return document.createElement(ele);
};

//引入JS
var pullInJavascript = function(src,next){
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src=src;
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(script);
    script.onload = script.onreadystatechange = function(){
        if(!this.readyState||this.readyState=='loaded'||this.readyState=='complete'){
            if(next) next();
        }
        script.onload = script.onreadystatechange = null;
    };
};

var checkLog = function(next){
    next();
    /*sendMessage('get','','/getSession','',function(data){
        if(data.userData){
            next();
        }
        else{
            $.MsgBox.Alert('请登录','没有用户登录，请登录！',function(){
                window.location.href = playerPort + defaultHash;
                location.reload();
            });
        }
    });*/
};

//发送请求
var sendMessage = function(type,port,url,data,next){
    if(type === 'get'){
        $.get(port + url,function(data,status){
            if(status === 'success'){
                next(data);
            }else{
                console.log(port,url,status);
            }
        });
    }
    else if(type === 'post'){
        $.post(port + url,data,function(data,status){
            if(status === 'success'){
                next(data);
            }else{
                console.log(port,url,status);
            }
        });
    }

};

//mmp