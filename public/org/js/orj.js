
//组织机构编辑中"重置"按钮---清空组织信息

$("#chongzhi").click(function(){
    //清空文本框的信息
    $('#orgCode').val('');
    $('#legalPerson').val('');
    $('#orgFullDes').val('');
    $('#orgShortDes').val('');
    $('#address').val('');
    $('#tel1').val('');
    $('#businessLicense').val('');
    $('#emailAdress').val('');
    $('#registerMoney').val('');
    $('#tel2').val('');
    $('#REMARK').val('');

})




//组织机构编辑中保存按钮---添加或保存组织信息
$("#save").click(function(){

    //console.log($('#orgCode').val().length);
    //条件约束, 带*的为必填
    var orgCode_RegExp = new RegExp(/^[A-Za-z0-9]{1,25}$/);
    var legalPerson_orgCode_RegExp = new RegExp(/^[^\u0000-\u00FF]{2,4}$/);
    var orgFullDes_RegExp = new RegExp(/^[^\u0000-\u00FF]{1,25}$/);
    var orgShortDes_RegExp = new RegExp(/^[^\u0000-\u00FF]{1,10}$/);

    var address_RegExp = new RegExp(/^[0-9a-zA-Z_\-\u3E00-\u9FA5]{2,80}$/);

    var tel1_RegExp = new RegExp(/^1[0-9]{10,10}$/);

    var tel2_RegExp = new RegExp(/^[0-9]{11,12}$/);
    var registerMoney_RegExp = new RegExp(/^[1-9][0-9]{0,7}$/);

    var businessLicense_RegExp = new RegExp(/^[A-Za-z0-9]{15,15}$/);
    var emailAdress_RegExp = new RegExp(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/);

    if( orgCode_RegExp.test($('#orgCode').val().trim()) == false ) {alert('组织代码约束条件:长度1-25；包含数字或字母！'); $('#orgCode', this.el).focus(); return ; }
    if( legalPerson_orgCode_RegExp.test($('#legalPerson').val().trim()) == false   ) {alert('法人约束条件: 2-4个汉字！'); $('#legalPerson', this.el).focus(); return ; }
    if( orgFullDes_RegExp.test($('#orgFullDes').val().trim()) == false  ) {alert('组织名称约束条件: 1-25个汉字！'); $('#orgFullDes', this.el).focus(); return ; }
    if( orgShortDes_RegExp.test($('#orgShortDes').val().trim()) == false ) {alert('简称约束条件: 1-10个汉字！'); $('#orgShortDes', this.el).focus(); return ; }
    if( address_RegExp.test($('#address').val().trim()) == false  )   {alert('地址约束条件: 长度2-80；包含数字，字母，汉字，"-","-"！'); $('#address', this.el).focus(); return ; }
    if( tel1_RegExp.test($('#tel1').val().trim()) == false  )   {alert('手机号约束条件: 11位手机号码且首位为1！'); $('#tel1', this.el).focus(); return ; }

    if( registerMoney_RegExp.test($('#registerMoney').val().trim()) == false && $('#registerMoney').val().trim() !=''   )  {alert('注册资金约束条件:长度1-8位；纯数字!'); $('#registerMoney', this.el).focus();return ;}
    if( businessLicense_RegExp.test($('#businessLicense').val().trim()) == false && $('#businessLicense').val().trim() !=''   )   {alert('营业执照约束条件: 长度15位；纯数字或数字+字母！'); $('#businessLicense', this.el).focus(); return ; }
    if( emailAdress_RegExp.test($('#emailAdress').val().trim()) == false && $('#emailAdress').val().trim() !=''   )  {alert('邮箱地址约束条件: 示例：aa@bb.com！'); $('#emailAdress', this.el).focus(); return ; }
    if( tel2_RegExp.test($('#tel2').val().trim()) == false && $('#tel2').val().trim() !='' )  {alert('电话号码约束条件: 11-12位座机号码！'); $('#tel2', this.el).focus(); return ; }


    var orjID =  $('#orjID').val();
    orjID = orjID.trim();
    //console.log(orjID);

    var dateTime= new Date().Format("yyyy-MM-dd HH:mm:ss");

    var data = {};

    data.orgCode = $('#orgCode').val();
    data.legalPerson = $('#legalPerson').val();
    data.orgFullDes = $('#orgFullDes').val();
    data.tel1 = $('#tel1').val();
    data.orgShortDes = $('#orgShortDes').val();
    data.orgSort = $('#orgSort').val();
    data.emailAdress = $('#emailAdress').val();
    data.tel2 = $('#tel2').val();
    data.address = $('#address').val();
    data.schoolType = $('#schoolType').val();
    data.orgscaleType = $('#orgscaleType').val();
    data.registerMoney = $('#registerMoney').val();
    data.businessLicense = $('#businessLicense').val();
    data.REMARK = $('#REMARK').val();
    data.ISVALID = 0;

    console.log(data);

    if(data.schoolType == 0 && orjID == '')   {
        var flag = confirm("请确认您选择的组织类型:非学校结构?");
        if(flag == false) return;
    }


    //如果为空，表示第一次添加，插入orj数据.
    if(orjID == '' )   insertOrj(data);
    else  //如果不为空，则检查数据是否存于数据库， 如果存在，更新。
    {  data.orgID = orjID;saveOrj( data);  }

});





