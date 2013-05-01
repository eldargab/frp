var mix = require('mix')

module.exports = Stream

function Stream(obj) {
  if (obj) return mix(obj, Stream.prototype)
}

Stream.prototype.push = Stream.prototype.out = function(val) {
  if (!this.listeners) return
  for (var i = 0; i < this.listeners.length; i++) {
    this.listeners[i](val)
  }
}

Stream.prototype.each = function(fn) {
  this.listeners = this.listeners || []
  this.listeners.push(fn)
  return this
}

Stream.prototype.pipe = function(stream) {
  this.each(function(val) {
    stream.push(val)
  })
  return stream
}

Stream.prototype.reduce = function(fn, initial) {
  var state = initial

  this.each(function(val) {
    state = fn(state, val)
  })

  return this
}

Stream.prototype.map = function(fn) {
  var stream = new Stream

  this.each(function(val) {
    stream.push(fn(val))
  })

  return stream
}

Stream.prototype.filter = function(pred) {
  var stream = new Stream

  this.each(function(val) {
    pred(val) && stream.push(val)
  })

  return stream
}
