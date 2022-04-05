import { GraphElement, QueryGraph } from "../api/swagger"

let body: QueryGraph
let selectedGraphElement: GraphElement
let standalone: boolean

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