;
(function (window, document) {
  const wildStyle = styleTemplate`.wild-mode .main a {
    color: ${'dark'};
    }
    .wild-mode .main .article-tags a {
        background: ${'light'};
    }
    .wild-mode .local-info {
        background: ${'light'};
    }
    body.wild-mode,
    .wild-mode .main {
        background: ${'light'};
    }
    .wild-mode th,
    .wild-mode td {
        border-bottom: 1px solid ${'dark'};
    }
    .wild-mode hr {
        border: 1px solid ${'dark'};
    }
    .wild-mode .pagination {
        background: ${'dark'};
    }
    .wild-mode .sidebar {
        background: ${'dark'};
    }
    .wild-mode .count,
    .wild-mode .taxonomy-key {
        color: ${'lightGray'};
    }
    .wild-mode .header,
    .wild-mode .footer,
    .wild-mode .header .sub-menu li:hover,
    .wild-mode .sidebar a:hover,
    .wild-mode .logo-link {
        background: ${'dark'};
    }
    .wild-mode .header .menu>li:hover,
    .wild-mode .footer a:hover {
        background: ${'light'};
    }
    .wild-mode .header ul ul {
        box-shadow: 0 0.1em 0.2em 0 ${'dark'};
    }
    .wild-mode .header ul ul,
    .wild-mode .pagination a:hover {
        background: ${'dark'};
    }`
  // dom helper functions ...
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
  // color generators
  const gen = {
    darkCode: ['c', 'f', '6', '9'],
    lightCode: ['a', 'b', 'c', 'd', 'e', 'f']
  }

  gen.dark = () => {
    let d = ''
    for (let i = 0; i !== 3; i++) {
      let c = gen.darkCode[randomInt(0, gen.darkCode.length)]
      d += c + c
    }
    return '#' + d
  }
  gen.light = () => {
    let d = ''
    for (let i = 0; i !== 6; i++) {
      d += gen.lightCode[randomInt(0, gen.lightCode.length)]
    }
    return '#' + d
  }

  gen.gray = (base = 0) => {
    let ret = ''
    for (let i = 0; i !== 6; i++) {
      if (base > 3) {
        ret += String.fromCharCode(65 + base - 4)
      } else {
        ret += (6 + base).toString()
      }
    }
    return '#' + ret
  }
  gen.lightGray = gen.gray.bind(5)
  function randomInt (min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
  }
  // tagged template function, make wild styles
  function styleTemplate (strings, ...keys) {
    return function () {
      let temp = strings.slice()
      keys.forEach((key, i) => {
        temp[i] += gen[key]()
      })
      return temp.join('').replace(/\s{2}/gm, ' ')
    }
  }
  // utility functions end
  let pane
  let main
  let paneLeft
  let cloak
  // entry
  onEvent('DOMContentLoaded', e => {
    pane = qs('.sidebar')
    main = qs('.main')
    cloak = qs('#cloak')
    paneLeft = pane.getBoundingClientRect().left
    tryLoadMode()
    tryRestoreSidebar()
    activateSidebarToggler()
    activateModeSwitcher()
    activateSidebarDrag()
  }, 0, document)
  // sidebar function dragging wrapper
  function activateSidebarDrag () {
    const state = {
      last: false,
      resizing: false,
      resizable: false
    }

    function switchCursor () {
      if (state.resizable) {
        setStyle(document.body, { cursor: 'ew-resize' })
      } else {
        setStyle(document.body, { cursor: 'auto' })
      }
    }

    function canResize (x, threshold = 4) {
      return Math.abs(x - pane.getBoundingClientRect().right) <= threshold
    }
    function resize (x) {
      let newWidth = x - paneLeft
      if (newWidth <= 10) {
        addClass(pane, 'hide')
      } else {
        adjustWidth(newWidth)
      }
    }
    function cancelResize (e) {
      state.resizing = false
      let r = pane.getBoundingClientRect()
      saveWidth(r.right - r.left)
    }

    function saveWidth (x) {
      if (x <= 10) {
        return
      }
      ls.set('sidebar_width', x)
    }

    onEvent('mousedown', e => {
      if (state.resizable) {
        state.resizing = true
      }
    }, 0)
    onEvent('mouseup', cancelResize, 0)
    onEvent('keydown', e => {
      if (e.ctrlKey && e.keyCode === 66) {
        toggleSidebar()
      }
    }, 0)

    onEvent('touchstart', e => {
      state.resizing = canResize(e.touches[0].clientX, 10)
    })
    onEvent('touchend', cancelResize)
    onPointerMove(pointerMoveHandler, 50, qs('.middle'))
    function pointerMoveHandler (e) {
      state.resizable = canResize(e.clientX)
      if (state.resizing) {
        resize(e.clientX)
      } else if (e.type === 'mousemove' && e.clientX > 10 && state.last !== state.resizable) {
        switchCursor()
        state.last = state.resizable
      }
    }
  }
  // sidebar dragging function end
  // toggle and load sidebar width
  function adjustWidth (x, unit = 'px') {
    setStyle(pane, { width: x + 'px' })
    setStyle(main, { marginLeft: x + 'px' })
  }
  function tryRestoreSidebar () {
    let x = ls.get('sidebar_width')
    adjustWidth(x)
    let flag = ls.get('is_sidebar_hide')
    flag === '1' ? addClass(pane, 'hide') : removeClass(pane, 'hide')
  }
  function activateSidebarToggler () {
    onEvent('click', toggleSidebar, 0, '.sidebar-toggler')
  }

  function toggleSidebar (e) {
    if (hasClass(pane, 'hide')) {
      removeClass(pane, 'hide')
      ls.set('is_sidebar_hide', '0')
    } else {
      addClass(pane, 'hide')
      ls.set('is_sidebar_hide', '1')
    }
    e.preventDefault()
    e.stopPropagation()
    return false
  }
  // style mode functions
  const toMode = name => {
    addClass(clearClass(document.body), name)
    ls.set('mode', name)
  }
  function tryLoadMode () {
    console.log('load mode')
    let mode = ls.get('mode')
    mode && toMode(mode)
    if (mode === 'wild-mode') {
      let wildEle = elt(
        'style',
        { class: 'wild-ele' },
        ls.get('wild_style'))
      document.body.appendChild(wildEle)
    }
    hideCloak()
  }
  function activateModeSwitcher () {
    onEvent('click', e => {
      toMode('light-mode')
    }, 0, qs('.to-light-mode'))

    onEvent('click', e => {
      toMode('dark-mode')
    }, 0, qs('.to-dark-mode'))

    onEvent('click', e => {
      toMode('wild-mode')
      let wildEle = qs('.wild-ele')
      const style = wildStyle()
      if (wildEle) {
        wildEle.innerText = style
      } else {
        document.body.appendChild(elt('style', { class: 'wild-ele' }, style))
      }
      ls.set('wild_style', style)
    }, 0, qs('.to-wild-mode'))
  }

  // function showCloak () {
  //   removeClass(cloak, 'hide')
  // }
  function hideCloak () {
    addClass(cloak, 'hide')
  }
})(window, document)
