
module.exports = function(prefix) {
  var p = prefix + '_'
  var counter = 0

  return function() {
    return p + counter++
  }
}
