/**
 * Created by xyz on 2015/7/17.
 */
/**
 * Created by xyz on 2015/5/20.
 */
// 调整接口
$.ajaxSetup({
  data: {
    'layout': 'wap',
    'stemp': 'index'
  }
});

// 缓存tags
var tagsCache = {
  // 当前选中tags的id
  tag_id: null
};

var $out_header = $('#out_header');
var $out_banner = $('#out_banner');
var $out_nav = $('#out_nav');
var $out_modules = $('#out_modules');
var $out_footer = $('#out_footer');
var $out_login;

// 请求【活动模块】数据
$.ajax({
  data: {
    'method': 'yooyo.activity.activity.get'
  }
}).then(function (res) {

  // 设置header
  var html_header = template('tmpl_header', res.data);
  $out_header.html(html_header);

  // 若标题过长(超过11个字)，则自动滚动
  if (res.data.name.length > 11) {
    timeout();
  }

  // 标题的自动滚动。
  function timeout() {
    var $el = $('.header ul li').eq(0);
    var width = $el.width() + 50;
    $el.animate({
      marginLeft: '-=' + width + 'px'
    }, 4000, 'linear', function () {
      $el.css({marginLeft: 0});
    });
    setTimeout(timeout, 7000);
  }

  tagsCache.tag_name = res.data.tag_name;

  // 请求【导航模块】数据
  return $.ajax({
    data: {
      'method': 'yooyo.activity.tags.list'
    }
  });
}).then(function(res){

  tagsCache.list = res.data;
  if (res.data.length > 0) {
    showTag(res.data[0].id);
  }

  // 返回【模块列表】的请求供后面使用。
  return $.ajax({
    data: {
      'method': 'yooyo.activity.module.list'
    }
  });
}).then(function (res) {

  // 设置banner
  var html_banner = template('tmpl_banner', res.data);
  $out_banner.html(html_banner);

//  // 渲染banner的焦点图
//  TouchSlide({
//    slideCell:"#slideBox",
//    titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
//    mainCell:".bd ul",
//    effect:"leftLoop",
//    autoPage:true,//自动分页
//    autoPlay:true //自动播放
//  });

  // 设置footer
  var html_footer = template('tmpl_footer', res.data);
  $out_footer.html(html_footer);

  // 把这个模块列表挂在tagsCache上是要取里面的faq，判断登录旁边那个按钮是否显示
  tagsCache.faq = res.data.faq;

  // 设置login
  $out_login = $('#out_login');
  // 判断是否登录
  testLogin($out_login);

});


// 设置tags数据
function setTags(cache) {
  cache.fixedList = [];
  var len = cache.list.length;
  while (len--) {
    if (cache.tag_id == cache.list[len].id) {
      cache.fixedList = cache.list[len].tags_child;
    }
  }

//  // 标记浮动导航是否显示字段
//  cache.showFixedList = false;
//  len = cache.fixedList.length;
//  while (len--) {
//    if (cache.fixedList[len].display == 1) {
//      cache.showFixedList = true;
//      break;
//    }
//  }
  // 设置导航tags
  var html_nav = template('tmpl_nav', cache);
  $out_nav.html(html_nav);
}

// 设置modules数据
function setModules(res) {
  // 处理modules里面的数据
  var modules = res.data.modules;
  // 先对模块里面的content属性做处理，因为单产品和多产品模块的content可能包含着产品信息，所以先把content里面的产品信息渲染出来，再渲染外层的数据。
  for (var i = 0, len = modules.length; i < len; i++) {
    if (modules[i].content) {
//      // 这个hasFixedLayer是针对单产品模块的，用来判断该模块是否有浮动层，当content里面只是一些静态数据时，可能产品的信息要用浮动层来展示。
//      modules[i].hasFixedLayer = !/\{\{.*}}/.test(modules[i].content);
      modules[i].content = template.compile(modules[i].content)(modules[i].resourceinfoList[0]);
    }
  }

  // 设置modules
  var html_modules = template('tmpl_modules', res.data);
  $out_modules.html(html_modules);

  // 最后渲染导航的效果。
  initNavigator();
}

// 切换标签，这里就是改变城市
function showTag(id) {
  tagsCache.tag_id = id;
  setTags(tagsCache);
  $.ajax({
    data: {
      'method': 'yooyo.activity.module.list',
      'tags_id': id
    }
  }).done(setModules);
}

// 判断是否登录，局部刷新视图
function testLogin(view) {
  // 调用接口判断是否登录
  $.ajax({
    url: net.url('ajaxLogin')[$.ajaxSettings.data.layout],
    jsonpCallback: 'callback'
  }).done(function (res) {

    // 判断帮助按钮是否显示
    res.isShowFAQ = tagsCache.faq ? true : false;

    var html_login = template('tmpl_login', res);
    view.html(html_login);
  });
}

// 退出登录
function logout() {
  // 调用接口判断是否登录
  $.ajax({
    url: net.url('ajaxLogout')[$.ajaxSettings.data.layout]
  }).done(function (res) {
    if (res.status == 1) {
      // 判断是否登录
      testLogin($out_login);
    }
  });
}

// 选择地区效果
$(document).delegate('.tiltle .more ul li', {
  'click.chooseArea': function () {
    var $el = $(this).closest('.more');
    var $a = $(this).find('a');
    $el[$a.hasClass('on') && !$el.hasClass('onshow') ? 'addClass' : 'removeClass']('onshow');
  }
});

// 锚点滚动
function toAnchor(id, offsetTop) {
  var $target = $('#' + id);
  if ($target.length > 0) {
    var scrollTop = $target.offset().top;
    $('html, body').scrollTop(scrollTop - (offsetTop || 0));
  }
}

// 页面改变大小时重设导航效果。
$(window).on({
  'resize.navigator': function () {
    initNavigator();
  }
});

// 初始化导航，渲染导航效果。
function initNavigator() {
  var $navigator = $('.navigator');
  if($navigator.length > 0) {
    var offsetTop = $navigator.offset().top;
    var height = $navigator.outerHeight();
    var $ul = $('ul.spot');
    var $li = $ul.find('li');
    var list = [];

    // 构建导航对应target的数组
    $li.each(function () {
      var $this = $(this);
      var anchor_id = 'anchor_' + $this.data('aid');
      var $target = $('#' + anchor_id);
      if ($target.length > 0) {
        list.push({
          $el: $this,
          $target: $target
        });
      }
    });

    // 按offsetTop从小到大排序
    list.sort(function (a, b) {
      return a.$target.offset().top > b.$target.offset().top;
    });

    // 导航切换
    $li.off('click.navigator').on({
      'click.navigator': function () {
        var $this = $(this);
        var anchor_id = 'anchor_' + $this.data('aid');
        toAnchor(anchor_id, height);
        setTimeout(function () {
          $li.removeClass('on');
          $this.addClass('on');
        }, 20)
      }
    });

    // 滚动时选中对应导航
    $(window, 'html, body').off('scroll.navigator').on({
      'scroll.navigator': function () {
        $ul[offsetTop > $(window).scrollTop() ? 'removeClass' : 'addClass']('fixed');

        var current;
        var len = list.length;
        while (len--) {
          var item = list[len];
          if (item.$target.offset().top <= $(window).scrollTop() + height) {
            current = item;
            break;
          }
        }

        if (current && !current.$el.hasClass('on')) {
          $li.removeClass('on');
          current.$el.addClass('on');
        }
      }
    });
  }
}


