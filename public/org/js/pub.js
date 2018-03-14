
//*******        *********************//
//         公共函数                    //
//*******        *********************//

$(document).ready(function () {

    kendo.culture("zh-CN");
});


//获取URL的参数值
function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");

    var r = window.location.search.substr(1).match(reg);

    if(r!=null)return  unescape(r[2]); return null;
}




//时间格式化
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


// 清除两边的空格
String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, '');
};



//显示或隐藏相应元素，
function ShowOrHidden(showID , hidID , flagID  )
{
    // alert('test');
//alert(flagID);
// alert(showID); alert(hidID);
    //alert( "#" + hidID);
//如果Flag为0， 显示隐要藏的元素； flag为1时，显示要藏的元素

    var flag = parseInt ($("#" + flagID).val());

    if(flag  == 0) {  //需要更改时执行

        $("#" + showID).hide();
        $("#" + hidID).show();
        $("#" + flagID).val(1);
        $("#" + hidID, this.el).focus();
    }

    if(flag  == 1) {  //更改完成时执行

        //重新赋值
        var valtmp = $("#" + hidID).val();
        var show_tmp = $("#" + showID).text();
        valtmp = valtmp.trim();
        show_tmp = show_tmp.trim();

        //if(selectedDeptID == ORGID)  {  alert('最顶层父结点不可修改，如需修改请在组织维护页进行！');  $("#" + hidID).val($("#" + showID).text()); return ; }
        if(valtmp == '' ) {alert('更改数据不能为空。'); $("#" + hidID).val($("#" + showID).text());  $("#" + hidID, this.el).focus(); return;   }
        if(valtmp == show_tmp  ) { $("#" + showID).text(valtmp);$("#" + hidID).hide();$("#" + showID).show(); $("#" + flagID).val('0');return ; }

        //判定是否重名 1.获取父结点； 2.循环对比父结点下子结点名称是否重名
        var parentID = '',  t=0;
        for(var i=0;i < orgTreeData.length; i++  ) {
            if(orgTreeData[i].orgID == selectedDeptID ) { t=i; parentID = orgTreeData[i].parentId; break; }

        }

        if(parentID != '') {
            for(var j=0;j < orgTreeData.length; j++ ) {

                if(j != t && orgTreeData[j].parentId == parentID  &&  valtmp == orgTreeData[j].orgFullDes ) {
                    alert('机构名称不能与同级结点重名。'); $("#" + hidID).val($("#" + showID).text());  $("#" + hidID, this.el).focus(); return;
                } //if  end

            } //for end
        }

// alert(parentID);




        var data=[], tmp = {};

        tmp.deptID = selectedDeptID;
        tmp.deptDes = valtmp;
        data[0] = tmp;

        var path = '', parm = {};

        if(selectedDeptID == ORGID) { path = '/org/Ajax_updateOrj'; parm ={'orgID': ORGID , 'orgFullDes' : valtmp  }; }
        else {path = '/org/Ajax_updateDept_arry'; parm ={ "models" : JSON.stringify(data) };}


        $.post(  path ,   parm  ,
            function(dataBack) {
                if(dataBack.status == '404') {alert(dataBack.err); console.log(dataBack.err); return ;}

                if(dataBack.status == '200') {
                    //更新组织树形结

                    //更新用户信息
                    $("#" + showID).text(valtmp);
                    $("#" + hidID).hide();
                    $("#" + showID).show();
                    $("#" + flagID).val('0');

                } //if end
            }); //function end   //.post end




    }

}








