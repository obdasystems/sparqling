import { QueryGraphHeadApiFactory } from '../api/swagger'
import { deleteFilter, showFilterDialogEditingMode, showFilterDialogForVariable } from './filters-handlers'
import * as ontologyGraph from '../ontology-graph'
import * as model from '../model'
import * as queryGraph from '../query-graph'
import * as queryHead from '../query-head'
import { getGraphElementByID, getIri } from '../util/graph-element-utility'
import { sparqlDialog } from '../widgets'
import onNewBody from '../main/on-new-body'

queryHead.onDelete(async headElement => {
  const qgApi = QueryGraphHeadApiFactory()
  const body = model.getQueryBody()
  let newBody = (await qgApi.deleteHeadTerm(headElement.id, body)).data
  onNewBody(newBody)
})

queryHead.onRename(async (headElement, alias) => {
  const qgApi = QueryGraphHeadApiFactory()
  const body = model.getQueryBody()
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

queryHead.onAddFilter(headElement => {
  const graphElement = getGraphElementByID(headElement.graphElementId)
  showFilterDialogForVariable(graphElement)
})

queryHead.onEditFilter((filterId) => {
  showFilterDialogEditingMode(filterId)
})

queryHead.onDeleteFilter((filterId) => {
  deleteFilter(filterId)
})