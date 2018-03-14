

$(document).ready(function () {

    //console.log('test');



});


var orders =[];


//清除两边的空格
String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, '');
};



//设置Grid数据
function SetGrid(data) {
    $("#singleSort").kendoGrid({
        dataSource: {
            data: data,
            pageSize: 7
        },
        sortable: {
            mode: "single",
            allowUnsort: false
        },
        pageable: {
            buttonCount: 5
        },
        scrollable: false,
        columns: [

            {
                template:"<a >#=orgCode#</a> ",
                title: "<div align='center'>组织代码 </div>",
                width: 100
            },
            {
                template: "<div>#=orgFullDes#</div> ",
                title: "<div align='center'>组织名称 </div>",
                width: 150
            },

            {
                template: "<div>#=orgShortDes#</div> ",
                title: "<div align='center'>组织简称 </div>",
                width: 100
            },
            /*
             {
             template: "<div>#=orgSort#</div>",
             title: "<div align='center'>组织类型 </div>",
             width: 100
             },

             {
             template:  "<div>#=schoolType#</div>",
             title: "<div align='center'>是否学校类型 </div>",
             width: 100
             },
             */

            {
                template:  "<select id='isvalid_#=orgID#' orgID='#=orgID#' onchange=\"updateOrgStatus(this,'isvalid')\"    ><option value='0' #if(ISVALID=='0'){# selected  #}#  >未生效</option><option value='1' #if(ISVALID=='1'){# selected  #}#  >已生效</option></select>",
                title: "<div align='center'>是否生效 </div>",
                width: 100
            },

            {
                template: "<a  href='/org/orgDep_edit?id=#=orgID#'  >维护机构</a>&nbsp;&nbsp;&nbsp;  ",    //<a  href='/org/org_edit?id=#=orgID#' >维护组织</a>
                title: "<div align='center'>操作 </div>",
                width: 100
            },

            {
                template: " <select id='checkStatus_#=orgID#' orgID='#=orgID#'  onchange=\"updateOrgStatus(this,'checkStatus')\"  ><option value='0' #if(checkStatus=='0'){# selected  #}#  >待审</option><option value='1' #if(checkStatus=='1'){# selected  #}#  >通过</option><option value='2' #if(checkStatus=='2'){# selected  #}#    >未通过</option></select>",    //<a  href='/org/org_edit?id=#=orgID#' >维护组织</a>
                title: "<div align='center'>审核 </div>",
                width: 50
            }

        ]
    });
}


function updateOrgStatus(ele,flag) {
    var orgID = ele.getAttribute('orgID');
    var id = ele.getAttribute('id');

    var value = $('#'+id).val();
    var data ={orgID:orgID};

    if(orgID=='' || orgID ==undefined ) return;

    if(flag == 'checkStatus' ) data.checkStatus = value;
    if(flag == 'isvalid' )     data.ISVALID = value;

    updateOrg(data);


}


function updateOrg(data) {

    $.post("/org/Ajax_updateOrj",  data  ,

        function(dataBack){
            if(dataBack.status == '404') {console.log(dataBack);alert('操作失败:' + dataBack.err);  return ;}
            if(dataBack.status == '200') {

            }

        });  //ajax end

}


//清除两边的空格
String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, '');
};




//组织查询列表中‘查询’按钮---list符合条件的组织
$("#org_search_search").click(function(){
    var orgCode = $('#orgCode').val().trim();
    var orgFullDes = $('#orgFullDes').val().trim();
    var orgShortDes = $('#orgShortDes').val().trim();
    var remark = $('#remark').val().trim();

    //if(orgCode ==''  && orgFullDes ==''  && orgShortDes==''   && remark=='')  { alert('查询条件不能全部为空！');   $('#orgCode', this.el).focus(); return ;}

    var data={};
    data.orgCode = orgCode;
    data.orgFullDes = orgFullDes;
    data.orgShortDes = orgShortDes;
    data.remark = remark;

    if( $('#isValid').val() != '-1' )    data.ISVALID = $('#isValid').val();
    if( $('#checkStatus').val() != '-1' )    data.checkStatus = $('#checkStatus').val();

    //console.log(data);

    //*****AJAX查询组织信息并显示到列表
    searchOrg(data);

});

//*****AJAX查询组织信息并显示到列表
function searchOrg(data) {

    $.post("/org/Ajax_searchOrg",  data  ,

        function(dataBack){
            if(dataBack.status == '404') {alert('查询操作失败'); return ;}

            if(dataBack.status == '200') {
                //console.log(dataBack.docData);
                // alert('查询成功');
                var resDatas = dataBack.docData;
                var t1 , t2;
                for(i=0; i< resDatas.length ; i++) {
                    t1 =  resDatas[i].orgSort;
                    t2 =  resDatas[i].schoolType;
                    t3 =  resDatas[i].ISVALID;
                    //解析组织类型
                    if(t1 == 0)   resDatas[i].orgSort = '非正式组织';
                    if(t1 == 1)   resDatas[i].orgSort = '正式组织';
                    if(t1 == 2)   resDatas[i].orgSort = '临时组织';
                    if(t1 == 3)   resDatas[i].orgSort = '其它';

                    //解析学校结构
                    if(t2 == 0)   resDatas[i].schoolType= '否';
                    if(t2 == 1)   resDatas[i].schoolType = '是';

                    //解析是否生效
                    //if(t3 == 0)   resDatas[i].ISVALID= '未生效';
                    //if(t3 == 1)   resDatas[i].ISVALID = '已生效';


                }
                SetGrid(dataBack.docData);

                //console.log(dataBack.docData);

                //orders = dataBack.docData;

            }

        });  //ajax end

}



//组织查询列表中‘重置’按钮
$("#org_search_reSet").click(function(){
    $('#orgCode').val('');
    $('#orgFullDes').val('');
    $('#orgShortDes').val('');
    $('#remark').val('');
});

//组织查询列表中‘新增组织’按钮
$("#org_search_addOrg").click(function(){
    var url = "/org/org_edit" ;
    window.location.href=url;
});