//组织机构编辑中'提交生效'按钮---提交组织信息
$("#OKsumbit").click(function(){

    //条件约束, 带*的为必填
    var orgCode_RegExp = new RegExp(/^[A-Za-z0-9]{1,25}$/);
    var legalPerson_orgCode_RegExp = new RegExp(/^[^\u0000-\u00FF]{2,4}$/);
    var orgFullDes_RegExp = new RegExp(/^[^\u0000-\u00FF]{1,25}$/);
    var orgShortDes_RegExp = new RegExp(/^[^\u0000-\u00FF]{1,10}$/);

    var address_RegExp = new RegExp(/^[0-9a-zA-Z_\-\u3E00-\u9FA5]{2,80}$/);

    var tel1_RegExp = new RegExp(/^1[0-9]{10,10}$/);

    var tel2_RegExp = new RegExp(/^[0-9]{11,12}$/);
    var registerMoney_RegExp = new RegExp(/^[1-9][0-9]{0,7}$/);

    var businessLicense_RegExp = new RegExp(/^[A-Za-z0-9]{15,15}$/);
    var emailAdress_RegExp = new RegExp(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/);

    if( orgCode_RegExp.test($('#orgCode').val().trim()) == false ) {alert('组织代码约束条件:长度1-25；包含数字或字母！'); $('#orgCode', this.el).focus(); return ; }
    if( legalPerson_orgCode_RegExp.test($('#legalPerson').val().trim()) == false   ) {alert('法人约束条件: 2-4个汉字！'); $('#legalPerson', this.el).focus(); return ; }
    if( orgFullDes_RegExp.test($('#orgFullDes').val().trim()) == false  ) {alert('组织名称约束条件: 1-25个汉字！'); $('#orgFullDes', this.el).focus(); return ; }
    if( orgShortDes_RegExp.test($('#orgShortDes').val().trim()) == false ) {alert('简称约束条件: 1-10个汉字！'); $('#orgShortDes', this.el).focus(); return ; }
    if( address_RegExp.test($('#address').val().trim()) == false  )   {alert('地址约束条件: 长度2-80；包含数字，字母，汉字，"-","-"！'); $('#address', this.el).focus(); return ; }
    if( tel1_RegExp.test($('#tel1').val().trim()) == false  )   {alert('手机号约束条件: 11位手机号码且首位为1！'); $('#tel1', this.el).focus(); return ; }

    if( registerMoney_RegExp.test($('#registerMoney').val().trim()) == false && $('#registerMoney').val().trim() !=''   )  {alert('注册资金约束条件:长度1-8位；纯数字!'); $('#registerMoney', this.el).focus();return ;}
    if( businessLicense_RegExp.test($('#businessLicense').val().trim()) == false && $('#businessLicense').val().trim() !=''   )   {alert('营业执照约束条件: 长度15位；纯数字或数字+字母！'); $('#businessLicense', this.el).focus(); return ; }
    if( emailAdress_RegExp.test($('#emailAdress').val().trim()) == false && $('#emailAdress').val().trim() !=''   )  {alert('邮箱地址约束条件: 示例：aa@bb.com！'); $('#emailAdress', this.el).focus(); return ; }
    if( tel2_RegExp.test($('#tel2').val().trim()) == false && $('#tel2').val().trim() !='' )  {alert('电话号码约束条件: 11-12位座机号码！'); $('#tel2', this.el).focus(); return ; }



    var orjID =  $('#orjID').val();
    orjID = orjID.trim();
    console.log(orjID);

    var dateTime= new Date().Format("yyyy-MM-dd HH:mm:ss");

    var data = {};

    data.orgCode = $('#orgCode').val();
    data.legalPerson = $('#legalPerson').val();
    data.orgFullDes = $('#orgFullDes').val();
    data.tel1 = $('#tel1').val();
    data.orgShortDes = $('#orgShortDes').val();
    data.orgSort = $('#orgSort').val();
    data.emailAdress = $('#emailAdress').val();
    data.tel2 = $('#tel2').val();
    data.address = $('#address').val();
    data.schoolType = $('#schoolType').val();
    data.orgscaleType = $('#orgscaleType').val();
    data.registerMoney = $('#registerMoney').val();
    data.businessLicense = $('#businessLicense').val();
    data.REMARK = $('#REMARK').val();
    data.ISVALID = 1;

    console.log(data);

    if(  $('#registerMoney').val().trim() != ''  &&   /^[\d]+$/i.test(data.registerMoney) ==  false ) {alert('注册资金必须为数字!'); return ;}

    if(data.schoolType == 0 && orjID == '')   {
        var flag = confirm("请确认您选择的组织类型:非学校结构?");
        if(flag == false) return;
    }

    //如果为空，表示第一次添加，插入orj数据.
    if(orjID == '' )   insertOrj(data,1);
    else  //如果不为空，则检查数据是否存于数据库， 如果存在，更新。
    {  data.orgID = orjID;saveOrj(data,1);  }

});




