import { Filter, GraphElement, HeadElement, QueryGraph } from "./api/swagger"

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

export function getFiltersOnHeadElement(headElement: HeadElement) {
  return body.filters?.filter(filter =>
    filter.expression.parameters[0].value === headElement.var
  )
}

export function addFilter(filter:Filter) {
  if(!body.filters) body.filters = []
  body.filters.push(filter)
}