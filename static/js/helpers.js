/* eslint-disable no-unused-vars */
// dom helper functions
function qs (sel, parent = document.body) {
  if (typeof parent === 'string') {
    parent = document.querySelector(parent)
  }
  return parent.querySelector(sel)
}

function elt (name, attr = {}, ...text) {
  const node = document.createElement(name)
  Object.keys(attr).forEach(k => {
    node.setAttribute(k, attr[k])
  })
  text.forEach(t => {
    if (typeof t === 'string') {
      t = document.createTextNode(t)
    }
    node.appendChild(t)
  })
  return node
}

function removeClass (dom, cls) {
  if (typeof dom === 'string') {
    dom = qs(dom)
  }
  dom.classList.remove(cls)
  return dom
}
function clearClass (dom, cls) {
  if (typeof dom === 'string') {
    dom = qs(dom)
  }
  dom.className = ''
  return dom
}
function addClass (dom, cls) {
  if (typeof dom === 'string') {
    dom = qs(dom)
  }
  dom.classList.add(cls)
  return dom
}
// function toggleClass (dom, cls) { // eslint-disable-line
//   if (typeof dom === 'string') {
//     dom = qs(dom)
//   }
//   dom.classList.toggle(cls)
//   return dom
// }
function hasClass (dom, cls) {
  if (typeof dom === 'string') {
    dom = qs(dom)
  }
  return dom.classList.contains(cls)
}
function setStyle (dom, styles) {
  if (typeof dom === 'string') {
    dom = qs(dom)
  }

  Object.keys(styles).forEach(key => {
    dom.style[key] = styles[key]
  })
}
function onEvent (event, cb, limit = 0, dom = document.body) {
  if (typeof dom === 'string') {
    dom = qs(dom)
  }
  if (limit > 0) {
    dom.addEventListener(event, throttle(cb, limit)) // eslint-disable-line
  } else {
    dom.addEventListener(event, cb)
  }
}
// mousemove and touchmove abstraction
function onPointerMove (cb, limit, dom = document.body) {
  onEvent('mousemove', e => {
    cb({ // eslint-disable-line
      clientX: e.clientX,
      clientY: e.clientY,
      type: e.type
    })
  }, limit, dom)

  onEvent('touchmove', e => {
    cb({ // eslint-disable-line
      clientX: e.touches[0].clientX,
      clientY: e.touches[0].clientY,
      type: e.type
    })
  }, limit, dom)
}
// local storage
const ls = {}
ls.get = key => window.localStorage.getItem(key)

ls.set = (key, value) => {
  if (value === null || value === undefined) {
    value = ''
  } else if (typeof value !== 'string') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}
function randomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}
