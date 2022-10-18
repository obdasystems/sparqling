import { QueryGraphBGPApi, QueryGraphExtraApi } from "../api/swagger";
import { performHighlights } from "../main";
import { handlePromise } from "../main/handle-promises";
import onNewBody from "../main/on-new-body";
import { computeHighlights, getBasePath, getRequestOptions, setActiveElement, transformHighlightsToPrefixedIRIs } from "../model";
import { getGscape } from "../ontology-graph";
import { selectElement } from "../query-graph";
import { classSelector, highlightsList } from "../widgets";

classSelector.onClassSelection(async (classIri: string) => {
  const qgBGPApi = new QueryGraphBGPApi(undefined, getBasePath())
  const qgExtraApi = new QueryGraphExtraApi(undefined, getBasePath())
  const classEntity = getGscape().ontology.getEntity(classIri)
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
  }
})