//插入组织数据, flag为1表示被提交生效调用
function  insertOrj(data, flag)
{
    $.post("/org/Ajax_insertOrj",  data  ,

        function(dataBack){
            if(dataBack.status == '404') {alert('操作失败:' + dataBack.err);  $('#orgCode', this.el).focus();  return ;}

            if(dataBack.status == '200') {
                //console.log(dataBack.docData);

                //对orjID赋值
                $('#orjID').val(dataBack.docData.orgID);

                if(flag == 1)   alert('已经生效');
                else
                    alert('保存成功');
            }

        });  //ajax end

}

//更新组织数据 , flag为1表示被提交生效调用
function saveOrj(data,flag)
{
    $.post("/org/Ajax_updateOrj",  data  ,

        function(dataBack){
            if(dataBack.status == '404') {alert('操作失败:' + dataBack.err );$('#orgCode', this.el).focus();  return ;}

            if(dataBack.status == '200') {
                if(flag == 1)   alert('已经生效');
                else
                    alert('保存成功');
            }

        });  //ajax end
}




//组织机构编辑中'返回组织列表页'按钮
$("#toOrgList").click(function(){
    var url = "/org/org_search"  ;
    window.location.href=url;

});

//组织机构编辑中'转机构维护页'按钮
$("#toOrgEdit").click(function(){
    var orjID =  $('#orjID').val();
    orjID = orjID.trim();

    if(orjID == '') {alert('请先完成组织的创建');  return ;}

    var url = "/org/orgDep_edit?id=" + orjID  ;
    window.location.href=url;

});

//Ajax修改模板： table: 表名 ， update_txt:修改字段，  where_txt ：条件语句
function update_myExamOK(data) {
// 发送AJAX 修改指定数据
    console.log(data);

    $.post("/exam/Ajax_update_txt_V2",
        {
            'table': data.table  ,
            'update_txt' :  data.update ,
            'where_txt' :  data.where
        },


        // res.send({examID:doc_exam.insertId , pageID: doc_page.insertId , status : '200'});
        function(dataBack){
            //alert("Data: " + data.examID + ',' + data.pageID + "\nStatus: " + data.status);
            if(dataBack.status == '404') {alert('Ajax操作失败'); return ;}

            if(dataBack.status == '200') {

                var url = "/exam/myExamOK?" + "myexamid=" + data.myexamid ;
                window.location.href=url;
            }

        });  //ajax end

}



