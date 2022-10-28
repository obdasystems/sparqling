import { GrapholRendererState, RendererStatesEnum, ui } from "grapholscape";
import { QueryGraph } from "../api/swagger";
import * as model from "../model";
import { getGscape } from "../ontology-graph";
import { getIri } from "../util/graph-element-utility";
import { classSelector, countStarToggle, distinctToggle, limitInput, offsetInput } from "../widgets";
import { performHighlights } from "./highlights";
import onNewBody from "./on-new-body";
import * as queryGraph from "../query-graph"

export default function (queryBody: QueryGraph) {
  // Hide selectors
  classSelector.hide();
  (getGscape().widgets.get(ui.WidgetEnum.INITIAL_RENDERER_SELECTOR) as any).hide()

  const grapholscape = getGscape()

  if (!grapholscape.renderState && !model.isFullPageActive()) {
    grapholscape.setRenderer(new GrapholRendererState())
  }

  onNewBody(queryBody)
  const activeElementIri = getIri(queryBody.graph)
  if (activeElementIri) {
    model.setActiveElement({
      graphElement: queryBody.graph,
      iri: grapholscape.ontology.getEntity(activeElementIri).iri
    })

    queryGraph.selectElement(activeElementIri)
    performHighlights(activeElementIri)
  }

  countStarToggle.checked = model.isCountStarActive()
  distinctToggle.checked = model.isDistinctActive()

  if (queryBody.limit && queryBody.limit > 0)
    limitInput.value = queryBody.limit.toString()

  if (queryBody.offset || queryBody.offset === 0)
    offsetInput.value = queryBody.offset.toString()
}