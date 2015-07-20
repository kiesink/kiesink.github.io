/**
 * Created by Administrator on 2015/4/14.
 */
//(function ($) {
//    $.fn.Scroll = function (options) {
//        //将当前上下文对象存入root
//        var root = this;
//
//        //默认配置
//        var settings = {
//            speed: 40,      //滚动速度,值越大速度越慢
//            direction: "x"  //滚动方向("x"或者"y" [x横向;y纵向])
//        };
//
//        //不为空，则合并参数
//        if (options)
//            $.extend(settings, options);
//
//
//        var timer = [];     //计时器
//        var marquee;        //滚动器(函数)
//        var isRoll;         //判断是否滚动(函数)
//
//        var _ul = $("> ul", root);          //ul标签
//        var _li = $("> ul > li", root);     //li标签(集合)
//
//        var li_num = _li.length;    //li标签个数
//        var li_first = _li.first();   //获取单个li标签
//
//
//        //判断为纵向还是横向，并进行相应操作
//        if (settings.direction == "x") {
//            var li_w = li_first.outerWidth(true);//单个li标签的宽度
//        var ul_w = li_w * li_num;//ul标签的宽度
//
//            _ul.css({ width: ul_w }); //设置ul宽度
//
//            marquee = function () {
//                _ul.animate({ marginLeft: "-=1" }, 0, function () {
//                    var _mleft = Math.abs(parseInt($(this).css("margin-left")));
//                    if (_mleft > li_w) { //滚动长度一旦大于单个li的长度
//                        $("> li:first", $(this)).appendTo($(this)); //就把第一个li移到最后
//                        $(this).css("margin-left", 0); //滚动长度归0
//                    }
//                });
//            };
//            //ul长度小于box长度时则不滚动，反之滚动
//            isRoll = function (t) {
//                if (ul_w <= root.width())
//                    clearInterval(t);
//                else
//                    marquee();
//            }
//        }
//        else {
//            var li_h = li_first.outerHeight(true); //单个li标签的高度
//            var ul_h = li_h * li_num; //ul标签的高度
//
//            _ul.css({ height: ul_h });  //设置ul高度
//
//            marquee = function () {
//                _ul.animate({ marginTop: "-=1" }, 0, function () {
//                    var _mtop = Math.abs(parseInt($(this).css("margin-top"))); //取绝对值
//                    if (_mtop > li_h) {
//                        $("> li:first", $(this)).appendTo($(this));
//                        $(this).css("margin-top", 0);
//                    }
//                });
//            };
//            //ul长度小于box长度时则不滚动，反之滚动
//            isRoll = function (t) {
//                if (ul_h <= root.height())
//                    clearInterval(t);
//                else
//                    marquee();
//            }
//        }
//
//        //遵循链式原则，并进行初始化
//        return root.each(function (i) {
//            //超出内容隐藏，防止用户没写overflow样式
//            $(this).css({ overflow: "hidden" });
//
//            timer[i] = setInterval(function () {
//                isRoll(timer[i]);
//            }, settings.speed);
//
//            //鼠标进入停止滚动，离开继续滚动
//            $(this).hover(function () {
//                clearInterval(timer[i]);
//            }, function () {
//                timer[i] = setInterval(function () {
//                    isRoll(timer[i]);
//                }, settings.speed);
//            });
//
//        });
//
//    };
//})(jQuery);

;(function ($) {
    var defaults = {
        img_wrap:".pic-img",
        page_wrap:".page",
        curren:"on",
        index:0,
        timer:null

    };
    $.fn.slider=function(options){

       var settings = $.extend({},defaults,options);
            return this.each(function(){
                var self = $(this),
                    $img_w = $(settings.img_wrap),
                    $page_w = $(settings.page_wrap),
                    $cur = settings.curren,
                    $timer = settings.timer,
                    $index = settings.index

                function showImg(index){
                    $img_w.children().eq(index).fadeIn().siblings().stop(true).fadeOut();
                    $page_w.children().eq(index).addClass($cur).siblings().stop(true).removeClass($cur);
                    $index = (index+1)%$img_w.children().size();
                }
                self.on("mouseenter mouseleave",function(e){
//                    console.log(e.type)

                    switch (e.type){
                        case "mouseenter":
                            clearInterval($timer)
                            break;
                        case "mouseleave":
                            $timer = setInterval(function(){
                                showImg($index)
                            },3000)
                            break;
                        default :
                            break;
                    }
                }).trigger("mouseleave");
                $page_w.children().mouseenter(function(){
                    num_index = $(this).index();
//                    console.log($(this))
                    showImg(num_index)
                })
//                console.log(self)

            })
    }

})(jQuery)
//;(function ($) {
//
//    var defaults = {
//        duration: 3000,
//        index: 0,
//        className: 'on'
//    }
//
//    function slide(settings) {
//        var $this = $(this);
//        var $opts = $(settings.opts);
//        var info = settings.info;
//        var $info_h =$this.find(info).eq(0).outerHeight(true);
//        var $children = $this.children();
//        var timer;
//        timer = setInterval(function() {
//            $children.eq(settings.index).fadeIn(/*"fast",function(){
//                $this.find(info).delay(200).animate({
//                    marginTop:-$info_h+"px"
//                })
//            }*/).siblings().stop(true).fadeOut(/*"fast",function(){
//                $this.find(info).delay(200).animate({
//                    marginTop:0
//                })
//                }*/);
//
//            $opts.children().removeClass(settings.className)
//                .eq(settings.index).addClass(settings.className);
//            settings.index = (settings.index + 1) % $children.length;//求余
//        }, settings.duration);
//        console.log()
//    }
//
//    $.fn.slider = function(options) {
//        var settings = $.extend({}, defaults, options)
//        return this.each(function() {
//            slide.call(this, settings)
//
//        })
//    }





//})(jQuery);

