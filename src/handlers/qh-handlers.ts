import { QueryGraphBGPApiFactory, QueryGraphHeadApiFactory } from '../api/swagger'
import { deleteFilter, showFilterDialogEditingMode, showFilterDialogForVariable } from './filters-handlers'
import * as ontologyGraph from '../ontology-graph'
import * as model from '../model'
import * as queryGraph from '../query-graph'
import * as queryHead from '../query-head'
import { getGraphElementByID, getIri } from '../util/graph-element-utility'
import { sparqlDialog } from '../widgets'
import onNewBody from '../main/on-new-body'
import { handlePromise } from '../main/handle-promises'
import { showFunctionDialogForVariable } from './functions-handlers'

queryHead.onDelete(async headElement => {
  const qgApi = QueryGraphHeadApiFactory()
  const body = model.getQueryBody()
  handlePromise(qgApi.deleteHeadTerm(headElement.id, body)).then(newBody => {
    onNewBody(newBody)
  })
})

queryHead.onRename(async (headElement, alias) => {
  const qgApi = QueryGraphHeadApiFactory()
  const body = model.getQueryBody()
  headElement.alias = alias
  handlePromise(qgApi.renameHeadTerm(headElement.id, body)).then(newBody => {
    onNewBody(newBody)
  })
})

queryHead.onLocalize(headElement => {
  let graphElement = getGraphElementByID(headElement.graphElementId)
  queryGraph.centerOnElem(graphElement)
  ontologyGraph.focusNodeByIRI(getIri(graphElement))
})

queryHead.sparqlButton.onClick = () => {
  sparqlDialog.isVisible ? sparqlDialog.hide() : sparqlDialog.show()
}

queryHead.clearQueryButton.onClick = () => {
  const queryBody = model.getQueryBody()
  if (queryBody?.graph?.id) {
    const qgApi = QueryGraphBGPApiFactory()
    handlePromise(qgApi.deleteGraphElementId(queryBody?.graph?.id, queryBody)).then(newBody => {
      onNewBody(newBody)
    })
  }
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

queryHead.onAddFunction(headElementId => {
  const graphElement = getGraphElementByID(model.getHeadElementByID(headElementId).graphElementId)
  showFunctionDialogForVariable(graphElement)
})

queryHead.onElementSortChange((headElementId, newIndex) => {
  const qhApi = QueryGraphHeadApiFactory()
  const tempQueryBody = model.getTempQueryBody()
  const tempHead = model.getTempQueryBody().head
  console.log(`Old head: ${tempHead.map(h => h.id)}`)
  const headElement = model.getHeadElementByID(headElementId)
  const oldIndex = tempHead.indexOf(headElement)
  
  tempHead.splice(oldIndex, 1) // remove element from old index
  tempHead.splice(newIndex, 0, headElement) // put it back in new index
  
  //handlePromise(qhApi.reoder...).then()
  console.log(`New head: ${tempHead.map(h => h.id)}`)
  console.log(`HeadElement: "${headElementId}" has been moved in postion ${newIndex}`)
})