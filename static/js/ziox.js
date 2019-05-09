
setPageHeight()

function setPageHeight () {
  const middle = document.querySelector('.middle')
  const w = document.documentElement.clientWidth
  const h = document.documentElement.clientHeight

  if (w <= 290) {
    middle.style.height = `${h - 120}px`
    return
  }
  if (w <= 360) {
    middle.style.height = `${h - 90}px`
    return
  }
  middle.style.height = `${h - 60}px`
}
window.addEventListener('resize', throttle(setPageHeight, 500)) // eslint-disable-line
const pane = document.querySelector('.sidebar')
const main = document.querySelector('.main')
const rect = pane.getBoundingClientRect()
const state = {
  last: false,
  resizing: false,
  resizable: false,
  originWidth: rect.width
}
document.body.addEventListener('mousemove', throttle(onMousemove, 50)) // eslint-disable-line

function onMousemove (e) {
  state.resizable = canResize(e.clientX)
  if (state.resizing) {
    resize(e.clientX)
  } else if (state.last !== state.resizable) {
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
    pane.classList.toggle('hide')
    pane.style.width = state.originWidth + 'px'
    main.style.marginLeft = state.originWidth + 'px'
  }
})
document.body.addEventListener('touchend', cancelResize)
document.body.addEventListener('mouseup', cancelResize)

function cancelResize () {
  state.resizing = false
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
    pane.style.width = 0 + 'px'
    main.style.marginLeft = 0 + 'px'
    pane.classList.add('hide')
  } else {
    pane.style.width = newWidth + 'px'
    main.style.marginLeft = newWidth + 'px'
  }
}

document.querySelector('.toggle-sidebar').addEventListener('click', e => {
  pane.classList.toggle('hide')
})
document.querySelector('#cloak').classList.add('hide')
