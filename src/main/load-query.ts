import { GrapholRendererState, ui } from "grapholscape";
import { QueryGraph } from "../api/swagger";
import * as model from "../model";
import { getGscape } from "../ontology-graph";
import * as queryGraph from "../query-graph";
import { setTheme } from "../query-graph/renderer";
import { getIri } from "../util/graph-element-utility";
import { classSelector, countStarToggle, distinctToggle, limitInput, offsetInput } from "../widgets";
import clearQuery from "./clear-query";
import { performHighlights } from "./highlights";
import onNewBody from "./on-new-body";

export default async function (queryBody: QueryGraph) {
  await clearQuery()
  // Hide selectors
  classSelector.hide();
  (getGscape().widgets.get(ui.WidgetEnum.INITIAL_RENDERER_SELECTOR) as any).hide()

  const grapholscape = getGscape()

  if (!grapholscape.renderState && !model.isFullPageActive()) {
    grapholscape.setRenderer(new GrapholRendererState())
  }

  onNewBody(queryBody)

  /**
   * // FIXME: Update style in order to make all elements visible.
   * without this edges might not be visible.
   */
  setTheme(grapholscape.theme)

  const activeElementIri = getIri(queryBody.graph)
  if (activeElementIri) {
    const iri = grapholscape.ontology.getEntity(activeElementIri)?.iri
    if (iri) {
      model.setActiveElement({
        graphElement: queryBody.graph,
        iri: iri
      })

      queryGraph.selectElement(activeElementIri)
      performHighlights(activeElementIri)
    }
  }

  countStarToggle.checked = model.isCountStarActive()
  distinctToggle.checked = model.isDistinctActive()

  if (queryBody.limit && queryBody.limit > 0)
    limitInput.value = queryBody.limit.toString()

  if (queryBody.offset || queryBody.offset === 0)
    offsetInput.value = queryBody.offset.toString()
}