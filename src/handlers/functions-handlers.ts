import { EntityTypeEnum, Function, FunctionNameEnum, GraphElement, HeadElement, QueryGraphHeadApiFactory, VarOrConstantTypeEnum } from "../api/swagger"
import { handlePromise } from "../main/handle-promises"
import onNewBody from "../main/on-new-body"
import * as model from '../model'
import { guessDataType } from "../ontology-graph"
import * as GEUtility from "../util/graph-element-utility"
import { functionDialog } from "../widgets"
import { Modality } from "../widgets/forms/base-form-dialog"

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
    // add function
    const tempHeadElement = tempQueryBody.head.find(elem => elem.id === id)
    tempHeadElement.function = newFunction
    handlePromise(qhApi.functionHeadTerm(id as string, tempQueryBody)).then(newBody => {
      onNewBody(newBody)
      functionDialog.setAsCorrect()
    })
  }
})
