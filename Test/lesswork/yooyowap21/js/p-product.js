avalon.ready(function() {
  var data = {
  };

  var vmGroup = avalon.define({
    $id: 'GroupCtrl',
    title: '跟团游',
    data: data,
    date: '',
    sign: {

    }
  });

  var vmFreeWalker = avalon.define({
    $id: 'FreeWalkerCtrl',
    title: '自由行',
    data: data,
    date: '',
    sign: {

    }
  });

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
  require(['prompt'],function(){
      $.promptModule(".sign-prompt",".prompt-comten")
  })
  avalon.scan();

});
