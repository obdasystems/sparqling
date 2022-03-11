import { EntityTypeEnum, HeadElement } from "../api/swagger"
import { guessDataType } from "../ontology-graph"
import * as GEUtility from "./graph-element-utility"

export function getHeadElementWithDatatype(headElem: HeadElement) {
  let relatedGraphElem = GEUtility.getGraphElementByID(headElem.graphElementId)
  headElem['entityType'] = GEUtility.getEntityType(relatedGraphElem)
  headElem['dataType'] = headElem['entityType'] === EntityTypeEnum.DataProperty
    ? guessDataType(GEUtility.getIri(relatedGraphElem))
    : null
  return headElem
}