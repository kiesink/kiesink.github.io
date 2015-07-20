//require(['jquery'], function($) {
  avalon.ready(function() {
    var data = {
      limit: [
          {
            name: '深圳华侨城茶溪谷门票',
            date: '2014年12月26日',
            address: '华侨城大码兑票终端机自助兑票',
            detail: '游客精心营造了一个绿的世界、花的世界，融合了西方山地小镇的风情、茶禅文化的融合、岭南茶田的幽雅和湿地 >>',
            price: 699,
            oldprice: 1188,
            img: {
              src: '../images/imgtext-img.jpg',
              info: '距开抢还有5天12时12分12秒'
            },
            tips: '广州'
          },
          {
            name: '深圳华侨城门票',
            date: '2014年12月26日',
            address: '华侨城大码兑票终端机自助兑票',
            detail: '游客精心营造了一个绿的世界、花的世界，融合了西方山地小镇的风情、茶禅文化的融合、岭南茶田的幽雅和湿地 >>',
            price: 555,
            oldprice: 888,
            img: {
              src: '../images/imgtext-img.jpg',
              info: '距开抢还有6天2时2分1秒'
            },
            tips: '广州22'
          },
          {
            name: '华侨城茶溪谷门票',
            date: '2014年12月26日',
            address: '华侨城大码兑票终端机自助兑票',
            detail: '游客精心营造了一个绿的世界、花的世界，融合了西方山地小镇的风情、茶禅文化的融合、岭南茶田的幽雅和湿地 >>',
            price: 298,
            oldprice: 1230,
            img: {
              src: '../images/imgtext-img.jpg',
              info: '距开抢还有7天1时1分2秒'
            },
            tips: '广州33'
          }
        ],
      bargain: [
          {
            name: '深圳华侨城门票',
            date: '2014年12月26日',
            address: '华侨城大码兑票终端机自助兑票',
            detail: '游客精心营造了一个绿的世界、花的世界，融合了西方山地小镇的风情、茶禅文化的融合、岭南茶田的幽雅和湿地 >>',
            price: 555,
            oldprice: 888,
            img: {
              src: '../images/imgtext-img.jpg',
              info: '距开抢还有5天12时12分12秒'
            },
            tips: '广州'
          },
          {
            name: '深圳华侨城茶溪谷门票',
            date: '2014年12月26日',
            address: '华侨城大码兑票终端机自助兑票',
            detail: '游客精心营造了一个绿的世界、花的世界，融合了西方山地小镇的风情、茶禅文化的融合、岭南茶田的幽雅和湿地 >>',
            price: 699,
            oldprice: 1188,
            img: {
              src: '../images/imgtext-img.jpg',
              info: '距开抢还有6天2时2分1秒'
            },
            tips: '广州22'
          },
          {
            name: '华侨城茶溪谷门票',
            date: '2014年12月26日',
            address: '华侨城大码兑票终端机自助兑票',
            detail: '游客精心营造了一个绿的世界、花的世界，融合了西方山地小镇的风情、茶禅文化的融合、岭南茶田的幽雅和湿地 >>',
            price: 298,
            oldprice: 1230,
            img: {
              src: '../images/imgtext-img.jpg',
              info: '距开抢还有7天1时1分2秒'
            },
            tips: '广州33'
          }
        ]
    };

    var vm = avalon.define({
      $id: 'Ctrl',
      data: data
    });
    avalon.scan();

    require(['acme'], function(acme){
      acme.anchor.top = 90;
    });
  });
//});
