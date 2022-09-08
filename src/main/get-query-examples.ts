import axios from "axios"
import * as model from "../model"
import { MastroEndpoint, QueryStatusEnum } from "../model"
import { handlePromise } from "./handle-promises"

export async function getQueryExamples(): Promise<unknown[] | undefined> {
  const stubbedResults = [
    'boh'
  ]
  setTimeout(() => {}, 600)
  return stubbedResults

  // const endpoint = await model.getFirstActiveEndpoint()
  // if (!endpoint) {
  //   console.warn('No endpoints available')
  //   return
  // }

  // const queryString = model.getQueryBody().sparql
  // const executionID = await handlePromise(axios.request<any>(getNewQueryRequestOptions(endpoint, queryString)))

  // return await queryPolling(endpoint, executionID)
}

export async function getClassIriExamples(iri: string): Promise<string[] | undefined> {
  const stubbedResults = [
    'aaa/bbb/ccc/book/1',
    'aaa/bbb/ccc/book/3',
    'aaa/bbb/ccc/book/8',
    'aaa/bbb/ccc/book/11',
    'aaa/bbb/ccc/book/12',
    'aaa/bbb/ccc/book/15',
    'aaa/bbb/ccc/book/56',
  ]
  setTimeout(() => {}, 600)
  return stubbedResults


  // const endpoint = await model.getFirstActiveEndpoint()
  // if (!endpoint) {
  //   console.warn('No endpoints available')
  //   return
  // }

  // const queryString = `SELECT  ?x as "IRI Examples" WHERE { ?x  rdf:type ${iri} }`
  // const executionID = await handlePromise(axios.request<any>(getNewQueryRequestOptions(endpoint, queryString)))

  // return await queryPolling(endpoint, executionID)
}

function getNewQueryRequestOptions(endpoint: MastroEndpoint, queryString: string) {
  const startNewQueryRequestOptions = {
    method: 'get',
    url: localStorage.getItem('mastroUrl') + '/endpoint/' + endpoint.name + '/query/start',
    data: queryString,
    headers: JSON.parse(localStorage.getItem('headers') || '')
  }

  Object.assign(startNewQueryRequestOptions, model.getRequestOptions())

  return startNewQueryRequestOptions
}

function getQueryStatusRequestOptions(endpoint: MastroEndpoint, executionID: string) {
  const queryStatusRequestOptions = {
    method: 'get',
    url: localStorage.getItem('mastroUrl') + '/endpoint/' + endpoint.name + '/query/' + executionID + '/status',
    headers: JSON.parse(localStorage.getItem('headers') || '')
  }

  Object.assign(queryStatusRequestOptions, model.getRequestOptions())

  return queryStatusRequestOptions
}

function getQueryResultRequestOptions(endpoint: MastroEndpoint, executionID: string) {
  const queryResultsRequestOptions = {
    url: localStorage.getItem('mastroUrl') + '/endpoint/' + endpoint.name + '/query/' + executionID + '/results',
    method: 'get',
    params: { pagesize: 10, pagenumber: 1 },
    headers: JSON.parse(localStorage.getItem('headers') || ''),
  }

  Object.assign(queryResultsRequestOptions, model.getRequestOptions())

  return queryResultsRequestOptions
}

function queryPolling(endpoint: MastroEndpoint, executionID: string) {
  return new Promise<any>((resolve, reject) => {
    let queryStatus:any, queryResult: any
    const queryInterval = setInterval(async () => {
      queryStatus = await handlePromise(axios.request<any>(getQueryStatusRequestOptions(endpoint, executionID)))
      if (queryStatus.status === QueryStatusEnum.FINISHED) {
        clearInterval(queryInterval)
        clearTimeout(queryTimeout)

        queryResult = await handlePromise(axios.request<any>(getQueryResultRequestOptions(endpoint, executionID)))
        resolve(queryResult)
      } else if (queryStatus.status === QueryStatusEnum.ERROR || queryStatus.status === QueryStatusEnum.UNAVAILABLE) {
        reject()
      }
    }, 800)

    const queryTimeout = setTimeout(() => {
      if (queryStatus.status !== QueryStatusEnum.FINISHED)
        console.warn('Timeout expired, server took too long to answer')
      clearInterval(queryInterval)
    }, 5000)
  })
}