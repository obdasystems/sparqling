import { GraphElement, HeadElement, QueryGraph } from "../api/swagger"
import { EntityOccurrence, Iri } from 'grapholscape'

let body: QueryGraph

export type ActiveElement = {
  graphElement: GraphElement,
  iri: Iri,
}
let activeElement: ActiveElement | undefined

export const COUNT_STAR_ID = '?COUNT_STAR'

// map GraphElementId+IRI -> EntityOccurrence: { OriginGrapholNodeID, diagramId }
// Use iri to distinguish children of a GraphElement
const originGrapholNodes: Map<string, EntityOccurrence> = new Map()

export function setQueryBody(newBody: QueryGraph) {
  body = newBody
  return body
}

export function setActiveElement(newActiveElement: ActiveElement | undefined) {
  activeElement = newActiveElement
}

export function getActiveElement() { return activeElement }

export function getQueryBody() { return body }

export function getOriginGrapholNodes() {
  return originGrapholNodes
}

export function getTempQueryBody(): QueryGraph {
  return JSON.parse(JSON.stringify(body))
}

export function getHeadElementByID(headElementId: string, queryBody = body): HeadElement | undefined {
  return queryBody?.head?.find(headElement => headElement.id === headElementId)
}

export function isCountStarActive(): boolean {
  return body?.count_star || false
}

export function isDistinctActive(): boolean {
  return body?.distinct || false
}