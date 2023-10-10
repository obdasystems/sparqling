import { EntityTypeEnum, QueryGraphBGPApi, QueryGraphExtraApi } from "../api/swagger";
import { performHighlights } from "../main";
import { handlePromise } from "../main/handle-promises";
import onNewBody from "../main/on-new-body";
import { getBasePath, getRequestOptions, hasEntityEmptyUnfolding, setActiveElement } from "../model";
import { getGscape, selectEntity } from "../ontology-graph";
import { selectElement } from "../query-graph";
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
    setActiveElement({
      graphElement: newQueryBody.graph,
      iri: classEntity.iri
    })

    onNewBody(newQueryBody)
    classSelector.hide()
    if (newQueryBody.graph.id)
      selectElement(newQueryBody.graph.id)

    performHighlights(classEntity.iri.fullIri)
    selectEntity(classEntity.iri.fullIri)
  }
}) as unknown as EventListener)


classSelector.addEventListener('confirm-shortest-path', (async (event: CustomEvent) => {
  console.log(event.detail)
}) as unknown as EventListener)