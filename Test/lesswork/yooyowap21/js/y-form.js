$(function(){
  //
  var $box = $('.y-box');
  var $mask = $('.y-mask');
  var $maskMain = $('.y-mask-main');

  if($box.length == 0){
    $box = $('<div class="y-box"></div>').appendTo('body');
  }
  if($mask.length == 0){
    $mask = $('<div class="y-mask" />').appendTo($box);
  }
  if($maskMain.length == 0){
    $maskMain = $('<div class="y-mask-main"/>').appendTo($mask);
  }

  window.select_y_form = function(){
    var name = $(this).attr('name'),
      width = $(this).width(),
      arrClass = $(this).attr('class').split(/ /);
    if(!name){
      name = 'select_' + (+new Date());
      $(this).attr('name', name);
    }
    var $selectOptionList = $(this).next('span.y-select'),
      $option = $(this).children('option');
    if($selectOptionList.length === 0){
      $selectOptionList = $('<span class="y-select ' + name + '" data-select-name="' + name + '"><span class="y-select-tips">(点击修改)</span></span>').insertAfter($(this));
    }

    for(var i = 0, len = arrClass.length; i < len; i++){
      if(arrClass[i] && arrClass[i] !== 'y-form'){
        $selectOptionList.addClass(arrClass[i]);
      }
    }
    //console.log($selectOptionList.width(), width);
    var $tips = $selectOptionList.find('.y-select-tips');
    if($selectOptionList.width() < width){
      $selectOptionList.css({
        'width': width + $tips.width()
      });
    }

    $option.each(function(){
      var value = $(this).val(),
        text = $(this).html(),
        selected = $(this).prop('selected'),
        $selectOption = $('<span class="y-select-option" style="display:' + (selected ? 'block' : 'none') + ';" data-value="' + value + '">' + text + '</span>');
      $selectOptionList.append($selectOption);
    });
  };

  //select
  $('select.y-form').each(select_y_form).hide();
  $('.y-select').on({
    'click': function(e){
      e.stopPropagation();		
      var name = $(this).data('select-name'),
        $list = $(this).children('.y-select-option'),
        winHeight = $(window).height();
      $maskMain.html('');
      var value = $('select[name="' + name + '"] ').val();
      $list.each(function(){
        var $item = $('<div class="y-mask-main-select' + (value == $(this).data('value') ? ' sel_color' : '') + '" data-name="' + name + '" data-value="' + $(this).data('value') + '">' + $(this).html() + '</div>');
        $maskMain.append($item);
      });
      $mask.css({
        height: winHeight
      }).show();
      $maskMain.css({
        marginTop:(winHeight - $maskMain.height()) / 2 * 0.9
      });

      $('.y-mask-main-select').on({
        'click': function(){
          $mask.hide();
          var //name = $(this).data('name'),
            value = $(this).data('value'),
            text = $(this).html();
          $('.y-select.' + name).children('.y-select-option').hide();
          $('.y-select.' + name).children('span[data-value="' + value + '"]').show();
          //$('select[name="' + name + '"] option[value="' + value + '"]').prop('selected', true).trigger('change blur');
          $('select[name="' + name + '"]').val(value).change();
        }
      });
    }
  });

  $mask.on({
    'click': function(e){
      if(e.target === $mask[0]) {
        $mask.hide();
      }
    }
  });

  $(window).on({
    'resize': function(){
      var winHeight = $(window).height(),
        docHeight = $(document).height(),
        htmlHeight = $('html').height(),
        bodyHeight = $('body').height(),
        height = Math.max(winHeight, winHeight, winHeight, winHeight);
      $mask.css({
        height: height
      });
      $maskMain.css({
        marginTop: (height - $maskMain.height()) / 2
      });
    }
  });

})