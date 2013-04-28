var Stream = require('stream')

module.exports = function(createItem) {
  return new Collection(createItem)
}

function Collection(createItem) {
  this.createItem = createItem
  this.items = {}
}

Stream(Collection.prototype)

Collection.prototype.push = function(cmd) {
  var self = this
  var uid = cmd.uid
  var item

  switch(cmd.crud) {
    case 'create':
      item = this.items[uid] = this.createItem(cmd)
      item.each(this.out())
      break
    case 'delete':
      item = this.items[uid]
      if (item) {
        delete this.items[uid]
        item.push(cmd)
      }
      break
    default:
      item = this.items[uid]
      item && item.push(cmd)
  }
}

Collection.prototype.out = function() {
  if (this._out) return this._out
  var self = this
  return this._out = function(cmd) {
    self._push(cmd)
  }
}
