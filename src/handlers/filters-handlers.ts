import { FilterExpressionOperatorEnum, QueryGraph, QueryGraphFilterApi, VarOrConstant, VarOrConstantConstantTypeEnum, VarOrConstantTypeEnum } from "../api/swagger"
import { showExamplesInForm } from "../main"
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
      parameters: JSON.parse(JSON.stringify(params))
    }
  }

  if (op === FilterExpressionOperatorEnum.Regex) {
    newFilter.expression.parameters.push({
      value: filterDialog.isCaseSensitive ? "" : "i",
      type: VarOrConstantTypeEnum.Constant,
      constantType: VarOrConstantConstantTypeEnum.String
    })
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

    let parameters = filter.expression?.parameters

    // in case of regex, last parameter is about flags, add them but not as parameter
    // leave them in filter object => copy parameters with JSON.parse(JSON.stringify(...))
    // from this copy remove last parameter so it won't be shown as value in the form
    if (filter.expression?.parameters && filter.expression.operator === FilterExpressionOperatorEnum.Regex) {      
      parameters = JSON.parse(JSON.stringify(filter.expression?.parameters))
      if (parameters && parameters[2]) {
        if (filterDialog.caseSensitiveCheckbox)
          filterDialog.caseSensitiveCheckbox.checked = parameters[2].value !== "i"
        parameters.splice(2)
      }
    }

    filterDialog.parameters = parameters
    filterDialog.parametersType = filter.expression?.parameters ? filter.expression.parameters[1].type : undefined
    filterDialog.show()
    filterListDialog.hide()
  }
}

filterDialog.onSeeExamples(async variable => {
  if (variable.value) {
    showExamplesInForm(variable.value, filterDialog)
  }
})