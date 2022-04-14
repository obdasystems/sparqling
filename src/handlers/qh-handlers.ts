import { QueryGraphBGPApiFactory, QueryGraphHeadApiFactory } from '../api/swagger'
import { handlePromise } from '../main/handle-promises'
import onNewBody from '../main/on-new-body'
import * as model from '../model'
import { getTempQueryBody } from '../model'
import * as ontologyGraph from '../ontology-graph'
import * as queryGraph from '../query-graph'
import * as queryHead from '../query-head'
import { getGraphElementByID, getIri } from '../util/graph-element-utility'
import { sparqlDialog } from '../widgets'
import { showAggregationsDialog } from './aggregatetions-handlers'
import { deleteFilter, showFilterDialogEditingMode, showFilterDialogForVariable } from './filters-handlers'
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
  const tempHead = tempQueryBody.head
  const headElement = model.getHeadElementByID(headElementId)
  const replacedHeadElement = tempHead[newIndex] // get the element to be "replaced", its index will change
  const tempHeadIds = tempHead.map(he => he.id) // use array of id to find index of elements

  tempHead.splice(tempHeadIds.indexOf(headElementId), 1) // remove headElement from its position
  tempHead.splice(tempHeadIds.indexOf(replacedHeadElement.id), 0, headElement) // put headElement in place of the element to replace

  handlePromise(qhApi.reorderHeadTerms(tempQueryBody)).then(newBody => onNewBody(newBody))
})

queryHead.onOrderByChange(headElementId => {
  const tempQueryBody = getTempQueryBody()
  const headElement = tempQueryBody.head.find(he => he.id === headElementId)

  headElement.ordering = headElement.ordering + 1
  if (headElement.ordering >= 2) {
    headElement.ordering = -1
  }

  // if (headElement.ordering === 0) {
  //   headElement.ordering = null
  // }

  const qhApi = QueryGraphHeadApiFactory()
  handlePromise(qhApi.orderByHeadTerm(headElementId, tempQueryBody)).then(newBody => {
    onNewBody(newBody)
  })
})

queryHead.onAddAggregation(headElementId => {
  const graphElement = getGraphElementByID(model.getHeadElementByID(headElementId).graphElementId)
  showAggregationsDialog(graphElement)
})