import './css/main.scss'
import { onEvent, qs } from './js/helpers'
import {
  tryLoadMode,
  tryRestoreSidebar,
  activateSidebarToggle,
  activateModeSwitcher,
  activateSidebarDrag,
  activateDialog
} from './js/main'

onEvent('DOMContentLoaded', e => {
  const doms = {}
  doms.pane = qs('.sidebar')
  doms.main = qs('.main')
  doms.cloak = qs('#cloak')
  doms.paneLeft = doms.pane.getBoundingClientRect().left
  tryLoadMode(doms)
  tryRestoreSidebar(doms)
  activateSidebarToggle(doms)
  activateModeSwitcher(doms)
  activateSidebarDrag(doms)
  activateDialog(doms)
}, 0, document)
