var Stream = require('stream')

var items = JSON.parse(localStorage.getItem('todos')) || {}
var uid = Object.keys(items).reduce(function(curr, key) { return key}, 0)

var storage = module.exports = new Stream

storage.push = function(cmd) {
  var item = cmd.data

  switch(cmd.type) {
    case 'create':
      item.uid = ++uid
      items[item.uid] = item
      cmd.uid = item.uid
      break
    case 'update':
      items[cmd.uid] = item
      break
    case 'delete':
      delete items[cmd.uid]
      break
  }

  localStorage.setItem('todos', JSON.stringify(items))

  this.out(cmd)
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
    this.push({
      type: 'update',
      uid: item.uid,
      data: item
    })
  }, this)
}

storage.clearCompleted = function() {
  this.getItems().forEach(function(item) {
    if (!item.completed) return
    this.push({
      type: 'delete',
      uid: item.uid
    })
  }, this)
}
