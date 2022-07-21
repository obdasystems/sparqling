import { QueryGraphHeadApiFactory } from '../api/swagger'
import { handlePromise } from '../main/handle-promises'
import onNewBody from '../main/on-new-body'
import * as model from '../model'
import { getTempQueryBody } from '../model'
import * as ontologyGraph from '../ontology-graph'
import * as queryGraph from '../query-graph'
import * as queryHead from '../query-head'
import { getGraphElementByID, getIri } from '../util/graph-element-utility'
// import { aggregationDialog, filterDialog, functionDialog } from '../widgets'
import { deleteFilter, showFilterDialogEditingMode } from './filters-handlers'
import showFormDialog from './show-form-dialog'

queryHead.onDelete(async headElement => {
  const qgApi = QueryGraphHeadApiFactory(undefined, model.getBasePath())
  const body = model.getQueryBody()

  if (headElement.id) {
    handlePromise(qgApi.deleteHeadTerm(headElement.id, body, model.getRequestOptions())).then(newBody => {
      onNewBody(newBody)
    })
  }
})

queryHead.onRename(async (headElementId, alias) => {
  const qgApi = QueryGraphHeadApiFactory(undefined, model.getBasePath())
  const tempQueryBody = model.getTempQueryBody()
  const headElement = model.getHeadElementByID(headElementId, tempQueryBody)

  if (headElement?.id) {
    headElement.alias = alias
    handlePromise(qgApi.renameHeadTerm(headElement.id, tempQueryBody, model.getRequestOptions())).then(newBody => {
      onNewBody(newBody)
    })
  }
})

queryHead.onLocalize(headElement => {
  if (headElement.graphElementId) {
    let graphElement = getGraphElementByID(headElement.graphElementId)
    if (graphElement) {
      const geIri = getIri(graphElement)
      if (geIri) {
        queryGraph.centerOnElem(graphElement)
        ontologyGraph.getGscape().centerOnEntity(geIri)
      }
    }
  }
})

// queryHead.onAddFilter(headElementId => {
//   const headElement = model.getHeadElementByID(headElementId)
//   if (headElement)
//     showFormDialog(headElement, filterDialog)
// })

// queryHead.onEditFilter((filterId) => {
//   showFilterDialogEditingMode(filterId)
// })

// queryHead.onDeleteFilter((filterId) => {
//   deleteFilter(filterId)
// })

// queryHead.onAddFunction(headElementId => {
//   const headElement = model.getHeadElementByID(headElementId)
//   if (headElement)
//     showFormDialog(headElement, functionDialog)
// })

queryHead.onElementSortChange((headElementId, newIndex) => {
  const headElement = model.getHeadElementByID(headElementId)
  if (!headElement) return

  const qhApi = QueryGraphHeadApiFactory(undefined, model.getBasePath())
  const tempQueryBody = model.getTempQueryBody()
  const tempHead = tempQueryBody.head
  const replacedHeadElement = tempHead[newIndex] // get the element to be "replaced", its index will change
  const tempHeadIds = tempHead.map(he => he.id) // use array of id to find index of elements

  tempHead.splice(tempHeadIds.indexOf(headElementId), 1) // remove headElement from its position
  tempHead.splice(tempHeadIds.indexOf(replacedHeadElement.id), 0, headElement) // put headElement in place of the element to replace

  handlePromise(qhApi.reorderHeadTerms(tempQueryBody, model.getRequestOptions())).then(newBody => onNewBody(newBody))
})

// queryHead.onOrderByChange(headElementId => {
//   const tempQueryBody = getTempQueryBody()
//   const headElement = tempQueryBody.head.find(he => he.id === headElementId)

//   if (headElement) {
//     headElement.ordering = (headElement.ordering || 0) + 1
//     if (headElement.ordering >= 2) {
//       headElement.ordering = -1
//     }
//   }

//   // if (headElement.ordering === 0) {
//   //   headElement.ordering = null
//   // }

//   const qhApi = QueryGraphHeadApiFactory(undefined, model.getBasePath())
//   handlePromise(qhApi.orderByHeadTerm(headElementId, tempQueryBody, model.getRequestOptions())).then(newBody => {
//     onNewBody(newBody)
//   })
// })

// queryHead.onAddAggregation(headElementId => {
//   const headElement = model.getHeadElementByID(headElementId)
//   if (headElement)
//     showFormDialog(headElement, aggregationDialog)
// })