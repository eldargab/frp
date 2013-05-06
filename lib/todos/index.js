var Stream = require('stream')
var merge = require('stream-merge')
var map = require('stream-transform')
var View = require('view')
var Todos = require('./todo-list')
var Header = require('./header')

var storage = require('./storage')
var ui = new View(document.body)
var header = Header(ui.views.header)
var todos = Todos(ui.views.todos)
var init = require('init')()

var info = merge(init, storage).use(map, function() {
  var items = storage.getItems()
  var count = items.length

  var completed = items.reduce(function(i, item) {
    item.completed && i++
    return i
  }, 0)

  var left = count - completed

  var leftText = left > 1 || left == 0
    ? '<strong>' + left + '</strong> items left'
    : '<strong>1</strong> item left'

  var clearCompletedText = 'Clear completed (' + completed + ')'

  this.out({
    count: count,
    completed: completed,
    left: left,
    leftText: leftText,
    clearCompletedText: clearCompletedText
  })
})

init(function() {
  storage.getItems().forEach(function(item) {
    todos.create(item.uid, item)
  })
})

info.pipe(ui).pipe(storage)
header.pipe(storage).pipe(todos).pipe(storage)

init()
