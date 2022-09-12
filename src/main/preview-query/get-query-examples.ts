import axios from "axios"
import * as model from "../../model"
import SparqlingFormDialog from "../../widgets/forms/base-form-dialog"
import { handlePromise } from "../handle-promises"
import handleEndpointSelection from "./handle-endpoint-selection"
import QueryPoller, { QueryPollerStatus } from "./query-poller"

export async function showIriExamplesInForm(iri: string, formDialog: SparqlingFormDialog) {
  handleEndpointSelection((async endpoint => {
    if (!endpoint) {
      console.warn('No endpoints available')
      formDialog.loadingExamples = false
      formDialog.addMessage('No endpoint available', 'error-message')
      setTimeout(() => formDialog.resetMessages(), 3000)
      return
    }

    const prefixes = await handlePromise(axios.request<any>({
      method: 'get',
      url: localStorage.getItem('mastroUrl') + '/endpoint/' + endpoint.name + '/prefixes',
      headers: JSON.parse(localStorage.getItem('headers') || '')
    }))

    const queryString = prefixes.map((p: { name: any; namespace: any }) => `PREFIX ${p.name} <${p.namespace}>`).join('\n') +
      `\nSELECT * WHERE { ?Examples  rdf:type <${iri}> } LIMIT 10`

    const queryStartResponse = await handlePromise(axios.request<any>(getNewQueryRequestOptions(endpoint, queryString)))

    const queryPoller = new QueryPoller(endpoint, queryStartResponse.executionId, 10)
    queryPoller.onNewResults = (result) => {
      if (queryPoller.status !== QueryPollerStatus.RUNNING) {
        formDialog.loadingExamples = false
      }

      formDialog.examples = result
    }

    queryPoller.onTimeoutExpiration = queryPoller.onStop = () => {
      formDialog.loadingExamples = false
    }

    queryPoller.start()
  }))
}

export function getNewQueryRequestOptions(endpoint: model.MastroEndpoint, queryString: string) {
  const startNewQueryRequestOptions = {
    method: 'post',
    url: localStorage.getItem('mastroUrl') + '/endpoint/' + endpoint.name + '/query/start',
    data: {
      queryID: Math.random(),
      queryDescription: '',
      queryCode: queryString
    },
    headers: JSON.parse(localStorage.getItem('headers') || '')
  }

  return startNewQueryRequestOptions
}