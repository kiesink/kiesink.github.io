//require(['jquery'], function($) {
  avalon.ready(function() {
    var data = {
      name: '深圳华侨城茶溪谷门票',
      price: 699,
      oldprice: 1188,
      img: {
        src: '../images/imgtext-img.jpg',
        info: '距开抢还有5天12时12分12秒'
      },
      tips: '广州123',
      thumbnail: [
        '../images/imgtext-img.jpg',
        '../images/list-img06.jpg',
        '../images/list-img07.jpg',
        '../images/list-img08.jpg',
        '../images/list-img06.jpg',
        '../images/list-img07.jpg',
        '../images/list-img08.jpg'
      ],
      date: '2015-03-01',
      count: 12
    };



    var vm = avalon.define({
      $id: 'Ctrl',
      data: data
      /*,
      count: {
        set: function(val){
          if(this.count < 1){
            console.log('不能小于1');
            this.count = 1;
            return 1;
          }

        },
        get: function(){
        }
      },
      sub: function(){

        vm.abc = vm.count - 1;
      },
      add: function(){
        vm.abc = vm.count - (-1);
      },
      abc: {
        set: function(val){
//          console.log(typeof val);
//
//          if(val < 1){
//            console.log('不能小于1');
//            alert(123);
//            return;
//          }
          this.count = val;
          console.log('set')
          //return this;
        },
        get: function(){
          if(this.count < 1){
            console.log('不能小于1');
            this.count = 1;
          }
          return this.count;
        }
      }*/
    });



    avalon.scan();

    require(['acme', 'ready!'], function(acme){
      // 配置锚点
      acme.anchor.top = 140;
      // 配置浮动栏
      acme.fixbar['fixbar1'].top = 85;

    });



  });
//});
