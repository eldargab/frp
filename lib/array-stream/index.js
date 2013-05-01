var Stream = require('stream')

module.exports = function(array) {
  return new ArrayStream(array)
}

function ArrayStream(array) {
  this.array = array
}

Stream(ArrayStream.prototype)

ArrayStream.prototype.push = function() {
  for (var i = 0; i < this.array.length; i++) {
    this.out(this.array[i])
  }
}
