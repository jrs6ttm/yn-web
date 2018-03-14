/**
 * Created by Administrator on 2015/10/10.
 */
var PageTemplateView = {
    PageHTML  :  '<ul class="pagination">'+
                    '<li <%if(currentPage == 1){%>class="disabled"<%}else{%>class="myPage" data-currentPage="<%=currentPage-1%>"<%}%>><span class="glyphicon glyphicon-chevron-left" /></li>'+
                    '<%for(var i=startPage; i<endPage+1;i++){%>'+
                        '<li <%if(currentPage == i){%>class="active myPage"<%}else{%>class="myPage"<%}%> data-currentPage="<%=i%>"><a href="javascript:void(0);"><%=i%></a></li>'+
                    '<%}%>'+
                    '<li <%if(currentPage == totalPage){%>class="disabled"<%}else{%>class="myPage" data-currentPage="<%=currentPage+1%>"<%}%>>'+
                        '<span class="glyphicon glyphicon-chevron-right" /></li>'+
                 '</ul>',
    PageHTML1 : '<ul class="nav navbar-nav" style="float:right;">'+
                    '<li><a>为您找到 <%=totalRecords%> 条相关记录</a></li>'+
                    '<li <%if(currentPage == 1){%>class="disabled"<%}else{%>class="myPage" data-currentPage="<%=currentPage-1%>"<%}%> ><a href="#">'+
                        '<span class="glyphicon glyphicon-chevron-left"></span></a></li>'+
                    '<li><a href="#"><%=currentPage%>/<%=totalPage%></a></li>'+
                    '<li <%if(currentPage == totalPage){%>class="disabled"<%}else{%>class="myPage" data-currentPage="<%=currentPage+1%>"<%}%> ><a href="#">'+
                        '<span class="glyphicon glyphicon-chevron-right"></span></a></li>'+
                '</ul>'
};

//分页
var PageView = Backbone.View.extend({
    className : 'page',
    attributes : {
        align : 'center',
        style : "margin-top: 5%"
    },
    events : {
        'click .myPage' : 'devidePage'
    },

    initialize : function(){
        _.bindAll(this, 'render', 'removeSelf');
    },

    render : function(HTML){
        this.template = _.template(HTML);
        $(this.el).append(
            this.template(this.model.toJSON())
        );

        return this;
    },

    removeSelf : function(){
        $(this.el).remove();
    },

    devidePage : function(event){
        var Obj = event.currentTarget;
        var toPage = Number($(Obj).attr('data-currentPage'));
        if(toPage < 7){
            Query.set({currentPage: toPage, startPage:1});
        }else{
            var startP = toPage - 5;
            var stopP = toPage + 4;
            if(startP < 1)
                startP = 1;
            if(stopP > Query.get('totalPage'))
                stopP = Query.get('totalPage');
            Query.set({currentPage: toPage, startPage: startP, endPage: stopP});
        }
    }
});
