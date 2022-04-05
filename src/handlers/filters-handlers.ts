import { EntityTypeEnum, FilterExpressionOperatorEnum, GraphElement, QueryGraph, QueryGraphFilterApiFactory, VarOrConstantTypeEnum } from "../api/swagger"
import { filterDialog, filterListDialog } from "../widgets"
import { Modality } from "../widgets/filters/filter-function-dialog"
import * as model from '../model'
import onNewBody from "../main/on-new-body"
import * as GEUtility from "../util/graph-element-utility"
import { guessDataType } from "../ontology-graph"
import { handlePromise } from "../main/handle-promises"

filterListDialog.onEdit((filterId: number) => showFilterDialogEditingMode(filterId))
filterListDialog.onDelete((filterId: number) => { deleteFilter(filterId) })

filterDialog.onSubmit(async (id, op, params) => {
  const filterApi = QueryGraphFilterApiFactory()

  const newFilter = {
    expression: {
      operator: op as FilterExpressionOperatorEnum,
      parameters: params
    }
  }

  if (id === undefined || id === null) {
    // add filter
    id = model.addFilter(newFilter)
    handlePromise(filterApi.newFilter(id, model.getQueryBody())).then(newBody => {
      filterDialog._id = id
      filterDialog.modality = Modality.EDIT
      finalizeFilterSubmit(newBody)
    })
  } else {
    handlePromise(filterApi.editFilter(id, model.getQueryBody())).then(newBody => {
      model.updateFilter(id, newFilter)
      finalizeFilterSubmit(newBody)
    })
  }

  function finalizeFilterSubmit(newBody: QueryGraph) {
    onNewBody(newBody)
    filterDialog.setAsCorrect()
  }
})

filterDialog.onDelete((filterId: number) => deleteFilter(filterId))


export async function deleteFilter(filterId: number) {
  if (filterId === null || filterId === undefined) return

  model.removeFilter(filterId)
  const filterApi = QueryGraphFilterApiFactory()

  handlePromise(filterApi.removeFilter(filterId, model.getQueryBody())).then(newBody => {
    onNewBody(newBody)
    filterDialog._id = null
    filterDialog.operator = null
    filterDialog.parameters.splice(1)
    filterDialog.modality = Modality.DEFINE
    filterDialog.setAsCorrect('Deleted correctly')
  })
}

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
    value: '?' + graphElement.id
  }]
  filterDialog.show()
  filterListDialog.hide()
}

export function showFilterDialogEditingMode(filterId: number) {
  const filter = model.getFilterById(filterId)
  filterDialog.modality = Modality.EDIT
  filterDialog._id = filterId
  filterDialog.operator = filter.expression?.operator
  filterDialog.parameters = filter.expression?.parameters
  filterDialog.parametersType = filter.expression?.parameters[1]?.type
  filterDialog.show()
  filterListDialog.hide()
}