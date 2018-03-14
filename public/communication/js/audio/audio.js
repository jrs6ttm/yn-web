/**
 * Created by admin on 2016/8/2.
 */
"use strict";

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

(function (root, factory) {
    //amd
    //if (typeof define === 'function' && define.amd) {
    //    define(['$'], factory);
    //} else if (typeof exports === 'object') { //umd
    //    module.exports = factory();
    //} else {
    root.Audio = factory(window.jQuery || $);
    //}
})(window, function ($) {
    $.fn.Audio = function (settings) {
        var list = [];
        $(this).each(function () {
            var audio = new Audio();
            var options = $.extend({
                target: $(this)
            }, settings);
            audio.init(options);
            list.push(audio);
        });
        return list;
    };

    var Audio = function () {
        function Audio() {
            _classCallCheck(this, Audio);
        }

        _createClass(Audio, [{
            key: 'contructor',
            value: function contructor() {}
        }, {
            key: 'init',
            value: function init(options) {
                var rnd = Math.random().toString().replace('.', '');
                this.id = 'audio_' + rnd;
                this.settings = {};
                this.controller = null;
                var _this = this;
                this.settings = $.extend(this.settings, options);
                this.audio = $(this.settings.target).get(0);
                this.createDom();
                _this.duration = _this.audio.duration;
                if (_this.duration != "Infinity") {
                    _this.durationContent.html(Math.floor(_this.duration) + 's');
                } else {
                    _this.durationContent.html($(_this.settings.target).attr('duration') || "");
                }
                this.settings.target.on('canplaythrough', function () {
                    _this.duration = _this.audio.duration;
                    if (_this.duration != "Infinity") {
                        _this.durationContent.html(Math.floor(_this.duration) + 's');
                    } else {
                        var attr = $(_this.settings.target).attr('duration');
                        if (attr) {
                            _this.durationContent.html($(_this.settings.target).attr('duration') + "s");
                        } else {
                            _this.durationContent.html('');
                        }
                    }
                });
                this.bindEvent();
            }
        }, {
            key: 'createDom',
            value: function createDom() {
                var html = '<div id="' + this.id + '" class="ui-audio"><i></i></div>';
                this.settings.target.hide().after(html);
                this.controller = $('#' + this.id);
                this.durationContent = $('<div class="ui-duration"></div>');
                this.controller.append(this.durationContent);
            }
        }, {
            key: 'bindEvent',
            value: function bindEvent() {
                var _this2 = this;

                var _this = this;
                this.controller.on('click', function () {
                    _this.play();
                });
                $(this.audio).on('ended', function () {
                    return _this.stop();
                });
                $(this.audio).on('timeupdate', function () {
                    return _this2.settings.updateCallback && _this2.settings.updateCallback.call(_this2, _this2.audio, _this2.audio.duration, _this2.durationContent);
                });
                $(this.audio).on('error', function () {
                    alert('加载音频文件出现错误!');
                });
            }
        }, {
            key: 'play',
            value: function play() {
                if (this.audio.paused) {
                    this.audio.play();
                    this.controller.addClass('play');
                } else {
                    this.audio.pause();
                    this.controller.removeClass('play');
                }
                this.settings.playCallback && this.settings.playCallback.call(this, this.audio, this.audio.paused, this.durationContent);
            }
        }, {
            key: 'stop',
            value: function stop() {
                this.controller.removeClass('play');
                this.settings.stopCallback && this.settings.stopCallback.call(this, this.audio, this.audio.paused, this.durationContent);
            }
        }]);

        return Audio;
    }();

    return Audio;
});
$('.audio').Audio();