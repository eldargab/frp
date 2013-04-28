var domify = require('domify')

module.exports = dom

function dom (html, ctx) {
  return html[0] == '<'
    ? domify(html)[0]
    : (ctx || document).querySelector(html)
}

dom.on = function(el, type, fn, capture) {
  el.addEventListener(type, fn, capture || false)
}

dom.off = function(el, type, fn, capture) {
  el.removeEventListener(type, fn, capture || false)
}

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
  el.classList.add(cl)
}

dom.removeClass = function (cl, el) {
  el.classList.remove(cl)
}

dom.hasClass = function (cl, el) {
  return el.classList.contains(cl)
}

dom.toggle = function(cl, on, el) {
  if (on) {
    el.classList.add(cl)
  } else {
    el.classList.remove(cl)
  }
}

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
