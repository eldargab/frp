var Stream = require('stream')

module.exports = function() {
  var stream = new Stream

  function init(fn) {
    if (fn) {
      stream.pipe(fn)
    } else {
      stream.push('init')
    }
  }

  init.pipe = function(s) {
    return stream.pipe(s)
  }

  return init
}
