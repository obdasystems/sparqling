import { HeadElement, QueryGraph } from "../api/swagger"
import { setDistinct } from "../handlers/extra-handlers"
import * as model from "../model"
import * as ontologyGraph from "../ontology-graph"
import getGscape from "../ontology-graph/get-gscape"
import * as queryGraph from "../query-graph"
import * as queryHead from "../query-head"
import { getHeadElementWithDatatype } from "../util/head-element-utility"
import { sparqlDialog, filterListDialog, distinctToggle, offset, limit, countStarToggle } from "../widgets"
import { emptyQueryMsg } from "../widgets/assets/texts"

export default function onNewBody(newBody: QueryGraph) {
  // empty query
  if (!newBody.graph) {
    model.setSelectedGraphElement(null)
    model.getOriginGrapholNodes().clear()
    ontologyGraph.resetHighlights()
    getGscape().unselectEntity()
    distinctToggle.state = false
    countStarToggle.state = false
    limit.querySelector('input').value = null
    offset.querySelector('input').value = null
  }

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
    limit.querySelector('input').disabled =
    offset.querySelector('input').disabled =
    newBody?.graph ? false : true
}