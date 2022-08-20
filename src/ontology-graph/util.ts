import { CollectionReturnValue, StylesheetStyle } from "cytoscape"
import { EntityOccurrence } from "grapholscape"
import { VarOrConstantConstantTypeEnum } from "../api/swagger"
import getGscape from "./get-gscape"

/**
 * Search a value-domain node in the neighborhood of an Entity
 * @param iri the Entity IRI
 */
// export function guessDataType(iri:string): VarOrConstantConstantTypeEnum | undefined {
//   let gscape = getGscape()
//   // search entities in the standard graphol ontologies because in simplified versions
//   // datatype are not present
//   let nodes = gscape.ontologies.default.getEntityOccurrences(iri)
//   if (!nodes) return
//   // for each node we have, find a range node leading to a datatype
//   for (let node of nodes) {
//     let valueDomainNodes = node
//       .openNeighborhood(`[type = "${Type.RANGE_RESTRICTION}"]`)
//       .openNeighborhood(`[type = "${Type.VALUE_DOMAIN}"]`)

//     if (valueDomainNodes[0] && valueDomainNodes.length > 0) {
//       let valueDomainType = valueDomainNodes[0].data().iri.prefixed // xsd:(??)
//       let key = Object.keys(VarOrConstantConstantTypeEnum).find( k => {
//         return VarOrConstantConstantTypeEnum[k] === valueDomainType
//       })
//       if (key) return VarOrConstantConstantTypeEnum[key]
//     }
//   }
// }

/**
 * Get the entity occurrence (elementId, diagramId).
 * Prefer instance in actual diagram, pick first one in the list as fallback
 * @param entityIri the entity's IRI to look for
 */
export function getEntityOccurrence(entityIri: string): EntityOccurrence | undefined {
  const gscape = getGscape()
  // Prefer instance in actual diagram, first one as fallback
  const selectedClassEntity = gscape.ontology.getEntity(entityIri)
  const selectedClassOccurrences = selectedClassEntity.occurrences.get(gscape.renderState)
  if (selectedClassOccurrences) {
    return selectedClassOccurrences?.find(occurrence => occurrence.diagramId === gscape.diagramId) ||
      selectedClassOccurrences[0]
  }
}

export function addStylesheet(cy: any, stylesheet: StylesheetStyle[]) {
  stylesheet.forEach(styleObj => {
    cy.style().selector(styleObj.selector).style(styleObj.style)
  })
}