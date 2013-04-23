var dom = require('dom')
var clone = require('clone')

module.exports = function todo(el, data, commands) {
  var out = new Stream
  var label = dom('label', el)
  var toggle = dom('.toggle', el)
  var input = dom('.edit', el)

  function sync(data) {
    dom.toggle('completed', data.completed, el)
    toggle.checked = !!data.completed
    input.value = data.text
    label.textContent = data.text
  }

  function onchange() {
    exitEditMode()

    var item = clone(data)
    item.text = input.value
    item.completed = toggle.checked

    sync(item)

    out.push({
      crud: 'update',
      item: item
    })
  }

  function enterEditMode() {
    dom.toggle('editing', true, el)
    input.focus()
  }

  function exitEditMode() {
    dom.toggle('editing', false, el)
  }

  dom.on(label, 'dblclick', enterEditMode)
  dom.on(toggle, 'click', onchange)
  dom.on(input, 'keypress', function(ev) {
    if (ev.key == 'Enter') onchange()
  })
  dom.on(input, 'blur', exitEditMode)

  commands.consume(function(cmd) {
    sync(data = cmd.item)
  })

  sync(data)

  return out
}
