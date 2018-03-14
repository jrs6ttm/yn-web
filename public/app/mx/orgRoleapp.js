

$(document).ready(function () {
    getOrgRoleApp();
});


function getOrgRoleApp()
{
    $.get("/app/getOrgRoleApp", {} ,
        function(dataBack){
            if(dataBack.status == '404') {console.log(dataBack);alert('操作失败:' + dataBack.err);  return ;}
            if(dataBack.status == '200') {
                console.log(dataBack);
                var datas = dataBack.datas;
                var roleapps = datas.roleapps;
                var roles =datas.roles;
                var htmlstr = '';
                for(var i=0;i< roles.length ;i++) {
                    var name = roles[i].name;
                    var idtmp = roles[i].orgRoleID;
                    htmlstr = htmlstr + "<tr> <td class='is-hidden'  style='vertical-align: middle;text-align: center;'>" + name + "</td>  <th scope='row' ><div class='one'> ";
                    for(var j=0; j<roleapps.length; j++) {
                        if(idtmp == roleapps[j].orgRoleID )   {
                            var checked = "";
                            var roleappID = roleapps[j].roleAppID;
                            var appname =roleapps[j].name;

                            if(roleapps[j].status == 1)  checked = "checked";
                            htmlstr = htmlstr +  "<div class='checkbox' > <label > <input id='box_" + roleappID + "' " + checked + " type='checkbox' raid='" + roleappID + "'  onclick='updateRoleApp(this)'  >" + appname + "</label> </div>";

                        } //if end
                    }  // for end
                    htmlstr = htmlstr + "  </div></th></tr>";

                } //for end
                console.log(htmlstr);
                $("#roleappTable").append(htmlstr);
            }
        });  //ajax end

}


function updateRoleApp(ele) {
    var rid = ele.getAttribute('raid');
    var flag = 0;
    var rid = ele.getAttribute('raid');
    if( document.getElementById("box_" + rid).checked ) flag = 1;

    //console.log(rid , flag);
    var data = {rid:rid , flag:flag};

    $.post("/org/Ajax_updateRoleApp",  data  ,
        function(dataBack){
            if(dataBack.status == '404') {console.log(dataBack);alert('操作失败:' + dataBack.err);  return ;}
            if(dataBack.status == '200') {
                console.log(rid,"权限操作成功");
            }
        });  //ajax end

}



