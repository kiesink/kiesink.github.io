avalon.ready(function() {
  var data = {
  };

  var vm = avalon.define({
    $id: 'Ctrl',
    title: '日期选择',
    data: data,
    date: '',
    sign: {

    },
    setData: function(){
      window.Data.datepicker.setData({
        '20150402': { price: 999, aaa: 8 },
        '20150403': { price: 888, aaa: 7 },
        '20150404': { price: 44, aaa: 9 }
      });
    }
  });


  require(['datepicker'], function() {

    var date1 = new Acme.DatePicker;
    date1.bind('selectDate1', {
      '20150329': { price: 111, aaa: 11 },
      '20150330': { price: 222, aaa: 22 },
      '20150331': { price: 333, aaa: 33 },
      '20150401': { price: 444, aaa: 44 },
      '20150402': { price: 555, aaa: 55 },
      '20150403': { price: 666, aaa: 66 },
      '20150404': { price: 777, aaa: 77 }
    }, 'price');
    date1.clickEvent = updateSelect;
    //date1.single = false; //把这个设为false即为多选

    // 把日期对象暴露到window上。供外部使用。
    window.Data = {
      datepicker: date1
    };

    // 获取选中数据：
    //  window.Data.datepicker.getSelected();



    // 选择日期时触发事件
    function updateSelect(e, selected){

      var date = [];
      for(var k in selected){
        var arr = k.match(/^(\d{4})(\d{2})(\d{2})$/);
        date.push(arr.splice(1,3).join('-'));
      }
      vm.date = date.join(', ');
      avalon.scan();
    }
  });

  avalon.scan();


});
