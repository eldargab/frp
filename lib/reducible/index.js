
module.exports = Reducible

function Reducible(reduce) {
  this.reduce = reduce
}

Reducible.prototype.map = function(fn) {
  var src = this
  return new Reducible(function(next, initial) {
    return src.reduce(function(state, val) {
      return next(state, fn(val))
    }, initial)
  })
}

Reducible.prototype.filter = function(fn) {
  var src = this
  return new Reducible(function(next, initial) {
    return src.reduce(function(state, val) {
      return fn(val) ? next(state, val) : state
    }, initial)
  })
}
