import { GraphElement, HeadElement, QueryGraph } from "../api/swagger"

let body: QueryGraph
let selectedGraphElement: GraphElement
let standalone: boolean
export const COUNT_STAR_ID = '?COUNT_STAR'

// map GraphElementId+IRI -> OriginGrapholNodeID
// Use iri to distinguish children of a GraphElement
const originGrapholNodes: Map<string, string> = new Map()

export function setQueryBody(newBody: QueryGraph) {
  body = newBody
  return body
}

export function setSelectedGraphElement(newGraphElement: GraphElement) {
  selectedGraphElement = newGraphElement
}

export function getQueryBody() { return body }
export function getSelectedGraphElement() { return selectedGraphElement }

export function getOriginGrapholNodes() {
  return originGrapholNodes
}

export function isStandalone() {
  return standalone
}

export function setStandalone(value: boolean) {
  standalone = value
}

export function getTempQueryBody(): QueryGraph {
  return JSON.parse(JSON.stringify(body))
}

export function getHeadElementByID(headElementId: string, queryBody = body): HeadElement {
  return queryBody?.head?.find(headElement => headElement.id === headElementId)
}

export function isCountStarActive(): boolean {
  return body?.head?.length === 1 && body?.head[0]?.graphElementId === null
}

export function getCountStarHeadElement(): HeadElement {
  return isCountStarActive() ? body?.head[0] : null
}