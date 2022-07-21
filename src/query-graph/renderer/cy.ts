import cytoscape, { Stylesheet } from "cytoscape"
import klay from 'cytoscape-klay'
import compoundDragAndDrop from 'cytoscape-compound-drag-and-drop'
import popper from 'cytoscape-popper'
import { bgpContainer } from "../../util/get-container"
import { EntityNameType } from "grapholscape"
import { EntityTypeEnum } from "../../api/swagger"
import { attachCxtMenuTo, cxtMenuWidget, getCxtMenuProps } from "../../widgets"
import { getCommandsForElement } from "./cxt-menu-commands"
import tippy from "tippy.js"

cytoscape.use(klay)
cytoscape.use(compoundDragAndDrop)
cytoscape.use(popper)

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

cy.on('mouseover', '[iri]', () => {
  const container = cy.container()
  if (container)
    container.style.cursor = 'pointer'
})

cy.on('mouseout', () => {
  const container = cy.container()
  if (container)
    container.style.cursor = 'unset'
})

cy.on('cxttap', `node, edge[type = "${EntityTypeEnum.ObjectProperty}"], edge[type = "${EntityTypeEnum.InverseObjectProperty}"]`, e => {
  attachCxtMenuTo(e.target.popperRef(), getCommandsForElement(e.target))
})

let displayedNameType: EntityNameType
let language: string

export default cy

export function setStateDisplayedNameType(newDisplayNameType: EntityNameType) {
  displayedNameType = newDisplayNameType || displayedNameType
}

export function getDisplayedNameType() { return displayedNameType }

export function setLanguage(newLanguage: string) {
  language = newLanguage || language
}

export function getLanguage() { return language }