/**
 * Created by admin on 2016/12/13.
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

function Eventer() {
    this.events = {};
}

Eventer.prototype.on = function(eventName, callback) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(callback);
};

Eventer.prototype.emit = function(eventName, _) {
    var events = this.events[eventName],
        args = Array.prototype.slice.call(arguments, 1),
        i, m;

    if (!events) {
        return;
    }
    for (i = 0, m = events.length; i < m; i++) {
        events[i].apply(null, args);
    }
};

function defineProp(obj, propName, init, callback) {
    try {
        Object.defineProperty(obj, propName, {

            get: function() {
                return init;
            },
            set: function(newValue) {
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
