/**
 * Created by admin on 2017/1/10.
 */
    ;
(function(root){
    var hostName = root.location.hostname,
        joint = /(learn.com)$/.test(hostName),
        prod = /(xuezuowang.com)$/.test(hostName),
        mode = prod ? 'prod' : (joint ? 'joint' : 'dev');
    var path = {
        dev: {
            xuezuowang: "http://oc.learn.com",
            ecgeditor: "http://authoring.learn.com",
            coursePlayer: "http://oc.learn.com/index.php/apps/courseplayer/",
            oldengine: "http://192.168.1.25:25000",
            newengine: "http://192.168.1.25:8080",
            socketPort: "http://192.168.1.97:13000"
        },
        joint: {
            xuezuowang: "http://oc.learn.com",
            ecgeditor: "http://authoring.learn.com",
            coursePlayer: "http://oc.learn.com/index.php/apps/courseplayer/",
            oldengine: "http://oldengine.learn.com",
            newengine: "http://newengine.learn.com",
            socketPort: "http://comsocket.learn.com"
        },
        prod: {
            xuezuowang: "http://www.xuezuowang.com",
            ecgeditor: "http://authoring.xuezuowang.com",
            coursePlayer: "http://www.xuezuowang.com/",
            oldengine: "http://oldengine3w.xuezuowang.com",
            newengine: "http://newengine3w.xuezuowang.com",
            socketPort: "https://comsocket.xuezuowang.com"
        }
    };
    root.config = path[mode];
    root.config.mode = mode;
})(window);
