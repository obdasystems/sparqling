import { Filter, FilterExpressionOperatorEnum, GraphElement, HeadElement, QueryGraph, VarOrConstant, VarOrConstantTypeEnum } from "./api/swagger"

let body: QueryGraph
let selectedGraphElement: GraphElement
let filtersMap: Map<number, Filter> = new Map()
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
  let filtersIterator = filtersMap.entries()
  let res: { id: number, value: Filter }[] = []
  let filterEntry = filtersIterator.next()
  while (filterEntry.value) {
    let filterId: number = filterEntry.value[0]
    let filter: Filter = filterEntry.value[1]
    if (filter.expression.parameters[0].type === VarOrConstantTypeEnum.Var &&
      filter.expression.parameters[0].value === headElement.var) {
      res.push({
        id: filterId,
        value: filter,
      })
    }
    filterEntry = filtersIterator.next()
  }
  return res
}

export function addFilter(filter: Filter) {
  if (!body.filters) body.filters = []
  body.filters.push(filter)
  const filterId = getNewFilterId()
  filtersMap.set(filterId, filter)
  return filterId
}

export function removeFilter(filterId: number) {
  const filter = filtersMap.get(filterId)
  const filterIndexInArray = body?.filters?.findIndex(f => f === filter)
  body?.filters?.splice(filterIndexInArray, 1)
  filtersMap.delete(filterId)
}

export function getFilterById(filterId: number) {
  return filtersMap.get(filterId)
}

export function updateFilter(filterId: number, filter: Filter) {
  filtersMap.set(filterId, filter)
}

function getNewFilterId() {
  if (counterFiltersId) {
    counterFiltersId += 1
  } else {
    counterFiltersId = 0
  }
  return counterFiltersId
}