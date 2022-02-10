import { QueryGraphApiFactory } from '../api/swagger'
import * as queryHead from '../query-head'
import * as queryGraph from '../query-graph'
import * as ontologyGraph from '../ontology-graph'
import onNewBody from './on-new-body'
import * as queryBody from './query-body'
import { sparqlDialog } from '../widgets'
import { getGraphElementByID, getIri } from '../util/graph-element-utility'

queryHead.onDelete(async headElement => {
  const qgApi = QueryGraphApiFactory()
  const body = queryBody.getBody()
  let newBody = (await qgApi.deleteHeadTerm(body, headElement.id)).data
  onNewBody(newBody)
})

queryHead.onRename(async (headElement, alias) => {
  const qgApi = QueryGraphApiFactory()
  const body = queryBody.getBody()
  headElement.alias = alias
  let newBody = (await qgApi.renameHeadTerm(body, headElement.id)).data
  onNewBody(newBody)
})

queryHead.onLocalize(headElement => {
  const body = queryBody.getBody()
  let graphElement = getGraphElementByID(headElement.graphElementId)
  queryGraph.centerOnElem(graphElement)
  ontologyGraph.focusNodeByIRI(getIri(graphElement))
})

queryHead.sparqlButton.onClick = () => {
  sparqlDialog.isVisible ? sparqlDialog.hide() : sparqlDialog.show()
}