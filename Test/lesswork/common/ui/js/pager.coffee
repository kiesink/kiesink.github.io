# Created by xyz on 2015/5/5.
define [
  "../js/avalon"
  "text!../html/pager.html"
  "css!../css/pager.css"
], (avalon, template) ->
  widget = avalon.ui["pager"] = (el, data, vmodels) ->

    return vmodels

  widget.version = 0.1

  widget.defaults = {

  }

  return avalon