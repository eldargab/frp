var Stream = require('stream')

module.exports = function merge() {
  var out = new Stream

  for (var i = 0; i < arguments.length; i++) {
    var input = arguments[i]
    if (Array.isArray(input)) {
      for (var j = 0; j < input.length; j++) {
        input[j].pipe(out)
      }
    } else {
      input.pipe(out)
    }
  }

  return out
}
