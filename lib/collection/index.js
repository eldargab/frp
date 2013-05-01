var Stream = require('stream')
var mix = require('mix')

module.exports = Collection

function Collection(obj) {
  if (obj) return mix(obj, Collection.prototype)
}

Stream(Collection.prototype)

Collection.prototype.push = function(cmd) {
  switch(cmd.type) {
    case 'create':
      this._createItem(cmd)
      break
    case 'delete':
      this._removeItem(cmd)
      break
    default:
      this._pushToItem(cmd)
  }
}

Collection.prototype._createItem = function(cmd) {
  var item = this.createItem(cmd)
  ;(this.items || (this.items = {}))[cmd.uid] = item
  item.each(this.getOut())
}

Collection.prototype._removeItem = function(cmd) {
  var item = this.items && this.items[cmd.uid]
  if (!item) return
  delete this.items[cmd.uid]
  item.push(cmd)
}

Collection.prototype._pushToItem = function(cmd) {
  var item = cmd.uid && this.items && this.items[cmd.uid]
  if (item) {
    item.push(cmd)
  } else {
    this.unmatched(cmd)
  }
}

Collection.prototype.unmatched = function(cmd) {
}

Collection.prototype.getOut = function() {
  if (this._out) return this._out
  var self = this
  return this._out = function(cmd) {
    self.out(cmd)
  }
}
