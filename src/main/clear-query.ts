import { QueryGraphBGPApiFactory } from '../api/swagger'
import * as model from '../model'
import { handlePromise } from './handle-promises'
import onNewBody from './on-new-body'

export default function() {
  const queryBody = model.getQueryBody()
  if (queryBody?.graph?.id) {
    const qgApi = QueryGraphBGPApiFactory(undefined, model.getBasePath())
    handlePromise(qgApi.deleteGraphElementId(queryBody?.graph?.id, queryBody, model.getRequestOptions())).then(newBody => {
      onNewBody(newBody)
    })
  }
}