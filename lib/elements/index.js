var Stream = require('stream')

module.exports = function(el, tpl) {
  return new Elements(el, tpl)
}

function Elements(el, tpl) {
  this.el = el
  this.tpl = tpl
  this.els = {}
}

Stream(Elements.prototype)

Elements.prototype.push = function(cmd) {
  var uid = cmd.uid
  switch(cmd.crud) {
    case 'create':
      cmd.el = this.create(uid)
      break
    case 'delete':
      this.del(uid)
      break
  }
  this._push(cmd)
}

Elements.prototype.create = function(uid) {
  var el = this.tpl.cloneNode(true)
  this.els[uid] = el
  this.el.appendChild(el)
  return el
}

Elements.prototype.del = function(uid) {
  this.el.removeChild(this.els[uid])
  delete this.els[uid]
}
