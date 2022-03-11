import FilterDialog from "./filter-dialog"
import * as queryBody from "../query-body"
import { FilterExpressionOperatorEnum, QueryGraph, QueryGraphFilterApiFactory } from "../api/swagger";
import onNewBody from "../main/on-new-body";

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
    filterDialog._id = id
    newBody = (await filterApi.newFilter(id, queryBody.getBody())).data
  } else {
    queryBody.updateFilter(id, newFilter)
    newBody = (await filterApi.editFilter(id, queryBody.getBody())).data
  }

  if (newBody) {
    onNewBody(newBody)
    filterDialog.setAsCorrect()
  }
})