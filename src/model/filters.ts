import { Filter, VarOrConstantTypeEnum } from "../api/swagger"
import { getQueryBody } from './query-body'

/**
 * Add a filter to the model and return its ID
 * @param filter filter to add
 * @returns the ID of the new filter
 */
export function addFilter(filter: Filter) {
  const body = getQueryBody()
  if (!body.filters) body.filters = []
  return body.filters.push(filter) - 1
}

export function removeFilter(filterId: number) {
  const body = getQueryBody()
  body?.filters?.splice(filterId, 1)
}

export function getFilterById(filterId: number) {
  const body = getQueryBody()
  return body.filters[filterId]
}

export function updateFilter(filterId: number, filter: Filter) {
  const body = getQueryBody()
  body.filters[filterId] = filter
}

export function getFiltersOnVariable(variable: string) {
  const body = getQueryBody()
  let filters = body?.filters?.map((filter, index) => {
    return { id: index, value: filter } 
  })

  return filters?.filter(f => {
    return f.value.expression.parameters[0].type === VarOrConstantTypeEnum.Var &&
      f.value.expression.parameters[0].value === variable
  })
}