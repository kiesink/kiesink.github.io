avalon.ready(function() {
  var data = {
  };

  var vm = avalon.define({
    $id: 'Ctrl',
    title: '标题',
    data: data,
    sign: {
          search: true,
          share: true
      }
  });

  avalon.scan();

  require(['jquery', 'acme'], function(a, acme){
  	
    $('#openmask').on(document, {
      'click': function(){
        $('.mask').show();
      }
    });

    $('.mask').on({
      'click': function(){
        var $this = $(this);
        $this.hide();
      }
    });

    $('.btn-id').on({
        click: function(){
            $(this).find('.y-select').click();
        }
    });

    require(['y-form'], function(){ });

    require(['date'], function(){

      var date = new Common.DateInput($('.date_picker')[0]);
      $('.btn-date').click(function(){
        date.show();
      })


      // 设置数据，或者直接把date暴露到window。在别的地方调用date.setDate设置数据
      date.setData({
        20150424: '222',
        20150425: '444',
        20150426: '555'

      });

    });
     /* $(".a-expand").click(function(){
          $(this).parent(".row").next().toggle();
      });*/

  });

  //require(['helper'], function(){});

});
