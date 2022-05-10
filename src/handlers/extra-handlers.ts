import { QueryGraphExtraApi, QueryGraphHeadApi } from "../api/swagger";
import { handlePromise } from "../main/handle-promises";
import onNewBody from "../main/on-new-body";
import { getQueryBody, isCountStarActive } from "../model";
import { countStarToggle, distinctToggle, limit, offset } from "../widgets";

distinctToggle.onToggle = () => {
  if (!isCountStarActive()) {
    setMainDistinct(distinctToggle.state)
  } else {
    const qExtraApi = new QueryGraphExtraApi()
    handlePromise(qExtraApi.countStarQueryGraph(distinctToggle.state, getQueryBody())).then(newBody => onNewBody(newBody))
  }
}

export function setMainDistinct(value: boolean) {
  const qExtraApi = new QueryGraphExtraApi()
  handlePromise(qExtraApi.distinctQueryGraph(value, getQueryBody())).then(newBody => {
    onNewBody(newBody)
  })
}

getInputElement(limit).onchange = handleLimitChange
getInputElement(limit).addEventListener('focusout', handleLimitChange)
getInputElement(limit).onsubmit = handleOffsetChange

getInputElement(offset).onchange = handleOffsetChange
getInputElement(offset).addEventListener('focusout', handleOffsetChange)
getInputElement(offset).onsubmit = handleOffsetChange

countStarToggle.onToggle = () => {
  const queryBody = getQueryBody()
  const qExtraApi = new QueryGraphExtraApi()
  const distinct = distinctToggle.state

  if (isCountStarActive()) {
    // remove headElement associated to count star
    const qHeadApi = new QueryGraphHeadApi()
    handlePromise(qHeadApi.deleteHeadTerm(queryBody.head[0].id, queryBody)).then(newBody => {
      onNewBody(newBody)
      setMainDistinct(distinct)
    })
  } else {
    // add count star
    handlePromise(qExtraApi.countStarQueryGraph(distinct, queryBody)).then(newBody => {
      onNewBody(newBody)
      setMainDistinct(false)
    })
  }
}

function handleOffsetChange() {
  const queryBody = getQueryBody()
  if (!queryBody?.graph) return

  const input = getInputElement(offset)
  let value = input.valueAsNumber
  const qExtraApi = new QueryGraphExtraApi()

  if (input.reportValidity() && value !== queryBody.offset) {
    // if NaN but valid, then th field is empty, pass -1 to remove the offset
    if (isNaN(value)) {
      value = -1

      if(value === queryBody.offset || !queryBody.offset) {
        //if offset is not set, no need to remove it, return
        return
      }
    }
    handlePromise(qExtraApi.offsetQueryGraph(value, queryBody)).then(newBody => {
      onNewBody(newBody)
    })
  } else {
    input.value = queryBody.offset > 0 ? queryBody.offset.toString() : null
  }
}

function handleLimitChange() {
  const queryBody = getQueryBody()
  if (!queryBody?.graph) return

  const input = getInputElement(limit)
  let value = input.valueAsNumber
  const qExtraApi = new QueryGraphExtraApi()

  if (input.reportValidity() && value !== queryBody.limit) {
    // if NaN but valid, then th field is empty, pass -1 to remove the limit
    if (isNaN(value)) {
      value = -1

      if(value === queryBody.limit || !queryBody.limit) {
        //if limit is not set, no need to remove it, return
        return
      }
    }
    handlePromise(qExtraApi.limitQueryGraph(value, queryBody)).then(newBody => {
      onNewBody(newBody)
    })
  } else {
    input.value = queryBody.limit > 0 ? queryBody.limit.toString() : null
  }
}

function getInputElement(elem: HTMLDivElement) {
  return elem.querySelector('input')
}