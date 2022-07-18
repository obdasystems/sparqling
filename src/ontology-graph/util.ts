import { CollectionReturnValue, StylesheetStyle } from "cytoscape"
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

export function addStylesheet(cy: any, stylesheet: StylesheetStyle[]) {
  stylesheet.forEach(styleObj => {
    cy.style().selector(styleObj.selector).style(styleObj.style)
  })
}