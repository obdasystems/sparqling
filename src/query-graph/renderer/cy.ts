import cytoscape, { Stylesheet } from "cytoscape"
import { DisplayedNameType } from "../displayed-name-type"
import klay from 'cytoscape-klay'
import cola from 'cytoscape-cola'
import cxtmenu from 'cytoscape-cxtmenu'
import compoundDragAndDrop from 'cytoscape-compound-drag-and-drop'
import { bgpContainer } from "../../util/get-container"

cytoscape.use(klay)
cytoscape.use(cola)
cytoscape.use(cxtmenu)
cytoscape.use(compoundDragAndDrop)

const cy = cytoscape({
  style: [] as Stylesheet[],
  wheelSensitivity: 0.4,
  maxZoom: 2,
})
cy.mount(bgpContainer)

/**
 * --- HACKY --- 
 * Allow events not involving buttons to work on cytoscape when it's in a shadow dom.
 * They don't work due to shadow dom event's retargeting
 * Cytoscape listen to events on window object. When the event reach window due to bubbling,
 * cytoscape handler for mouse movement handles it but event target appear to be the 
 * custom component and not the canvas due to retargeting, therefore listeners are not triggered.
 * workaround found here: https://github.com/cytoscape/cytoscape.js/issues/2081
 */
cy.on('render', () => {
  try {
    (cy as any).renderer().hoverData.capture = true
  } catch {}
})

let menu: any
let displayedNameType: DisplayedNameType
let language: string

export default cy

export function setStateDisplayedNameType(newDisplayNameType: DisplayedNameType) {
  displayedNameType = newDisplayNameType || displayedNameType
}

export function getDisplayedNameType() { return displayedNameType }

export function setLanguage(newLanguage: string) {
  language = newLanguage || language
}

export function getLanguage() { return language }