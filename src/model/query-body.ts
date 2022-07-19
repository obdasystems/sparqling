import { GraphElement, HeadElement, QueryGraph } from "../api/swagger"
import { EntityOccurrence } from 'grapholscape'

let body: QueryGraph
let selectedGraphElement: GraphElement | undefined
export const COUNT_STAR_ID = '?COUNT_STAR'

// map GraphElementId+IRI -> EntityOccurrence: { OriginGrapholNodeID, diagramId }
// Use iri to distinguish children of a GraphElement
const originGrapholNodes: Map<string, EntityOccurrence> = new Map()

export function setQueryBody(newBody: QueryGraph) {
  body = newBody
  return body
}

export function setSelectedGraphElement(newGraphElement: GraphElement | undefined) {
  selectedGraphElement = newGraphElement
}

export function getQueryBody() { return body }
export function getSelectedGraphElement() { return selectedGraphElement }

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
  return body?.head?.length === 1 && body?.head[0]?.graphElementId === null
}

export function getCountStarHeadElement(): HeadElement | undefined {
  return isCountStarActive() ? body?.head[0] : undefined
}