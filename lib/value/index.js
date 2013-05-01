
module.exports = function(el, val) {
  return arguments.length == 2
    ? set(el, val)
    : get(el)
}

function set(el, val) {
  isChecked(el)
    ? el.checked = !!val
    : el.value = val
}

function get(el) {
  return isChecked(el)
    ? el.checked
    : el.value
}

function isChecked(el) {
  var type = el.getAttribute('type')
  return type == 'checkbox' || type == 'radio'
}
