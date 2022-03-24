import { GraphElement } from "../api/swagger"
import centerOnElement from "../util/center-on-element"
import { bgpContainer } from "../util/get-container"
import * as GEUtility from "../util/graph-element-utility"
import QueryGraphWidget from "./qg-widget"
import * as bgp from "./renderer"
import { cxtMenu } from "./renderer"

export { setLanguage, renderOptionals } from './renderer'
export * from './renderer/setters'
export * from './optionals'
export const widget = new QueryGraphWidget(bgpContainer)

// inject tests for allowing joins into renderer, keep renderer logic agnostic
bgp.setJoinStartCondition((nodeID: string) => GEUtility.canStartJoin(GEUtility.getGraphElementByID(nodeID)))
bgp.setJoinAllowedCondition((node1ID, node2ID) => {
  let ge1 = GEUtility.getGraphElementByID(node1ID)
  let ge2 = GEUtility.getGraphElementByID(node2ID)
  return GEUtility.isJoinAllowed(ge1, ge2)
})


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
      // if the object property is inverse, switch source and target
      if (GEUtility.isInverseObjectProperty(objectProperty)) {
        bgp.addEdge(graphElem, parent, objectProperty)
      } else {
        bgp.addEdge(parent, graphElem, objectProperty)
      } 
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
  let deletedNodeIds: string[] = []
  bgp.getElements().forEach( elem => {
    if ( elem.data('displayed_name') && !GEUtility.getGraphElementByID(elem.id())) {
      /**
       * remove it if elem is:
       *  - not a child
       *  - a child and its iri is not in the query anymore
       */
      if (!elem.isChild() || !GEUtility.getGraphElementByIRI(elem.data('iri'))) {
        deletedNodeIds.push(elem.id())
        bgp.removeNode(elem.id())
      }
    }
  })

  return deletedNodeIds
}

export function centerOnElem(graphElem: GraphElement) {
  let cyElem = bgp.getElementById(graphElem.id)
  centerOnElement(cyElem, cyElem.cy().maxZoom())
}

export function getSelectedGraphElement() {
  return GEUtility.getGraphElementByID(bgp.getElements().filter('.sparqling-selected')[0]?.id())
}

// ******************************* GRAPH INTERACTION CALLBACKS ******************************* //
export function onAddHead(callback: (graphElem: GraphElement) => void) {
  bgp.onAddHead(id => callback(GEUtility.getGraphElementByID(id)))
}

export function onDelete(callback: (graphElem: GraphElement) => void) {
  bgp.onDelete(id => {
    callback(GEUtility.getGraphElementByID(id))
    cxtMenu.hide()
  })
}

export function onAddFilter(callback: (graphElem: GraphElement) => void) {
  bgp.onAddFilter(id => {
    callback(GEUtility.getGraphElementByID(id))
  })
}

export function onSeeFilters(callback: (graphElem: GraphElement) => void) {
  bgp.onSeeFilters(id => {
    callback(GEUtility.getGraphElementByID(id))
  })
}

export function onJoin(callback: (graphElem1: GraphElement, graphElem2: GraphElement) => void) {
  bgp.onJoin((node1ID, node2ID) => {
    let graphElem1 = GEUtility.getGraphElementByID(node1ID)
    let graphElem2 = GEUtility.getGraphElementByID(node2ID)
    callback(graphElem1, graphElem2)
  })
}

export function onElementClick(callback: (graphElem: GraphElement, iri: string) => void) {
  bgp.onElementClick((id, iri) => callback(GEUtility.getGraphElementByID(id), iri))
}

export function isIriInQueryGraph(iri: string): boolean {
  return GEUtility.getGraphElementByIRI(iri) ? true : false
}