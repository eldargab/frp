var items = JSON.parse(localStorage.getItem('todos'))
var uid = Object.keys(items).reduce(function(curr, key) { return key}, 0)

module.exports = function storage(commands) {
  return commands.map(function(cmd) {
    var item = cmd.item

    switch(cmd.crud) {
      case 'create':
        item.uid = ++uid
        items[item.uid] = item
        break
      case 'update':
        items[item.uid] = item
        break
      case 'delete':
        delete items[item.uid]
        break
    }

    localStorage.setItem('todos', JSON.stringify(items))

    return cmd
  })
}

module.exports.getItems = function() {
  return Object.keys(items).map(function(key) {
    return items[key]
  })
}
