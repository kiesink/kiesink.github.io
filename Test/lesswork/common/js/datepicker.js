/**
 * Created by xyz on 2015/3/26.
 */
define(['acme'], function() {
  var bindMap = Acme.DatePicker.prototype.bindMap = {};

  // 绑定el，数据对象，显示属性
  // 【el的id, 数据对象, 数据对象里面的key值】
  Acme.DatePicker.prototype.bind = function(id, data, showAttr,selectDay) {
    // 日期绑定的数据，如{ '20150101': { price: 99, other: 'xx' } }是把一个对象绑定到20150101这天。
    this.info = data || {};
    // 日期绑定的数据对象应该显示哪个属性
    this.showAttr = showAttr || 'price';
    // 已选日期
    this.selectDays = {};
    var datepicker = this;
    var $el = $('#' + id);
    this.el = $el;
    $el.data('date', datepicker);
    $el.addClass('selectDate_box');
    bindMap[id] = datepicker;
    updateDate($el, datepicker,selectDay);
    //return datepicker;
  };
  //显示单周数据
  Acme.DatePicker.prototype.bindForWeek = function(id, data, showAttr,dateObj) {
    // 日期绑定的数据，如{ '20150101': { price: 99, other: 'xx' } }是把一个对象绑定到20150101这天。
    this.info = data || {};
    // 日期绑定的数据对象应该显示哪个属性
    this.showAttr = showAttr || 'price';
    // 已选日期
    this.selectDays = {};
    var datepicker = this;
    var $el = $('#' + id);
    this.el = $el;
    $el.data('date', datepicker);
    $el.addClass('selectDate_box');
    bindMap[id] = datepicker;
    updateDateForWeek($el, datepicker,dateObj);
    //return datepicker;
  };

  //
  Acme.DatePicker.prototype.setData = function(data, showAttr) {
    var datepicker = this;
    datepicker.info = data || {};
    datepicker.showAttr = datepicker.showAttr || 'price';
    datepicker.selectDays = {};
    var $el = datepicker.el;
    var id = $el.attr('id');
    bindMap[id] = datepicker;
    updateDate($el, datepicker);
    //return datepicker;
  };

  // 设置当前选中日期的数据，如acme1.setSelected(['20150101'])即选中20150101这天的意思
  Acme.DatePicker.prototype.setSelected = function(data) {
    var datepicker = this;
    var $el = datepicker.el;
    var obj = {};
    switch (Object.prototype.toString.call(data)) {
      case '[object Object]':
        obj = data;
        break;
      case '[object Array]':
        var len = data.length;
        while (len--) {
          obj[data[len]] = '';
        }
        break;
      case '[object String]':
        obj[data] = '';
        break;
    }
    datepicker.selectDays = obj;
    updateDate($el, datepicker);
  };

  // 获取当前选中日期的数据
  Acme.DatePicker.prototype.getSelected = function() {
    var datepicker = this;
    var data = {};
    this.el.find('.selectDay li a.select.selected').each(function() {
      var $this = $(this);
      var key = $this.attr('date');
      var value = datepicker.info[key];
      data[key] = value;
    });
    return data;
  };
  //切换下一月份
  Acme.DatePicker.prototype.next = function() {
    var $box = this.el;
    var id = $box.attr('id');
    var $days = $box.find('.selectDay');
    updateDate($box, bindMap[id]['nextMonth']());
  };
  //切换上一月份
  Acme.DatePicker.prototype.pre = function() {
    var $box = this.el;
    var id = $box.attr('id');
    var $days = $box.find('.selectDay');
    updateDate($box, bindMap[id]['prevMonth']());
  };
  //切换到当前月份
  Acme.DatePicker.prototype.toNowMonth = function() {
    var $box = this.el;
    var id = $box.attr('id');
    var $days = $box.find('.selectDay');
    updateDateForWeek($box, bindMap[id]['nowMonth'](),new Date());
  };

  // 是否单选
  Acme.DatePicker.prototype.single = true;



  $(document).delegate('.selectDate_box .pre, .selectDate_box .next', {
    'click.datepicker': function() {
      var $this = $(this);
      var $box = $this.closest('.selectDate_box');
      var id = $box.attr('id');
      var $days = $box.find('.selectDay');
      //处理底部三角箭头问题 add by haven
      var $dateSign = $(".datepicker-sign");
      if($dateSign){
          $dateSign.find(".sign").addClass("rotate180");
          $dateSign.attr("data-sign","up");
      }
      updateDate($box, bindMap[id][$this.hasClass('pre') ? 'prevMonth' : 'nextMonth']());
    }
  });

  $(document).delegate('.selectDate_box .selectYear a', {
    'click.datepicker': function() {
      var $this = $(this);
      var $box = $this.closest('.selectDate_box');
      var $boxSelectYear = $box.find('.open_year_box');
      if ($boxSelectYear.is(':hidden')) {
        var $ul = $('<ul/>');
        for (var i = 2015; i > 1949; i--) {
          $ul.append($('<li><a href="javascript:;">' + i + '</a></li>'));
        }
        $boxSelectYear.html('').append($ul);
        $boxSelectYear.show();
      } else {
        $boxSelectYear.hide();
      }
    }
  });

  $(document).delegate('.selectDate_box .open_year_box a', {
    'click.datepicker': function() {
      var $this = $(this);
      var $box = $this.closest('.selectDate_box');
      var id = $box.attr('id');
      var datepicker = bindMap[id];
      var $days = $box.find('.selectDay');
      var year = $this.html();
      datepicker.setYear(year);
      //处理底部三角箭头问题 add by haven
      var $dateSign = $(".datepicker-sign");
      if($dateSign){
        $dateSign.find(".sign").addClass("rotate180");
        $dateSign.attr("data-sign","up");
      }
      updateDate($box, datepicker);
      // 点击时收起,因为上面updateDate里面修改了dom，把open_year_box清掉了，这里不用再触发。
      //$box.find('.selectYear a').trigger('click.datepicker');
    }
  });

  $(document).delegate('.selectDate_box .selectDay li a.select', {
    'click.datepicker': function (e) {
      var $this = $(this);
      var $box = $this.closest('.selectDate_box');
      var id = $box.attr('id');
      var datepicker = bindMap[id];

      if (datepicker.single) {
        $box.find('.selectDay li a.select').removeClass('selected');
      }

      if ($this.hasClass('selected')) {
        $this.removeClass('selected');
      } else {
        $this.addClass('selected');
      }

      if (typeof datepicker.clickEvent === 'function') {
        var day = {};
        var $list = $box.find('.selectDay li a.select.selected');

        for (var i = 0, len = $list.length; i < len; i++) {
          var $item = $list.eq(i);
          var key = $item.attr('date');
          var value = datepicker.info[key];
          day[key] = value;
        }
        datepicker.clickEvent.call(null, e, day);
        datepicker.selectDays = day;
      }
    }
  });


  Acme.DatePicker.prototype.clickEventHandle = function(callback){
    $(document).delegate('.selectDate_box .selectDay li a', {
      'click.datepicker': function(e) {
        var $this = $(this);
        var $box = $this.closest('.selectDate_box');
        var id = $box.attr('id');
        var datepicker = bindMap[id];

        if (datepicker.single) {
          $box.find('.selectDay li a').removeClass('selected');
        }

        if ($this.hasClass('selected')) {
          $this.removeClass('selected');
        } else {
          $this.addClass('selected');
        }

        if (callback) {
          //去掉今天日期选择效果
          $box.find(".cur").removeClass("cur");
          var day = {};
          var $list = $box.find('.selectDay li a.selected');

          for (var i = 0, len = $list.length; i < len; i++) {
            var $item = $list.eq(i);
            var key = $item.attr('date');
            var value = datepicker.info[key];
            day[key] = value;
            break;
          }
          //将key由yyyyMMdd格式转为yyyy--MM--dd格式
          key = key.substring(0,4)+"-"+key.substring(4,6)+"-"+key.substring(6,8);
          callback.call(null, key);
          datepicker.selectDays = day;
        }
      }
    });
  }


  function select(e, $this, selector, callback){
    var $box = $this.closest('.selectDate_box');
    var id = $box.attr('id');
    var datepicker = bindMap[id];

    if (datepicker.single) {
      $box.find(selector).removeClass('selected');
    }

    if ($this.hasClass('selected')) {
      $this.removeClass('selected');
    } else {
      $this.addClass('selected');
    }

    if (typeof datepicker.clickEvent === 'function' || callback) {
      var day = {};
      var $list = $box.find(selector + '.selected');

      for (var i = 0, len = $list.length; i < len; i++) {
        var $item = $list.eq(i);
        var key = $item.attr('date');
        var value = datepicker.info[key];
        day[key] = value;
      }
      (datepicker.clickEvent || callback).call(null, e, day);
      datepicker.selectDays = day;
    }
  }


  // 更新html
  function updateDate($el, datepicker,dateStr) {

    var weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    var firstWeekday = 1;
    var html = '' +
      '<div class="selectDate_tt">' +
      '<ul>' +
      '<li class="pre"><a href="javascript:void(0)" class="sign">&#x12011;</a></li>' +
      '<li class="selectYear"><a href="javascript:void(0)" class="sign"><span class="nowYear">2015</span>年&#x12010; <span class="nowMonth">3</span>月</a></li>' +
      '<li class="next"><a href="javascript:void(0)" class="sign">&#x12009;</a></li>' +
      '</ul>' +
      '</div>' +
      '<div class="open_year_box"></div>' +
      '<div class="selectDate_seventDate">' +
      '<span>' + weekdays[(firstWeekday + 0) % 7] + '</span>' +
      '<span>' + weekdays[(firstWeekday + 1) % 7] + '</span>' +
      '<span>' + weekdays[(firstWeekday + 2) % 7] + '</span>' +
      '<span>' + weekdays[(firstWeekday + 3) % 7] + '</span>' +
      '<span>' + weekdays[(firstWeekday + 4) % 7] + '</span>' +
      '<span>' + weekdays[(firstWeekday + 5) % 7] + '</span>' +
      '<span>' + weekdays[(firstWeekday + 6) % 7] + '</span>' +
      '</div>' +
      '<div class="selectDay"></div>' +
      '';
    $el.html(html);

    var $days = $el.find('.selectDay');
    var $year = $el.find('.nowYear');
    var $month = $el.find('.nowMonth');
    var id = $el.attr('id');
    var $ul = $('<ul/>');
    var days = datepicker.getDaysList(firstWeekday);

    var selectDays = datepicker.selectDays || {};
    //add by haven
    if(dateStr && dateStr !== ""){
      selectDays[dateStr] = "";
    }

    var today = (function() {
      var date = new Date;
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    })();

    for (var i = 0; i < days.length; i++) {
      var day = days[i];
      var isToday = false;
      if (day.year === today.year && day.month === today.month && day.day === today.day) {
        isToday = true;
      }
      //add by haven 由传入参数节点选择日期，去掉今日
      if(dateStr && dateStr !== ""){
        isToday = false;
      }
      var date = day.year + ('0' + day.month).substr(-2) + ('0' + day.day).substr(-2);
      var info = datepicker.info[date] ? datepicker.info[date] : '';

      if (day.month !== datepicker.month) {
        $ul.append($('<li><span class="disable"><p>' + day.day + '</p></span></li>'))
      } else {
        var hasInfo = date in datepicker.info;
        var isSelected = date in selectDays;
        $ul.append($('<li' + (isToday ? ' class="cur"' : '') + '><a href="javascript:;"' + (hasInfo ? ' class="select' + (isSelected ? ' selected' : '') + '"' : '') + ' date="' + date + '"><p>' + day.day + '</p>' + (hasInfo && (datepicker.showAttr in datepicker.info[date]) ? '<span class="datepicker-info">' + datepicker.info[date][datepicker.showAttr] + '</span>' : '') + '</a></li>'))
      }
    }
    bindMap[id] = datepicker;
    $year.html('').append(datepicker.year);
    $month.html('').append(datepicker.month);
    $days.html('').append($ul);
  }

  /**
   * 根据传入的日期，显示当周的日期
   * @param date string 目标日期"yyyy-MM-dd"格式
   * @param $el 日历对象
   * @param datepicker
   */
  function updateDateForWeek($el, datepicker,dateObj) {
    //将传入进来的初始日期保存
    datepicker.setInitDate(dateObj);
    var weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    var firstWeekday = 1;
    var html = '' +
      '<div class="selectDate_tt">' +
      '<ul>' +
      '<li class="pre"><a href="javascript:void(0)" class="sign">&#x12011;</a></li>' +
      '<li class="selectYear"><a href="javascript:void(0)" class="sign"><span class="nowYear"></span>年&#x12010; <span class="nowMonth"></span>月</a></li>' +
      '<li class="next"><a href="javascript:void(0)" class="sign">&#x12009;</a></li>' +
      '</ul>' +
      '</div>' +
      '<div class="open_year_box"></div>' +
      '<div class="selectDate_seventDate">' +
      '<span>' + weekdays[(firstWeekday + 0) % 7] + '</span>' +
      '<span>' + weekdays[(firstWeekday + 1) % 7] + '</span>' +
      '<span>' + weekdays[(firstWeekday + 2) % 7] + '</span>' +
      '<span>' + weekdays[(firstWeekday + 3) % 7] + '</span>' +
      '<span>' + weekdays[(firstWeekday + 4) % 7] + '</span>' +
      '<span>' + weekdays[(firstWeekday + 5) % 7] + '</span>' +
      '<span>' + weekdays[(firstWeekday + 6) % 7] + '</span>' +
      '</div>' +
      '<div class="selectDay"></div>' +
      '';
    $el.html(html);

    var $days = $el.find('.selectDay');
    var $year = $el.find('.nowYear');
    var $month = $el.find('.nowMonth');
    var id = $el.attr('id');
    var $ul = $('<ul/>');
    //设置日期为传入日期 add by haven
    datepicker.setYear(dateObj.getFullYear());
    datepicker.setMonth(dateObj.getMonth()+1);
    var days = datepicker.getWeekDaysList(firstWeekday,dateObj);
    //设置默认选中的值 add by haven
    var dateStr = dateObj.getFullYear() + ('0' + (dateObj.getMonth()+1)).substr(-2) + ('0' + dateObj.getDate()).substr(-2);
    var dateStrObj = {};
        dateStrObj[dateStr] = "";
    var selectDays = dateStrObj || datepicker.selectDays || {};

    var today = (function() {
      var date = new Date;
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    })();

    for (var i = 0; i < days.length; i++) {
      var day = days[i];
      var isToday = false;
      if (day.year === today.year && day.month === today.month && day.day === today.day) {
        isToday = true;
      }

      var date = day.year + ('0' + day.month).substr(-2) + ('0' + day.day).substr(-2);
      var info = datepicker.info[date] ? datepicker.info[date] : '';

      if (day.month !== datepicker.month) {
        $ul.append($('<li><span class="disable"><p>' + day.day + '</p></span></li>'))
      } else {
        var hasInfo = date in datepicker.info;
        var isSelected = date in selectDays;
        $ul.append($('<li'+ '><a href="javascript:;"' + ' class="select' + (isSelected ? ' selected' : '') + '"' + ' date="' + date + '"><p>' + day.day + '</p>' + (hasInfo && (datepicker.showAttr in datepicker.info[date]) ? '<span class="datepicker-info">' + datepicker.info[date][datepicker.showAttr] + '</span>' : '') + '</a></li>'))
      }
    }
    bindMap[id] = datepicker;
    $year.html('').append(datepicker.year);
    $month.html('').append(datepicker.month);
    $days.html('').append($ul);
  }
  return Acme;
});