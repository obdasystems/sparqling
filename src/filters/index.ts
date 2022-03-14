import FilterDialog from "./filter-dialog"
import * as queryBody from "../query-body"
import { FilterExpressionOperatorEnum, QueryGraph, QueryGraphFilterApiFactory } from "../api/swagger";
import onNewBody from "../main/on-new-body";
import { Modality } from "./filter-function-dialog";

export const filterDialog = new FilterDialog()

filterDialog.onSubmit(async (id, op, params) => {
  const filterApi = QueryGraphFilterApiFactory()
  let newBody: QueryGraph

  const newFilter = {
    expression: {
      operator: op as FilterExpressionOperatorEnum,
      parameters: params
    }
  }

  if (id === undefined || id === null) {
    // add filter
    id = queryBody.addFilter(newFilter)
    newBody = (await filterApi.newFilter(id, queryBody.getBody())).data
    filterDialog._id = id
    filterDialog.modality = Modality.EDIT
  } else {
    queryBody.updateFilter(id, newFilter)
    newBody = (await filterApi.editFilter(id, queryBody.getBody())).data
  }

  if (newBody) {
    onNewBody(newBody)
    filterDialog.setAsCorrect()
  }
})

filterDialog.onDelete(async (id) => {
  if (id === null || id === undefined) return

  queryBody.removeFilter(id)
  const filterApi = QueryGraphFilterApiFactory()

  const newBody = (await filterApi.removeFilter(id, queryBody.getBody())).data

  if (newBody) {
    onNewBody(newBody)
    filterDialog._id = null
    filterDialog.operator = null
    filterDialog.parameters.splice(1)
    filterDialog.modality = Modality.DEFINE
    filterDialog.setAsCorrect('Deleted correctly')
  }
})