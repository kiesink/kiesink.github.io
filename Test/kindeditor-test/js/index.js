/**
 * Created by xyz on 2015/6/2.
 */
// 自定义插件语言 #1
KindEditor.lang({
  test1: '插入HTML',
  example2: 'CLASS样式'
});
KindEditor.plugin('test1', function (K) {
  var editor = this, name = 'test1';
  editor.clickToolbar(name, function () {
    editor.insertHtml('<strong>测试文字123</strong>');
  });
});

KindEditor.plugin('test2', function (K) {
  var editor = this, name = 'test2';

  function click(value) {
    var cmd = editor.cmd;
    if (value === 'adv_strikethrough') {
      cmd.wrap('<span style="background-color:#e53333;text-decoration:line-through;"></span>');
    } else {
      cmd.wrap('<span class="' + value + '"></span>');
    }
    cmd.select();
    editor.hideMenu();
  }

  editor.clickToolbar(name, function () {
    var menu = editor.createMenu({
      name: name,
      width: 150
    });
    menu.addItem({
      title: '红底白字',
      click: function () {
        click('red');
      }
    });
    menu.addItem({
      title: '绿底白字',
      click: function () {
        click('green');
      }
    });
    menu.addItem({
      title: '黄底白字',
      click: function () {
        click('yellow');
      }
    });
    menu.addItem({
      title: '自定义删除线',
      click: function () {
        click('adv_strikethrough');
      }
    });
  });
});

KindEditor.ready(function (K) {
  K.create('#content1', {
    cssPath: ['editinfo.css'],
    items: ['source', 'removeformat', 'test1', 'test2', 'code']
  });
});