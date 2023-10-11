import { EntityTypeEnum, QueryGraphBGPApi, QueryGraphExtraApi } from "../api/swagger";
import { handlePromise } from "../main/handle-promises";
import onNewBody from "../main/on-new-body";
import { getBasePath, getRequestOptions, hasEntityEmptyUnfolding } from "../model";
import { getGscape } from "../ontology-graph";
import { classSelector } from "../widgets";

classSelector.addEventListener('class-selection', (async (event: CustomEvent<string>) => {
  const classIri = event.detail
  if (hasEntityEmptyUnfolding(classIri, EntityTypeEnum.Class))
    return

  const qgBGPApi = new QueryGraphBGPApi(undefined, getBasePath())
  const qgExtraApi = new QueryGraphExtraApi(undefined, getBasePath())
  const classEntity = getGscape().ontology.getEntity(classIri)

  if (!classEntity) return

  const tempNewQueryBody = await handlePromise(qgBGPApi.getQueryGraph(classEntity.iri.fullIri, getRequestOptions()))
  const newQueryBody = await handlePromise(qgExtraApi.distinctQueryGraph(true, tempNewQueryBody, getRequestOptions()))

  if (newQueryBody) {
    onNewBody(newQueryBody)
    classSelector.hide()
  }
}) as unknown as EventListener)


classSelector.addEventListener('confirm-shortest-path', (async (event: CustomEvent) => {
  console.log(event.detail)
}) as unknown as EventListener)