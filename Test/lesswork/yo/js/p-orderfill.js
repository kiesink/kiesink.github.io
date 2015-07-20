//require(['jquery'], function($) {
  avalon.ready(function() {
    var data = {
      price: 120,
      count: 10,
      date: '2015-03-02'
    };

    var vm = avalon.define({
      $id: 'Ctrl',
      data: data
    });
    avalon.scan();

  });
//});
