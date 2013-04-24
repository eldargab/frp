var uid = require('uid')('stream')

module.exports = Stream

function Stream() {
  this.uid = uid()
  this.listeners = []
  this.pipes = {}
}

Stream.prototype.push = function(val) {
  for (var i = 0; i < this.listeners.length; i++) {
    this.listeners[i](val)
  }
}

Stream.prototype.each = function(fn) {
  this.listeners.push(fn)
  return this
}

Stream.prototype.removeConsumer = function(fn) {
  var index = this.listeners.indexOf(fn)
  if (~index) this.listeners.splice(index, 1)
  return this
}

Stream.prototype.pipe = function(stream) {
  this.each(this.pipes[stream.uid] = function(val) {
    stream.push(val)
  })
  return stream
}

Stream.prototype.unpipe = function(stream) {
  var consumer = this.pipes[stream.uid]
  if (consumer) {
    delete this.pipes[stream.uid]
    this.removeConsumer(consumer)
  }
  return this
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
