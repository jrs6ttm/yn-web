/**
 * Created by lijiemoop on 2/15/2016.
 */
/**
 * Created by lijiemoop on 11/6/2015.
 *解析hash
 */


 var defaultHash = '#home',
            userData ,
             playerPort = '/index.php/apps/courseplayer',
             processEnginePort = 'http://192.168.1.25:25000',
             soursePort = 'http://www.xuezuowang.com:28088',
             filePort = '/index.php/apps/managementsysext',
             VMPort = 'http://www.xuezuowang.com:10000',
             VM2Port = "http://www.xuezuowang.com:10001",
             VM3Port = '192.168.0.38',
             signPort = '#{signPort}',
             codePort = '#{codePort}',
             ecgeditorPort = 'http://authoring2.xuezuowang.com';
            examPort = 'http://exam.xuezuowang.com';
            studyPort = 'http://org.learn.com';
            monitorPort = 'http://org.learn.com';



$(function(){
    sendMessage('get',playerPort,'/getUser','',function(data){
        userData = data;
        HashRead(location.hash.replace(/^#/,""));
    });


});
/*????url??*/
(function(win){
    var hashchange = win.onhashchange,
        change, //for IE
        loc = location,
        hash = loc.hash,
        delay = 50;
    function gethash(hash){
        return hash.replace(/^#/,"");
    }
    win.onhashchange = function(){
        if(hashchange){
            hashchange = function(){
                func(gethash(loc.hash));
            }
        }else{
            setTimeout(function change(){
                if(loc.hash !== hash){
                    func(gethash(loc.hash));
                    hash = loc.hash;
                }
                setTimeout(change, delay);
            },delay);
        }
    };
}(window));
//??func
var func = function(hash){
    HashRead(hash);
};
/*?URL???????*/
window.onhashchange(func);
/*??url*/
var HashRead = function(hash){
    if(!hash){
        window.history.pushState(null,null,defaultHash);
        return;
    }
    hashRouter(hash.split('/'));
};