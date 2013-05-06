var mix = require('mix')

module.exports = Stream

function Stream(obj) {
  if (obj) return mix(obj, Stream.prototype)
}

Stream.prototype.use = function(fn) {
  var f = fn
  arguments[0] = this
  return f.apply(this, arguments)
}

Stream.prototype.push = Stream.prototype.out = function() {
  if (!this.listeners) return
  for (var i = 0; i < this.listeners.length; i++) {
    var l = this.listeners[i]
   l.push.apply(l, arguments)
  }
  return this
}

Stream.prototype.pipe = function(stream) {
  if (!stream.push) stream = new Func(stream)
  this.listeners = this.listeners || []
  this.listeners.push(stream)
  return stream
}

function Func(fn) {
  this.fn = fn
}

Func.prototype.push = function() {
  this.fn.apply(null, arguments)
}
