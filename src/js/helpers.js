// dom helper functions
const throttle = require('lodash.throttle')
export function qs (sel, parent = document.body) {
  if (typeof parent === 'string') {
    parent = document.querySelector(parent)
  }
  return parent.querySelector(sel)
}

export function elt (name, attr = {}, ...text) {
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

export function removeClass (dom, cls) {
  if (typeof dom === 'string') {
    dom = qs(dom)
  }
  dom.classList.remove(cls)
  return dom
}
export function clearClass (dom, cls) {
  if (typeof dom === 'string') {
    dom = qs(dom)
  }
  dom.className = ''
  return dom
}
export function addClass (dom, cls) {
  if (typeof dom === 'string') {
    dom = qs(dom)
  }
  dom.classList.add(cls)
  return dom
}
export function toggleClass (dom, cls) {
  if (typeof dom === 'string') {
    dom = qs(dom)
  }
  dom.classList.toggle(cls)
  return dom
}
export function hasClass (dom, cls) {
  if (typeof dom === 'string') {
    dom = qs(dom)
  }
  return dom.classList.contains(cls)
}
export function setStyle (dom, styles) {
  if (typeof dom === 'string') {
    dom = qs(dom)
  }

  Object.keys(styles).forEach(key => {
    dom.style[key] = styles[key]
  })
}
export function onEvent (event, cb, limit = 0, dom = document.body, options = {}) {
  if (typeof dom === 'string') {
    dom = qs(dom)
  }
  if (limit > 0) {
    dom.addEventListener(event, throttle(cb, limit), options)
  } else {
    dom.addEventListener(event, cb, options)
  }
}
// mousemove and touchmove abstraction
export function onPointerMove (cb, limit, dom = document.body) {
  onEvent('mousemove', e => {
    cb({ // eslint-disable-line
      clientX: e.clientX,
      clientY: e.clientY,
      type: e.type
    })
  }, limit, dom, { passive: true })

  onEvent('touchmove', e => {
    cb({ // eslint-disable-line
      clientX: e.touches[0].clientX,
      clientY: e.touches[0].clientY,
      type: e.type
    })
  }, limit, dom, { passive: true })
}
// local storage
export const ls = {}
ls.get = key => window.localStorage.getItem(key)

ls.set = (key, value) => {
  if (value === null || value === undefined) {
    value = ''
  } else if (typeof value !== 'string') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}
export function randomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

export function download (filename, text) {
  const a = elt('a', {
    href: 'data:text/plain;charset=utf-8,' + encodeURIComponent(text),
    download: filename,
    style: {
      display: 'none'
    }
  })
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export function trackTime (id) {
  const [entry] = window.performance.getEntriesByName(id)
  if (!entry) {
    window.performance.mark(id)
    return 0
  }
  return window.performance.now() - entry.startTime
}
export function getProgress (data) {
  if (data.duration) {
    return Math.min(trackTime(data.id) / data.duration, 1)
  }
  return 1
}
