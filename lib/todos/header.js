var dom = require('dom')

module.exports = function header(el) {
  var input = dom('input', el)
  var commands = new Stream

  dom.on(input, 'change', function() {
    if (!input.value) return

    commands.push({
      crud: 'create',
      item: {
        text: input.value
      }
    })

    input.value = ''
  })

  return commands
}
