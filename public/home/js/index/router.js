/**
 * Created by lijiemoop on 2/15/2016.
 * index路由
 */
var getHashValues = function(hashQueue){
    var vals = [];
    if(hashQueue[0]){
        if(hashQueue[1] != undefined){
            var i = 1;
            while(hashQueue[i] != undefined){
                vals.push(hashQueue[i]);
                i++;
            }
        }
        return vals;
    }
};

var hashRouter = function(hashQueue){
    var page;

    if(hashQueue[0]){
        page = hashQueue[0];
        pageSelect(page);
    }
    else{
        window.history.pushState(null,null,defaultHash);
    }
};

//选择页面
var pageSelect = function(page){
    $('html,body').animate({ scrollTop: 0}, 0);
    var vals;
    switch (page){
        case 'home':

                var home = new Home;
                $('._page_view').empty();
                home.init(vals);

            break;
        case 'situation':

            var situation = new Situation;
            $('._page_view').empty();
            vals = getHashValues(location.hash.replace(/^#/,"").split('/'));
            situation.init(vals);

            break;
        case 'course':

            var course = new Course;
            $('._page_view').empty();
            vals = getHashValues(location.hash.replace(/^#/,"").split('/'));
            course.init(vals);

            break;
        case 'player':

            var player = new Player;
            $('._page_view').empty();
            vals = getHashValues(location.hash.replace(/^#/,"").split('/'));
            player.init(vals);

            break;
        case 'studyManage':

            var studyManage = new StudyManage;
            $('._page_view').empty();
            vals = getHashValues(location.hash.replace(/^#/,"").split('/'));
            studyManage.init('studyManage');

            break;
        case 'examManage':

            var studyManage = new StudyManage;
            $('._page_view').empty();
            vals = getHashValues(location.hash.replace(/^#/,"").split('/'));
            studyManage.init('examManage');
        case 'userManage':
            var userManage = new UserManage;
            $('._page_view').empty();
            userManage.init();
            break;
        default :
            window.history.pushState(null,null,defaultHash);
            HashRead(location.hash.replace(/^#/,""));
            break;
    }
};