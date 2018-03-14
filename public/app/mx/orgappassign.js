
$(document).ready(function () {

});


// 清除两边的空格
String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, '');
};

function getapplist() {
    var orgID = $("#org").val();
    if(orgID == '')  return ;
    var data = {orgID:orgID};
    $.post("/app/getorgapps",  data  ,
        function(dataBack){
            if(dataBack.status == '404') {console.log(dataBack);alert('操作失败:' + dataBack.err);  return ;}
            if(dataBack.status == '200') {
                var datas = dataBack.datas;
                $("#applist").empty();
                for(var i=0; i<datas.length;i++) {
                    addOrgAppHtmp(datas[i]);
                }
            }
        });  //ajax end
}

function addOrgAppHtmp(data){
    // console.log('AA',data);
    var  oaid = data.orgappid;
    var  appid = data.appid;
    var  name =  data.name;
    var  isassign = data.isassign;
    var  checkedflag ='';
    if(isassign == '1')  checkedflag = 'checked';
    var htmlstr = '';
    htmlstr = htmlstr +
        "<tr > <td><label> <input id='box_" + oaid + "'  " + checkedflag + "   type='checkbox' oaid='" + oaid + "' onclick='updateOrgApp(this)'>" + name + "</label></td> </tr>";

    $("#applist").append(htmlstr);

}


function updateOrgApp(ele) {
    var oaid =  ele.getAttribute('oaid');
    var id = ele.getAttribute('id');
    if(oaid=='' || oaid == undefined) {alert('操作失败:oaid数据错误');  return ;}
    var data = {oaid:oaid};
    if(document.getElementById(id).checked)  data.isassign ='1';
    else  data.isassign ='0';

    $.post("/app/updateorgapp",  data  ,
        function(dataBack){
            if(dataBack.status == '404') {console.log(dataBack);alert('操作失败:' + dataBack.err);  return ;}
            if(dataBack.status == '200') {
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






