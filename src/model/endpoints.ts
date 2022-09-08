import axios, { AxiosResponse } from "axios"
import { getRequestOptions, isStandalone } from "./request-options"
import { handlePromise } from "../main/handle-promises"
import { QueryGraph } from "../api/swagger"

export type MastroEndpoint = {
  description: string
  name: string
  mastroID: MastroID
  needRestart: boolean
  user: string
}

export type MastroID = {
  avpID: string
  datasourceID: string
  mappingID: string
  ontologyID: {
    ontologyName: string
    ontologyVersion: string
  }
}

export type EndpointStatus = {
  status: {
    id: MastroID,
    status: EndpointStatusEnum
  }
}

export enum EndpointStatusEnum {
  RUNNNING = 'RUNNING',
  STOPPED = 'STOPPED',
}

export enum QueryStatusEnum {
  FINISHED = 'FINISHED',
  UNAVAILABLE = 'UNAVAILABLE',
  ERROR = 'ERROR'
}

let endpoints: MastroEndpoint[] = []

export async function getFirstActiveEndpoint(): Promise<MastroEndpoint | undefined> {
  if (isStandalone()) return

  if (endpoints.length > 0) {
    const mwsGetEndpointStatusOptions = {
      method: 'get',
      url: ''
    }
    let endpointStatus: EndpointStatus

    for (let i = 0; i < endpoints.length; i++) {
      mwsGetEndpointStatusOptions.url = `${localStorage.getItem('mastroUrl')}/endpoint/${endpoints[i].name}/status`

      Object.assign(mwsGetEndpointStatusOptions, getRequestOptions())

      endpointStatus = await handlePromise(axios.request<any>(mwsGetEndpointStatusOptions))

      if (endpointStatus.status.status === EndpointStatusEnum.RUNNNING) {
        return endpoints.find(endpoint => JSON.stringify(endpoint.mastroID) === JSON.stringify(endpointStatus.status.id))
      }
    }
  }

  const mwsGetRunningEndpointsOptions = {
    method: 'get',
    url: `${localStorage.getItem('mastroUrl')}/endpoints/running`,
  }

  Object.assign(mwsGetRunningEndpointsOptions, getRequestOptions())

  await handlePromise(axios.request<any>(mwsGetRunningEndpointsOptions)).then(response => {
    endpoints = response.endpoints
  })

  return endpoints[0]
}