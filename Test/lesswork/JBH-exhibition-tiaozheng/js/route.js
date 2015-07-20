/**
 * Created by xyz on 2015/4/13.
 */
// configure
var baseUrl = '../../common/js/';
// var baseUrl = '//img.yooyoimg.com/p/common/js/';
require.config({
  //urlArgs: "v="+ Math.random(),
  paths: {
    avalon: 'avalon',
    mmRouter: 'base/mmRouter',
    mmState: 'base/mmState',
    mmRequest: 'base/mmRequest',
    mmHistory: 'base/mmHistory',
    mmPromise: 'base/mmPromise',
    jquery: 'lib/jquery-1.8.0',
    jqzoom: 'lib/jquery.jqzoom',
    areadata: 'http://img.jb.yooyo.com/p/2.1/manager/js/jbareadata.js',
    mousewheel: 'lib/jquery.mousewheel',
    carousel: 'lib/CloudCarousel.1.0.5'
  },
  shim: {
    jquery: {
      exports: 'jQuery'
    },
    jqzoom: {
      deps: ['jquery']
    },
    areadata: {
      exports: '_areaselect_data'
    },
    mousewheel: {
      deps: ['jquery']
    },
    carousel: {
      deps: ['jquery', 'mousewheel']
    }
  }
});

