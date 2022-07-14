import { HeadElement, QueryGraph } from "../api/swagger"
import core from "../core"
import * as model from "../model"
import * as ontologyGraph from "../ontology-graph"
import getGscape from "../ontology-graph/get-gscape"
import * as queryGraph from "../query-graph"
import * as queryHead from "../query-head"
import { getHeadElementWithDatatype } from "../util/head-element-utility"
import { countStarToggle, distinctToggle, filterListDialog, limit, offset, sparqlDialog, startRunButtons } from "../widgets"
import { emptyQueryMsg } from "../widgets/assets/texts"

export default function onNewBody(newBody: QueryGraph) {
  const limitInputElement = limit.querySelector('input')
  const offsetInputElement = offset.querySelector('input')

  // empty query
  if (!newBody.graph) {
    model.setSelectedGraphElement(undefined)
    model.getOriginGrapholNodes().clear()
    ontologyGraph.resetHighlights()
    getGscape().unselectEntity()
    distinctToggle.state = false
    countStarToggle.state = false

    if (limitInputElement)
      limitInputElement.value = ''

    if (offsetInputElement)
      offsetInputElement.value = ''
  }
  startRunButtons.canQueryRun = newBody.graph && !model.isStandalone() && core.onQueryRun !== undefined

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

  if (limitInputElement && offsetInputElement) {
    distinctToggle.disabled =
      countStarToggle.disabled =
      limitInputElement.disabled =
      offsetInputElement.disabled =
      newBody?.graph ? false : true
  }

}