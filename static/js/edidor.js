/* eslint-disable no-undef */
;
(function (window, document) {
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
    activateSidebarToggle()
    activateModeSwitcher()
    activateSidebarDrag()
    activateDialog()
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
  function activateSidebarToggle () {
    onEvent('click', toggleSidebar, 0, '.toggle-sidebar')
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
    if (!hasClass(document.body, name)) {
      addClass(clearClass(document.body), name)
    }
    ls.set('mode', name)
  }
  function tryLoadMode () {
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
      e.preventDefault()
      e.stopPropagation()
      if (e.target.id === 'theme-switcher-button') {
        return
      }
      if (hasClass(e.target, 'export-wild')) {
        addClass('.dialog', 'show')
        qs('#theme-name').focus()
        return
      }
      let theme = e.target.dataset.theme
      if (!theme) {
        console.error('Theme name not found, probably missing an "Identifier" field in Config file.')
        return
      }
      toMode(theme + '-mode')
      if (theme === 'wild') {
        const wildEle = qs('.wild-ele')
        const style = wildStyle()
        if (wildEle) {
          wildEle.innerText = style
        } else {
          document.body.appendChild(elt('style', { class: 'wild-ele' }, style))
        }
        ls.set('wild_style', style)
      }
    }, 0, '#theme-switcher')
  }

  // function showCloak () {
  //   removeClass(cloak, 'hide')
  // }
  function hideCloak () {
    addClass(cloak, 'hide')
  }

  function activateDialog () {
    onEvent('click', e => {
      removeClass('.dialog', 'show')
    }, 0, '.close-dialog')
    onEvent('click', e => {
      const themeName = qs('#theme-name').value.trim()
      if (!themeName) {
        alert('Name is required.')
        return
      }
      if (!/^[a-zA-Z\s-]+$/.test(themeName)) {
        alert('Only English letters, space, hyphens are allowed.')
        return
      }
      if (themeName === 'light' || themeName === 'dark' || themeName === 'wild') {
        alert('Mess up builtin themes.')
        return
      }
      exportWild(themeName)
      removeClass('.dialog', 'show')
    }, 0, '.export')
  }
  function exportWild (themeName) {
    let content = generateText(themeName)
    download(themeName + '.css', content)
  }

  function generateText (themeName) {
    let style = ls.get('wild_style')
    let identifier = themeName.replace(/\s/g, '-')
    style = style.replace(/wild-mode/g, `${identifier}-mode`)
    const content = `/*
    Hugo Edidor theme wild mode exported.
    homepage: https://github.com/jacobsun/edidor
    Usage:
    1. Throw me to your site root folder/static/css directory, you can rename me to whatever you like.
    2. Copy the code below to your config file.

    --------
    [[menu.main]]
    parent = "Theme"
    identifier = "${identifier}"
    name = "${themeName}"
    url = "#"
    weight = 30
    --------

    3. Change the field 'name' and 'weight' to whatever you like. Leave others alone, and don't add your custom field, hugo doesn't support that, though I really hope so :/.
*/
    ${style}`
    return content
  }
  function download (filename, text) {
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

  // Start file download.

})(window, document)
