import { HeadElement, QueryGraph } from "../api/swagger"
import core from "../core"
import * as model from "../model"
import * as ontologyGraph from "../ontology-graph"
import getGscape from "../ontology-graph/get-gscape"
import * as queryGraph from "../query-graph"
import * as queryHead from "../query-head"
import { getHeadElementWithDatatype } from "../util/head-element-utility"
import { classSelector, countStarToggle, distinctToggle, filterListDialog, limitInput, offsetInput, sparqlDialog, startRunButtons } from "../widgets"
import { emptyQueryMsg } from "../widgets/assets/texts"
import { clearHighlights } from "./highlights"

export default function onNewBody(newBody: QueryGraph) {
  // empty query
  if (!newBody.graph) {
    model.setActiveElement(undefined)
    model.getOriginGrapholNodes().clear()
    clearHighlights()
    getGscape().unselect()
    distinctToggle.checked = true
    countStarToggle.checked = false
    startRunButtons.queryName = undefined

    limitInput.value = ''
    offsetInput.value = ''

    if (model.isFullPageActive()) {
      classSelector.show()
    }
  }
  startRunButtons.canQueryRun = newBody.graph?.id !== undefined && !model.isStandalone() && core.onQueryRun !== undefined

  let body = model.setQueryBody(newBody)
  queryGraph.widget.isBGPEmpty = body.graph === null || body.graph === undefined
  queryGraph.render(body.graph)
  const deletedNodeIds = queryGraph.removeNodesNotInQuery()
  deletedNodeIds.forEach(id => model.getOriginGrapholNodes().delete(id))
  queryGraph.renderOptionals(body.optionals)

  queryHead.render(body.head?.map((headElem: HeadElement) =>
    getHeadElementWithDatatype(headElem)
  ))

  filterListDialog.filterList = model.getFiltersOnVariable(filterListDialog.variable)

  sparqlDialog.text = body?.sparql ? body.sparql : emptyQueryMsg()

  distinctToggle.disabled =
    countStarToggle.disabled =
    limitInput.disabled =
    offsetInput.disabled =
    newBody?.graph ? false : true

  if (!distinctToggle.disabled)
    distinctToggle.classList.add('actionable')

  if (!countStarToggle.disabled)
    countStarToggle.classList.add('actionable')

  model.setQueryDirtyState(true)
}