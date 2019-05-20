import { qs, getProgress } from './helpers'
import { easeElasticOut } from 'd3-ease'
export function getLoader () {
  let topEle = qs('.top')
  let bottomEle = qs('.bottom')
  let distance = document.documentElement.clientHeight / 2
  let ticket = false
  let closed = false
  let opening = false
  let openWaiting = false
  const animation = (ease, cb, duration, finaly = () => {}) => {
    const tick = () => {
      let progress = Math.min(ease((getProgress(data))), 1)
      // d3.easeExpOut has problem, t can not reach to 1, so I mannually fix it
      // progress = progress > 0.999 ? 1 : progress
      if (progress < 1) {
        cb(progress)
        window.requestAnimationFrame(tick)
      } else {
        window.performance.clearMarks(data.id)
        cb(progress)
        finaly()
      }
    }
    const data = {
      duration,
      id: window.requestAnimationFrame(tick)
    }
  }
  const loading = () => {
    console.log('loading', ticket)
    if (ticket) return
    ticket = true
    close(() => {
      closed = true
      if (openWaiting) {
        open()
      }
    })
  }
  const loaded = () => {
    console.log('loaded: ', ticket, opening)
    if (!ticket) return
    if (opening) return
    opening = true
    if (closed) {
      open()
    } else {
      openWaiting = true
    }
  }
  function close (cb) {
    animation(easeElasticOut, progress => {
      topEle.style.top = -((1 - progress) * distance) + 'px'
      bottomEle.style.top = (1 - progress) * distance + distance + 'px'
    }, 1000, cb)
  }

  function open (cb) {
    animation(easeElasticOut, progress => {
      topEle.style.top = -(progress * distance) + 'px'
      bottomEle.style.top = progress * distance + distance + 'px'
    }, 1000, () => {
      opening = false
      closed = false
      openWaiting = false
      ticket = false
    })
  }

  return {
    loading,
    loaded
  }
}
