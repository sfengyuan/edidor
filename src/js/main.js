import {
  qs,
  elt,
  removeClass,
  clearClass,
  addClass,
  hasClass,
  setStyle,
  onEvent,
  onPointerMove,
  ls,
  download
} from './helpers'
import wildStyle from './css_template'
import { genFile } from './file_template'

// sidebar function dragging wrapper
function activateSidebarDrag (doms) {
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
    return Math.abs(x - doms.pane.getBoundingClientRect().right) <= threshold
  }
  function resize (x) {
    let newWidth = x - doms.paneLeft
    if (newWidth <= 10) {
      addClass(doms.pane, 'hide')
    } else {
      adjustWidth(newWidth)
    }
  }
  function cancelResize (e) {
    state.resizing = false
    let r = doms.pane.getBoundingClientRect()
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
  setStyle(qs('.sidebar'), { width: x + 'px' })
  setStyle(qs('.main'), { marginLeft: x + 'px' })
}
function tryRestoreSidebar (doms) {
  let x = ls.get('sidebar_width')
  adjustWidth(x)
  let flag = ls.get('is_sidebar_hide')
  flag === '1' ? addClass(doms.pane, 'hide') : removeClass(doms.pane, 'hide')
}
function activateSidebarToggle (doms) {
  onEvent('click', toggleSidebar.bind(null, doms), 0, '.toggle-sidebar')
}

function toggleSidebar (doms, e) {
  if (hasClass(doms.pane, 'hide')) {
    removeClass(doms.pane, 'hide')
    ls.set('is_sidebar_hide', '0')
  } else {
    addClass(doms.pane, 'hide')
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
function tryLoadMode (doms, loader) {
  let mode = ls.get('mode')
  mode && toMode(mode)
  if (mode === 'wild-mode') {
    let wildEle = elt(
      'style',
      { class: 'wild-ele' },
      ls.get('wild_style'))
    document.body.appendChild(wildEle)
  }
  loader.loaded()
}
function activateModeSwitcher (doms, loader) {
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
    loader.loading()
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
    loader.loaded()
  }, 0, '#theme-switcher')
}

// function showCloak () {
//   removeClass(cloak, 'hide')
// }

function activateDialog (doms, loader) {
  onEvent('click', e => {
    removeClass('.dialog', 'show')
  }, 0, '.close-dialog')
  onEvent('click', e => {
    const themeName = qs('#theme-name').value.trim()
    if (!themeName) {
      window.alert('Name is required.')
      return
    }
    if (!/^[a-zA-Z\s-]+$/.test(themeName)) {
      window.alert('Only English letters, space, hyphens are allowed.')
      return
    }
    if (themeName === 'light' || themeName === 'dark' || themeName === 'wild') {
      window.alert('Mess up builtin themes.')
      return
    }
    loader.loading()
    exportWild(themeName)
    removeClass('.dialog', 'show')
    loader.loaded()
  }, 0, '.export')
}
function exportWild (themeName) {
  let content = generateFile(themeName)
  download(themeName + '.css', content)
}

function generateFile (themeName) {
  let style = ls.get('wild_style')
  let identifier = themeName.replace(/\s/g, '-')
  style = style.replace(/wild-mode/g, `${identifier}-mode`)
  let file = genFile(identifier, themeName)
  return file + style
}

export {
  tryLoadMode,
  tryRestoreSidebar,
  activateSidebarToggle,
  activateModeSwitcher,
  activateSidebarDrag,
  activateDialog
}
