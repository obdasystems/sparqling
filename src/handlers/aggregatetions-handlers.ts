import { EntityTypeEnum, GraphElement, QueryGraphHeadApiFactory, VarOrConstantTypeEnum } from "../api/swagger";
import { handlePromise } from "../main/handle-promises";
import onNewBody from "../main/on-new-body";
import * as model from "../model";
import { guessDataType } from "../ontology-graph";
import { getEntityType, getIri } from "../util/graph-element-utility";
import { aggregationDialog } from "../widgets";
import { Modality } from "../widgets/forms/base-form-dialog";

aggregationDialog.onSubmit((headElementID, havingOperator, havingParameters, aggregateOperator) => {
  const qhApi = QueryGraphHeadApiFactory()
  const tempQueryBody = model.getTempQueryBody()

  tempQueryBody.groupBy = {
    aggregateFunction: aggregateOperator
  }

  if (havingOperator && havingParameters) {
    tempQueryBody.having = {
      expression: {
        operator: havingOperator,
        parameters: havingParameters,
      }
    }
  }
  
  handlePromise(qhApi.aggregationHeadTerm(headElementID as string, tempQueryBody)).then(newBody => {
    onNewBody(newBody)
    aggregationDialog.setAsCorrect()
  })
})

export function showAggregationsDialog(graphElement: GraphElement) {
  const type = getEntityType(graphElement)

  if (type === EntityTypeEnum.Class) {
    aggregationDialog.parametersType = VarOrConstantTypeEnum.Iri
  } else {
    aggregationDialog.parametersType = VarOrConstantTypeEnum.Constant
  }

  aggregationDialog.modality = Modality.DEFINE
  aggregationDialog._id = '?' + graphElement.id
  aggregationDialog.operator = null
  aggregationDialog.parameters = [{
    type: VarOrConstantTypeEnum.Var,
    constantType: guessDataType(getIri(graphElement)),
    value: '?' + graphElement.id
  }]
  aggregationDialog.aggregateOperator = null
  aggregationDialog.show()
}