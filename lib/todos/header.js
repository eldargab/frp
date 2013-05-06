var dom = require('dom')
var Stream = require('stream')

module.exports = function header(el) {
  var input = dom('input', el)
  var commands = new Stream

  dom.on(input, 'change', function() {
    if (!input.value) return

    commands.push('create', {
      text: input.value
    })

    input.value = ''
  })

  return commands
}
