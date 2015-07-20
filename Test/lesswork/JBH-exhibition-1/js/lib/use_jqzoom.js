/*使用jqzoom*/
$(function(){
	$('.jqzoom').jqzoom({
		zoomType: 'standard',
		lens:true,
		preloadImages: false,
		alwaysOn:false,
		zoomWidth: 350,
		zoomHeight: 316,//右边放大镜图片高度
		xOffset:0,
		yOffset:0,
		position:'right'
    });
});