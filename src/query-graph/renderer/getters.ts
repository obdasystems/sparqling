import cy from "./cy"

/**
 * Get an elem by its id
 * @param elemID the node/edge ID
 * @returns a cytoscape representation of the element or undefined if it does not exist
 */
export function getElementById(elemID: string) {
  const elem = cy.$id(elemID)
  return elem.empty() ? undefined : elem
}

export function getNodes() {
  return cy.nodes()
}

export function getEdges() {
  return cy.edges()
}

export function getElements() {
  return cy.elements()
}
