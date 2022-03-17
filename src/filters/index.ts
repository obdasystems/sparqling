import FilterDialog from "./filter-dialog"
import * as queryBody from "../query-body"
import { EntityTypeEnum, FilterExpressionOperatorEnum, GraphElement, QueryGraph, QueryGraphFilterApiFactory, VarOrConstantTypeEnum } from "../api/swagger"
import onNewBody from "../main/on-new-body"
import { Modality } from "./filter-function-dialog"
import * as GEUtility from "../util/graph-element-utility"
import { guessDataType } from "../ontology-graph"

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

export function showFilterDialogForVariable(graphElement: GraphElement) {
  const type = GEUtility.getEntityType(graphElement)

  if (type === EntityTypeEnum.Class) {
    filterDialog.parametersType = VarOrConstantTypeEnum.Iri
  } else {
    filterDialog.parametersType = VarOrConstantTypeEnum.Constant
  }

  filterDialog.modality = Modality.DEFINE
  filterDialog._id = null
  filterDialog.operator = null
  filterDialog.parameters = [{
    type: VarOrConstantTypeEnum.Var,
    constantType: guessDataType(GEUtility.getIri(graphElement)),
    value: '?'+graphElement.id
  }]
  filterDialog.show()
}

export function showFilterDialogEditingMode(filterId: number) {
  const filter = queryBody.getFilterById(filterId)
  filterDialog.modality = Modality.EDIT
  filterDialog._id = filterId
  filterDialog.operator = filter.expression?.operator
  filterDialog.parameters = filter.expression?.parameters
  filterDialog.parametersType = filter.expression?.parameters[1]?.type
  filterDialog.show()
}