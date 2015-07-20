/**
 * Created by xyz on 2015/3/31.
 */
avalon.ready(function() {
  var data = {
  };

  var vmBookHotel = avalon.define({
    $id: 'BookHotelCtrl',
    title: '酒店订购',
    data: data,
    date: '',
    sign: {

    }
  });

  require(['date'], function(){
    //$('.date_picker').date_input();
    var date = new Common.DateInput($('.date_picker')[0]);
    date.setData({
      '20150329': { price: 111, aaa: 11 },
      '20150330': { price: 222, aaa: 22 },
      '20150331': { price: 333, aaa: 33 },
      '20150401': { price: 444, aaa: 44 },
      '20150402': { price: 555, aaa: 55 },
      '20150403': { price: 666, aaa: 66 },
      '20150404': { price: 777, aaa: 77 }
    });
    $('.btn-date').click(function(){
      date.show();
    })
  });

  avalon.scan();

});
