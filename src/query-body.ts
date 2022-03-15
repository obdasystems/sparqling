import { Filter, GraphElement, HeadElement, QueryGraph, VarOrConstantTypeEnum } from "./api/swagger"

let body: QueryGraph
let selectedGraphElement: GraphElement
let counterFiltersId: number

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
  let filters = body?.filters?.map((filter, index) => {
    return { id: index, value: filter } 
  })

  return filters?.filter(f => {
    return f.value.expression.parameters[0].type === VarOrConstantTypeEnum.Var &&
      f.value.expression.parameters[0].value === headElement.var
  })
}

/**
 * Add a filter to the model and return its ID
 * @param filter filter to add
 * @returns the ID of the new filter
 */
export function addFilter(filter: Filter) {
  if (!body.filters) body.filters = []
  return body.filters.push(filter) - 1
}

export function removeFilter(filterId: number) {
  body?.filters?.splice(filterId, 1)
}

export function getFilterById(filterId: number) {
  return body.filters[filterId]
}

export function updateFilter(filterId: number, filter: Filter) {
  body.filters[filterId] = filter
  //writeFilterMapInQueryBody()
}

function getNewFilterId() {
  if (counterFiltersId !== null && counterFiltersId !== undefined) {
    counterFiltersId += 1
  } else {
    counterFiltersId = 0
  }
  return counterFiltersId
}

function writeFilterMapInQueryBody() {
  body.filters = []
  //filtersMap.forEach(filter => body.filters.push(filter))
}