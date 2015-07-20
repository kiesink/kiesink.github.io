define(['text!../widget/input-num.html'], function(html) {
  var dom = avalon.parseHTML(html).firstChild;
  var input = dom.getElementsByTagName('input')[0];

  //    必须 在avalon.ui上注册一个函数，它有三个参数，分别为容器元素，data， vmodels
  var widget = avalon.ui["inputnum"] = function(el, data, vmodels) {
    var elParent = el.parentNode;
    var options = data.inputnumOptions;
    var $el = avalon(el);
    $el.addClass('input-text');

    var vmodel = avalon.define(data.inputnumId, function(vm) {

      avalon.mix(vm, options);
      // 给vm添加一个方法
      vm.plus = function(e) {
        //console.log(123)
        vm.count++;
      };

      vm.$init = function(scan){
        //console.log('init');

        elParent.insertBefore(dom, el);
        dom.replaceChild(el, input);


        //avalon.scan(dom, [vm].concat[vmodels]);
        scan();
      };
    });

    return vmodel;
  };

  widget.version = 1.0;

  widget.defaults = {
    //count: 1
  };

  return avalon;
});