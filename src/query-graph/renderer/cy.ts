import cytoscape, { NodeSingular } from "cytoscape"
import cola from 'cytoscape-cola'
import compoundDragAndDrop from 'cytoscape-compound-drag-and-drop'
import klay from 'cytoscape-klay'
import popper from 'cytoscape-popper'
import automove from 'cytoscape-automove'
import svg from 'cytoscape-svg'
import { EntityNameType, ui } from "grapholscape"
import { bgpContainer, tippyContainer } from "../../util/get-container"
import { getCommandsForElement } from "./cxt-menu-commands"
import { EntityTypeEnum } from "../../api/swagger"
import { cxtMenu } from "../../widgets"
import { isFullPageActive } from "../../model"
import { getGscape } from "../../ontology-graph"

cytoscape.use(klay)
cytoscape.use(compoundDragAndDrop)
cytoscape.use(popper)
cytoscape.use(cola)
cytoscape.use(automove)
cytoscape.use(svg)

export const cy = cytoscape({
  wheelSensitivity: 0.4,
  maxZoom: 2,
})
cy.mount(bgpContainer)

cy.container()?.firstElementChild?.appendChild(tippyContainer)

cy.on('resize', () => {
  cy.container()?.firstElementChild?.appendChild(tippyContainer)
})
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
  } catch { }
})

cy.on('mouseover', '[iri], [?isSuggestion]', () => {
  const container = cy.container()
  if (container)
    container.style.cursor = 'pointer'
})

cy.on('mouseout', () => {
  const container = cy.container()
  if (container)
    container.style.cursor = 'unset'
})

cy.on('cxttap', `[iri][!isSuggestion]`, e => {
  cxtMenu.attachTo(e.target.popperRef(), getCommandsForElement(e.target))
})

cy.on('tap', e => {
  if (e.target === cy && isFullPageActive()) {
    (getGscape().widgets.get(ui.WidgetEnum.ENTITY_DETAILS) as any).hide()
  }
});

(cy as any).automove({
  nodesMatching: (node: NodeSingular) => cy.$(':grabbed')
    .neighborhood(`[type = "${EntityTypeEnum.DataProperty}"],[type = "${EntityTypeEnum.Annotation}"]`)
    .has(node),
  reposition: 'drag',
  dragWith: `[type ="${EntityTypeEnum.Class}"]`
})

let displayedNameType: EntityNameType
let language: string

export function setStateDisplayedNameType(newDisplayNameType: EntityNameType) {
  displayedNameType = newDisplayNameType || displayedNameType
}

export function getDisplayedNameType() { return displayedNameType }

export function setLanguage(newLanguage: string) {
  language = newLanguage || language
}

export function getLanguage() { return language }