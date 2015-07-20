/**
 * Created by xyz on 2015/3/12.
 * 20150317~
 */
define(['jquery'], function($){

  $(function(){

    //遮罩层
    $('.input-select-mask').on({
      click: function(e){
        $(this).hide();
        return false;
      }
    });

    //
    var $mask = $('<div class="input-select-mask" />').appendTo('body'),
      $maskMain = $('<div class="input-select-mask-main"/>').appendTo($mask);

    //select
    $('select.input-select').each(function(){
      var name = $(this).attr('name'),
        width = $(this).width();
      if(!name){
        name = 'select_' + (+new Date());
        $(this).attr('name', name);
      }
      var $selectOptionList = $(this).next('span.input-select'),
        $option = $(this).children('option');
      if($selectOptionList.length === 0){
        $selectOptionList = $('<span class="input-select ' + name + '" data-select-name="' + name + '"></span>').insertBefore($(this));
      }
      $selectOptionList.css({
        'width': width
      });
      $option.each(function(){
        var value = $(this).val(),
          text = $(this).html(),
          selected = $(this).prop('selected'),
          $selectOption = $('<span class="input-select-option" style="display:' + (selected ? 'block' : 'none') + ';" data-value="' + value + '">' + text + '</span>');
        $selectOptionList.append($selectOption);
      });
    }).hide();
    $('span.input-select').on({
      'click': function(){
        var name = $(this).data('select-name'),
          $list = $(this).children('.input-select-option'),
          winHeight = $(window).height();
        $maskMain.html('');
        $list.each(function(){
          var $item = $('<div class="input-select-mask-main-select" data-name="' + name + '" data-value="' + $(this).data('value') + '">' + $(this).html() + '</div>');
          $maskMain.append($item);
        });
        $mask.css({
          height: winHeight
        }).show();
        $maskMain.css({
          marginTop:(winHeight - $maskMain.height()) / 2 * 0.9
        });

        $('.input-select-mask-main-select').on({
          'click': function(){
            $mask.hide();
            //var name = $(this).data('name');
            var value = $(this).data('value');
            var text = $(this).html();
            var index = $(this).index();
            var $select =  $('.input-select.' + name);
            var $optionList = $select.children('span.input-select-option');
            $optionList.hide();
            //var $selected = $('.input-select.' + name).children('span[data-value="' + value + '"]');
            //if($selected.length === 1){
            //  $selected.show();
            //}
            //else{
            $optionList.eq(index).show();
            //}
            //$('select[name="' + name + '"] option[value="' + value + '"]').prop('selected', true);
            $('select[name="' + name + '"] option').eq(index).prop('selected', true);
          }
        });
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

  });

});