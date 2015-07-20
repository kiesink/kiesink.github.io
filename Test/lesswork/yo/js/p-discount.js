//require(['jquery'], function($) {
  avalon.ready(function() {
    var data = {
      list:[
        {
          img: {
            src: '../images/imgtext-img.jpg'
          },
          text: {
            title: '这是标题',
            content: '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容123'
          },
          tips: '活动已结束',
          state: 'finish'
        },
        {
          img: {
            src: '../images/imgtext-img.jpg'
          },
          text: {
            title: '这是标题',
            content: '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容123'
          },
          tips: '活动已结束',
          state: 'finish'
        },
        {
          img: {
            src: '../images/imgtext-img.jpg'
          },
          text: {
            title: '这是标题',
            content: '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容123'
          },
          tips: '活动ing'
        },
        {
          img: {
            src: '../images/imgtext-img.jpg'
          },
          text: {
            title: '这是标题',
            content: '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容123'
          },
          tips: '活动ing'
        },
        {
          img: {
            src: '../images/imgtext-img.jpg'
          },
          text: {
            title: '这是标题',
            content: '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容123'
          },
          tips: '活动ing'
        },
        {
          img: {
            src: '../images/imgtext-img.jpg'
          },
          text: {
            title: '这是标题',
            content: '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容123'
          },
          tips: '活动ing'
        },
        {
          img: {
            src: '../images/imgtext-img.jpg'
          },
          text: {
            title: '这是标题',
            content: '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容123'
          },
          tips: '活动ing'
        }
      ]
    };

    var vm = avalon.define({
      $id: 'Ctrl',
      data: data
    });
    avalon.scan();
  });
//});
