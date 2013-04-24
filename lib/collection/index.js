var Stream = require('stream')

module.exports = function collection(createItem, commands) {
  var out = new Stream
  var items = {}

  commands.each(function(cmd) {
    var uid = cmd.uid

    switch(cmd.crud) {
      case 'create':
        item = items[uid] = new Item(createItem, cmd.data)
        item.output && item.output.pipe(out)
        break
      case 'delete':
        item = items[uid]
        item.output && item.output.unpipe(out) // FIXME: Do we need this?
        delete items[uid]
        break
      default:
        item = items[uid]
        item && item.input.push(cmd)
    }
  })

  return out
}

function Item(create, data) {
  this.input = new Stream
  this.output = create(data, this.input)
}
