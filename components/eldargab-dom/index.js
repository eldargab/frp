var event = require('event')
var classes = require('classes')
var domify = require('domify')
var css = require('css')

module.exports = dom

function dom (html, ctx) {
  return html[0] == '<'
    ? domify(html)[0]
    : (ctx || document).querySelector(html)
}

dom.on = event.bind

dom.off = event.unbind

dom.firstChild = function (el) {
  var child = el.firstChild
  while (child && child.nodeType != 1) {
    child = child.nextSibling
  }
  return child
}

dom.forEach = function (sel, ctx, fn, that) {
  if (typeof ctx == 'function') {
    that = fn
    fn = ctx
    ctx = document
  }
  var list = ctx.querySelectorAll(sel)
  for (var i = 0; i < list.length; i++) {
    fn.call(that, list[i])
  }
}

dom.map = function (sel, ctx, fn, that) {
  if (typeof ctx == 'function') {
    that = fn
    fn = ctx
    ctx = document
  }
  var list = ctx.querySelectorAll(sel)
  var ret = new Array(list.length)
  for (var i = 0; i < list.length; i++) {
    ret[i] = fn.call(that, list[i])
  }
  return ret
}


dom.addClass = function (cl, el) {
  el.classList
    ? el.classList.add(cl)
    : classes(el).add(cl)
}

dom.removeClass = function (cl, el) {
  el.classList
    ? el.classList.remove(cl)
    : classes(el).remove(cl)
}

dom.hasClass = function (cl, el) {
  return el.classList
    ? el.classList.contains(cl)
    : classes(el).has(cl)
}

dom.css = css

dom.remove = function (el) {
  var parent = el.parentNode
  parent && parent.removeChild(el)
}

dom.replace = function (n, old) {
  old.parentNode.replaceChild(n, old)
}

dom.insertBefore = function (n, ref) {
  ref.parentNode.insertBefore(n, ref)
}

dom.insertAfter = function (n, ref) {
  ref.parentNode.insertBefore(n, ref.nextSibling)
}
