/**
 * Created by xyz on 2015/5/20.
 */
// 调整接口
$.ajaxSetup({
  data: {
    'layout': 'web',
    'stemp': 'index'
  }
});

// 缓存tags
var tagsCache = {
  // 当前选中tags的id
  tag_id: null
};

// 模板容器
var $out_header = $('#out_header');
var $out_banner = $('#out_banner');
var $out_nav = $('#out_nav');
var $out_fixbar = $('#out_fixbar');
var $out_modules = $('#out_modules');
var $out_footer = $('#out_footer');
var $out_login;

// 请求【activity模块】数据
$.ajax({
  data: {
    'method': 'yooyo.activity.activity.get'
  }
}).then(function (res) {

  // 设置header
  var html_header = template('tmpl_header', res.data);
  $out_header.html(html_header);

  // 设置login
  $out_login = $('#out_login');
  // 判断是否登录
  testLogin($out_login);

  tagsCache.tag_name = res.data.tag_name;
  // 请求【导航模块】数据,设置导航和模块列表数据
  return $.ajax({
    data: {
      'method': 'yooyo.activity.tags.list'
    }
  });
}).then(function(res){
  tagsCache.list = res.data;
  tagsCache.background_color = '';
  if(res.data.length > 0) {
    showTag(res.data[0].id);
  }

  // 返回一个请求【模块列表】的defferred
  return $.ajax({
    data: {
      'method': 'yooyo.activity.module.list'
    }
  });
}).then(function (res) {

  res.data.header.showLinkBox = /^yzl\./.test(net.hostname);

  // 设置banner
  var html_banner = template('tmpl_banner', res.data);
  $out_banner.html(html_banner);

  // banner的焦点图效果
  $(".slideBox").slide({ titCell: ".hd li", mainCell: ".bd ul", effect: "fold", autoPlay: true, delayTime: 700});

  // 设置footer
  var html_footer = template('tmpl_footer', res.data);
  $out_footer.html(html_footer);

  // 判断悬浮导航里面的faq是否显示
  tagsCache.isShowFAQ = res.data.faq ? true : false;

  // 设置fixbar
  var html_fixbar = template('tmpl_fixbar', tagsCache);
  $out_fixbar.html(html_fixbar);
});

// 设置tags数据
function setTags(cache){
  cache.fixedList = [];
  var len = cache.list.length;
  while(len--){
    if(cache.tag_id == cache.list[len].id){
      cache.fixedList = cache.list[len].tags_child;
    }
  }

  // 设置导航tags
  var html_nav = template('tmpl_nav', cache);
  $out_nav.html(html_nav);

  // 设置fixbar
  var html_fixbar = template('tmpl_fixbar', tagsCache);
  $out_fixbar.html(html_fixbar);
}

// 设置modules数据
function setModules(res){

  // 处理modules里面的数据
  var modules = res.data.modules;

  // 设置导航标签
  tagsCache.background_color = modules[0] ? modules[0].background_color : '';
  setTags(tagsCache);

  // 先对模块里面的content属性做处理，因为单产品和多产品模块的content可能包含着产品信息，所以先把content里面的产品信息渲染出来，再渲染外层的数据。
  for(var i = 0, len = modules.length; i < len; i++){
    var module = modules[i];

    // 如果是【单产品/单产品自定义/多产品/多产品自定义】，则在连续的第一个模块上加上needSupply = true的标识。
    if(/^3|4|13|14$/.test(module.type)){
      module.needSupply = true;
    }
    // 否则，把needSupply设为false
    if(i > 0 && /^3|4|13|14$/.test(modules[i - 1].type)){
      module.needSupply = false;
    }

    if(module.type == 13) {
      // 这个hasFixedLayer是针对单产品自定义模块的，用来判断该模块是否有浮动层，当content里面只是一些静态数据时，可能产品的信息要用浮动层来展示。
      module.hasFixedLayer = !/\{\{.*}}/.test(module.content);
    }
    if(module.content) {
      module.content = template.compile(module.content)(module.resourceinfoList[0]);
    }
  }

  // 设置modules
  var html_modules = template('tmpl_modules', res.data);
  $out_modules.html(html_modules);

}

// 切换标签，这里就是改变城市
function showTag(id){
  tagsCache.tag_id = id;
//  因为要在标签上带上模块的背景色，所以【标签设置】放到【模块设置】里面
//  setTags(tagsCache);
  $.ajax({
    data: {
      'method': 'yooyo.activity.module.list',
      'tags_id': id
    }
  }).done(setModules);
}

// 判断是否登录，局部刷新视图
function testLogin(view){
  // 调用接口判断是否登录
  $.ajax({
    url: net.url('ajaxLogin')[$.ajaxSettings.data.layout],
    jsonpCallback: 'callback'
  }).done(function(res){

    var html_login = template('tmpl_login', res);
    view.html(html_login);
  });
}

// 退出登录
function logout(){
  // 调用接口判断是否登录
  $.ajax({
    url: net.url('ajaxLogout')[$.ajaxSettings.data.layout]
  }).done(function(res){
    if(res.status == 1){
      // 判断是否登录
      testLogin($out_login);
    }
  });
}

// 右边浮动导航滚动效果
$(window).delegate(this, {
  'scroll.fixbar': function () {
    var $widget = $('.widget-fixbar');
    var scrollTop = $(document).scrollTop();
    $widget.stop().animate({
      top: scrollTop > 590 ? scrollTop - 500 : 30
    });
  }
});

// 右边浮动导航点击效果
$(document).delegate('.widget-anchor', {
  'click.anchor': function () {
    $('.widget-anchor').parent('li').removeClass('on');
    $(this).parent('li').addClass('on');
  }
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