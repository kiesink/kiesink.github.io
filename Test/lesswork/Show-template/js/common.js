/**
 * Created by xyz on 2015/6/4.
 */
// 设置内外网参数
var net = {
  /**
   * 设置内外网开关
   *  wan：外网
   *  lan：内网
   *  为空则根据域名识别。
   */
  type: '' || (/\.com$/.test(location.hostname) ? 'wan' : 'lan'),
  wan: function(){
    // 外网接口属性, 会继承wlan里面的属性
    return {
      ajax: 'http://open.yooyo.com/rtapi/outer/router.json',
      image: 'http://cimg.yooyo.com',
      // 检测登录状态
      ajaxLogin: 'http://shop.yooyo.com/LoginAction/isLogin.do',
      // 退出登录
      ajaxLogout: 'http://shop.yooyo.com/LoginAction/login/off.json',
      // 登录链接
      login: {
        web: 'http://shop.yooyo.com/LoginAction/LoginFirst',
        wap: 'http://' + net.hostname + '/event/activity/m/' + net.activity_id + '/to_login.do'
      },
      // 查看订单链接
      order: {
        web: 'http://' + net.hostname + '/event/activity/' + net.activity_id + '/circle_order',
        wap: 'http://' + net.hostname + '/event/activity/m/' + net.activity_id + '/circle_order'
      },
      // 门票页链接(就是详细页)，后面会补上产品id
      ticket: {
        web: 'http://' + net.hostname + '/event/activity/',
        wap: 'http://' + net.hostname + '/event/activity/m/'
      },
      // 常见问题链接
      faq: {
        web: 'http://' + net.hostname + '/event/activity/' + net.activity_id + '/jump_faq',
        wap: 'http://' + net.hostname + '/event/activity/m/' + net.activity_id + '/jump_faq'
      }
    }
  },
  lan: function(){
    // 内网接口属性, 会继承wlan里面的属性
    return {
      ajax: 'http://open.yooyo.com/dev-api/outer/router.json',
      image: 'http://cimg.yooyo.local/emall',
      ajaxLogin: 'http://shop.yooyo.local/LoginAction/isLogin.do',
      ajaxLogout: 'http://shop.yooyo.local/LoginAction/login/off.json',
      // 登录链接
      login: {
        web: 'http://shop.yooyo.local/LoginAction/LoginFirst',
        wap: 'http://' + net.hostname + '/activity/activity/m/' + net.activity_id + '/to_login.do'
      },
      // 查看订单链接
      order: {
        web: 'http://' + net.hostname + '/activity/activity/' + net.activity_id + '/circle_order',
        wap: 'http://' + net.hostname + '/activity/activity/m/' + net.activity_id + '/circle_order'
      },
      // 门票页链接(就是详细页)，后面会补上产品id
      ticket: {
        web: 'http://' + net.hostname + '/event/activity/',
        wap: 'http://' + net.hostname + '/event/activity/m/'
      },
      // 常见问题链接
      faq: {
        web: 'http://' + net.hostname + '/activity/activity/' + net.activity_id + '/jump_faq',
        wap: 'http://' + net.hostname + '/activity/activity/m/' + net.activity_id + '/jump_faq'
      }
    }
  },
  wlan: function(){
    // 内外网的公共属性
    return {
      // test
      test: {
        web: 'test web',
        wap: 'test wap'
      }
    }
  },
  // 主机名
  hostname: location.hostname,
  // 活动id
  activity_id: getQuery('id'),
  // 获取对应属性的url
  url: function(name){
    // 获取公共属性
    var wlan = net.wlan();
    // 获取当前网段属性
    var obj = net[net.type]();

    // 简单继承公共属性。
    for(var k in wlan){
      obj[k] || (obj[k] = wlan[k]);
    }
    // 获取属性对象
    var value = obj[name];
    // 返回属性对象
    return typeof value === 'object' ? value : {
      web: value,
      wap: value
    };
  }
};

(function(){
  // 临时切换内外网数据
  var net_type = getQuery('net_type');
  if(/^[wl]an$/.test(net_type)){ net.type = net_type; }
  // 临时设定hostname
  var hostname = getQuery('hostname');
  if(hostname){ net.hostname = hostname; }
})();

// 设置接口公共参数
$.ajaxSetup({
  url: net.url('ajax')['web'],
  data: {
    'app_key': 'yooyo_activity',
    'id': net.activity_id,
    'activity_id': net.activity_id,
    'url': net.hostname
  },
  dataType:"jsonp",
  error: function(){
    throw new Error('接口异常');
  }
});

/**
 * 解析各种链接
 *  linkType = {
 *    ajax: 接口链接
 *    login: 登录链接
 *    order: 查看订单链接
 *    ticket: 产品门票链接
 *    image: 图片链接
 *    faq: 常见问题链接
 *    默认: 普通超链接
 *  }
 */
template.helper('link', function(url, linkType){
  // 获取客户端名称 web/wap
  var type = $.ajaxSettings.data.layout;

  switch(linkType){
    case 'login':
    case 'order':
    case 'faq':
      url = net.url(linkType)[type];
      break;
    case 'ticket':
    case 'image':
      if(!/^http(s)?\:\/\//.test(url)) {
        url = net.url(linkType)[type] + url;
      }
      break;
    default:
      if(!/^http(s)?\:\/\//.test(url)){
        url = 'http://' + url
      }
      break;
  }
  return url;
});

// 和上面那个link里面的ticket一样， 为了兼容之前写的，没有改过来的代码。
template.helper('ticket_link', function(url){
  // 获取客户端名称 web/wap
  var type = $.ajaxSettings.data.layout;

  if(!/^http(s)?\:\/\//.test(url)) {
    url = net.url('ticket')[type] + url;
  }

  return url;
});

// 针对现有优惠规则数据做的一个helper
template.helper('sale_rule', function(obj, index){
  var args = [
    obj.sale_rule_type,
    obj.sale_rule_arg1,
    obj.sale_rule_arg2,
    index
  ];

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

  return saleRule.apply(null, args);
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

// 清除cookie
function clearCookie(name, options){
  options = $.extend({
    expires: -1,
    path: '/',
    domain: net.hostname.replace(/^[^.]*/, ''),
    secure: ''
  }, options);

  document.cookie = [
    name, '=; expires=-1',
    options.path    ? '; path=' + options.path : '',
    options.domain  ? '; domain=' + options.domain : '',
    options.secure  ? '; secure' : ''
  ].join('');
}

// 获取单个cookie值
function getCookie(name){
  var cookie = document.cookie;
  var re = new RegExp('(;)?(\\\s)*' + name + '=([^;]*)');
  var matcher = cookie.match(re);
  var value = '';
  if(matcher){
    value = matcher[3];
  }
  return value;
}