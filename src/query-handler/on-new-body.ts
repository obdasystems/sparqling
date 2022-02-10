import { EntityTypeEnum, HeadElement, QueryGraph } from "../api/swagger/models"
import * as queryBody from "./query-body"
import * as queryGraph from "../query-graph"
import * as queryHead from "../query-head"
import * as GEUtility from "../util/graph-element-utility"
import { guessDataType } from "../ontology-graph"
import { sparqlDialog } from "../widgets"
import { emptyQueryMsg } from "../widgets/assets/texts"

export default function onNewBody(newBody: QueryGraph) {
  let body = queryBody.setBody(newBody)
  queryGraph.setGraph(body.graph)
  queryGraph.render(body.graph)
  queryGraph.removeNodesNotInQuery()

  queryHead.setHead(body.head)
  queryHead.render(body.head?.map((headElem: HeadElement) => {
    let relatedGraphElem = GEUtility.getGraphElementByID(headElem.graphElementId)
    headElem['entityType'] = GEUtility.getEntityType(relatedGraphElem)
    headElem['dataType'] = headElem['entityType'] === EntityTypeEnum.DataProperty
      ? guessDataType(GEUtility.getIri(relatedGraphElem))
      : null
    return headElem
  }))

  sparqlDialog.text = body?.sparql ? body.sparql : emptyQueryMsg()
}