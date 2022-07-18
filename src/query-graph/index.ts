// import { GraphElement } from "../api/swagger"
// import centerOnElement from "../util/center-on-element"
// import { bgpContainer } from "../util/get-container"
// import * as GEUtility from "../util/graph-element-utility"
// import { clearQueryButton, countStarToggle, distinctToggle, limit, offset, sparqlButton } from "../widgets"
// import QueryGraphWidget from "./qg-widget"
// import * as bgp from "./renderer"
// import { cxtMenu } from "./renderer"

// export * from './optionals'
// export { renderOptionals, setLanguage } from './renderer'
// export * from './renderer/setters'

// export const widget = new QueryGraphWidget(bgpContainer, [limit, offset, distinctToggle, countStarToggle, sparqlButton, clearQueryButton])

// // inject tests for allowing joins into renderer, keep renderer logic agnostic
// bgp.setJoinStartCondition((nodeID: string) => {
//   const graphElement = GEUtility.getGraphElementByID(nodeID)
//   return graphElement ? GEUtility.canStartJoin(graphElement) : false
// })
// bgp.setJoinAllowedCondition((node1ID, node2ID) => {
//   let ge1 = GEUtility.getGraphElementByID(node1ID)
//   let ge2 = GEUtility.getGraphElementByID(node2ID)
//   return ge1 && ge2 ? GEUtility.isJoinAllowed(ge1, ge2) : false
// })


// export function selectElement(nodeIDorIRI: string): GraphElement | undefined {
//   let graphElem = GEUtility.getGraphElementByID(nodeIDorIRI) || GEUtility.getGraphElementByIRI(nodeIDorIRI)
//   //bgp.unselect()
//   if (graphElem?.id) {
//     bgp.selectNode(graphElem.id)
//     // selectedGraphElement = graphElem
//   }

//   return graphElem
// }

// export function render(graphElem: GraphElement, parent?: GraphElement, objectProperty?: GraphElement) {
//   if (!graphElem) return

//   if (!GEUtility.isObjectProperty(graphElem)) {
//     bgp.addNode(graphElem)
//     if (parent) {
//       bgp.addEdge(parent, graphElem, objectProperty)
//     }
//   }

//   // if the actual elem was an object property, it will be added at next step as edge
//   // between this elem and its children
//   if (GEUtility.isObjectProperty(graphElem)) {
//     graphElem.children?.forEach((childGraphElem: GraphElement) => render(childGraphElem, parent, graphElem))
//   } else {
//     graphElem.children?.forEach((childGraphElem: GraphElement) => render(childGraphElem, graphElem))
//   }
// }

// // remove elements not in query anymore, asynchronously
// export function removeNodesNotInQuery() {
//   let deletedNodeIds: string[] = []
//   bgp.getElements().forEach(elem => {
//     const graphElement = GEUtility.getGraphElementByID(elem.id())
//     if (elem.data('displayed_name') && !graphElement) {
//       /**
//        * remove it if elem is:
//        *  - not a child
//        *  - a child and its iri is not in the query anymore
//        */
//       if (!elem.isChild() || !GEUtility.getGraphElementByIRI(elem.data('iri'))) {
//         deletedNodeIds.push(elem.id())
//         bgp.removeNode(elem.id())
//       }
//     }
//   })

//   return deletedNodeIds
// }

// export function centerOnElem(graphElem: GraphElement) {
//   if (graphElem.id) {
//     let cyElem = bgp.getElementById(graphElem.id)
//     if (cyElem)
//       centerOnElement(cyElem, cyElem.cy().maxZoom())
//   }
// }

// export function getSelectedGraphElement() {
//   return GEUtility.getGraphElementByID(bgp.getElements().filter('.sparqling-selected')[0]?.id())
// }

// // ******************************* GRAPH INTERACTION CALLBACKS ******************************* //
// export function onAddHead(callback: (graphElem: GraphElement) => void) {
//   bgp.onAddHead(id => {
//     const graphElement = GEUtility.getGraphElementByID(id)
//     if (graphElement)
//       callback(graphElement)
//   })
// }

// export function onDelete(callback: (graphElement: GraphElement, iri?: string) => void) {
//   bgp.onDelete((id, iri) => {
//     const graphElement = GEUtility.getGraphElementByID(id) || GEUtility.getParentFromChildId(id)
//     if (graphElement)
//       callback(graphElement, iri)
//     cxtMenu.hide()
//   })
// }

// export function onAddFilter(callback: (graphElem: GraphElement) => void) {
//   bgp.onAddFilter(id => {
//     const graphElement = GEUtility.getGraphElementByID(id)
//     if (graphElement)
//       callback(graphElement)
//   })
// }

// export function onSeeFilters(callback: (graphElem: GraphElement) => void) {
//   bgp.onSeeFilters(id => {
//     const graphElement = GEUtility.getGraphElementByID(id)
//     if (graphElement)
//       callback(graphElement)
//   })
// }

// export function onJoin(callback: (graphElem1: GraphElement, graphElem2: GraphElement) => void) {
//   bgp.onJoin((node1ID, node2ID) => {
//     let graphElem1 = GEUtility.getGraphElementByID(node1ID)
//     let graphElem2 = GEUtility.getGraphElementByID(node2ID)
//     if (graphElem1 && graphElem2)
//       callback(graphElem1, graphElem2)
//   })
// }

// export function onElementClick(callback: (graphElem: GraphElement, iri: string) => void) {
//   bgp.onElementClick((id, iri) => {
//     const graphElement = GEUtility.getGraphElementByID(id)
//     if (graphElement)
//       callback(graphElement, iri)
//   })
// }

// export function isIriInQueryGraph(iri: string): boolean {
//   return GEUtility.getGraphElementByIRI(iri) ? true : false
// }