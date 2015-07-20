/*
 Created by Ths on 2015-03-30.
 */

(function() {
    define(['jquery'], function($) {
        return (function(root, factory) {
            var configs;
            configs = {
                debug: 0
            };
            if (typeof root.Acme !== 'object' || !root.Acme._state) {
                return factory(root, configs);
            }
        })(this, function(root, configs) {
            var $document, $window, Classes, Configs, JQ, Methods, Widgets, acme, alt, elmtMap, hasOwnProp, isArray, isBoolean, isDate, isError, isFunction, isNull, isNumber, isObject, isRegExp, isString, isUndefined, log, reSplit, reTrim, reTrimAll, slice, splice, time, timeEnd, times, win, xyz, _Acme;
            reSplit = /[^, ]+/g;
            reTrim = /^\s*|\s*$/g;
            reTrimAll = /^\s*|\s{2,}|\s*$/g;
            hasOwnProp = Object.prototype.hasOwnProperty;
            slice = Array.prototype.slice;
            splice = Array.prototype.splice;
            xyz = {
                breaker: function() {},
                each: function(list, handle, reverse) {
                    var len, offset, result, start, _results;
                    if (list.length !== +list.length) {
                        list = [list];
                    }
                    len = list.length;
                    start = offset = -1;
                    if (reverse) {
                        start = len;
                    } else {
                        offset = 1;
                    }
                    _results = [];
                    while (len--) {
                        result = handle(list[start += offset], start);
                        if (result === xyz.breaker) {
                            break;
                        }
                        _results.push(result);
                    }
                    return _results;
                },
                "in": function(obj, handle) {
                    var k, result, _results;
                    if (handle) {
                        _results = [];
                        for (k in obj) {
                            if (hasOwnProp.call(obj, k)) {
                                result = handle(k, obj[k]);
                                if (result === xyz.breaker) {
                                    break;
                                }
                                _results.push(result);
                            } else {
                                _results.push(void 0);
                            }
                        }
                        return _results;
                    }
                },
                mix: function(obj) {
                    xyz.each(arguments, function(item) {
                        return xyz["in"](item, function(k, value) {
                            return obj[k] = value;
                        });
                    });
                    return obj;
                },
                trim: function(str, replaceInside) {
                    if (replaceInside) {
                        return str.replace(reTrimAll, '');
                    } else {
                        return str.replace(reTrim, '');
                    }
                },
                traverse: function(obj, key, handle) {
                    var children;
                    children = obj[key];
                    return xyz.each(children, function(child) {
                        if (isFunction(handle)) {
                            handle(child);
                        }
                        return xyz.traverse(child, key, handle);
                    });
                },
                deset: function(obj, key, value) {
                    if (typeof obj !== 'object') {
                        throw new Error(obj + ' 必须是object.');
                    }
                    if (!hasOwnProp.call(obj, key)) {
                        return obj[key] = value;
                    }
                },
                disguise: function(cstr) {
                    var F, args, f;
                    args = slice.call(arguments, 1);
                    if (!isFunction(cstr)) {
                        cstr = new Function;
                    }
                    F = (function() {
                        function F() {
                            cstr.apply(this, args);
                        }

                        return F;

                    })();
                    F.prototype = cstr.prototype;
                    f = new F;
                    f.constructor = cstr;
                    return f;
                }
            };
            Configs = xyz.mix({}, configs, {
                _state: 2
            });
            Widgets = {};
            Classes = {};
            time = function() {
                if (Configs.debug) {
                    return console.time(arguments[0]);
                }
            };
            timeEnd = function() {
                if (Configs.debug) {
                    return console.timeEnd(arguments[0]);
                }
            };
            times = (function() {
                var count;
                count = 0;
                return function(name, fn) {
                    var ths;
                    if (!Configs.debug) {
                        return;
                    }
                    ths = this;
                    if (!fn) {
                        fn = name;
                        name = ++count;
                    }
                    console.time(name);
                    fn.call(ths);
                    return console.timeEnd(name);
                };
            })();
            time('time');
            win = function(key, value) {
                if (!Configs.debug) {
                    return;
                }
                if (!value) {
                    value = key;
                    key = 'q';
                }
                return root[key] = value;
            };
            alt = function(msg) {
                return alert(msg);
            };
            log = function() {
                if (Configs.debug) {
                    return console.log.apply(console, arguments);
                }
            };
            (function() {
                var isFn, toString;
                toString = Object.prototype.toString;
                isFn = function(name) {
                    return function(obj) {
                        var type;
                        if ((type = typeof obj) !== 'object') {
                            return type === name.toLowerCase();
                        }
                        return toString.call(obj) === '[object ' + name + ']';
                    };
                };
                return 'Boolean Number String Function Array Date RegExp Object Error Null Undefined'.replace(reSplit, function(name) {
                    return xyz['is' + name] = isFn(name);
                });
            })();
            isBoolean = xyz.isBoolean;
            isNumber = xyz.isNumber;
            isString = xyz.isString;
            isFunction = xyz.isFunction;
            isArray = xyz.isArray;
            isDate = xyz.isDate;
            isRegExp = xyz.isRegExp;
            isObject = xyz.isObject;
            isError = xyz.isError;
            isNull = xyz.isNull;
            isUndefined = xyz.isUndefined;
            $window = $(root);
            $document = $(document);
            Methods = {
                addEvent: function(name, selector, $list, event, handle) {
                    event = event + '.' + name;
                    if (isString(selector)) {
                        $document.delegate(selector, event, handle);
                    }
                    // 某些事件会被这个拦截，先注释掉 5-18
                    //          if ($list && $list.on) {
                    //            return $list.on(event, function(e) {
                    //              //e.stopPropagation();
                    //              return handle.apply(this, arguments);
                    //            });
                    //          }
                },
                removeEvent: function(name, selector, $list, event) {
                    event = event + '.' + name;
                    if (isString(selector)) {
                        $document.undelegate(event);
                    }
                    //          if ($list && $list.on) {
                    //            return $list.off(event);
                    //          }
                },
                addMeEvent: function(name, event, handle) {
                    var $list, selector;
                    selector = '[me-' + name + ']';
                    $list = $(elmtMap[name].list);
                    return Methods.addEvent(name, selector, $list, event, handle);
                },
                removeMeEvent: function(name, event) {
                    var $list, selector;
                    selector = '[me-' + name + ']';
                    $list = $(elmtMap[name].list);
                    return Methods.removeEvent(name, selector, $list, event);
                }
            };
            acme = {
                defaults: {
                    groupName: '_defaultsgroup'
                },
                getList: function(name) {
                    return $('[me-' + name + ']');
                },
                getValue: function($el, name) {
                    return $el.attr('me-' + name);
                },
                extract: function(key) {
                    var ebj, match;
                    match = key.match(/^(#?)([^.#]+)(\.?)([^#]*)(#?)$/);
                    return ebj = {
                        target: match[1] ? 'from' : 'to',
                        name: match[2],
                        grouping: match[3] ? true : false,
                        groupName: match[3] ? match[4] : acme.defaults.groupName,
                        cmd: match[5] ? true : false
                    };
                }
            };
            JQ = (function() {
                function JQ(elmt) {
                    return $(elmt);
                }

                return JQ;

            })();
            elmtMap = {};
            setTimeout(function() {
                return xyz.traverse(document, 'childNodes', function(elmt) {
                    var attrs;
                    if (elmt.nodeType !== 1) {
                        return;
                    }
                    attrs = elmt.attributes;
                    return xyz.each(attrs, function(attr) {
                        var ebj, key, match, obj;
                        match = attr.name.match(/^me-(.*)/);
                        if (match) {
                            key = match[1];
                            ebj = acme.extract(attr.value);
                            if (!elmtMap[key]) {
                                elmtMap[key] = {
                                    list: [],
                                    fromList: [],
                                    toList: [],
                                    map: {}
                                };
                            }
                            obj = elmtMap[key];
                            obj.list.push(elmt);
                            if (ebj.cmd) {
                                return xyz.breaker;
                            }
                            obj[ebj.target + 'List'].push(elmt);
                            xyz.deset(obj.map, ebj.groupName, {});
                            xyz.deset(obj.map[ebj.groupName], ebj.name, {});
                            return obj.map[ebj.groupName][ebj.name][ebj.target] = JQ(elmt);
                        }
                    });
                });
            });

            /* 锚点 */
            Widgets.anchor = function(name) {
                var config, map, scroll, scrollList;
                config = {
                    top: 0
                };
                scrollList = [];
                if (!hasOwnProp.call(elmtMap, name)) {
                    return;
                }
                map = elmtMap[name].map;
                xyz["in"](map, function(key, value) {
                    return xyz["in"](value, function(k, v) {
                        v.top = $(v.to[0]).offset().top;
                        return scrollList.push(v);
                    });
                });
                scrollList.sort(function(a, b) {
                    if (a.top && b.top) {
                        return a.top - b.top;
                    } else {
                        return 0;
                    }
                });
                scroll = function() {
                    var obj, scrollTop;
                    scrollTop = $document.scrollTop();
                    obj = null;
                    xyz.each(scrollList, function(item) {
                        obj = item;
                        if (obj.top && scrollTop + config.top >= obj.top) {
                            return xyz.breaker;
                        }
                        return obj = scrollList[0];
                    }, true);
                    return xyz["in"](map, function(key, value) {
                        return xyz["in"](value, function(k, v) {
                            v.from.removeClass('on');
                            if (obj) {
                                return obj.from.addClass('on');
                            }
                        });
                    });
                };
                setTimeout(scroll, 2);
                Methods.addEvent(name, null, $window, 'scroll', scroll);
                Methods.addMeEvent(name, 'click', function(e) {
                    var $this, ebj, key;
                    $this = $(this);
                    key = acme.getValue($this, name);
                    ebj = acme.extract(key);
                    if (ebj.target === 'from') {
                        xyz["in"](map, function(key, value) {
                            return xyz["in"](value, function(k, v) {
                                return v.from.removeClass('on');
                            });
                        });
                        $this.addClass('on');
                        Methods.removeEvent(name, null, $window, 'scroll');
                        $('html,body').stop(true).animate({
                            scrollTop: $(map[ebj.groupName][ebj.name].to[0]).offset().top - config.top
                        }, 'slow', function() {
                            return Methods.addEvent(name, null, $window, 'scroll', scroll);
                        });
                        return false;
                    }
                });
                return config;
            };

            /* 折叠菜单 */
            Widgets.collapse = function(name) {
                var config, map;
                config = {};
                if (!hasOwnProp.call(elmtMap, name)) {
                    return;
                }
                map = elmtMap[name].map;
                xyz["in"](map, function(key, value) {
                    return xyz["in"](value, function(k, v) {
                        return v.to[v.from && v.from.hasClass('on') ? 'show' : 'hide']();
                    });
                });
                Methods.addMeEvent(name, 'click', function(e) {
                    var $this, ebj, isOn, key;
                    $this = $(this);
                    key = acme.getValue($this, name);
                    ebj = acme.extract(key);
                    if (ebj.cmd) {
                        if (ebj.grouping) {
                            xyz["in"](map[ebj.groupName], function(key, value) {
                                value.from.removeClass('on');
                                return value.to.hide();
                            });
                        } else {
                            xyz["in"](map, function(key, value) {
                                return xyz["in"](value, function(k, v) {
                                    v.from.removeClass('on');
                                    return v.to.hide();
                                });
                            });
                        }
                        e.stopPropagation();
                        return false;
                    }
                    if (ebj.target === 'from') {
                        isOn = $this.hasClass('on');
                        xyz["in"](map[ebj.groupName], function(key, value) {
                            value.from.removeClass('on');
                            return value.to.hide();
                        });
                        if (isOn) {
                            $this.removeClass('on');
                            map[ebj.groupName][ebj.name].to.hide();
                        } else {
                            $this.addClass('on');
                            map[ebj.groupName][ebj.name].to.show();
                        }
                        return false;
                    }
                });
                return config;
            };

            /* 选项�?*/
            Widgets.tab = function(name) {
                var config, map;
                config = {};
                if (!hasOwnProp.call(elmtMap, name)) {
                    return;
                }
                map = elmtMap[name].map;
                xyz["in"](map, function(key, value) {
                    return xyz["in"](value, function(k, v) {
                        return v.to[v.from.hasClass('on') ? 'show' : 'hide']();
                    });
                });
                Methods.addMeEvent(name, 'click', function() {
                    var $this, ebj, key;
                    $this = $(this);
                    key = acme.getValue($this, name);
                    ebj = acme.extract(key);
                    if (ebj.target === 'from') {
                        xyz["in"](map[ebj.groupName], function(key, value) {
                            value.from.removeClass('on');
                            return value.to.hide();
                        });
                        $this.addClass('on');
                        map[ebj.groupName][ebj.name].to.show();
                        return false;
                    }
                });
                return config;
            };

            /* 浮动�?*/
            Widgets.fixbar = function(name) {
                var $list, config, doFixed, map, setCss;
                config = {};
                $list = acme.getList(name);
                map = {};
                xyz.each($list, function(item, i) {
                    var $item, key;
                    $item = $list.eq(i);
                    key = acme.getValue($item, name);
                    map[key] = {
                        $el: $item,
                        isSetCss: false,
                        offset: $item.offset()
                    };
                    return config[key] = {
                        top: 0,
                        left: 0
                    };
                });
                setCss = function(key) {
                    var $item, $parent;
                    if (!map[key].isSetCss) {
                        $item = map[key].$el;
                        $item.css({
                            width: $item.width(),
                            height: $item.height(),
                            top: parseFloat(config[key].top)
                        });
                        $parent = $item.parent();
                        return $parent.css({
                            height: $parent.height()
                        });
                    }
                };
                doFixed = function() {
                    var scrollTop;
                    scrollTop = $document.scrollTop();
                    return xyz["in"](map, function(key, value) {
                        var $item;
                        $item = map[key].$el;
                        if (scrollTop > map[key].offset.top - config[key].top) {
                            setCss(key);
                            return $item.addClass('me-js-fixed');
                        } else {
                            return $item.removeClass('me-js-fixed');
                        }
                    });
                };
                setTimeout(doFixed, 2);
                Methods.addEvent(name, null, $window, 'scroll', doFixed);
                return config;
            };
            Widgets.mask = function(name) {
                var $mask, config, map;
                config = {
                    hide: function() {
                        return $mask.hide();
                    }
                };
                if (!hasOwnProp.call(elmtMap, name)) {
                    return;
                }
                map = elmtMap[name].map;
                $mask = $('<div class="js-mask"><b class="js-mask-before"></b></div>').hide().appendTo('body');
                xyz["in"](map, function(key, value) {
                    return xyz["in"](value, function(k, v) {
                        $mask.append(v.to[0]);
                        return v.to.addClass('js-hide js-inline-block');
                    });
                });
                Methods.addEvent(name, '.js-mask', $mask, 'click', function(e) {
                    var $this;
                    $this = $(this);
                    if (e.target === $this[0]) {
                        return xyz["in"](map, function(key, value) {
                            return xyz["in"](value, function(k, v) {
                                $mask.hide();
                                return v.to.addClass('js-hide');
                            });
                        });
                    }
                });
                Methods.addMeEvent(name, 'click', function(e) {
                    var $this, ebj, key;
                    $this = $(this);
                    key = acme.getValue($this, name);
                    ebj = acme.extract(key);
                    if (ebj.cmd && ebj.name === 'hide') {
                        $mask.hide();
                        return false;
                    }
                    if (ebj.target === 'from') {
                        xyz["in"](map, function(key, value) {
                            return xyz["in"](value, function(k, v) {
                                return v.to.addClass('js-hide');
                            });
                        });
                        map[ebj.groupName][ebj.name].to.removeClass('js-hide');
                        $mask.show();
                        return false;
                    }
                });
                return config;
            };

            /* 简单动�?*/
            Configs.animate = (function(name) {
                var $list, config, extract;
                config = {
                    click: 'click',
                    hover: 'mouseenter'
                };
                $list = acme.getList(name);
                $list.addClass('anm');
                extract = function(attr, handle) {
                    var list, results;
                    results = [];
                    list = attr.split(/;/);
                    xyz.each(list, function(item, i) {
                        var arr, key, value;
                        if (/\S+/.test(item)) {
                            arr = item.split(/:/);
                            key = arr[0];
                            value = arr[1];
                            if (isUndefined(value)) {
                                value = key;
                                key = 'click';
                            }
                            return results[i] = handle(xyz.trim(key), xyz.trim(value));
                        }
                    });
                    return results;
                };
                xyz.each($list, function(item, i) {
                    var $item, attr;
                    $item = $list.eq(i);
                    attr = acme.getValue($item, name);
                    return extract(attr, function(event, classes) {
                        classes = classes.replace(/\,/, ' ');
                        if (config[event]) {
                            event = config[event];
                        }
                        return $item.on(event, (function($el, classes) {
                            return function() {
                                return $el.addClass(classes).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                                    return $el.removeClass(classes);
                                });
                            };
                        })($item, classes));
                    });
                });
                return config;
            })('animate');

            /* 表单验证 */
            Configs.form = (function() {
                var config;
                config = {};
                return config;
            })();

            /* 按钮（给按钮加个点击效果，让用户知道点击了） */
            Configs.btn = (function() {
                var config;
                config = {
                    using: false,
                    skip: []
                };
                $document.delegate('a', {
                    'mousedown.hyperlink': function(el) {
                        //如果是日期控件里面的a标签，不添加点击的a的特殊处理 add by haven
                        var $target = $(el.currentTarget);
                        if($target.parents(".datepicker-wraper").length > 0){
                            return;
                        }
                        var $this;
                        $this = $(this);
                        if (!$this.hasClass('js-hyperlink') && !$this.hasClass('btn')) {
                            return $this.addClass('anm anm-time300 ac-feedback').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                                return $this.removeClass('anm anm-time300 ac-feedback');
                            });
                        }
                    }
                });
                return config;
            })();

            /* 缩略图效�?*/
            Widgets.imganchor = function(name) {
                var config, map;
                config = {};
                if (!hasOwnProp.call(elmtMap, name)) {
                    return;
                }
                map = elmtMap[name].map;
                Methods.addEvent(name, '.imglist .btn-prev, .imglist .btn-next', null, 'click', function(e) {
                    var $imglist, $li, $list, $this, $ul, imgWidth, imgsWidth, isNext, listWidth, marginLeft, offsetLeft;
                    $this = $(this);
                    $imglist = $this.closest('.imglist');
                    isNext = $this.hasClass('btn-next');
                    $list = $imglist.find('.list');
                    $ul = $list.find('ul');
                    $li = $ul.find('li');
                    imgWidth = $li.outerWidth();
                    imgsWidth = imgWidth * $li.length;
                    marginLeft = parseInt($ul.css('marginLeft'));
                    offsetLeft = (isNext ? '-' : '+') + '=' + imgWidth + 'px';
                    if (isNext) {
                        listWidth = $list.width();
                        if (marginLeft - imgWidth < listWidth - imgsWidth) {
                            offsetLeft = listWidth - imgsWidth + imgWidth - $li.width() + 'px';
                        }
                    } else if (marginLeft + imgWidth > 0) {
                        offsetLeft = '0px';
                    }
                    if (!$ul.is(':animated')) {
                        return $ul.animate({
                            marginLeft: offsetLeft
                        });
                    }
                });
                Methods.addMeEvent(name, 'click', function(e) {
                    var $this, ebj, key, src;
                    $this = $(this);
                    key = acme.getValue($this, name);
                    ebj = acme.extract(key);
                    if (ebj.target === 'from') {
                        src = $this.data('src');
                        if (!src) {
                            src = $this.find('img').data('src');
                        }
                        map[ebj.groupName][ebj.name].to.attr('src', src);
                        return false;
                    }
                });
                return config;
            };
            Classes.DatePicker = (function() {
                var DatePicker;
                DatePicker = (function() {
                    function DatePicker() {
                        this.init.apply(this, arguments);
                    }

                    return DatePicker;

                })();
                DatePicker.prototype = {
                    init: function(datepicker) {
                        var date, day, weekday;
                        date = new Date;
                        if (datepicker instanceof DatePicker) {
                            day = this.getDays.call(datepicker);
                            if (datepicker.day > day) {
                                datepicker.day = day;
                            }
                            date.setFullYear(datepicker.year, datepicker.month - 1, datepicker.day);
                        }
                        this.year = date.getFullYear();
                        this.month = date.getMonth() + 1;
                        this.day = date.getDate();
                        weekday = date.getDay();
                        this.hours = date.getHours();
                        this.minutes = date.getMinutes();
                        this.seconds = date.getSeconds();
                        this.milliseconds = date.getMilliseconds();
                        this.weekday = weekday ? weekday : 7;
                        this.days = this.getDays();
                        return this;
                    },
                    prevMonth: function() {
                        this.month -= 1;
                        return xyz.mix(this, new DatePicker(this));
                    },
                    nextMonth: function() {
                        this.month += 1;
                        return xyz.mix(this, new DatePicker(this));
                    },
                    nowMonth: function(){
                        this.month = new Date().getMonth() + 1;
                        return xyz.mix(this, new DatePicker(this));
                    },
                    getDays: function() {
                        if (/^(1|3|5|7|8|10|12)$/.test(this.month)) {
                            return 31;
                        }
                        if (/^(4|6|9|11)$/.test(this.month)) {
                            return 30;
                        }
                        if (this.year % 400 === 0 || (this.year % 100 !== 0 && this.year % 4 === 0)) {
                            return 29;
                        } else {
                            return 28;
                        }
                    },
                    getFullDate: function(datepicker) {
                        if (datepicker == null) {
                            datepicker = this;
                        }
                        return datepicker.year + ('0' + datepicker.month).substring(-2) + ('0' + datepicker.day).substring(-2);
                    },
                    format: function(sFormat, datepicker) {
                        var map;
                        if (sFormat == null) {
                            sFormat = 'yyyy-MM-dd';
                        }
                        if (datepicker == null) {
                            datepicker = this;
                        }
                        map = {
                            'y+': datepicker.year || '0000',
                            'M+': datepicker.month || '00',
                            'd+': datepicker.day || '00',
                            'h+': datepicker.hours || '00',
                            'm+': datepicker.minutes || '00',
                            's+': datepicker.seconds || '00',
                            'S+': datepicker.milliseconds || '000',
                            'w': '一二三四五六日'.charAt((datepicker.weekday || 1) - 1)
                        };
                        xyz["in"](map, function(key, value) {
                            var reg;
                            reg = new RegExp(key, 'g');
                            return sFormat = sFormat.replace(reg, function(str) {
                                var olen, slen;
                                olen = map[key].toString().length;
                                slen = str.length;
                                if (key === 'y+' && olen > slen) {
                                    return map[key].toString().substring(olen - slen);
                                }
                                if (olen >= slen) {
                                    return map[key];
                                } else {
                                    return 0..toFixed(slen - olen).substring(2) + map[key];
                                }
                            });
                        });
                        return sFormat;
                    },
                    addDay: function(days) {
                        var day, lastMonth, ths;
                        if (days == null) {
                            days = 1;
                        }
                        ths = this;
                        this.day += days;
                        this.setDate(this);
                        if (this.day > this.days) {
                            this.day -= this.days;
                            this.nextMonth();
                        }
                        if (this.day < 1) {
                            day = this.day;
                            lastMonth = (new DatePicker(ths)).prevMonth();
                            this.day = lastMonth.days + day;
                            this.prevMonth();
                        }
                        return this;
                    },
                    setYear: function(year) {
                        if (year) {
                            this.year = year;
                        }
                        return this.setDate();
                    },
                    setMonth: function(month) {
                        if (month) {
                            this.month = month;
                        }
                        return this.setDate();
                    },
                    setDay: function(day) {
                        if (day) {
                            this.day = day;
                        }
                        return this.setDate();
                    },
                    setDate: function(datepicker) {
                        if (datepicker == null) {
                            datepicker = this;
                        }
                        return this.init(datepicker);
                    },
                    //保存初始化传进来的date
                    setInitDate:function(date){
                        if (date) {
                            this.initDate = date;
                        }
                        //return this.setInitDate();
                    },
                    getInitDate:function(){
                        return this.initDate;
                    },
                    getFirstWeekday: function() {
                        return (this.weekday - this.day % 7 + 8) % 7;
                    },
                    //获取指定日期所在的一周日期列表，dateObj指定的日期对象 add by haven
                    getWeekDaysList: function(startWeekday, dateObj) {
                        var daysList,
                            weekDaysList,
                            year,
                            month,
                            day,
                            pos,
                            beginPos,
                            endPos;
                        year = dateObj.getFullYear();
                        month = dateObj.getMonth() + 1;
                        day = dateObj.getDate();
                        daysList = this.getDaysList(startWeekday);
                        weekDaysList = new Array(7);
                        for (var i = 0; i < daysList.length; i++) {
                            if(year === daysList[i].year && month === daysList[i].month && day === daysList[i].day){
                                pos = Math.ceil((i+1)/7);
                                //从0开始
                                beginPos = (pos-1)*7;
                                endPos = pos*7-1;
                            }
                        }
                        weekDaysList = daysList.slice(beginPos,endPos+1);
                        return weekDaysList;
                    },
                    getDaysList: function(startWeekday) {
                        var daysList, firstWeekday, lastMonth, lastMonthBeginDay, nextMonth, nextMonthBeginDay, ths;
                        if (startWeekday == null) {
                            startWeekday = 0;
                        }
                        ths = this;
                        daysList = new Array(ths.days);
                        xyz.each(daysList, function(item, i) {
                            return daysList[i] = {
                                year: ths.year,
                                month: ths.month,
                                day: i + 1
                            };
                        });
                        lastMonth = new DatePicker(ths).prevMonth();
                        nextMonth = new DatePicker(ths).nextMonth();
                        lastMonthBeginDay = lastMonth.days;
                        nextMonthBeginDay = 1;
                        firstWeekday = this.getFirstWeekday();
                        firstWeekday = (firstWeekday - startWeekday + 7) % 7;
                        while (firstWeekday--) {
                            daysList.unshift({
                                year: lastMonth.year,
                                month: lastMonth.month,
                                day: lastMonthBeginDay--
                            });
                        }
                        while (daysList.length % 7 !== 0) {
                            daysList.push({
                                year: nextMonth.year,
                                month: nextMonth.month,
                                day: nextMonthBeginDay++
                            });
                        }
                        return daysList;
                    }
                };
                return DatePicker;
            })();
            Configs.config = (function() {
                var mixKeys;
                mixKeys = function(obj) {
                    if (obj == null) {
                        obj = {};
                    }
                    xyz.each(arguments, function(item) {
                        return xyz["in"](item, function(k, value) {
                            if (isObject(value) || isArray(value) || !hasOwnProp.call(obj, k)) {
                                return obj[k] = value;
                            } else {
                                return mixKeys(obj[k], value);
                            }
                        });
                    });
                    return obj;
                };
                return function(config) {
                    return Configs = mixKeys(Configs, config);
                };
            })();
            setTimeout(function() {
                return xyz["in"](elmtMap, function(key, value) {
                    if (hasOwnProp.call(Widgets, key) && isFunction(Widgets[key])) {
                        return Configs[key] = xyz.mix(Widgets[key](key), Configs[key]);
                    }
                });
            }, 1);
            Configs = xyz.mix(Configs, Classes);
            if (root.Acme) {
                _Acme = Configs._Acme = root.Acme;
            }
            root.Acme = Configs;
            Configs.noConflict = function() {
                root.Acme = _Acme;
                return Configs;
            };
            timeEnd('time');
            return Configs;
        });
    });

}).call(this);