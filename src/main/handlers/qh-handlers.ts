import { QueryGraphFilterApiFactory, QueryGraphHeadApiFactory } from '../../api/swagger'
import * as queryHead from '../../query-head'
import * as queryGraph from '../../query-graph'
import * as ontologyGraph from '../../ontology-graph'
import onNewBody from '../on-new-body'
import * as queryBody from '../../query-body'
import { sparqlDialog } from '../../widgets'
import { getGraphElementByID, getIri } from '../../util/graph-element-utility'

queryHead.onDelete(async headElement => {
  const qgApi = QueryGraphHeadApiFactory()
  const body = queryBody.getBody()
  let newBody = (await qgApi.deleteHeadTerm(headElement.id, body)).data
  onNewBody(newBody)
})

queryHead.onRename(async (headElement, alias) => {
  const qgApi = QueryGraphHeadApiFactory()
  const body = queryBody.getBody()
  headElement.alias = alias
  let newBody = (await qgApi.renameHeadTerm(headElement.id, body)).data
  onNewBody(newBody)
})

queryHead.onLocalize(headElement => {
  let graphElement = getGraphElementByID(headElement.graphElementId)
  queryGraph.centerOnElem(graphElement)
  ontologyGraph.focusNodeByIRI(getIri(graphElement))
})

queryHead.sparqlButton.onClick = () => {
  sparqlDialog.isVisible ? sparqlDialog.hide() : sparqlDialog.show()
}

queryHead.onSetFilter(async (filter, headElement) => {
  let existingFilter = queryBody.getFiltersOnHeadElement(headElement)?.find(f => f.expression.operator === filter.expression.operator)
  if (existingFilter) {
    // TODO Edit existing filter
  } else {
    let newFilterId = queryBody.getBody().filters?.length || 0
    queryBody.addFilter(filter)
    const filterApi = QueryGraphFilterApiFactory()
    const newBody = (await filterApi.newFilter(newFilterId, queryBody.getBody())).data
    onNewBody(newBody)
  }
})