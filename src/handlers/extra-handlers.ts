import { QueryGraphExtraApi } from "../api/swagger";
import { handlePromise } from "../main/handle-promises";
import onNewBody from "../main/on-new-body";
import { getQueryBody } from "../model";
import { countStarToggle, distinctToggle, limit, offset } from "../widgets";

distinctToggle.onToggle = () => setDistinct(distinctToggle.state)

export function setDistinct(value: boolean) {
  const qExtraApi = new QueryGraphExtraApi()
  handlePromise(qExtraApi.distinctQueryGraph(value, getQueryBody())).then(newBody => {
    onNewBody(newBody)
  })
}

getInputElement(limit).onchange = handleLimitChange
getInputElement(limit).onblur = handleLimitChange

getInputElement(offset).onchange = handleOffsetChange
getInputElement(offset).onblur = handleOffsetChange

countStarToggle.onToggle = () => {
  const queryBody = getQueryBody()
  const qExtraApi = new QueryGraphExtraApi()
  const distinct = queryBody.distinct ? true : false
  handlePromise(qExtraApi.countStarQueryGraph(distinct, queryBody)).then(newBody => {
    onNewBody(newBody)
  })
}

function handleOffsetChange() {
  const input = getInputElement(offset)
  const value = input.valueAsNumber
  const queryBody = getQueryBody()
  if (input.reportValidity() && queryBody?.graph && value !== queryBody.offset) {
    const qExtraApi = new QueryGraphExtraApi()
    handlePromise(qExtraApi.offsetQueryGraph(value, queryBody)).then(newBody => {
      onNewBody(newBody)
    })
  }
}

function handleLimitChange() {
  const input = getInputElement(limit)
  const value = input.valueAsNumber
  const queryBody = getQueryBody()
  if (input.reportValidity() && queryBody?.graph && value !== queryBody.limit) {
    const qExtraApi = new QueryGraphExtraApi()
    handlePromise(qExtraApi.limitQueryGraph(value, queryBody)).then(newBody => {
      onNewBody(newBody)
    })
  }
}

function getInputElement(elem: HTMLDivElement) {
  return elem.querySelector('input')
}