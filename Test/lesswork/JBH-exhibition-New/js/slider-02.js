/**
 * Created by Administrator on 2015/4/23.
 */
function DY_scroll(wraper, prev, next, img, speed, or) {
    var wraper = $(wraper);
    var prev = $(prev);
    var next = $(next);
    var img = $(img).find('ul');
    var w = img.find('li').outerWidth(true);
    var className ="on";
    var s = speed;
    var ad=null;
    var flag = "left";
    if(img.find('li').size()<5)return false;//判断个数

    next.click(function () {
        img.animate({'margin-left': -w}/*,1500,'easeOutBounce'*/, function () {
            img.find('li').eq(0).appendTo(img);
            img.css({'margin-left': 0});
        });
        flag = "left";
    });
    prev.click(function () {
        img.find('li:last').prependTo(img);
        img.css({'margin-left': -w});
        img.animate({'margin-left': 0}/*,1500,'easeOutBounce'*/);
        flag = "right";
    });

    if (or == true) {
        ad = setInterval(function () {
            flag == "left" ? next.click() : prev.click()
        }, s * 1000);
        wraper.hover(function () {
            prev.show();
            next.show();
            clearInterval(ad);
        }, function () {
            prev.hide();
            next.hide();
            ad = setInterval(function () {
                flag == "left" ? next.click() : prev.click()
            }, s * 1000);
        });
    }

}
DY_scroll('#enter-focus02', '.prev', '.next', '.focus-list', 2, true);// true为自动播放，不加此参数或false就默认不自动