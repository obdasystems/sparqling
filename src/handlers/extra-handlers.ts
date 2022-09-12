import { QueryGraphExtraApi } from "../api/swagger";
import { handlePromise } from "../main/handle-promises";
import onNewBody from "../main/on-new-body";
import { getBasePath, getQueryBody, getRequestOptions, isCountStarActive, isDistinctActive } from "../model";
import { validateInputElement } from "../widgets/forms/validate-form";

export function handleDistinctChange() {
  const qExtraApi = new QueryGraphExtraApi(undefined, getBasePath())
  handlePromise(qExtraApi.distinctQueryGraph(!isDistinctActive(), getQueryBody(), getRequestOptions())).then(newBody => {
    onNewBody(newBody)
  })
}

export function handleCountStarChange() {
  const qExtraApi = new QueryGraphExtraApi(undefined, getBasePath())
  handlePromise(qExtraApi.countStarQueryGraph(!isCountStarActive(), getQueryBody(), getRequestOptions())).then(newBody => {
    onNewBody(newBody)
  })
}

export function handleOffsetChange(evt: Event) {
  const queryBody = getQueryBody()
  if (!queryBody?.graph) return

  const input = evt.currentTarget as HTMLInputElement

  if (input) {
    let value = input.valueAsNumber
    const qExtraApi = new QueryGraphExtraApi(undefined, getBasePath())

    if (validateInputElement(input) && value !== queryBody.offset) {
      // if NaN but valid, then th field is empty, pass -1 to remove the offset
      if (isNaN(value)) {
        value = -1

        if (value === queryBody.offset || !queryBody.offset) {
          //if offset is not set, no need to remove it, return
          return
        }
      }
      handlePromise(qExtraApi.offsetQueryGraph(value, queryBody, getRequestOptions())).then(newBody => {
        onNewBody(newBody)
      })
    } else {
      input.value = queryBody.offset && queryBody.offset > 0
        ? queryBody.offset.toString()
        : ''
    }
  }
}

export function handleLimitChange(evt: Event) {
  const queryBody = getQueryBody()
  if (!queryBody?.graph) return

  const input = evt.currentTarget as HTMLInputElement

  if (input) {
    let value = input.valueAsNumber
    const qExtraApi = new QueryGraphExtraApi(undefined, getBasePath())

    if (validateInputElement(input) && value !== queryBody.limit) {
      // if NaN but valid, then th field is empty, pass -1 to remove the limit
      if (isNaN(value)) {
        value = -1

        if (value === queryBody.limit || !queryBody.limit) {
          //if limit is not set, no need to remove it, return
          return
        }
      }
      handlePromise(qExtraApi.limitQueryGraph(value, queryBody, getRequestOptions())).then(newBody => {
        onNewBody(newBody)
      })
    } else {
      input.value = queryBody.limit && queryBody.limit > 0 ? queryBody.limit.toString() : ''
    }
  }
}