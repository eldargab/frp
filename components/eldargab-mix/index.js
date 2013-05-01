
module.exports = function(t, src) {
  for (var i = 1; i < arguments.length; i++) {
    var s = arguments[i]
    for (var key in s) {
      t[key] = s[key]
    }
  }
  return t
}
