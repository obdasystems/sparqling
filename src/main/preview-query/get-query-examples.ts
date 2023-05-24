import axios from "axios"
import * as model from "../../model"
import { getQueryBody, MastroEndpoint } from "../../model"
import { findGraphElement, getGraphElementByID, getGraphElementByIRI, getIri, getIris, graphElementHasIri, isAnnotation, isClass, isDataProperty } from "../../util/graph-element-utility"
import { previewDialog } from "../../widgets"
import SparqlingFormDialog from "../../widgets/forms/base-form-dialog"
import { handlePromise } from "../handle-promises"
import handleEndpointSelection from "./handle-endpoint-selection"
import QueryPoller, { QueryPollerStatus } from "./query-poller"
import { GraphElement } from "../../api/swagger"

export async function showExamplesInForm(graphElementId: string, formDialog: SparqlingFormDialog) {
  handleEndpointSelection((async endpoint => {
    if (!endpoint) {
      console.warn('No endpoints available')
      formDialog.loadingExamples = false
      formDialog.addMessage('No endpoint available', 'error-message')
      setTimeout(() => formDialog.resetMessages(), 3000)
      return
    }
    
    const graphElement = getGraphElementByID(graphElementId)
    if (graphElement) {
      const queryString = await getExamplesQueryString(graphElement, endpoint, formDialog.examplesSearchValue)
      if (!queryString) return

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
    }
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

export async function showExamplesInDialog(graphElementId: string) {
  const graphElement = getGraphElementByID(graphElementId)
  if (graphElement) {
    if (isDataProperty(graphElement) || isAnnotation(graphElement)) {
      previewDialog.allowSearch = true
      // previewDialog.examplesSearchValue = ''
    }

    previewDialog.result = undefined
    previewDialog.title = 'Examples'
    previewDialog.show()

    previewDialog.onSearchExamples(() => {
      showExamplesInDialog(graphElementId)
    })

    handleEndpointSelection(async (endpoint) => {
      if (!endpoint) {
        return
      }

      previewDialog.isLoading = true

      const queryString = await getExamplesQueryString(graphElement, endpoint, previewDialog.examplesSearchValue)
      if (!queryString)
        return

      const queryStartResponse = await handlePromise(axios.request<any>(getNewQueryRequestOptions(endpoint, queryString)))

      const queryPoller = new QueryPoller(endpoint, queryStartResponse.executionId, 10)

      queryPoller.onNewResults = (result) => {
        if (queryPoller.status !== QueryPollerStatus.RUNNING) {
          previewDialog.isLoading = false
        }
        previewDialog.result = result
      }

      queryPoller.onTimeoutExpiration = queryPoller.onStop = () => {
        previewDialog.isLoading = false
      }

      queryPoller.start()
    })
  }
}

async function getExamplesQueryString(graphElement: GraphElement, endpoint: MastroEndpoint, searchValue?: string) {
  const prefixes = await handlePromise(axios.request<any>({
    method: 'get',
    url: localStorage.getItem('mastroUrl') + '/endpoint/' + endpoint.name + '/prefixes',
    headers: JSON.parse(localStorage.getItem('headers') || '')
  }))

  let queryString: string = prefixes.map((p: { name: any; namespace: any }) => `PREFIX ${p.name} <${p.namespace}>`).join('\n')
  let iris = getIris(graphElement)
  if (iris.length > 0) {
    if (isClass(graphElement)) {
      queryString += `\nSELECT DISTINCT * WHERE { 
        ${iris.map(iri => `?Examples  rdf:type <${iri}>.`).join('\n')}
      }`
    } else {
      const classGraphElement = findGraphElement(getQueryBody()?.graph, (ge) => ge.children?.includes(graphElement) || false)
      const propertyIri = getIri(graphElement)
      if (classGraphElement) {
        iris = getIris(classGraphElement)
        if (iris.length > 0 && propertyIri) {
          queryString += `\nSELECT DISTINCT ?Examples WHERE {
            ${iris.map(iri => `?x rdf:type <${iri}>.`).join('\n')}
            ?x <${propertyIri}> ?Examples;`
        } else {
          return
        }
      } else if (propertyIri) {
        queryString += `\nSELECT DISTINCT ?Examples WHERE { ?x  <${propertyIri}> ?Examples;`
      }
  
      if (searchValue)
        queryString += `\nFILTER (regex(?Examples, "${searchValue}", 'i'))`
  
      queryString += ` }`
    }
  
    queryString += `\nLIMIT 10`
    return queryString
  }
} 