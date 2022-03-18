import { CollectionReturnValue, SingularData } from "cytoscape"
import centerOnElement from "../util/center-on-element"
import getGscape from "./get-gscape"

/**
 * Select a node without firing cytoscape's selection event
 */
 export async function focusNodeByIRI(iri: string) {
  const gscape = getGscape()
  let occurrences = gscape.ontology.getEntityOccurrences(iri)
  // find the first one in the actual diagram
  let node: CollectionReturnValue = occurrences.find((occ: any) => occ.data('diagram_id') === gscape.actualDiagramID)
  if (!node) node = occurrences[0]
  focusNode(node)
}

export async function focusNodeByIdAndDiagram(nodeId: string) {
  const gscape = getGscape()
  const cyNode = gscape.ontology.getElem(nodeId)
  if (cyNode) {
    focusNode(cyNode)
  }
}

async function focusNode(node: CollectionReturnValue) {
  const gscape = getGscape()
  if (node?.data('diagram_id') !== gscape.actualDiagramID) {
    await gscape.showDiagram(node.data('diagram_id'))
  }

  if (node) {
    centerOnElement(node, 1.5)
  }
}