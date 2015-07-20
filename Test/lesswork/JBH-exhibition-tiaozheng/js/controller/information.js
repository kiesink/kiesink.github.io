/**
 * Created by xyz on 2015/6/10.
 */
define([], function(){
  var lastId
  var vmodel = avalon.define({
    $id: "InformationCtrl",
    list: [],
    recommend: [],
    getById: function(id){

    }
  });

  return avalon.controller(function($ctrl) {
    $ctrl.$vmodels = [vmodel];
    // 加载数据
    $ctrl.$onEnter = function(param, rs, rj) {
      rs(function(){
        //var query = avalon.mix({}, vmodel.query = this.query);
//        avalon.Api.get('information.list', {}, function(res){
//          vmodel.list = res.data.result;
//          //vmodel.setPager('information.list', res.data);
//        });
        vmodel.list= [1,2,3]
      });
      // here will stop
      return false
    };

    // 初始化
    $ctrl.$onRendered = function() {
    }
  })
});