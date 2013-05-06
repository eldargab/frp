var Stream = require('stream')
var mix = require('mix')
var slice = Array.prototype.slice

module.exports = Actor

function Actor(obj) {
  if (obj) return mix(obj, Actor.prototype)
}

Stream(Actor.prototype)

Actor.prototype.push = function(type) {
  var handler = this[type]
  if (handler) {
    handler.apply(this, slice.call(arguments, 1))
  } else {
    this.unmatched.apply(this, arguments)
  }
  return this
}

Actor.prototype.unmatched = function(cmd) {
  throw new Error('Unknown command: ' + cmd)
}
