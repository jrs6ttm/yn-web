/**
 * Created by admin on 2016/9/1.
 */
(function(window) {
    /*
     * emojiArray   表情组
     * textareaId     输入框对象的id
     * loadId      加载表情的对象 id
     */
    function Emoji(option) {
        this.emoji = option.emojiArray;
        this.textarea = option.textarea;
        this.emojiButton = option.emojiButton;
        this.emojiContainer = option.emojiContainer;
    }

    Emoji.prototype = {
        /*初始化*/
        init: function () {
            this.loadEmoji();
            this.bindEvent();
        },
        // 绑定事件
        bindEvent: function () {
            var _this = this;
            /*输入框对象*/
            var emojiBox = document.getElementById('emojiBox');
            $('#emojiBox').on('click', 'img', function (event) {
                var textarea = $(_this.textarea);
                $(this).clone().appendTo(textarea);
                cancelEventBubble(event);
            });

           _this.emojiButton.addEventListener('click', function (event) {
                if (emojiBox.style.display === 'block') {
                    emojiBox.style.display = 'none';
                } else {
                    emojiBox.style.display = 'block';
                }
                cancelEventBubble(event);
            });
        },
        /*加载表情*/
        loadEmoji: function () {
            var emoji = [], i,
                data = this.emoji,
                len = data.length,
                emojiChoose = document.createElement("div");

            for (i = 0; i < len; i++) {
                emoji.push('<img src="" alt="' + data[i] + '"class="emoji emoji_' + data[i] + '"/>');
            }
            emojiChoose.innerHTML = emoji.join('');
            emojiChoose.setAttribute("id", "emojiBox");
            emojiChoose.setAttribute('style', 'display:none');
            this.emojiContainer.appendChild(emojiChoose);
        }
    };

    window.Emoji = Emoji;
})(window);