var Actor = require('actor')
var mix = require('mix')

module.exports = Collection

function Collection(obj) {
  if (obj) return mix(obj, Collection.prototype)
}

Actor(Collection.prototype)

Collection.prototype.create = function(uid) {
  var item = this.createItem.apply(this, arguments)
  ;(this.items || (this.items = {}))[uid] = item
  item.pipe(this._getOut())
}

Collection.prototype.createItem = function(uid) {
  throw new Error('.createItem() is not implemented')
}

Collection.prototype.dispatch = function(uid, args) {
  var item = this.items && this.items[uid]
  if (!item) throw new Error('Item ' + uid + ' not defined')
  item.push.apply(item, args)
}

Collection.prototype.del = function(uid) {
  var item = this.items && this.items[uid]
  if (!item) throw new Error('Unknown item: ' + uid)
  delete this.items[uid]
  item.push('destroy')
}

Collection.prototype._getOut = function() {
  return this._out
    ? this._out
    : this._out = new Out(this)
}

function Out(stream) {
  this.stream = stream
}

Out.prototype.push = function() {
  this.stream.out.apply(this.stream, arguments)
}