require(['mmState', 'mmRequest'], function () {

  var Api = {
    url: 'http://api.jiabo360.com/dock-api/',
    //url: 'http://gapp2:28082/dock-api/',
    map: {
      'index-banner': 'outer/zst/info/advertising/list.json',   // 首页banner
      'index-main': 'outer/zst/index/list.json',                // 首页主体
      'product-search': 'outer/zst/product/list.json',      // 产品搜索
      'product-detail': 'outer/zst/product/get.json',       // 产品详情
      'product-recommend': 'outer/zst/product/get.json',    // 产品推荐
      'enterprise': 'outer/zst/company/getCompanyInfoById.json',      // 企业首页
      'enterprise-recommend': 'outer/zst/product/company/list.json',  // 企业推荐
      'enterprise-search': 'outer/zst/company/getCompanyList.json',   // 企业搜索
      'enterprise-product': 'outer/zst/product/list.json',            // 企业产品列表
      'enterprise-info': 'outer/zst/product/company/get.json',        // 企业信息，在产品页用到
      'information.list': 'outer/zst/info/content/list.json',   // 咨询列表
      'information.detail': 'outer/zst/info/content/get.json',  // 资讯内容
      'other': '' // 其他
    },
    get: function (urlName, data, fn) {
      var url = this.url + this.map[urlName];
      avalon.get(url, data, function (res) {
        switch (res.ret_flag) {
          case 0:
//            avalon.log('数据异常,res:', res);
//            alert('数据异常,res:' + JSON.stringify(res));
//            avalon.router.go('error');
//            break;
          case 1:
            fn.apply(null, arguments);
            break;
          default:
            break;
        }
      }, 'jsonp');
    }
  };

  avalon.Api = Api;

  var Template = {
    url: '../html/',
    maps: {
      // 测试链接
      'map': 'map.html',
      // 首页
      'index': 'home.html',
      // 产品搜索
      'product-search': 'product-search.html',
      // 产品详情
      'product-detail': 'product-detail.html',
      // 企业
      'enterprise': 'enterprise.html',
      // 企业搜索
      'enterprise-search': 'enterprise-search.html',
      // 企业产品列表
      'enterprise-product': 'enterprise-product.html',
      // 咨询列表
      'information.list': 'information-list.html',
      // 资讯内容
      'information-detail': 'information-detail.html',
      // 其他
      'error': '404.html'
    },
    get: function (name) {
      return this.url + this.maps[name];
    },
    from: function (path) {
      path = this.url + path;
      return /\.html$/.test(path) ? path : path + '.html';
    }
  };

  var model = avalon.define('Ctrl', function (vm) {
    // 放些公共内容，如页面标题。
    vm.common = {};
    vm.query = {};

    // 搜索类型, 搜索内容
    vm.search_type = 'product';
    vm.search_keyword = '';
    vm.changeSearchType = function (type) {
      vm.search_type = type;
    };
    vm.search = function () {
//      var url = '#/';
//      switch (vm.search_type){
//        case 'product':
//          url += 'product/search';
//          break;
//        case 'enterprise':
//          url += 'enterprise/search';
//          break;
//        default :
//          url += '';
//          break;
//      }
//      window.open(url + '?s=' + vm.search_keyword);
      var state;
      switch (vm.search_type) {
        case 'product':
          state = 'product-search';
          break;
        case 'enterprise':
          state = 'enterprise-search';
          break;
        default :
          state = '';
          break;
      }
      // s统一作为search的query键
      avalon.router.go(state, {
        query: {
          s: vm.search_keyword
        }
      });

    };

    // 页码
    vm.pager = {
      state: '',
      pageList: []
    };
    // 设置pager
    vm.setPager = function (state, data) {
      model.pager = avalon.mix({}, data, { state: state, pageList: [] });
      if (model.pager.hasOwnProperty('totalCount')) {
        // 统一接口属性【记录总数total_count】
        model.pager.total_count = model.pager.totalCount;
      }
      model.pager.total_page = Math.ceil(model.pager.total_count / model.pager.page_size);

      var pageList = model.pager.pageList;

      for (var i = 1, len = 5; len--; i++) {
        var number = model.pager.page_no + Math.floor(i / 2) * Math.pow(-1, i);
        if (number > 0 && number <= model.pager.total_page) {
          pageList[i % 2 == 0 ? 'push' : 'unshift']({ page_no: number, text: number });
        }
      }

      pageList.unshift({
        page_no: model.pager.page_no > 1 ? model.pager.page_no - 1 : 1,
        text: '上一页'
      });
      pageList.push({
        page_no: model.pager.page_no < model.pager.total_page ? model.pager.page_no + 1 : model.pager.total_page,
        text: '下一页'
      });

      pageList.unshift({
        page_no: 1,
        text: '第一页'
      });
      pageList.push({
        page_no: model.pager.total_page,
        text: '最后一页'
      });

    };
    // 跳转到某页
    vm.gotoPage = function (num) {
      var query = {page_no: num};
      query.page_no = query.page_no > model.pager.total_page ? model.pager.total_page : (query.page_no || 1);
      model.setQuery(query);
    };

    // 设置参数
    vm.setQuery = function (query) {
      query = avalon.mix({}, mmState.currentState.query, query);
      for (var k in query) {
        if (query[k] === null)  delete query[k];
      }
      avalon.router.go(mmState.currentState.stateName, { query: query });
    };

    // 添加收藏夹功能
    vm.addFavorite = function () {
      var url = window.location;
      var title = document.title;
      var ua = navigator.userAgent.toLowerCase();

      try {
        if (ua.indexOf("360se") > -1) {
          alert("由于360浏览器功能限制，请按 Ctrl+D 手动收藏！");
        }
        else if (ua.indexOf("msie 8") > -1) {
          window.external.AddToFavoritesBar(url, title); //IE8
        }
        else if (document.all) {
          window.external.addFavorite(url, title);
        }
        else if (window.sidebar) {
          window.sidebar.addPanel(title, url, "");
        }
        else{
          throw new Error('error');
        }
      } catch (e) {
        alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
      }
    };

    // 页面比较少，就不new太多控制器了，所以把大概的几个功能都挂到vm下。
    vm.indexbanner = {};
    vm.indexmain = {};
    vm.enterprise = {};
    vm.enterpriseinfo = {};
    vm.enterprisesearch = {};
    vm.enterpriseproduct = {};
    vm.enterpriserecommend = {};
    vm.productsearch = {};
    vm.productdetail = {};
    vm.informationlist = {};
    vm.informationdetail = {};

    // 部分固定映射放在这里
    vm.maps = {
      search_type: {
        'product': '产品',
        'enterprise': '企业'
      },
      business_model: {
        0: '生产厂家',
        1: '经销批发',
        2: '招商代理',
        3: '商业服务',
        4: '其他'
      },
      enterprise_type: {
        0: '有限责任公司',
        1: '国有企业',
        2: '集体企业',
        3: '联营企业',
        4: '中外合资企业',
        5: '中外合作企业',
        6: '外商独资企业',
        7: '个体工商户',
        8: '个人独资企业'
      }
    };

    // 地区也是固定的
    vm.area = {
      source: null,
      data: null,
      province_list: [],
      province_code: null,
      city_list: [],
      city_code: null,
      area_list: [],
      area_code: null
    };

  });

  /* 地区联动数据处理 */
  model.area.$watch('source', function (val) {
    var data = {};
    var k, i, len, obj;

    for (i = 0, len = val.p.length; i < len; i++) {
      obj = val.p[i];
      data[obj.ccode] = obj.name;
    }

    for (k in val.c) {
      for (i = 0, len = val.c[k].length; i < len; i++) {
        obj = val.c[k][i];
        data[obj.ccode] = obj.name;
      }
    }

    for (k in val.a) {
      for (i = 0, len = val.a[k].length; i < len; i++) {
        obj = val.a[k][i];
        data[obj.ccode] = obj.name;
      }
    }

    model.area.data = data;
  });
  model.area.$watch('data', function () {
    model.area.province_list = model.area.source.p;
    model.area.province_code = model.area.province_list[0].ccode;
  });
  model.area.$watch('province_code', function (val) {
    var data = model.area.data;
    var pName = data[val];

    if (model.area.source.c[pName]) {
      model.area.city_list = model.area.source.c[pName];
      model.area.city_code = model.area.city_list[0].ccode;
    }
  });
  model.area.$watch('city_code', function (val) {
    var data = model.area.data;
    var pName = data[model.area.province_code];
    var cName = data[val];

    if (model.area.source.a[pName + '-' + cName]) {
      model.area.area_list = model.area.source.a[pName + '-' + cName];
      model.area.area_code = model.area.area_list[0].ccode;
    }
  });


  /* 首页 */
  avalon.state("index", {
    //controller: "Ctrl",
    url: '/index',
    views: {
      "": {
        templateUrl: Template.get('index')
      }
    },
    onEnter: function () {
      var query = avalon.mix({}, model.query = this.query);
      model.common = {
        title: '首页'
      };

      // 旋转及导航效果。
      require(['carousel'], function () {
        var count = 0;
        var timer = setInterval(function () {
          if ($("#carousel1").length > 0 || count > 60) {
            clearInterval(timer);
            // 这初始化容器中指定的元素，在这种情况下，旋转木马.
            $("#carousel1").CloudCarousel({
              xPos: 650,
              yPos: 80,
              reflHeight: 85,         //倒影的高度
              reflOpacity: 0.5,
              minScale: 0.5,
              xRadius: 450,
              yRadius: -20,
              buttonLeft: '#but1',
              buttonRight: '#but2',
              altBox: '#altbox',
              FPS: 60,
              speed: 0.1,
              bringToFront: true,
              autoRotate: 'right',
              autoRotateDelay: 4000
            });

            // 鼠标移到下面的导航栏时转到对应的图片
            $('.sider-trigger').bind({
              'mouseenter': function () {
                var tid = $(this).attr('tid');
                $('#' + tid).find('.cloudcarousel').trigger('click', true);
              }
            });

            // 鼠标移到更多时导航从下到上出现
            var isOut = true;
            var $moreBtn = $('#sider-btn-more');
            var $moreContent = $('#sider-more');
            $moreBtn.bind({
              'mouseenter': function () {
                isOut = false;
                $moreContent.stop().animate({
                  bottom: 75
                });
              },
              'mouseleave': function () {
                isOut = true;
                hideMore();
              }
            });
            $moreContent.bind({
              'mouseenter': function () {
                isOut = false;
              },
              'mouseleave': function () {
                isOut = true;
                hideMore();
              }
            });
            function hideMore() {
              setTimeout(function () {
                if (isOut) {
                  $moreContent.stop().animate({
                    bottom: -108
                  });
                }
              }, 500);
            }


          }
          count++;
        }, 30);
      });


      Api.get('index-banner', query, function (res) {
        model.indexbanner = res;
      });
      Api.get('index-main', query, function (res) {
        model.indexmain = res;
      });
    }

  });


  // 企业
  avalon
    .state("enterprise", {
      abstract: true,
      url: "/enterprise",
      templateUrl: "enterprise.html",
      onEnter: function () {

      }

    })
    // 企业首页
    .state("enterprise.home", {
      //controller: "Ctrl",
      url: "/{id:int}",
      views: {
        "": {
          templateUrl: 'enterprise.home.html'
        }
      },
      onEnter: function () {
        var query = avalon.mix({}, model.query = this.query);
        query.id = this.params.id;
        model.common = {
          title: '企业主页'
        };
        Api.get('enterprise', query, function (res) {
          model.enterprise = res;
        });
      }
    })
    // 产品
    .state("enterprise.product", {
      abstract: true,
      url: "/{cid:int}/product",
      templateUrl: "product.html",
      onEnter: function () {

      }
    })
    // 企业产品
    .state("enterprise.product.list", {
      url: "/list",
      views: {
        "": {
          templateUrl: 'product.list.html'
        }
      },
      onEnter: function () {
        var query = avalon.mix({}, model.query = this.query);
        model.common = {
          title: '企业产品'
        };
        Api.get('enterprise-info', avalon.mix({}, query, {id: this.params.cid}), function (res) {
          model.enterpriseinfo = res;
        });
        Api.get('enterprise-product', avalon.mix({}, query, {fk_company_id: this.params.cid}), function (res) {
          model.enterpriseproduct = res;
          model.setPager('enterprise-product', res.data);
        });
      }

    })
    // 产品详细页
    .state("enterprise.product.detail", {
      url: "/{pid:int}",
      views: {
        "": {
          templateUrl: 'product.detail.html'
        }
      },
      onEnter: function () {
        var query = avalon.mix({}, model.query = this.query);
        model.common = {
          title: '产品详情页'
        };

        Api.get('product-detail', { id: this.params.pid }, function (res) {
          model.productdetail = res;
          Api.get('enterprise-info', {id: res.data.fk_company_id}, function (res) {
            model.enterpriseinfo = res;

            // 放大镜效果
            require(['jqzoom'], function () {
              $('.jqzoom').jqzoom({
                zoomType: 'standard',
                lens: true,
                preloadImages: false,
                alwaysOn: false,
                zoomWidth: 350,
                zoomHeight: 316,//右边放大镜图片高度
                xOffset: 0,
                yOffset: 0,
                position: 'right'
              });

              // 那个缩略图左右点击效果
              var $content = $(".spec-items ul");
              var liwidth = $content.find("li").outerWidth()//单个li的宽度
              var count = $content.find("li").length;//总共的<a>元素的个
              $content.css("width", liwidth * (count + 1));//预留1个位置，左移动一个焦点图为了以后循环滚动取第一个LI，不预留的话最后那个图就被覆盖
              var i = 5;  //已知显示的li元素的个数
              var m = 5;  //用于计算的变量
              $("#spec-backward").click(function () {
                if (!$content.is(":animated")) {  //判断元素是否正处于动画，如果不处于动画状态，则追加动画。
                  if (m < count) {  //判断 i 是否小于总的个数
                    $content.animate({left: "-=" + liwidth}, 600);
                    m++;
                  }
                }
              });
              $("#spec-forward").click(function () {
                if (!$content.is(":animated")) {
                  if (m > i) { //判断 i 是否小于总的个数
                    $content.animate({left: "+=" + liwidth}, 600);
                    m--;
                  }
                }
              });

            });

          });
        });


        require(['css!../css/editinfo.css'], function () {
        });
      }

    });


  avalon
    .state("search", {
      abstract: true,
      url: "/search",
      templateUrl: "search.html",
      onEnter: function () {

      }
    })
    // 企业搜索页
    .state("search.enterprise", {
      //controller: "Ctrl",
      url: "/enterprise",
      views: {
        "": {
          templateUrl: "enterprise.search.html"
        }
      },
      onEnter: function () {
        var query = avalon.mix({}, model.query = this.query);
        model.common = {
          title: '企业搜索结果'
        };
        Api.get('enterprise-search', query, function (res) {
          model.enterprisesearch = res;
          model.setPager('enterprise-search', res.data.company_list);
        });
      }
    })
    // 产品搜索页
    .state("search.product", {
      //controller: "Ctrl",
      url: "/product",
      views: {
        "": {
          templateUrl: "product.search.html"
        }
      },
      onEnter: function () {
        var query = avalon.mix({}, model.query = this.query);
        model.common = {
          title: '产品搜索'
        };
        require(['areadata'], function (res) {
          model.area.source = res;
        });
        Api.get('product-search', query, function (res) {
          model.productsearch = res;
          model.setPager('product-search', res.data);
        });
        Api.get('enterprise-recommend', query, function (res) {
          model.enterpriserecommend = res;
        });
      }

    });

  // 资讯
  avalon
    .state("information", {
      abstract: true,
      url: "/information",
      templateUrl: "information.html"
    })
    // 资讯列表
    .state("information.list", {
      //controller: "Ctrl",
      url: "/list",
      views: {
        "": {
          templateUrl: 'information.list.html'
        }
      },
      onEnter: function () {
        var query = avalon.mix({}, model.query = this.query);
        model.common = {
          title: '资讯列表页'
        };
        Api.get('information.list', query, function (res) {
          model.informationlist = res;
          model.setPager('information.list', res.data);
        });

      }
    })
    // 咨询内容
    .state("information.detail", {
      //controller: "Ctrl",
      url: "/{id:int}",
      views: {
        "": {
          templateUrl: 'information.detail.html'
        }
      },
      onEnter: function () {
        var query = avalon.mix({}, model.query = this.query);
        model.common = {
          title: '资讯内容页'
        };
        Api.get('information.detail', {id: this.params.id}, function (data) {
          model.informationdetail = data;
        });
      }
    });


  // 这个用来处理那些没有带企业id的产品链接
  avalon.router.get('/product/{pid:int}', function (pid) {
    Api.get('product-detail', {id: pid}, function (res) {
      avalon.router.go('enterprise.product.detail', {
        cid: res.data.fk_company_id,
        pid: pid
      });
    });
  });

  /* 其他 */
  avalon.state("error", {
    //controller: "Ctrl",
    url: '/error',
    views: {
      "": {
        templateUrl: Template.get('error')
      }
    },
    onEnter: function () {
      model.common = {
        title: '找不到页面'
      };
    }

  });
  avalon.state("map", {
    //controller: "Ctrl",
    url: '/map',
    views: {
      "": {
        templateUrl: Template.get('map')
      }
    },
    onEnter: function () {
      model.common = {
        title: '地图'
      };
    }

  });

  /* 默认路由 */
  avalon.router.get('/', function () {
    avalon.router.go('index');
  });
//  avalon.router.error(function(){
//    avalon.router.go('error');
//  });

  avalon.history.start({
    hashPrefix: ""
  });

  avalon.scan();
});
