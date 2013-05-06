var Actor = require('actor')
var store = require('store')

var items = store('todos') || {}
var uid = Object.keys(items).reduce(function(curr, key) { return key}, 0)

var storage = module.exports = new Actor

storage.create = function(item) {
  item.uid = ++uid
  items[item.uid] = item
  store('todos', items)
  this.out('create', item.uid, item)
}

storage.update = function(uid, item) {
  items[uid] = item
  store('todos', items)
  this.out('update', uid, item)
}

storage.del = function(uid) {
  delete items[uid]
  store('todos', items)
  this.out('del', uid)
}

storage.getItems = function() {
  return Object.keys(items).map(function(key) {
    return items[key]
  })
}

storage.toggleAll = function(completed) {
  this.getItems().forEach(function(item) {
    if (item.completed == completed) return
    item.completed = completed
    this.update(item.uid, item)
  }, this)
}

storage.clearCompleted = function() {
  this.getItems().forEach(function(item) {
    if (!item.completed) return
    this.del(item.uid)
  }, this)
}
