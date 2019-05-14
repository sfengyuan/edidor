;
(function (window, document) {
  let pane
  let main
  let rect
  document.addEventListener('DOMContentLoaded', e => {
    pane = document.querySelector('.sidebar')
    main = document.querySelector('.main')
    rect = pane.getBoundingClientRect()
    const state = {
      last: false,
      resizing: false,
      resizable: false
    }
    activateSidebarToggler()
    activateSidebarDrag()
    restoreSidebar()
    tryLoadMode()
    function activateSidebarDrag () {
      document.body.addEventListener('mousemove', throttle(onMousemove, 50)) // eslint-disable-line

      function onMousemove (e) {
        state.resizable = canResize(e.clientX)
        if (state.resizing) {
          resize(e.clientX)
        } else if (state.last !== state.resizable && e.clientX > 10) {
          switchCursor()
          state.last = state.resizable
        }
      }
      document.body.addEventListener('mousedown', e => {
        if (state.resizable) {
          state.resizing = true
        }
      })
      document.body.addEventListener('touchstart', e => {
        state.resizing = canResize(e.touches[0].clientX, 10)
      })
      document.body.addEventListener('touchmove', e => {
        if (state.resizing) {
          resize(e.touches[0].clientX)
        }
      })

      document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.keyCode === 66) {
          toggleSidebar()
        }
      })
      document.body.addEventListener('touchend', cancelResize)
      document.body.addEventListener('mouseup', cancelResize)

      function cancelResize (e) {
        if (e.target.classList.contains('sidebar-toggler')) {
          return
        }
        state.resizing = false
        let r = pane.getBoundingClientRect()
        saveWidth(r.right - r.left)
      }

      function switchCursor () {
        if (state.resizable) {
          document.body.style.cursor = 'ew-resize'
        } else {
          document.body.style.cursor = 'auto'
        }
      }

      function canResize (x, threshold = 4) {
        return Math.abs(x - pane.getBoundingClientRect().right) <= threshold
      }

      function resize (x) {
        let newWidth = x - rect.left
        if (newWidth <= 10) {
          pane.classList.add('hide')
        } else {
          setWidth(newWidth)
        }
      }
    }
    function activateSidebarToggler () {
      const toggle = document.querySelector('.sidebar-toggler')
      toggle && toggle.addEventListener('click', toggleSidebar)
    }
    function setWidth (x, unit = 'px') {
      pane.style.width = x + unit
      main.style.marginLeft = x + unit
    }
    function saveWidth (x) {
      if (x <= 10) {
        return
      }
      window.localStorage.setItem('sidebar_width', x)
    }
    function toggleSidebar (e) {
      if (pane.classList.contains('hide')) {
        pane.classList.remove('hide')
        window.localStorage.setItem('is_sidebar_hide', '0')
      } else {
        pane.classList.add('hide')
        window.localStorage.setItem('is_sidebar_hide', '1')
      }
    }
    function restoreSidebar () {
      let x = window.localStorage.getItem('sidebar_width')
      setWidth(x)
      let flag = window.localStorage.getItem('is_sidebar_hide')
      flag === '1' ? pane.classList.add('hide') : pane.classList.remove('hide')
    }

    function tryLoadMode () {
      let mode = window.localStorage.getItem('mode')
      if (mode) {
        document.body.className = ''
        document.body.classList.add(mode)
      }
      if (mode === 'wild-mode') {
        let wildEle = document.createElement('style')
        wildEle.classList.add('wild-ele')
        wildEle.innerText = window.localStorage.getItem('wild_style')
        document.body.appendChild(wildEle)
      }
    }
  })
})(window, document);

(function (window, document) {
  const toMode = name => {
    let b = document.body
    b.className = ''
    b.classList.add(name)
    window.localStorage.setItem('mode', name)
  }
  const wildStyle = styleTemplate`.wild-mode .main a {
      color: ${'dark'};
  }
  .wild-mode .main .article-tags a {
      background: ${'light'};
      color     : #000000;
  }
  .wild-mode .local-info {
      background: ${'light'};
      color     : #000000;
      box-shadow: none;
  }
  body.wild-mode,
  .wild-mode .main {
      background: ${'light'};
  }
  .wild-mode .main,
  .wild-mode blockquote.twitter-tweet,
  .wild-mode .sidebar a,
  .wild-mode .taxonomy-key,
  .wild-mode .main .title a {
      color: #333333;
  }
  .wild-mode .icon {
      background: #333333;
  }
  .wild-mode .article-meta,
  .wild-mode .item-meta,
  .wild-mode .footnotes {
      color: #999999;
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
  .wild-mode pre,
  .wild-mode code {
      background: ${'gray'};
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
  }
  .wild-mode .header a,
  .wild-mode .footer a,
  .wild-mode .footer time,
  .wild-mode .pagination a {
      color: #333333;
  }
  .wild-mode .header .sub-menu a {
      color: #333333;
  }
  .wild-mode .footer .icon {
      background-color: #333333;
  }
  .wild-mode .main h1,
  .wild-mode .main h2,
  .wild-mode .main h3,
  .wild-mode .main h4,
  .wild-mode .main h5,
  .wild-mode .main h6,
  .wild-mode .title {
      text-shadow: none;
  }`
  const gen = {
    dark: genDark,
    light: genLight,
    lightGray: genGray.bind(5),
    gray: genGray
  }

  function applyWildStyle () {
    let wildEle = document.querySelector('.wild-ele') || document.createElement('style')
    let style = wildStyle().replace(/\n/gm, '')
    wildEle.innerText = style
    window.localStorage.setItem('wild_style', style)
    document.body.appendChild(wildEle)
  }

  function styleTemplate (strings, ...keys) {
    return function () {
      let temp = strings.slice()
      keys.forEach((key, i) => {
        temp[i] += gen[key]()
      })
      return temp.join('')
    }
  }

  const dark = ['c', 'f', '6', '9']
  const light = ['a', 'b', 'c', 'd', 'e', 'f']

  function genDark () {
    let d = ''
    for (let i = 0; i !== 3; i++) {
      let c = dark[randomInt(0, dark.length)]
      d += c + c
    }
    return '#' + d
  }

  function genLight () {
    let d = ''
    for (let i = 0; i !== 6; i++) {
      d += light[randomInt(0, light.length)]
    }
    return '#' + d
  }

  function genGray (base = 0) {
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

  function randomInt (min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
  }
  document.querySelector('.to-light-mode').addEventListener('click', e => {
    toMode('light-mode')
  })
  document.querySelector('.to-dark-mode').addEventListener('click', e => {
    toMode('dark-mode')
  })
  document.querySelector('.to-wild-mode').addEventListener('click', e => {
    toMode('wild-mode')
    applyWildStyle()
  })
})(window, document);
