/**
 * Created by admin on 2016/12/23.
 */
;
(function(root) {
    /**
     *查询
     */

    function q(value) {
        var flag = value.slice(0, 1),
            ele = value.substring(1);
        if (flag === '#') {
            return document.getElementById(ele);
        } else if (flag === '.') {
            return document.getElementsByClassName(ele);
        } else if (flag === '[') {
            return document.querySelectorAll(value);
        } else {
            return document.getElementsByTagName(value);
        }
    }

    function zh(value) {
        if (typeof value === 'string') {
            try {
                value = JSON.parse(value);
            } catch(e) {
                console.log(e);
            }
        }
        return value;
    }

    /**
     *事件发生器
     */

    function Eventer() {
        var key = 0;
        this.events = {};
        this.getKey = function() {
            return key++;
        };
    }

    Eventer.prototype.on = function(eventName, callback) {
        var key = this.getKey();
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push({
            key: key,
            func: callback
        });
        return key;
    };

    Eventer.prototype.emit = function(eventName, _) {
        var events = this.events[eventName],
            args = Array.prototype.slice.call(arguments, 1),
            i, m;

        if (!events) {
            return;
        }
        for (i = 0, m = events.length; i < m; i++) {
            events[i].func.apply(null, args);
        }
    };

    Eventer.prototype.remove = function(eventName, key) {
        if (this.events[eventName] && this.events[eventName].length) {
            if (key === undefined) {
                return this.events[eventName] = [];
            }
            var index = this.findIndex(this.events[eventName], key);
            index > -1 ? this.events[eventName].splice(index, 1) : void 0;
        }
    };

    Eventer.prototype.findIndex = function(arr, key) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].key === key) {
                return i;
            }
        }
        return -1;
    };

    /**
     * 数据监测
     */

    function defineProp(obj, propName, init, callback) {
        try {
            Object.defineProperty(obj, propName, {

                get: function() {
                    return init;
                },
                set: function(newValue) {
                    if (init === newValue) {
                        return;
                    }
                    init = newValue;
                    callback(newValue);
                },

                enumerable: true,
                configurable: true
            });
        } catch (error) {
            console.dir(error);
            console.log("browser not supported.");
        }
    }

    var common = {};
    common.q = q;
    common.zh = zh;
    common.Eventer = Eventer;
    common.defineProp = defineProp;

    root.common = common;
})(window);

