import { qgWidget, bgp } from "./widget"
import { DisplayedNameType } from "./displayed-name-type"
import * as GEUtility from "../util/graph-element-utility"
import { GraphElement, EntityTypeEnum } from "../api/swagger"
import { Theme } from "grapholscape"
import { CollectionReturnValue } from "cytoscape"
import centerOnElement from "../util/center-on-element"

export { qgWidget as widget }

// inject tests for allowing joins into renderer, keep renderer logic agnostic
bgp.canStartJoin = nodeID => GEUtility.canStartJoin(GEUtility.getGraphElementByID(nodeID))
bgp.isJoinAllowed = (node1ID, node2ID) => {
  let ge1 = GEUtility.getGraphElementByID(node1ID)
  let ge2 = GEUtility.getGraphElementByID(node2ID)
  return GEUtility.isJoinAllowed(ge1, ge2)
}

let graph: GraphElement

export function selectElement(nodeIDorIRI: string): GraphElement {
  let graphElem = GEUtility.getGraphElementByID(nodeIDorIRI) || GEUtility.getGraphElementByIRI(nodeIDorIRI)
  //bgp.unselect()
  if (graphElem) {
    bgp.selectNode(graphElem.id)
    // selectedGraphElement = graphElem
  }

  return graphElem
}

export function render(graphElem: GraphElement, parent?: GraphElement, objectProperty?: GraphElement) {
  if (!graphElem) return

  if (!GEUtility.isObjectProperty(graphElem)) {
    bgp.addNode(graphElem)
    if (parent) {
      bgp.addEdge(parent, graphElem, objectProperty)
    }
  }

  // if the actual elem was an object property, it will be added at next step as edge
  // between this elem and its children
  if (GEUtility.isObjectProperty(graphElem)) {
    graphElem.children?.forEach((childGraphElem: GraphElement) => render(childGraphElem, parent, graphElem))
  } else {
    graphElem.children?.forEach((childGraphElem: GraphElement) => render(childGraphElem, graphElem))
  }
}

// remove elements not in query anymore, asynchronously
export function removeNodesNotInQuery() {
  setTimeout(() => {
    bgp.elements.forEach( elem => {
      if ( elem.data('displayed_name') && !GEUtility.getGraphElementByID(elem.id())) {
        /**
         * remove it if elem is:
         *  - not a child
         *  - a child and its iri is not in the query anymore
         */
        if (!elem.isChild() || !GEUtility.getGraphElementByIRI(elem.data('iri')))
          bgp.removeNode(elem.id())
      }
    })
  },0)
}

export function centerOnElem(graphElem: GraphElement) {
  let cyElem = bgp.getElementById(graphElem.id)
  centerOnElement(cyElem, cyElem.cy().maxZoom())
}

export function getSelectedGraphElement() {
  return GEUtility.getGraphElementByID(bgp.elements.filter('.sparqling-selected')[0]?.id())
}

// ******************************* GRAPH INTERACTION CALLBACKS ******************************* //
export function onAddHead(callback: (graphElem: GraphElement) => void) {
  bgp.onAddHead(id => callback(GEUtility.getGraphElementByID(id)))
}

export function onDelete(callback: (graphElem: GraphElement) => void) {
  bgp.onDelete(id => callback(GEUtility.getGraphElementByID(id)))
}

export function onJoin(callback: (graphElem1: GraphElement, graphElem2: GraphElement) => void) {
  bgp.onJoin((node1ID, node2ID) => {
    let graphElem1 = GEUtility.getGraphElementByID(node1ID)
    let graphElem2 = GEUtility.getGraphElementByID(node2ID)
    callback(graphElem1, graphElem2)
  })
}

export function onElementClick(callback: (graphElem: GraphElement, iri: string) => void) {
  bgp.onElemSelect((id, iri) => callback(GEUtility.getGraphElementByID(id), iri))
}
// ********************************************************************************************* //

export function setDisplayedNameType(newDisplayedNameType: string, language: string) {
  bgp.setDisplayedNameType(DisplayedNameType[newDisplayedNameType], language)
}

export function setLanguage(newLanguage: string) {
  bgp.setDisplayedNameType(DisplayedNameType.label, newLanguage)
}

export function setTheme(newTheme: Theme) {
  bgp.theme = newTheme
}

export function setGraph(newGraph: GraphElement) {
  graph = newGraph
}

export function getGraph() { return graph }

export function iriInQueryGraph(iri: string): boolean {
  return GEUtility.getGraphElementByIRI(iri) ? true : false
}