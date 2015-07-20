avalon.ready(function() {
  var data = {
  };

  var vm = avalon.define({
      $id: 'Ctrl'
  });

  avalon.scan();




    require(['jquery'], function(){
        $(window).scroll(function(){
            var pageHeight=$(document).height();
            var viewHeight=$(window).height();
            var scrollLocat=$(window).scrollTop();
            if(scrollLocat + viewHeight > pageHeight - 84){
                //console.log('dao di le');
                $(".combin-8.qi").addClass("change-bg");
            }
            else{ $(".combin-8.qi").removeClass("change-bg");}

        });
        });
    //判断页面滚动到底部



  require(['jquery'], function(){
    $(".navi a").click(function() {
        $(".navi a").removeClass('on');
        $(this).addClass('on');
    });

    var $ul=$(".sche ul");
    var $li=$ul.find("li");
    var length = $li.length;
    $li = $li.eq(length - 1);
    var margin = parseFloat($li.css('marginLeft')) ;
    var width = $li.outerWidth() + margin;
    $ul.css({ width: width * (length )});
    //var Wul=Lul.parent("div").width();
    //alert(Lul);

    //header星号图标
    $(".mark").click(function(){
        $(this).find("i").toggle();
    });

//      $(".close-dnl").click(function(){
//          $(".download-wrap").hide();
//          $(".dnl").removeClass("dnl");
//      });
      $(".download-wrap .btn").click(function(){
          $(".download-wrap").hide();
          $(".dnl").removeClass("dnl");
      });


    /* 首页 */
    //计时器
    var intDiff = parseInt(60 * 60 * 1);//倒计时总秒数量
    function timer(intDiff){
        window.setInterval(function(){
            var day=0,
                hour=0,
                minute=0,
                second=0;//时间默认值
            if(intDiff > 0){
                day = Math.floor(intDiff / (60 * 60 * 24));
                hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
                minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
                second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
            }
            if (minute <= 9) minute = '0' + minute;
            if (second <= 9) second = '0' + second;
            //$('#day_show').html(day+"天");
            $('.timer-hour').html(hour);
            $('.timer-minute').html(minute);
            $('.timer-second').html(second);
            intDiff--;
        }, 1000);
    }
    timer(intDiff);



    /* 首页 */
    var $slide = $('#leftSlide');
    if($slide.length > 0) {
      var $slideImgs = $slide.find('.bd img');
      require(['touchslide'], function () {
        var time = +new Date;
        var timer = setInterval(function(){
          var isOk = true;
          for(var i = 0, len = $slideImgs.length; i < len; i++){
            if($slideImgs.eq(i).width() < 1 || $slideImgs.eq(i).height() < 1){
              isOk = false;
            }
          }
          if(isOk){
            TouchSlide({ slideCell: "#leftSlide", effect: "leftLoop", autoPlay: "true", mainCell: ".bd ul" });
            clearInterval(timer);
          }
          if(+new Date - time > 5000){
            clearInterval(timer);
          }
        }, 50);
      });
    }
  });

    require(['jquery'], function(){
        $(".radio-qi").click(function(){
            $('.radio-qi').parent(".row").css("color","#666");
            $(this).parent(".row").css("color","#3cc05b");
            // console.log($(':radio:checked'));
        });
        });
    //单选按钮行变色



//下拉列表内容填入div
    require(['jquery'], function(){
        $('.diy_select_list li').click(function(){
            var html = $(this).find('a').html();
            $('.diy_select_txt').html(html);
        });
    });

    //日期
    require(['datepicker'], function(){
        var date1 = new Acme.DatePicker;
        date1.bind('selectDate1', {
            '20150329': {
                price: 288,
                aaa: 123
            },
            '20150330': {
                price: 111,
                aaa: 123
            },
            '20150331': {
                price: 222,
                aaa: 22
            },
            '20150401': {
                price: 333,
                aaa: 33
            },
            '20150402': {
                price: 444,
                aaa: 44444
            },
            '20150403': {
                price: 555,
                aaa: 223355
            },
            '20150404': {
                price: 666,
                aaa: 66
            }
        }, 'price');
        date1.clickEvent = updateSelect;
        //date1.single = false; //把这个设为false即为多选

        // 选择日期时触发事件
        function updateSelect(e, selected){
            var date = [];
            for(var k in selected){
                var arr = k.match(/^(\d{4})(\d{2})(\d{2})$/);
                date.push(arr.splice(1,3).join('-'));
            }
            vmGroup.date = date.join(', ');
            vmFreeWalker.date = date.join(', ');
            avalon.scan();
        }
    });

});

