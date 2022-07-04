import { EntityTypeEnum, HeadElement } from "../api/swagger"
import { guessDataType } from "../ontology-graph"
import * as GEUtility from "./graph-element-utility"

export function getHeadElementWithDatatype(headElem: HeadElement) {

  if (headElem.graphElementId) {
    let relatedGraphElem = GEUtility.getGraphElementByID(headElem.graphElementId)
    if (relatedGraphElem) {
      const relatedGraphElemIri = GEUtility.getIri(relatedGraphElem)
      if (relatedGraphElemIri) {
        headElem['entityType'] = GEUtility.getEntityType(relatedGraphElem)
        headElem['dataType'] = headElem['entityType'] === EntityTypeEnum.DataProperty
          ? guessDataType(relatedGraphElemIri)
          : null
        return headElem
      }
    }
  }

  return headElem
}