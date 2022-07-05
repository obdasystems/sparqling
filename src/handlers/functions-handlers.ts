import { Function, QueryGraphHeadApi } from "../api/swagger"
import { handlePromise } from "../main/handle-promises"
import onNewBody from "../main/on-new-body"
import * as model from '../model'
import { functionDialog } from "../widgets"

functionDialog.onSubmit(async (id, op, params) => {
  const qhApi = new QueryGraphHeadApi(undefined, model.getBasePath())

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
    if (tempHeadElement) {
      tempHeadElement.function = newFunction
      handlePromise(qhApi.functionHeadTerm(id as string, tempQueryBody, model.getRequestOptions())).then(newBody => {
        onNewBody(newBody)
        functionDialog.setAsCorrect()
      })
    }
  }
})
