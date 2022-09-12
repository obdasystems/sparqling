import axios, { AxiosResponse } from "axios"
import { getRequestOptions, isStandalone } from "./request-options"
import { handlePromise } from "../main/handle-promises"
import { QueryGraph } from "../api/swagger"
import { Command } from "../widgets/cxt-menu/cxt-menu-widget"

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
let selectedEndpoint: MastroEndpoint | undefined

// export async function getFirstActiveEndpoint(): Promise<MastroEndpoint | undefined> {
//   if (isStandalone()) return

//   if (endpoints.length > 0) {
//     for (let i = 0; i < endpoints.length; i++) {
//       if (await isEndpointRunning(endpoints[i])) {
//         return endpoints.find(endpoint => JSON.stringify(endpoint.mastroID) === JSON.stringify(endpoints[i].mastroID))
//       }
//     }
//   }

//   await updateEndpoints()

//   return endpoints[0]
// }

export function getEndpoints(): MastroEndpoint[] {
  return endpoints
}

export async function updateEndpoints() {
  if (isStandalone()) return

  const mwsGetRunningEndpointsOptions = {
    method: 'get',
    url: `${localStorage.getItem('mastroUrl')}/endpoints/running`,
  }

  Object.assign(mwsGetRunningEndpointsOptions, getRequestOptions())

  await handlePromise(axios.request<any>(mwsGetRunningEndpointsOptions)).then(response => {
    endpoints = response.endpoints
  })
}

export async function isEndpointRunning(endpoint: MastroEndpoint) {
  const mwsGetEndpointStatusOptions = {
    method: 'get',
    url: `${localStorage.getItem('mastroUrl')}/endpoint/${endpoint.name}/status`
  }

  Object.assign(mwsGetEndpointStatusOptions, getRequestOptions())
  const endpointStatus: EndpointStatus = await handlePromise(axios.request<any>(mwsGetEndpointStatusOptions))

  return endpointStatus.status.status === EndpointStatusEnum.RUNNNING
}

export async function isSelectedEndpointRunning() {
  return selectedEndpoint ? isEndpointRunning(selectedEndpoint) : false
}

export function getSelectedEndpoint() {
  return selectedEndpoint
}

export function setSelectedEndpoint(endpoint: MastroEndpoint) {
  selectedEndpoint = endpoint
}

export function getEndpointsCxtMenuCommands(onEndpointSelectionCallback: (endpoint: MastroEndpoint) => void): Command[] {
  return endpoints.map(endpoint => {
    return {
      content: endpoint.name,
      select: () => {
        setSelectedEndpoint(endpoint)
        onEndpointSelectionCallback(endpoint)
      },
    }
  })
}