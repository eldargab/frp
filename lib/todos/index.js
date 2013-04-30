var dom = require('dom')
var Stream = require('stream')
var merge = require('stream-merge')
var a2s = require('array-stream')
var Todos = require('./todo-list')
var Header = require('./header')

var start = new Stream

var storage = require('./storage')

var changes = merge(start, storage)

var todosCount = changes.map(function() {
  return storage.getItems().length
})

var completedCount = changes.map(function() {
  return storage.getItems().filter(function(item) {
    return item.completed
  }).length
})

var leftCount = changes.map(function() {
  return storage.getItems().filter(function(item) {
    return !item.completed
  }).length
})

var leftText = leftCount.map(function(count) {
  return count > 1 || count == 0
    ? '<strong>' + count + '</strong> items left'
    : '<strong>1</strong> item left'
})

dom.on(dom('#clear-completed'), 'click', function() {
  storage.clearCompleted()
})

completedCount.each(function(count) {
  var button = dom('#clear-completed')
  button.textContent = 'Clear completed (' + count + ')'
  dom.toggle('hidden', !count, button)
})

dom.on(dom('#toggle-all'), 'click', function(ev) {
  var toggle = ev.target
  storage.toggleAll(toggle.checked)
})

leftCount.each(function(count) {
  dom('#toggle-all').checked = !count
})

leftText.each(function(text) {
  dom('#todo-count').innerHTML = text
})

todosCount.each(function(count) {
  dom.toggle('hidden', !count, dom('#footer'))
  dom.toggle('hidden', !count, dom('#main'))
})

var todosView = Todos(dom('#todo-list'))

todosView.pipe(storage)

storage.pipe(todosView)

var initialList = storage.getItems().map(function(item) {
  return {
    type: 'create',
    uid: item.uid,
    data: item
  }
})

start.pipe(a2s(initialList)).pipe(todosView)

Header(dom('#header')).pipe(storage)

start.push()
