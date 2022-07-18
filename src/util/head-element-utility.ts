// import { EntityTypeEnum, HeadElement } from "../api/swagger"
// import { guessDataType } from "../ontology-graph"
// import * as GEUtility from "./graph-element-utility"

// export function getHeadElementWithDatatype(headElement: HeadElement) {
//   const headElementCopy = JSON.parse(JSON.stringify(headElement))
//   if (headElementCopy.graphElementId) {
//     let relatedGraphElem = GEUtility.getGraphElementByID(headElementCopy.graphElementId)
//     if (relatedGraphElem) {
//       const relatedGraphElemIri = GEUtility.getIri(relatedGraphElem)
//       if (relatedGraphElemIri) {
//         headElementCopy['entityType'] = GEUtility.getEntityType(relatedGraphElem)
//         headElementCopy['dataType'] = headElementCopy['entityType'] === EntityTypeEnum.DataProperty
//           ? guessDataType(relatedGraphElemIri)
//           : null
//         return headElementCopy
//       }
//     }
//   }

//   return headElementCopy
// }