import { FilterExpressionOperatorEnum, QueryGraph, QueryGraphFilterApi } from "../api/swagger"
import { showIriExamplesInForm } from "../main"
import { handlePromise } from "../main/handle-promises"
import onNewBody from "../main/on-new-body"
import * as model from '../model'
import { getGraphElementByID, getIri } from "../util/graph-element-utility"
import { filterDialog, filterListDialog } from "../widgets"
import { Modality } from "../widgets/forms/base-form-dialog"

filterListDialog.onEdit((filterId: number) => showFilterDialogEditingMode(filterId))
filterListDialog.onDelete((filterId: number) => { deleteFilter(filterId) })

filterDialog.onSubmit(async (id, op, params) => {
  const filterApi = new QueryGraphFilterApi(undefined, model.getBasePath())

  const newFilter = {
    expression: {
      operator: op as FilterExpressionOperatorEnum,
      parameters: params
    }
  }

  // Perform edits on a dummy query body in order to preserve the actual working one
  // The new data will be saved on service correct response
  const tempQueryBody = model.getTempQueryBody()

  if (id === undefined || id === null) {
    // add filter
    if (!tempQueryBody.filters) {
      tempQueryBody.filters = []
    }
    
    id = tempQueryBody.filters.push(newFilter) - 1
    handlePromise(filterApi.newFilter(id, tempQueryBody, model.getRequestOptions())).then(newBody => {
      filterDialog._id = id
      filterDialog.modality = Modality.EDIT
      finalizeFilterSubmit(newBody)
    })
  } else {
    id = id as number
    // update filter
    if (tempQueryBody.filters) {
      tempQueryBody.filters[id] = newFilter
      handlePromise(filterApi.editFilter(id, tempQueryBody, model.getRequestOptions())).then(newBody => {
        finalizeFilterSubmit(newBody)
      })
    }
  }

  function finalizeFilterSubmit(newBody: QueryGraph) {
    onNewBody(newBody)
    filterDialog.setAsCorrect()
  }
})

filterDialog.onDelete((filterId: number) => deleteFilter(filterId))


export async function deleteFilter(filterId: number) {
  if (filterId === null || filterId === undefined) return

  const filterApi = new QueryGraphFilterApi(undefined, model.getBasePath())
  handlePromise(filterApi.removeFilter(filterId, model.getQueryBody(), model.getRequestOptions())).then(newBody => {
    onNewBody(newBody)
    filterDialog._id = undefined
    filterDialog.operator = undefined
    filterDialog.parameters?.splice(1)
    filterDialog.modality = Modality.DEFINE
    filterDialog.setAsCorrect('Deleted correctly')
  })
}

export function showFilterDialogEditingMode(filterId: number) {
  const filter = model.getFilterById(filterId)
  if (filter) {
    filterDialog.modality = Modality.EDIT
    filterDialog._id = filterId
    filterDialog.operator = filter.expression?.operator
    filterDialog.parameters = filter.expression?.parameters
    filterDialog.parametersType = filter.expression?.parameters ? filter.expression.parameters[1].type : undefined
    filterDialog.show()
    filterListDialog.hide()
  }
}

filterDialog.onSeeExamples(async variable => {
  const graphElementId = getGraphElementByID(variable.value || '')
  if (graphElementId) {
    const iri = getIri(graphElementId)
    if (iri) {
      showIriExamplesInForm(iri, filterDialog)
    }
  }
})