/**
 * Created by admin on 2016/8/10.
 */

//拖到绝对定位的html元素

function drag(element, event) {
    //初始化鼠标位置，转换为文档坐标
    var scroll = getScrollOffsets();
    var startX = event.clientX + scroll.x;
    var startY = event.clientY + scroll.y;

    //在文档坐标下，待拖动元素的初始位置
    //因为elementToDrag是绝对定位的
    //所以我们可以假设它的offsetParent就是文档的body元素
    var origX = element.offsetLeft;
    var origY = element.offsetTop;

    //计算mousedown事件和元素左上角之间的距离
    //我们将它另存为鼠标移动的距离
    var deltaX = startX - origX;
    var deltaY = startY - origY;

    //注册用于响应接着mousedown事件发生的mousemove和mouseup事件的事件处理程序
    if (document.addEventListener) { // 标准事件模型
        //在document对象上注册捕获事件处理程序
        document.addEventListener("mousemove", moveHandler, true);
        document.addEventListener("mouseup", upHandler, true);
    } else if (document.attachEvent) {
        //在IE事件模型中，
        //捕获事件是通过调用元素上的setCapture()捕获它们
        element.setCapture();
        element.attachEvent("onmousemove", moveHandler);
        element.attachEvent("onmouseup", upHandler);
        //作为mouseup事件看待鼠标捕获的丢失
        element.attachEvent("onlosecapture", upHandler);
    }

    //处理这个事件，不让其他元素看到它
    cancelEventBubble(event);

    //现在阻止任何默认操作
    if (event.preventDefault) { //标准模型
        event.preventDefault();
    } else { //IE
        event.returnValue = false;
    }


    //捕获mousemove事件的处理程序
    function moveHandler(e) {
        if (!e) {
            e = window.event; //IE事件模型
        }

        //移动这个元素到当前鼠标位置
        //通过滚动条的位置和初始单击的偏移量来调整
        var scroll = getScrollOffsets();
        element.style.left = (e.clientX + scroll.x - deltaX) + "px";
        element.style.top = (e.clientY + scroll.y - deltaY) + "px";
        //同时不让任何其他元素看到这个事件
        cancelEventBubble(e);
    }

    //捕获最终mouseup事件的处理程序

    function upHandler(e) {
        if (!e) {
            e = window.event; //IE事件模型
        }

        //注销事件处理程序
        if (document.removeEventListener) { //DOM事件模型
            document.removeEventListener("mouseup", upHandler, true);
            document.removeEventListener("mousemove", moveHandler, true);
        } else if (document.detachEvent) { //IE5+事件模型
            element.detachEvent("onlosecapture", upHandler);
            element.detachEvent("onmouseup", upHandler);
            element.detachEvent("onmousemove", moveHandler);
            element.releaseCaptrue();
        }

        cancelEventBubble(e);
    }
}

//查询窗口滚动条的位置
function getScrollOffsets(w) {
    //使用指定的窗口，如果不带参数则使用当前窗口
    w = w || window;

    //除了IE 8及更早的版本以外，其他浏览器都能用
    if (w.pageXOffset != null) {
        return {
            x: w.pageXOffset,
            y: w.pageYOffset
        };
    }
    //对标准模式下的IE (或任何浏览器)
    var d = w.document;
    if (document.compatMode == "CSS1Compat") {
        return {
            x: d.documentElement.scrollLeft,
            y: d.documentElement.scrollTop
        };
    }

    //对怪异模式(doctype)下的浏览器
    return {
        x: d.body.scrollLeft,
        y: d.body.scrollTop
    };
}

function cancelEventBubble(event) {
    //并且不让事件进一步传播
    if (event.stopPropagation) { //标准模型
        event.stopPropagation();
    } else { //IE
        event.cancelBubble = true;
    }
}

function preventDefault(event) {
    //现在阻止任何默认操作
    if (event.preventDefault) { //标准模型
        event.preventDefault();
    } else { //IE
        event.returnValue = false;
    }
}


function isEmpty(obj) {
    for (var name in obj) {
        return false;
    }
    return true;
}

//获取node节点的下一个元素
function getNextElement(node){
    if(node.nextSibling){
        if(node.nextSibling.nodeType === 1){
            return node.nextSibling;
        }
        return getNextElement(node.nextSibling);
    }
    return null;
}

//获取node节点的前一个元素
function getPrevElement(node){
    if(node.previousSibling){
        if(node.previousSibling.nodeType == 1){
            return node.previousSibling;
        }
        return getPrevElement(node.previousSibling);
    }
    return null;
}

//生成随机id
function generateId() {
    var id = Math.random();
    id += '';
    return id.split('.')[1];
}

function imgLoadError(ele) {
    ele.src = 'images/error.jpg'
}

//将child节点插入到parent中，使其成为第n个子节点
function insertAt(parent, child, n) {
    if (n < 0 || n > parent.childNodes.length) {
        throw new Error("invalid index");
    } else if (n === parent.childNodes.length) {
        parent.appendChild(child);
    } else {
        parent.insertBefore(child, parent.childNodes[n]);
    }
}

function placeCaretAtEnd(ele) {
    ele.focus();

    if (typeof window.getSelection != "undefined"
        && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(ele);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        console.log(range);
        console.log(sel);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        console.log(textRange);
        textRange.moveToElementText(ele);
        textRange.collapse(false);
        textRange.select();
    }
}



