define(['jquery'], function($){

  function DateInput(el, opts) {
    if (typeof(opts) != "object") opts = {};
    $.extend(this, DateInput.DEFAULT_OPTS, opts);
    this.input = $(el);
    this.bindMethodsToObj("show", "hide", "hideIfClickOutside", "keydownHandler", "selectDate");
    this.build();
    this.selectDate();
    this.hide()
  }

  DateInput.DEFAULT_OPTS = {
    month_names: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    short_month_names: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    short_day_names: ["日", "一", "二", "三", "四", "五", "六"],
    start_of_week: 1,
    dbData: {},
    selectedMap: {},
    selectedList: [],
    showAttr: 'price'
  };

  DateInput.prototype = {
    build: function() {
      var monthNav = $('<p class="month_nav">' + '<span class="button prev" title="[Page-Up]">&#171;</span>' + ' <span class="month_name"></span> ' + '<span class="button next" title="[Page-Down]">&#187;</span>' + '</p>');
      this.monthNameSpan = $(".month_name", monthNav);
      $(".prev", monthNav).click(this.bindToObj(function() {
        this.moveMonthBy( - 1)
      }));
      $(".next", monthNav).click(this.bindToObj(function() {
        this.moveMonthBy(1)
      }));
      var yearNav = $('<p class="year_nav">' + '<span class="button prev" title="[Ctrl+Page-Up]">&#171;</span>' + ' <span class="year_name"></span> ' + '<span class="button next" title="[Ctrl+Page-Down]">&#187;</span>' + '</p>');
      this.yearNameSpan = $(".year_name", yearNav);
      $(".prev", yearNav).click(this.bindToObj(function() {
        this.moveMonthBy( - 12)
      }));
      $(".next", yearNav).click(this.bindToObj(function() {
        this.moveMonthBy(12)
      }));
      var nav = $('<div class="nav"></div>').append(monthNav, yearNav);
      var tableShell = "<table><thead><tr>";
      $(this.adjustDays(this.short_day_names)).each(function() {
        tableShell += "<th>" + this + "</th>"
      });
      tableShell += "</tr></thead><tbody></tbody></table>";
      this.dateSelector = $('<div class="date_selector"></div>').append(nav, tableShell);



      this.rootLayers = $('<div class="date_mask"></div>');
      //var $date_box = $('<table class="date_box"><tr><td></td></tr></table>');	//为调整垂直位置加的。。
      //$date_box.find('tr td')
      this.rootLayers.append(this.dateSelector);
      //this.rootLayers.append($date_box).appendTo('body');
      this.rootLayers.appendTo('body');

      this.rootLayers.click(this.bindToObj(function(e){
        if($(e.target).parents('.date_selector').length < 1 && e.currentTarget === this.rootLayers[0]){
          this.hide();
        }
      }));
      /*
       if ($.browser.msie && $.browser.version < 7) {
       this.ieframe = $('<iframe class="date_selector_ieframe" frameborder="0" src="#"></iframe>').insertBefore(this.dateSelector);
       this.rootLayers = this.rootLayers.add(this.ieframe);
       $(".button", nav).mouseover(function() {
       $(this).addClass("hover")
       });
       $(".button", nav).mouseout(function() {
       $(this).removeClass("hover")
       })
       };
       */
      this.tbody = $("tbody", this.dateSelector);
      this.input.change(this.bindToObj(function() {
//        var value = this.input.val();
//        console.log(value)
//        $('.selected', this.tbody).removeClass("selected");
//        $('td[date="' + this.format(value) + '"]', this.tbody).addClass("selected")
//
//        this.selectedMap = {}[value] = this.dbData[value];
//        this.selectedList = [ this.selectedMap ];
//        console.log(this.stringToDate(value))
//        this.selectDate(this.stringToDate(value))
        this.selectDate()
      }));
      this.selectDate()
    },
    setData: function(data, showAttr){
      this.dbData = data || {};
      if(showAttr){ this.showAttr = showAttr; }
      this.selectDate();
    },
    selectMonth: function(date) {
      var xDate = this.selectedDateString;
      var newMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      if (!this.currentMonth || !(this.currentMonth.getFullYear() == newMonth.getFullYear() && this.currentMonth.getMonth() == newMonth.getMonth())) {

        this.currentMonth = newMonth;
        var rangeStart = this.rangeStart(date),
          rangeEnd = this.rangeEnd(date);
        var numDays = this.daysBetween(rangeStart, rangeEnd);
        var dayCells = "";
        for (var i = 0; i <= numDays; i++) {
          var currentDay = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate() + i, 12, 00);
          var xYear = currentDay.getFullYear();
          var xMonth = currentDay.getMonth();
          var xDay = currentDay.getDate();
          var strDate = this.dateToString(currentDay);

          if (this.isFirstDayOfWeek(currentDay)) dayCells += "<tr>";

          //console.log(strDate, xYear, xMonth, xDay,currentDay.getMonth())

          //(strDate in this.dbData ? this.dbData[strDate][showAttr] : '')

          if (xMonth == date.getMonth()) {
            dayCells += '<td class="selectable_day" date="' + strDate + '">' + xDay + '</td>'
          } else {
            dayCells += '<td class="unselected_month" date="' + strDate + '">' + xDay + '</td>'
          };
          if (this.isLastDayOfWeek(currentDay)) dayCells += "</tr>"
        };
        this.tbody.empty().append(dayCells);
        this.monthNameSpan.empty().append(this.monthName(date));
        this.yearNameSpan.empty().append(this.currentMonth.getFullYear());
//        $(".selectable_day", this.tbody).click(this.bindToObj(function(event) {
//            console.log(this.input[0])
//          this.changeInput($(event.target).attr("date"))
//        }));
        $(this.tbody).delegate('.selectable_day', {
          'click.dateold': this.bindToObj(function(event) {
            event.stopPropagation();
            this.changeInput($(event.target).attr("date"))
          })
        });
        $('td[date="' + this.dateToString(new Date()) + '"]', this.tbody).addClass("today");
        $("td.selectable_day", this.tbody).mouseover(function() {
          $(this).addClass("hover")
        });
        $("td.selectable_day", this.tbody).mouseout(function() {
          $(this).removeClass("hover")
        })
      };
      $('.selected', this.tbody).removeClass("selected");
      var hasDbData = false;
      for(var k in this.dbData){
        if(this.dbData.hasOwnProperty(k)){
          hasDbData = true;
        }
      }

      var monthNow = this.currentMonth.getMonth() + 1;
      if(hasDbData) {
        var tempList = [];
        for (var k in this.dbData) {
          var key = this.format(k);
          tempList.push(key);
          $('td[date="' + key + '"]', this.tbody).addClass("dbselect");
        }

        $('td', this.tbody).each(function () {
          if (!$(this).hasClass('dbselect')) {
            $(this).removeClass("selectable_day").addClass('unselected_month');
          }
          else if(parseInt($(this).attr('date').match(/\d{4}-(\d{2})-\d{2}/)[1]) === monthNow){
            $(this).removeClass("unselected_month").addClass('selectable_day');
          }
        });

        for (var k in this.selectedMap) {
          var matcher = k.match(/\d{4}-(\d{2})-\d{2}/);
          if(matcher && parseInt(matcher[1]) === monthNow) {
            $('td[date="' + this.format(k) + '"]', this.tbody).addClass("select")
          }
        }

        if(!xDate) {
          tempList.sort(function (a, b) {
            a = a.replace(/-/g, '');
            b = b.replace(/-/g, '');
            return a - b;
          });
          if (tempList.length > 0) {
            xDate = this.format(tempList[0]);
          }
        }
        else {
          //throw new Error('获取数据失败');
        }
        matcher1 = xDate.match(/\d{4}-(\d{2})-\d{2}/);
        if(matcher1 && parseInt(matcher1[1]) === monthNow) {
          $('td[date="' + xDate + '"]', this.tbody).addClass("selected");
        }
        this.input.val(xDate);
//        for (var k in this.dbData) {
//          var key = k
//          if (!/-/.test(k)) {
//            key = k.substring(0, 4) + '-' + k.substring(4, 6) + '-' + k.substring(6, 8);
//          }
//
//          var selectDay = this.selectDate(this.stringToDate(key));
//          $('td[date="' + selectDay + '"]', this.tbody).addClass("selected")
//          break;
//        }
      }
      else{
        $('.selectable_day', this.tbody).each(function () {
          if (!$(this).hasClass('dbselect')) {
            $(this).removeClass("selectable_day").addClass('unselected_month');
          }
        });
      }
    },
    format: function(str){
      if (!/-/.test(str)) {
        str = str.substring(0, 4) + '-' + str.substring(4, 6) + '-' + str.substring(6, 8);
      }
      return str;
    },
    selectDate: function(date) {
      if (typeof(date) == "undefined") {
        date = this.stringToDate(this.input.val())
      };

      var hasData = false;
      for(var k in this.dbData){
        if(this.dbData.hasOwnProperty(k)){
          hasData = true;
        }
      }
      if(hasData) {
        if (!date) {
          var tempList = [];
          for (var k in this.dbData) {
            var key = this.format(k);
            tempList.push(key);
            $('td[date="' + key + '"]', this.tbody).addClass("dbselect");
          }
          tempList.sort(function (a, b) {
            a = a.replace(/-/g, '');
            b = b.replace(/-/g, '');
            return a - b;
          });
          if (tempList.length > 0) {
            date = this.stringToDate(this.format(tempList[0]));
          }
        }
      }
      else {
        //throw new Error('获取数据失败');
        $('.selectable_day', this.tbody).removeClass('dbselect').removeClass("selectable_day").addClass('unselected_month')
        this.input.val('');
      }
      if(!date) date = new Date;
      this.selectedDate = date;
      this.selectedDateString = this.dateToString(this.selectedDate);
      this.selectedMap[this.selectedDateString] = this.dbData[this.selectedDateString];
      this.selectMonth(this.selectedDate)
    },
    changeInput: function(dateString) {
      this.input.val(dateString).change();
      this.hide()
    },
    show: function() {
      this.rootLayers.css("display", "block");
      this.input.click(this.hideIfClickOutside);
      this.input.unbind("focus", this.show);
      $(document.body).keydown(this.keydownHandler);
      //this.setPosition()
    },
    hide: function() {
      this.rootLayers.css("display", "none");
      $([window, document.body]).unbind("click", this.hideIfClickOutside);
      this.input.focus(this.show);
      $(document.body).unbind("keydown", this.keydownHandler)
    },
    hideIfClickOutside: function(event) {
      if (event.target != this.input[0] && !this.insideSelector(event)) {
        this.hide()
      }
    },
    hideIfClickBg: function(event) {
      //if (event.target != this.input[0] && !this.insideSelector(event)) {
        this.hide()
      //}
    },
    insideSelector: function(event) {
      var offset = this.dateSelector.position();
      //console.log(this.dateSelector,offset);
      offset.right = offset.left + this.dateSelector.width();//this.dateSelector.outerWidth();
      offset.bottom = offset.top + this.dateSelector.height();//this.dateSelector.outerHeight();
      return event.pageY < offset.bottom && event.pageY > offset.top && event.pageX < offset.right && event.pageX > offset.left
    },
    keydownHandler: function(event) {
      switch (event.keyCode) {
        case 9:
        case 27:
          this.hide();
          return;
          break;
        case 13:
          this.changeInput(this.selectedDateString);
          break;
        case 33:
          this.moveDateMonthBy(event.ctrlKey ? -12 : -1);
          break;
        case 34:
          this.moveDateMonthBy(event.ctrlKey ? 12 : 1);
          break;
        case 38:
          this.moveDateBy( - 7);
          break;
        case 40:
          this.moveDateBy(7);
          break;
        case 37:
          this.moveDateBy( - 1);
          break;
        case 39:
          this.moveDateBy(1);
          break;
        default:
          return
      }
      event.preventDefault()
    },
    stringToDate: function(string) {
      var matches;
      matches = string.match(/^(\d{4})-(\d{2})-(\d{2})$/)
      if (matches) {
        return new Date(matches[1], matches[2] - 1, matches[3], 12, 00)
      } else {
        return null
      }
    },
    dateToString: function(date) {
      var strDate = date.getFullYear()+"-"+this.short_month_names[date.getMonth()]+"-" +date.getDate();
      strDate = strDate.replace(/[^-]*/g, function(str){
        if(str.length === 1){ str = '0' + str; } return str;
      });
      return strDate;
    },
    setPosition: function() {
      var offset = this.input.offset();

      this.rootLayers.css({
        top: 0,//offset.top + this.input.height(), //outerHeight(),
        left: 0//offset.left
      });

      if (this.ieframe) {
        this.ieframe.css({
          width: this.dateSelector.width(), //outerWidth(),
          height: this.dateSelector.height() //outerHeight()
        })
      }
    },
    moveDateBy: function(amount) {
      var newDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate() + amount);
      this.selectDate(newDate)
    },
    moveDateMonthBy: function(amount) {
      var newDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + amount, this.selectedDate.getDate());
      if (newDate.getMonth() == this.selectedDate.getMonth() + amount + 1) {
        newDate.setDate(0)
      };
      this.selectDate(newDate)
    },
    moveMonthBy: function(amount) {
      var newMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + amount, this.currentMonth.getDate());
      this.selectMonth(newMonth)
    },
    monthName: function(date) {
      return this.month_names[date.getMonth()]
    },
    bindToObj: function(fn) {
      var self = this;
      return function() {
        return fn.apply(self, arguments)
      }
    },
    bindMethodsToObj: function() {
      for (var i = 0; i < arguments.length; i++) {
        this[arguments[i]] = this.bindToObj(this[arguments[i]])
      }
    },
    indexFor: function(array, value) {
      for (var i = 0; i < array.length; i++) {
        if (value == array[i]) return i
      }
    },
    monthNum: function(month_name) {
      return this.indexFor(this.month_names, month_name)
    },
    shortMonthNum: function(month_name) {
      return this.indexFor(this.short_month_names, month_name)
    },
    shortDayNum: function(day_name) {
      return this.indexFor(this.short_day_names, day_name)
    },
    daysBetween: function(start, end) {
      start = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
      end = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
      return (end - start) / 86400000
    },
    changeDayTo: function(dayOfWeek, date, direction) {
      var difference = direction * (Math.abs(date.getDay() - dayOfWeek - (direction * 7)) % 7);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate() + difference)
    },
    rangeStart: function(date) {
      return this.changeDayTo(this.start_of_week, new Date(date.getFullYear(), date.getMonth()), -1)
    },
    rangeEnd: function(date) {
      return this.changeDayTo((this.start_of_week - 1) % 7, new Date(date.getFullYear(), date.getMonth() + 1, 0), 1)
    },
    isFirstDayOfWeek: function(date) {
      return date.getDay() == this.start_of_week
    },
    isLastDayOfWeek: function(date) {
      return date.getDay() == (this.start_of_week - 1) % 7
    },
    adjustDays: function(days) {
      var newDays = [];
      for (var i = 0; i < days.length; i++) {
        newDays[i] = days[(i + this.start_of_week) % 7]
      };
      return newDays
    }
  };
  $.fn.date_input = function(opts) {
    return this.each(function() {
      var date = new DateInput(this, opts);
      $(this).data('date', date);
    })
  };
  $.date_input = {
    initialize: function(opts) {
      $("input.date_picker").date_input(opts)
    }
  };

  window.Common.DateInput = DateInput;
  return DateInput;
});