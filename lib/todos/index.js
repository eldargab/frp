var Stream = require('stream')
var merge = require('stream-merge')
var a2s = require('array-stream')
var View = require('view')
var Todos = require('./todo-list')
var Header = require('./header')

var start = new Stream

var storage = require('./storage')

var changes = merge(start, storage)

var stats = changes.map(function() {
  var items = storage.getItems()
  var count = items.length
  var completed = items.reduce(function(i, item) {
    item.completed && i++
    return i
  }, 0)

  return {
    count: count,
    completed: completed,
    left: count - completed
  }
})

var initialList = a2s(storage.getItems().map(function(item) {
  return {
    type: 'create',
    uid: item.uid,
    data: item
  }
}))

var ui = new View()
.registerFilter('left', function(left) {
  return left > 1 || left == 0
    ? '<strong>' + left + '</strong> items left'
    : '<strong>1</strong> item left'
})
.registerFilter('completed', function(completed) {
  return 'Clear completed (' + completed + ')'
})
.event('clearCompleted', function() {
  storage.clearCompleted()
})
.event('toggleAll', function(on) {
  storage.toggleAll(on)
})
.bind(document.body)

var header = Header(ui.views.header)

var todos = Todos(ui.views.todos)

start.pipe(initialList).pipe(todos)

storage.pipe(todos)

todos.pipe(storage)

header.pipe(storage)

stats.each(function(stat) {
  ui.set(stat)
})

start.push()
