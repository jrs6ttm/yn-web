
$(document).ready(function () {
    getApp();
});

// 清除两边的空格
String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, '');
};

//获取App列表
function  getApp(){
    var data={};
    $.post("/app/getapps",  data  ,
        function(dataBack){
            if(dataBack.status == '404') {console.log(dataBack);alert('操作失败:' + dataBack.err);  return ;}
            if(dataBack.status == '200') {
                console.log(dataBack);
                var datas = dataBack.datas;
                var htmlstr = '';
                for(var i=0;i<datas.length;i++) {
                    var appid = datas[i].appid  , name = datas[i].name  ;
                    htmlstr = htmlstr +    "<option value='" + appid + "'>" + name + "</value>";
                } // for end
                $("#applist").append(htmlstr);
            }
        });  //ajax end
}




//'添加'按钮
$("#addfun").click(function(){
    var  appid =  $("#applist").val().trim();
    var  url = $("#url").val().trim();
    var  name = $("#name").val().trim();
    //console.log(appid);
    if(appid == '') {alert('请选择功能列表');   $('#applist', this.el).focus(); return ;}
    if( url== '')    {alert('url不能为空');   $('#url', this.el).focus(); return ;  }
    if(name == '')   {alert('name不能为空');   $('#name', this.el).focus(); return ;  }

    var data ={appid:appid, name:name , url:url};
    console.log('A', data);
    insertfun(data);
});


function  insertfun(data)
{
    $.post("/app/insertfun",  data  ,
        function(dataBack){
            if(dataBack.status == '404') {console.log(dataBack);alert('操作失败:' + dataBack.err);  return ;}
            if(dataBack.status == '200') {
                console.log(dataBack);
                data.funid = dataBack.datas.funid;
                addFunHtmp(data);
            }
        });  //ajax end
}



function addFunHtmp(data){
    // console.log('AA',data);
    var  funid = data.funid;
    var  appid = data.appid;
    var  name =  data.name;
    var  url = data.url;

    var htmlstr = '';
    htmlstr = htmlstr +
        "<tr id='tr_" + funid + "' > " +
        "      <td ><input type='text'  value='" + name + "' id='name_" + funid+ "' funid='" + funid + "' onblur=\"updatefun(this,'name')\"></td> " +
        "      <td ><input type='text'  value='" + url + "' id='url_" + funid+ "' funid='" + funid + "' onblur=\"updatefun(this,'url')\"></td> " +
        "      <td ><button  class='btn btn-danger btn-xs '  style= 'width: 50px;' id='del_" + funid + "' funid='" + funid+ "'  onclick=\"updatefun(this,'del')\">  注销 </button>  </td>" +
        "</tr>" ;

    $("#tbody").append(htmlstr);
}




function updatefun(ele,flag) {
    var funid =  ele.getAttribute('funid');
    var id = ele.getAttribute('id');
    var data = {funid:funid};
    if(flag == 'name') {
        var name = $('#' + id).val().trim();
        if( name == '' ) return;
        data.name = name;
    }

    if(flag == 'url') {
        var url = $('#' + id).val().trim();
        if( url == '' ) return;
        data.url = url;
    }

    if( flag ==  'del' ) {
        data.isvalid = '0';
    }

    //console.log(data);
    //console.log(appid,flag);

    $.post("/app/updatefun",  data  ,
        function(dataBack){
            if(dataBack.status == '404') {console.log(dataBack);alert('操作失败:' + dataBack.err);  return ;}
            if(dataBack.status == '200') {
                console.log(dataBack);
                if( flag ==  'del' )  $('#tr_' + funid).remove();
            }
        });  //ajax end
}




function listappfuns(ele) {
    var id = ele.getAttribute('id');
    var appid =$('#'+id).val();
    if(appid == '') return;
    var data = {appid:appid};

    $.post("/app/getappfuns",  data  ,
        function(dataBack){
            if(dataBack.status == '404') {console.log(dataBack);alert('操作失败:' + dataBack.err);  return ;}
            if(dataBack.status == '200') {
                console.log(dataBack);
                var datas = dataBack.datas;
                $("#tbody").empty();
                for(var i=0;i<datas.length; i++) {
                    addFunHtmp(datas[i]);
                }
            }
        });  //ajax end

}







