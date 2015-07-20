if(typeof Common !== 'object' ){ Common = {}; }
Common.Loading = function(){ this.init.apply(this, arguments); };
Common.Loading.prototype = {
	 init: function(){
			 if($('.load-mask').length < 1) {
					 var $el = $('' +
									 '<div class="load-mask" style="display: none;position: fixed;top: 0;left: 0;width: 100%;height: 100%;' +
									 'background-color: rgba(0, 0, 0, .6);text-align: center;vertical-align: middle;z-index:20000;">' +
									 '<span style="display: inline-block;width: 0;height: 100%;vertical-align: middle;"></span>' +
									 '<img style="display: inline-block;width: initial;vertical-align: middle;" src="http://img.yooyoimg.com/p/common/img/loading1.gif" alt=""/>' +
									 '</div>' +
									 '');
					 $('body').append($el);
			 }
	 },
	 show: function(){
			 $('.load-mask').show();
	 },
	 hide: function(){
			 $('.load-mask').hide();
	 }
};
