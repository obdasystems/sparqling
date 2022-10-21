import { ui } from "grapholscape";
import { QueryGraph } from "../api/swagger";
import { getActiveElement, getQueryBody, setActiveElement } from "../model";
import { getGscape } from "../ontology-graph";
import { getIri } from "../util/graph-element-utility";
import { classSelector } from "../widgets";
import clearQuery from "./clear-query";
import { performHighlights } from "./highlights";
import onNewBody from "./on-new-body";
import * as queryGraph from "../query-graph"

export default function(queryBody: QueryGraph) {
  const grapholscape = getGscape()
  onNewBody(queryBody)
  const activeElementIri = getIri(queryBody.graph)
  if (activeElementIri) {
    setActiveElement({
      graphElement: queryBody.graph,
      iri: grapholscape.ontology.getEntity(activeElementIri).iri
    })

    queryGraph.selectElement(activeElementIri)
    performHighlights(activeElementIri)
  }

  // Hide selectors
  classSelector.hide();
  (getGscape().widgets.get(ui.WidgetEnum.INITIAL_RENDERER_SELECTOR) as any).hide()
}