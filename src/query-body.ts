import { GraphElement, QueryGraph } from "./api/swagger"

let body: QueryGraph
let selectedGraphElement: GraphElement

export function setBody(newBody: QueryGraph) {
  body = newBody
  return body
}

export function setSelectedGraphElement(newGraphElement: GraphElement) {
  selectedGraphElement = newGraphElement
}

export function getBody() { return body }
export function getSelectedGraphElement() { return selectedGraphElement }