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
import { getLoader } from './js/loader'
const loader = getLoader()
onEvent('DOMContentLoaded', e => {
  console.log('page loaded!', Date.now())
  loader.loading()
  const doms = {}
  doms.pane = qs('.sidebar')
  doms.main = qs('.main')
  doms.cloak = qs('#cloak')
  doms.paneLeft = doms.pane.getBoundingClientRect().left
  tryLoadMode(doms, loader)
  tryRestoreSidebar(doms)
  activateSidebarToggle(doms)
  activateModeSwitcher(doms, loader)
  activateSidebarDrag(doms)
  activateDialog(doms, loader)
}, 0, document)
