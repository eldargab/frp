var Stream = require('stream')

module.exports = Collection

function Collection(obj) {
  if (obj) {
    for (var key in Collection.prototype) {
      obj[key] = Collection.prototype[key]
    }
    return obj
  }
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
  item.each(this.out())
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

Collection.prototype.out = function() {
  if (this._out) return this._out
  var self = this
  return this._out = function(cmd) {
    self._push(cmd)
  }
}
