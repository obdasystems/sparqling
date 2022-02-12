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