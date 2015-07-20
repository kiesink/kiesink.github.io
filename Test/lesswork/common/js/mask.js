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

  require(['../../ShowSpecial/2015广州国际电子商务博览会专题/js/lib/jquery-1.11.1', 'acme'], function(a, acme){
  	
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

  });
});
