var Actor = require('actor')
var mix = require('mix')

module.exports = function(src, fn) {
  var stream = new Actor

  if (typeof fn == 'function') {
    stream.push = function() {
      fn.apply(this, arguments)
    }
  } else {
    mix(stream, fn)
  }

  return src.pipe(stream)
}
