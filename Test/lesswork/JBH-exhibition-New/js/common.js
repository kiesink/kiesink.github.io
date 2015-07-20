/**
 * Created by xyz on 2015/6/4.
 */
// 获取referrer
var referrer = document.referrer;
// 获取活动id
var activity_id = getQuery('id');

// 设置接口公共参数
$.ajaxSetup({
  url: 'http://open.yooyo.com/dev-api/outer/router.json',
  data: {
    'app_key': 'yooyo_activity',
    'id': activity_id,
    'activity_id': activity_id
  },
  dataType:"jsonp"
});

// 锚点滚动
function toAnchor(id){
  var $target = $('#' + id);
  if ($target.length > 0) {
    var scrollTop = $target.offset().top;
    $('html, body').animate({
      scrollTop: scrollTop
    })
  }
}

// 获取优惠规则字符串
function saleRule(type, arg1, arg2, index){
  if(arguments.length < 4){ return '缺少参数'; }
  return {
    1: ['第' + arg1 + '张', '立减' + arg2 +'元'],
    2: ['第' + arg1 + '张', '特价' + arg2 +'元'],
    3: ['第' + arg1 + '份', '立减' + arg2 +'元'],
    4: ['第' + arg1 + '份', '特价' + arg2 +'元']
  }[type][index];
}
template.helper('saleRule', saleRule);
// 针对现有优惠规则数据做的一个helper
template.helper('sale_rule', function(obj, index){
  var args = [
    obj.sale_rule_type,
    obj.sale_rule_arg1,
    obj.sale_rule_arg2,
    index
  ];
  return saleRule.apply(null, args);
});

// 统一图片输出路径为绝对路径
template.helper('img_path', function(dir_path){
  var path, args = [].slice.call(arguments, 1);
  if(!/^http(s)?\:\/\//.test(dir_path)){
    //path = 'http://172.20.80.31/car' + dir_path;
    path = 'http://cimg.yooyo.local/emall' + dir_path;
  }
  return path + args.join('');
});

// 解析产品门票超链接
template.helper('ticket_link', function(url){
//  var id = arguments[0];
//  // 获取活动id
//  var activity_id = $.ajaxSettings.data.activity_id;
//  // 获取客户端名称
//  var type = $.ajaxSettings.data.layout;
//
//  return {
//    'web': 'http://www.yooyo.com/event/activity/' + activity_id + '/detail.html?p_id=',
//    'wap': 'http://www.yooyo.com/event/activity/m/' + activity_id + '/toBuyPage.do?p_id='
//  }[type] + id;

  // 获取客户端名称
  var type = $.ajaxSettings.data.layout;

  var website = referrer || 'www.yooyo.com';
  website = website.replace(/^http:\/\/|\/.*/g, '');

  if(/^http(s)?/.test(url)){ return url; }
  return {
    'web': 'http://' + website + '/event/activity/',
    'wap': 'http://' + website + '/event/activity/m/'
  }[type] + url;
});


// 解析超链接
template.helper('link', function(url){
  return /^http(s)?/.test(url) ? url : 'http://' + url;
});

// 根据模块type值获取对应名称
template.helper('module_type', function(type){
  // 模块类型对照表
  var ModuleType = {
    1: '顶部模块',
    2: '底部模块',
    3: '单产品模块',
    4: '多产品模块',
    5: '抽奖模块',
    6: '微信模块',
    7: '自定义模块',
    12: '常见问题模块'
  };
  return ModuleType[type];
});

// 获取url参数
function getQuery(name){
  var query = {};
  var search = window.location.search;
  var list = search.substring(1).split(/&/);
  for(var i = 0, len = list.length; i < len; i++){
    var arr = list[i].split(/=/);
    query[arr[0]] = arr[1] || '';
  }
  return name ? query[name] : query;
}