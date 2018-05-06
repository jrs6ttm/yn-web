var video={
    playStatus:1,//当前播放状态。0：播放；1：停止
    self:$("#jplayer"),//播放器对象
    points:[],
    part0:[{'title':'','des':'','startTime':0,"duration":0,"role":[]}],
    part1:[],
    parts:[{'title':'','des':'','startTime':0,"duration":0,"role":[]}],//分段信息
    thisVideo:{},
    tmpPoint:null,
    added : 1,
    amountT:null,
    resentTime:null,
    fla:[],
    list:[],
    tab:[],
    countainer:null,
    pausedParts:[],
    videoHTML :
    '    <div class="jp-video" id="jp_container_1" role="application" aria-label="media player">'+
	'       <div class="jp-type-single">'+
	'           <div class="jp-jplayer" id="jquery_jplayer_1"  onclick="video.screenClick(this)"></div>'+
	'           <div class="jp-gui">'+
	/*'               <div class="jp-video-play" style="display: block;">'+
	'                   <button tabindex="0" class="jp-video-play-icon" role="button">play</button>'+
	'               </div>'+*/
	'               <div class="jp-interface">'+
	'                   <div class="jp-progress">'+
	'                       <div class="jp-seek-bar" style="width: 100%;">'+
	'                           <div class="jp-play-bar" style="width: 0%;"></div>'+
	'                       </div>'+
	'                   </div>'+
	'                   <div class="jp-current-time" role="timer" aria-label="time">00:00</div>'+
	'                   <div class="jp-duration" role="timer" aria-label="duration">-00:33</div>'+
	'                   <div class="jp-details">'+
	'                       <div class="jp-title" aria-label="title">Big Buck Bunny</div>'+
	'                   </div>'+
	'                   <div class="jp-controls-holder">'+
	'                       <div class="jp-volume-controls">'+
	'                           <button tabindex="0" class="jp-mute" role="button">mute</button>'+
	'                           <button tabindex="0" class="jp-volume-max" role="button">max volume</button>'+
	'                           <div class="jp-volume-bar">'+
	'                               <div class="jp-volume-bar-value" style="width: 80%;"></div>'+
	'                           </div>'+
	'                       </div>'+
	'                       <div class="jp-controls">'+
	'                           <button tabindex="0" class="jp-play" role="button">play</button>'+
	'                           <button tabindex="0" class="jp-stop" role="button">stop</button>'+
	'                       </div>'+
	'                       <div class="jp-toggles">'+
	'                           <button tabindex="0" class="jp-repeat" role="button">repeat</button>'+
	'                           <button tabindex="0" class="jp-full-screen" role="button">full screen</button>'+
	'                       </div>'+
	'                   </div>'+
	'               </div>'+
	'           </div>'+
/*'<div class="jp-no-solution" style="display: none;">'+
'    <span>Update Required</span>'+
'To play the media you will need to either update your browser to a recent version or update your <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.'+
'</div>'+*/
'       </div>'+
'   </div>',
    editHTML:'<div class="pointEdit" style="display: none;width: 98%;height: 30px;padding: 5px 0">'+
    '   <button class="geBtn button pullright" onclick="video.removeAddPoints(this)">取消</button>'+
    '   <button class="geBtn button gePrimaryBtn pullright" onclick="video.doneAddPoints(this)">完成</button>'+
    '   <button class="geBtn button gePrimaryBtn pullright" onclick="video.saveTmpPoint()">确定</button>'+
    '</div>'+
    '<div id="video-tips" style="position: relative;z-index: 102;">第一步 设置断点：点击表格下方“添加断点”进行设置!</div>'+
    '<div id="video-tabs">'+
    '    <ul class="tabListHead">'+
    '        <li class="tabList" onclick="video.firstStep()">1.设置断点</li>'+
    '        <li class="tabList" onclick="video.secondStep()">2.设置段落</li>'+
    '        <li class="tabList" onclick="video.thirdStep()">3.分段预览</li>'+
    '    </ul>'+
    '    <div class="tab">'+
    '        <table>'+
    '            <thead>'+
    '                <tr>'+
    '                    <th>编号</th>'+
    '                    <th>断点位置</th>'+
    '                    <th>操作</th>'+
    '                </tr>'+
    '            </thead>'+
    '            <tbody class="_points">'+
    '            </tbody>'+
    '        </table>'+
    '        <button class="geBtn button gePrimaryBtn pullright" onclick="video.addNewPoint()">断点编辑</button><!--<button class="bottom btn-sm pull-left"></button>-->'+
    '    </div>'+
    '    <div class="tab">'+
    '        <table>'+
    '            <thead>'+
    '                <tr>'+
    '                    <th>编号</th>'+
    '                    <th>段落标题</th>'+
    '                    <th>段落详情</th>'+
    '                    <th>开始时间</th>'+
    '                    <th>段落长度</th>'+
    '                    <th>角色</th>'+
    '                    <th>操作</th>'+
    '                </tr>'+
    '            </thead>'+
    '            <tbody class="_parts">'+
    '           </tbody>'+
    '        </table>'+
    '        <div id="partEdit" style="display:none;>'+
    '            <form onsubmit="return false;">'+
    '                <div class="form-group">'+
    '                   <span class="pullLeft">段落标题</span>'+
    '                   <input id="editTitle" type="text" class="form-control pullLeft" placeholder="title">'+
    '              </div>'+
    '                <div class="form-group">'+
    '                    <span class="pullLeft">段落介绍</span>'+
    '                    <textarea id="editDes" class="form-control pullLeft" rows="3" placeholder="Textarea"></textarea>'+
    '                </div>'+
    '                <div class="form-group">'+
    '                    <span class="pullLeft">角色编辑</span>'+
    '                    <div class="pullLeft"><input type="checkbox" class="editRole" onclick="video.checkInput(this)" value="研发部" />研发部<input type="checkbox" onclick="video.checkInput(this)" class="editRole" value="市场部" />市场部<input type="checkbox" onclick="video.checkInput(this)" class="editRole" value="客服中心" />客服中心<input type="checkbox" onclick="video.checkInput(this)" class="editRole" value="信息中心" />信息中心<input type="checkbox" onclick="video.checkInput(this)" class="editRole" value="网络部" />网络部</div>'+
    '                </div>'+
    '                    <button class="geBtn button gePrimaryBtn pullLeft" onclick="video.savePartEdit()">保存</button>'+
    '            </form>'+
    '        </div>'+
    '    </div>'+
    '    <div class="tab">'+
    '        <table>'+
    '           <thead>'+
    '               <tr>'+
    '                   <th>编号</th>'+
    '                   <th>段落标题</th>'+
    '                   <th>段落详情</th>'+
    '                   <th>开始时间</th>'+
    '                    <th>段落长度</th>'+
    '                    <th>角色</th>'+
    '               </tr>'+
    '            </thead>'+
    '            <tbody class=" _partsCreact">'+
    '            </tbody>'+
    '        </table>'+
    '        <button class="geBtn button gePrimaryBtn" onclick="video.saveEdit()">保存</button>'+
    '    </div>'+
    '</div>',
    init : function(countainer,inVideo,type,next){

        var playVideo = {
            title:inVideo.name,
            m4v:filePort + 'fileManager/fileRead?userId='+inVideo.userId + '&filePath=' + inVideo.sourceF,
            poster:'./images/public/post.png'
        };

        video.next = next;
        video.part0 = [{'title':'','des':'','startTime':0,"duration":0,"role":[]}];
        var parts = inVideo.segments||video.part0;
        video.part1 = [];
        video.points = [];
        video.playStatus=1;//当前播放状态。0：播放；1：停止
        video.self=$("#jplayer");//播放器对象
        video.parts=[{'title':'','des':'','startTime':0,"duration":0,"role":[]}];//分段信息
        video.thisVideo=inVideo;
        video.tmpPoint=null;
        video.added=1;
        video.pausedParts = [];
        video.amountT=null;
        video.resentTime=null;
        video.fla=[];
        video.added = 1;
        video.countainer=null;

        video.type = type;
        if(parts!=undefined){
            if(parts.length>0){
                video.parts = parts;
            }
        }

        video.countainer = countainer;
        if(inVideo.segments!= undefined){
            if(parts.length > 0){
                video.part0 = [];video.part0.push(parts[0]);
                for(i=1;i<parts.length;i++){
                    video.part1.push(parts[i]);
                    video.points.push(parts[i].startTime);
                }
            }
        }

        for(i=0;i<=video.points.length;i++){
            video.fla[i]=false;
        }

        countainer.append(this.videoHTML);
        $("#jquery_jplayer_1").jPlayer({
            ready: function (){
                video.self = $(this);
                video.self.jPlayer("setMedia", playVideo).jPlayer("pause",0);
            },
            cssSelectorAncestor: "#jp_container_1",
            swfPath: "/js",
            supplied: "flv,m4v,webmv,rtmpv,m3u8v",
            useStateClassSkin: true,
            autoBlur: false,
            volume:80,
            size: {
                width: "100%", height: "auto", cssClass: ""
            },
            smoothPlayBar: true,
            keyEnabled: true,
            remainingDuration: true,
            toggleDuration: true
        });
        //若初始状态为编辑状态
        if(type == "edit"){
            $("#jplayer1").attr("onclick",'video.screenClick(this)');
            countainer.append('<div id="shadowPiece" style="width: 98%;height: 100%;position:fixed;top:0;left:0;z-index: 100;background: rgb(0,0,0);opacity:0.2;display: none"></div>');
            //$( "#video-tabs" ).tabs();
            countainer.append(this.editHTML);
            setTimeout('video.tabDefine();video.updatePointsList();',100);
        }
        else if(type == 'play'){
            $("#jplayer1").css("width","100%");
        }
        else{
            video.pausedParts = type;
            $("._h").hide();
            var len = 100/parts.length;
            for(i=0;i<parts.length;i++){
                $(".menuBar").append("<div class='oneMenu' style='width: "+len+"%' title='"+parts[i].title+"'><span class='glyphicon glyphicon-play' aria-hidden='true'></span></div>")
            }
            $(".jp-progress").css("border","0").append("<div style='float:left;position: absolute;top:0;width: 100%;height: 100%;z-index: 200;background-color: transparent;margin: 0;padding: 0'></div>")
        }

    },
    checkPoint : function(amountTime,remainTime,points){
        if(video.amountT != parseInt(amountTime)){
            video.amountT = parseInt(amountTime);
        }
        var x=[0];
        points = x.concat( points );
        var resentTime = amountTime - remainTime;
        var tmp;
        for(i=points.length-1;i>=0;i--){
            if(resentTime>points[i]){
                tmp = i;
                break;
            }
        }
        if(!isNaN(tmp)){
            if($.inArray(tmp,video.pausedParts)>=0 && !video.fla[tmp]){
                $(video.self).jPlayer("pause");
                alert('请完成工作台上的练习，再继续播放');
                video.playStatus = 1;
                video.fla[tmp]=true;
                for(i=0;i<video.fla.length;i++){
                    if(i!=tmp){
                        video.fla[i]=false;
                    }
                }
            }
        }
    },
    addTimePoint : function(amountTime,points){
        if(amountTime&& video.added){
            video.added = 0;
            var persents;
            for(i=0;i<points.length;i++){
                persents=points[i]/amountTime*100;
                $(".jp-play-bar").append("<div class='timePoint' style='margin:1px 0 3px "+persents+"%;border-radius: 2px;width:5px;background-color: white;height: 7px;position: absolute'></div>");
            }
        }
        else{
            return false;
        }

    },
    getResentTime : function(amountTime,remainTime){
        video.resentTime = amountTime - remainTime;
    },
    //**s转换为**m**s
    timeTransfer:function(t){
        var hour,minite,second;
        t=parseInt(t);
        if(t>=3600){
            hour = parseInt(t/3600);
            t-=(3600*hour);
        }
        if(t>=60){
            minite = parseInt(t/60);
            t-=(60*minite);
        }
        second = t;
        var srt1 = hour?(hour<9?("0"+hour):hour).toString():'00',srt2=minite?(minite<9?("0"+minite):minite).toString():'00',srt3=second?(second<9?("0"+second):second).toString():'00';
        return srt1 +':'+srt2+':'+srt3;
    },
    //屏幕点击切换播放状态
    screenClick:function(me){
        if(video.playStatus){
            $(me).jPlayer("play");
            video.playStatus = 0;
        }else{
            $(me).jPlayer("pause");
            video.playStatus = 1;
        }
    },
    //断点编辑
    addNewPoint : function(){
        $('#jplayer1').css({
            "z-index":'101',
            "position":"relative"
        });
        $("#jp_container_1").css({
            "z-index":'101',
            "position":"relative"
        });
        $('.pointEdit').css({
            "z-index":'101',
            "position":"relative"
        });
        $("#shadowPiece").show();
        $(".pointEdit").show();
        $(".jp-progress").attr("onclick","video.setTmpPoints()");
        $("#video-tips").html("请点击上方进度条设置断点↑");
    },

    setTmpPoints : function(){
        $("#video-tips").html("点击“确定”保存该断点或点击“完成”保存断点并退出编辑!");
        setTimeout("video.addTmpPoint(video.resentTime)",500);
    },

    addTmpPoint : function(t){
        $(".tmpP").remove();
        var p=t*100/video.amountT;
        video.tmpPoint = parseInt(t);
        $(".jp-play-bar").append("<div class='tmpP' style='border-radius: 2px;width:5px;background-color: white;height: 7px;position: absolute;margin:1px 0 3px "+p+"%;'></div>");
    },

    saveTmpPoint : function(){
        $("#video-tips").html("继续点击进度条继续添加或者点击“完成”完成添加！");
        $(".tmpP").removeClass("tmpP").addClass("timePoint");
        video.savePointsData();
    },

    doneAddPoints : function(me){
        $("#shadowPiece").hide();
        $(".tmpP").removeClass("tmpP").addClass("timePoint");
        video.savePointsData();
        $(me).parent().hide();$('#video-tips').html('点击“添加断点”继续添加或进行第二步：断落编辑！');$('.jp-progress').removeAttr('onclick');
    },

    removeAddPoints : function(me){
        $("#shadowPiece").hide();
        $(".tmpPoint").remove();
        $(me).parent().hide();$('#video-tips').html('点击“添加断点”继续添加或进行第二步：断落编辑！');$('.jp-progress').removeAttr('onclick');
    },

    savePointsData:function(){
        var points = [],parts=[],f=true,tmpPart = {'title':'','des':'','startTime':video.tmpPoint,'duration':0,'role':[]};
        if(video.tmpPoint == 0) return;
        if(video.points.length) {
            for (i = 0; i < video.points.length; i++) {
                if (video.tmpPoint < video.points[i]&&f) {
                    points.push(video.tmpPoint);
                    parts.push(tmpPart);
                    f=false;
                    video.tmpPoint = 0;
                }
                points.push(video.points[i]);
                parts.push(video.part1[i])
            }
        }
        if(f){
            points.push(video.tmpPoint);
            parts.push(tmpPart);
            video.tmpPoint = 0;
        }

        video.points = points;
        video.part1 = parts;
        video.parts = [];
        video.parts=video.part0.concat( video.part1 );
        video.updatePointsList();
    },

    updatePointsList:function(){
        $("._points").empty();
        for(i=0;i< video.points.length;i++){
            var tmp = '<tr>'+
                '     <td>'+(i+1)+'</td>'+
                '     <td>'+video.timeTransfer(video.points[i])+'</td>'+
                '     <td><a class="videoEdit" onclick="video.removePoint('+i+')">删除</a></td>'+
                '</tr>';
            $("._points").append(tmp);
        }
    },

    removePoint:function(k){
        if(confirm("确认删除？")){
            var points=[],parts=[];
            $(".timePoint")[k].remove();
            for(i=0;i<video.points.length;i++){
                if(i!=k){
                    points.push(video.points[i]);
                    parts.push(video.part1[i]);
                }
                else{
                    if(i==0){
                        video.part0[0].title=video.part0[0].title+'   '+video.part1[0].title;
                        video.part0[0].des=video.part0[0].des+'   '+video.part1[0].des;
                    }
                    else{
                        parts[i-1].title=parts[i-1].title+'   '+video.part1[i].title;
                        parts[i-1].des=parts[i-1].des+'   '+video.part1[i].des;
                    }
                }
            }
            video.points = points;
            video.part1 = parts;
            video.parts=video.part0.concat( video.part1 );
            video.updatePointsList();
            video.updatePartsList();
        }
    },
    //步骤切换
    firstStep:function(){
        $("#video-tips").html("第一步 设置断点：点击表格下方“添加断点”进行设置!");
        video.updatePointsList();
    },
    secondStep:function(){
        $("#video-tips").html("第二步 设置段落：点击表格中“编辑”编辑段落信息!");
        video.updatePartsList();
    },
    thirdStep:function(){
        $("#video-tips").html("第三步 完成设置：预览分段，确认无误后点击“保存”确认分段编辑！");
        $("._partsCreact").empty();
        var duration;
        for(i=0;i< video.parts.length;i++){
            if(i==video.parts.length-1){
                duration = video.amountT-video.parts[i].startTime;
            }
            else{
                duration = video.parts[i+1].startTime-video.parts[i].startTime;
            }
            video.parts[i].duration = duration;
            var tmp = '<tr>'+
                '     <td>'+(i+1)+'</td>'+
                '     <td>'+video.parts[i].title+'</td>'+
                '     <td>'+video.parts[i].des+'</td>'+
                '     <td>'+video.timeTransfer(video.parts[i].startTime)+'</td>'+
                '     <td>'+video.timeTransfer(duration)+'</td>'+
                '     <td>'+video.parts[i].role+'</td>'+
                '</tr>';
            $("._partsCreact").append(tmp);
        }
    },
    //段落编辑
    updatePartsList:function(){
        $("._parts").empty();
        var duration;
        for(i=0;i< video.parts.length;i++){
            if(i==video.parts.length-1){
                duration = video.amountT-video.parts[i].startTime;
            }
            else{
                duration = video.parts[i+1].startTime-video.parts[i].startTime;
            }
            video.parts[i].duration = duration;
            var tmp = '<tr>'+
                '     <td>'+(i+1)+'</td>'+
                '     <td>'+video.parts[i].title+'</td>'+
                '     <td>'+video.parts[i].des+'</td>'+
                '     <td>'+video.timeTransfer(video.parts[i].startTime)+'</td>'+
                '     <td>'+video.timeTransfer(duration)+'</td>'+
                '     <td>'+video.parts[i].role+'</td>'+
                '     <td><a class="videoEdit" onclick="video.editPart('+i+')">编辑</a>&nbsp;&nbsp;<a class="videoEdit" onclick="video.removePart('+i+')">删除</a></td>'+
                '</tr>';
            $("._parts").append(tmp);
        }
    },
    editPart:function(k){
        video.editedPart = k;
        $("#editTitle").val(video.parts[k].title);
        $("#editDes").val(video.parts[k].des);
        for(i=0;i<video.parts[k].role.length;i++){
            $("input[value="+video.parts[k].role[i]+"]").click();
        }
        $("#partEdit").slideDown();
    },
    savePartEdit:function(){
        if(video.editedPart==0){
            video.part0[0].title = $("#editTitle").val();
            video.part0[0].des = $("#editDes").val();
            video.part0[0].role = [];
            for(i=0;i<$(".editRole").length;i++){
                if($($(".editRole")[i]).attr("checked") ){
                    video.part0[0].role.push($($(".editRole")[i]).val());
                }
            }
        }
        else{
            video.part1[video.editedPart-1].title = $("#editTitle").val();
            video.part1[video.editedPart-1].des = $("#editDes").val();
            video.part1[video.editedPart-1].role = [];
            for(i=0;i<$(".editRole").length;i++){
                if($($(".editRole")[i]).attr("checked") ){
                    video.part1[video.editedPart-1].role.push($($(".editRole")[i]).val());
                }
            }
        }
        video.parts=video.part0.concat( video.part1 );
        video.updatePartsList();
        $("#editTitle").val("");
        $("#editDes").val("");
        $(".editRole").removeAttr("checked").attr("onclick","video.checkInput(this)");
        $("#partEdit").slideUp();
    },
    removePart:function(k){
        if(video.parts.length == 1){
            alert("段落总数为一个无法删除！");
        }
        else{
            if(confirm("确认删除？")){
                var parts=[],points=[];
                if(k==0){
                    video.part0[0].title=video.part1[0].title;
                    video.part0[0].des=video.part1[0].des;
                    for(i=1;i<video.part1.length;i++){
                        parts.push(video.part1[i]);
                        points.push(video.points[i]);
                    }
                    $(".timePoint")[k].remove();
                }
                else{
                    for(i=0;i<video.part1.length;i++){
                        if(i!=k-1){
                            parts.push(video.part1[i]);
                            points.push(video.points[i]);
                        }
                    }
                    $(".timePoint")[k-1].remove();
                }
                video.part1 = parts;
                video.points = points;
                video.parts=video.part0.concat( video.part1 );
                video.updatePartsList();
            }
        }
    },
    saveEdit:function(){
        var videoData = {};
        videoData = video.thisVideo;
        videoData.segments = video.parts;

        video.next(videoData);
        video.countainer.empty();
    },
    checkInput:function(me){
        $(me).attr("checked",true).removeAttr("onclick").attr("onclick","video.uncheckInput(this)");
    },
    uncheckInput:function(me){
        $(me).removeAttr("checked").removeAttr("onclick").attr("onclick","video.checkInput(this)");
    },
    tabDefine : function(){
        video.list = $(".tabList");
        video.tab = $(".tab");
        for(i=0;i<video.list.length;i++){
            $(video.list[i]).attr("onmouseover","$(this).css('background-color','#e5e5e5')").attr("onmouseout","$(this).css('background-color','#fff')");
            $(video.list[i]).attr("onclick","video.showTab("+i+")")
        }
        video.showTab(0,video.tab);
    },

    showTab : function(k){
        for(i=0;i<video.tab.length;i++){
            $(video.tab[i]).hide();
            $(video.list[i]).css('color','#000').css('background-color','#fff').attr("onmouseover","$(this).css('background-color','#e5e5e5')").attr("onmouseout","$(this).css('background-color','#fff')");
        }
        if(k == 0){
            video.firstStep();
        }
        else if(k == 1) {
            video.secondStep();
        }
        else{
            video.thirdStep();
        }
        $(video.list[k]).removeAttr("onmouseover").removeAttr("onmouseout").css('background-color','#e5e5e5');
        $(video.tab[k]).show();
    }
};







var getUrl = function(id){
    var LRPath = soursePort + '/OfficeTransfer/';
    return LRPath+id;
};