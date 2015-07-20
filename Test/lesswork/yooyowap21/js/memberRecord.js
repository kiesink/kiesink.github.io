avalon.ready(function() {
    //日期
    require(['datepicker','../js/business/hammer.min.js','jquery'], function(Datepicker,Hammer,$) {
        var date1 = new Acme.DatePicker;
        //默认显示一行
        date1.bindForWeek('selectDate1', {}, 'price',new Date());

        // date1.bind('selectDate1', {}, 'price');
        // var datepicker = $("#selectDate1").data('date');
        // 添加滑动翻页效果
        var el = document.querySelector("#selectDate1");
        var mc = new Hammer(el);
        mc.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL});
        mc.on("swipeup",function(ev){
            date1.next();
            showMonthTip();
        });
        mc.on("swipedown",function(ev){
            date1.pre();
            showMonthTip();
        });
        //点击箭头伸展，收缩日期
        $(".datepicker-sign").on("click",function(el){
            var $target = $(el.currentTarget);
            var nowYear = $(".nowYear").html();
            var nowMonth = $(".nowMonth").html();
            var $selected = $(".selected");
            var selectDay = "";
            var data = {};
            //var nowDate = $(".slec")
            if($target.attr("data-sign") === "down"){
                //var selectDay =  var date = day.year + ('0' + day.month).substr(-2) + ('0' + day.day).substr(-2);
                date1.setYear(nowYear);
                date1.setMonth(nowMonth);
                if($selected.length !== 0){
                    selectDay = $selected.attr("date");
                    data[selectDay] = {};
                }
                date1.bind('selectDate1', data, 'price',selectDay);
                $target.find(".sign").addClass("rotate180");
                $target.attr("data-sign","up");
            }else {
                var dateObj = date1.getInitDate();//获取初始化时传入的日期
                date1.bindForWeek('selectDate1', {}, 'price',dateObj);
                $target.find(".sign").removeClass("rotate180");
                $target.attr("data-sign","down");
            }
        });
        //滑动翻页日历时显示月份提示
        var $dateTip = $(".datepicker-tip");
        var $dateTipMonth = $dateTip.find("span:first");
        var $dateMask = $(".datepicker-mask");
        function showMonthTip(){
            $dateTipMonth.html($(".nowMonth").html());
            $dateTip.addClass("fadeOut").removeClass("hide");
            $dateMask.removeClass("hide");
            setTimeout(function(){
                $dateTip.removeClass("fadeOut").addClass("hide");
                $dateMask.addClass("hide");
            },1000);
        }

    });

});