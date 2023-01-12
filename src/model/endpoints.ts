import axios from "axios"
import { ui } from "grapholscape"
import { EntityTypeEnum } from "../api/swagger"
import { handlePromise } from "../main/handle-promises"
import { getName, getRequestOptions, getVersion, isStandalone } from "./request-options"

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

export type MWSEntity = {
  entityIRI: string,
  entityID: string,
  entityPrefixIRI: string,
  entityRemainder: string,
  entityType: string,
}

export type EmptyUnfoldingEntities = {
  emptyUnfoldingClasses: MWSEntity[],
  emptyUnfoldingDataProperties: MWSEntity[],
  emptyUnfoldingObjectProperties: MWSEntity[],
}

let endpoints: MastroEndpoint[] = []
let selectedEndpoint: MastroEndpoint | undefined
let emtpyUnfoldingEntities: EmptyUnfoldingEntities = {
  emptyUnfoldingClasses: [],
  emptyUnfoldingDataProperties: [],
  emptyUnfoldingObjectProperties: []
}
// let emtpyUnfoldingEntities: EmptyUnfoldingEntities = {
//   emptyUnfoldingClasses: [{
//     entityID: '',
//     entityIri: 'http://www.obdasystems.com/books/Edition',
//     entityType: 'dp',
//     entityPrefixIri: ':Edition',
//     entityRemainder: 'Edition'
//   }],
//   emptyUnfoldingDataProperties: [{
//     entityID: '',
//     entityIri: 'http://www.obdasystems.com/books/title',
//     entityType: 'dp',
//     entityPrefixIri: ':title',
//     entityRemainder: 'title'
//   }],
//   emptyUnfoldingObjectProperties: [{
//     entityID: '',
//     entityIri: 'http://www.obdasystems.com/books/hasEdition',
//     entityType: 'dp',
//     entityPrefixIri: ':hasEdition',
//     entityRemainder: 'hasEdition'
//   }]
// }

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
  return endpoints.sort((a, b) => a.name.localeCompare(b.name))
}

export async function updateEndpoints() {
  if (isStandalone()) return

  const mwsGetRunningEndpointsOptions = {
    method: 'get',
    url: `${localStorage.getItem('mastroUrl')}/endpoints/running`,
  }

  Object.assign(mwsGetRunningEndpointsOptions, getRequestOptions())

  endpoints = ((await handlePromise(axios.request<any>(mwsGetRunningEndpointsOptions))).endpoints as MastroEndpoint[])
    .filter(endpoint => endpoint.mastroID.ontologyID.ontologyName === getName() &&
      endpoint.mastroID.ontologyID.ontologyVersion === getVersion()
    )

  if (!selectedEndpoint || !endpoints.map(e => e.name).includes(selectedEndpoint.name)) {
    setSelectedEndpoint(endpoints[0])
  }
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

  if (endpoint) {
    const mwsEmptyUnfoldingRequestOptions = {
      method: 'get',
      url: `${localStorage.getItem('mastroUrl')}/endpoint/${endpoint.name}/emptyUnfoldingEntities`
    }

    Object.assign(mwsEmptyUnfoldingRequestOptions, getRequestOptions())
    handlePromise(axios.request<EmptyUnfoldingEntities>(mwsEmptyUnfoldingRequestOptions)).then(emptyUnfoldings => {
      emtpyUnfoldingEntities = emptyUnfoldings
    })
  }
}

export function getEndpointsCxtMenuCommands(onEndpointSelectionCallback: (endpoint: MastroEndpoint) => void): ui.Command[] {
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

export function hasEntityEmptyUnfolding(entityIri: string, entityType?: EntityTypeEnum) {
  let arrToCheck: MWSEntity[] = []

  switch (entityType) {
    case EntityTypeEnum.Class: {
      arrToCheck = arrToCheck.concat(...emtpyUnfoldingEntities.emptyUnfoldingClasses)
      break
    }

    case EntityTypeEnum.DataProperty: {
      arrToCheck = arrToCheck.concat(...emtpyUnfoldingEntities.emptyUnfoldingDataProperties)
      break
    }

    case EntityTypeEnum.ObjectProperty:
    case EntityTypeEnum.InverseObjectProperty: {
      arrToCheck = arrToCheck.concat(...emtpyUnfoldingEntities.emptyUnfoldingObjectProperties)
      break
    }

    default:
      arrToCheck = arrToCheck.concat(
        ...emtpyUnfoldingEntities.emptyUnfoldingClasses,
        ...emtpyUnfoldingEntities.emptyUnfoldingDataProperties,
        ...emtpyUnfoldingEntities.emptyUnfoldingObjectProperties
      )
  }

  return arrToCheck.some(e => e.entityIRI === entityIri || e.entityPrefixIRI === entityIri)
}


export function getEmptyUnfoldingEntities(type?: EntityTypeEnum) {
  switch (type) {
    case EntityTypeEnum.Class: {
      return emtpyUnfoldingEntities.emptyUnfoldingClasses
    }

    case EntityTypeEnum.DataProperty: {
      return emtpyUnfoldingEntities.emptyUnfoldingDataProperties
    }

    case EntityTypeEnum.ObjectProperty:
    case EntityTypeEnum.InverseObjectProperty: {
      return emtpyUnfoldingEntities.emptyUnfoldingObjectProperties
    }

    default:
      return new Array<MWSEntity>().concat(
        ...emtpyUnfoldingEntities.emptyUnfoldingClasses,
        ...emtpyUnfoldingEntities.emptyUnfoldingDataProperties,
        ...emtpyUnfoldingEntities.emptyUnfoldingObjectProperties
      )
  }
}