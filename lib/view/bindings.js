var dom = require('dom')
var value = require('value')

exports.attr = Attr

function Attr(el, name) {
  this.el = el
  this.name = name
}

Attr.prototype.set = function(val) {
  this.el.setAttribute(val)
}

exports.css = Css

function Css(el, cl) {
  this.el = el
  this.cl = cl
}

Css.prototype.set = function(on) {
  dom.toggle(this.cl, on, this.el)
}

exports.event = Event

function Event(el, type) {
  this.el = el
  this.type = type
}

Event.prototype.set = function(listener) {
  dom.on(this.el, this.type, function(ev) {
    listener.call(ev, ev)
  })
}

exports.html = Html

function Html(el) {
  this.el = el
}

Html.prototype.set = function(html) {
  this.el.innerHTML = html
}

exports.text = Text

function Text(el) {
  this.el = el
}

Text.prototype.set = function(text) {
  this.el.textContent = text
}

exports.value = Value

function Value(el) {
  this.el = el
}

Value.prototype.set = function(val) {
  value(this.el, val)
}

exports._Multi = Multi

function Multi(list) {
  this.bindings = list
}

Multi.prototype.set = function(val) {
  for (var i = 0; i < this.bindings.length; i++) {
    this.bindings[i].set(val)
  }
}

Multi.prototype._add_ = function(binding) {
  this.bindings.push(binding)
  return this
}

exports._create = function(fn) {
  function Binding(el, param) {
    this.el = el
    this.param = param
  }

  Binding.prototype.fn = fn

  Binding.prototype.set = function(val) {
    this.fn(val, this.el, this.param)
  }

  return Binding
}
