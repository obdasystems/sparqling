import { EntityTypeEnum, Function, FunctionNameEnum, GraphElement, QueryGraphHeadApiFactory, VarOrConstantTypeEnum } from "../api/swagger"
import { handlePromise } from "../main/handle-promises"
import onNewBody from "../main/on-new-body"
import * as model from '../model'
import { guessDataType } from "../ontology-graph"
import * as GEUtility from "../util/graph-element-utility"
import { functionDialog } from "../widgets"
import { Modality } from "../widgets/filter-function-dialog"

functionDialog.onSubmit(async (id, op, params) => {
  const qhApi = QueryGraphHeadApiFactory()

  const newFunction: Function = {
    name: op,
    parameters: params,
  }

  // Perform edits on a dummy query body in order to preserve the actual working one
  // The new data will be saved on service correct response
  const tempQueryBody = model.getTempQueryBody()

  if (id) {
    console.log(id)
    // add function
    const tempHeadElement = tempQueryBody.head.find(elem => elem.id === id)
    tempHeadElement.function = newFunction
    handlePromise(qhApi.functionHeadTerm(id,tempQueryBody)).then(newBody => {
      onNewBody(newBody)
      functionDialog.setAsCorrect()
    })
  }
})

export function showFunctionDialogForVariable(graphElement: GraphElement) {
  const type = GEUtility.getEntityType(graphElement)

  if (type === EntityTypeEnum.Class) {
    functionDialog.parametersType = VarOrConstantTypeEnum.Iri
  } else {
    functionDialog.parametersType = VarOrConstantTypeEnum.Constant
  }

  functionDialog.modality = Modality.DEFINE
  functionDialog._id = '?' + graphElement.id
  functionDialog.operator = null
  functionDialog.parameters = [{
    type: VarOrConstantTypeEnum.Var,
    constantType: guessDataType(GEUtility.getIri(graphElement)),
    value: '?' + graphElement.id
  }]
  functionDialog.show()
  //filterListDialog.hide()
}