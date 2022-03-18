import { HeadElement, QueryGraph } from "../api/swagger"
import * as queryBody from "../query-body"
import * as queryGraph from "../query-graph"
import * as queryHead from "../query-head"
import { getHeadElementWithDatatype } from "../util/head-element-utility"
import { sparqlDialog } from "../widgets"
import { emptyQueryMsg } from "../widgets/assets/texts"

export default function onNewBody(newBody: QueryGraph) {
  let body = queryBody.setBody(newBody)
  queryGraph.setGraph(body.graph)
  queryGraph.render(body.graph)
  const deletedNodeIds = queryGraph.removeNodesNotInQuery()
  deletedNodeIds.forEach(id => queryBody.getOriginGrapholNodes().delete(id))
  queryGraph.renderOptionals(body.optionals)

  queryHead.setHead(body.head)
  queryHead.render(body.head?.map((headElem: HeadElement) => 
    getHeadElementWithDatatype(headElem)
  ))

  sparqlDialog.text = body?.sparql ? body.sparql : emptyQueryMsg()
}