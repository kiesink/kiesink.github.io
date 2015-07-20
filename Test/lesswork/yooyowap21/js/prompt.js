/**
 * Created by Administrator on 2015/4/1.
 */

define(['jquery'], function($){
    $.extend({
        promptModule:function(clickobj,showobj){
            $(clickobj).click(function(){
                if($(showobj).is(":visible")){
                    $(showobj).hide();
                }else{
                    $(showobj).show();
                }
            })
        }
    });


});