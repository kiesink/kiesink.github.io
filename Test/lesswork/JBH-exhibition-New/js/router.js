/**
 * Created by xyz on 2015/6/16.
 */
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