avalon.ready(function() {
  var data = {
  };

  var vm = avalon.define({
    $id: 'Ctrl',
    title: '标题',
    data: data
  });

  avalon.scan();


  require(['datepicker'], function() {

    var date1 = new Acme.DatePicker;
    date1.bind('selectDate1', {
      '20150305': '288',
      '20150306': '288',
      '20150307': '388',
      '20150308': '688',
      '20150309': '288'
    });

    $('.getData').click(function () {
      alert(JSON.stringify(date1.getData()));
    });
  });
});

function cg(obj){
    var o=obj.previousSibling;
    if(o.childNodes[0].value) {
        o.innerHTML =  o.childNodes[0].value;
        obj.innerHTML="(点击修改)";
    }else{
        o.innerHTML="<input class='edi-text-2' type='text' value='"+o.innerHTML+"' />";
        obj.innerHTML="保存";
    }
}
