import axios from "axios"
import { GrapholTypesEnum, ui } from "grapholscape"
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
    await setSelectedEndpoint(endpoints[0])
  } else {
    await updateEntitiesEmptyUnfoldings()
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

export async function setSelectedEndpoint(endpoint: MastroEndpoint) {
  selectedEndpoint = endpoint
  await updateEntitiesEmptyUnfoldings()
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

export async function updateEntitiesEmptyUnfoldings() {
  if (selectedEndpoint) {
    const mwsEmptyUnfoldingRequestOptions = {
      method: 'get',
      url: `${localStorage.getItem('mastroUrl')}/endpoint/${selectedEndpoint.name}/emptyUnfoldingEntities`
    }

    Object.assign(mwsEmptyUnfoldingRequestOptions, getRequestOptions())
    await handlePromise(axios.request<EmptyUnfoldingEntities>(mwsEmptyUnfoldingRequestOptions)).then(emptyUnfoldings => {
      emtpyUnfoldingEntities = emptyUnfoldings
    })
  }
}

export function hasEntityEmptyUnfolding(entityIri: string, entityType?: EntityTypeEnum | GrapholTypesEnum) {
  let arrToCheck: MWSEntity[] = []

  switch (entityType) {
    case GrapholTypesEnum.CLASS:
    case EntityTypeEnum.Class: {
      arrToCheck = arrToCheck.concat(...emtpyUnfoldingEntities.emptyUnfoldingClasses)
      break
    }

    case GrapholTypesEnum.DATA_PROPERTY:
    case EntityTypeEnum.DataProperty: {
      arrToCheck = arrToCheck.concat(...emtpyUnfoldingEntities.emptyUnfoldingDataProperties)
      break
    }

    case GrapholTypesEnum.OBJECT_PROPERTY:
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