import { clearConfig } from './config'
import { clearEndpoints } from './endpoints'
import { clearLoadingState } from './loading-state'
import { setActiveElement, setQueryBody } from './query-body'
import { setRequestOptions } from './request-options'

export * from './query-body'
export * from './filters'
export * from './request-options'
export * from './loading-state'
export * from './endpoints'
export * from './highlights'
export * from './config'

let file: File
let isRunning = false
let isFullPage = false
export let previousOwlVisualizerState: boolean
let _isQueryDirty = true

export const HIGHLIGHT_CLASS = 'highlighted'
export const FADED_CLASS = 'faded'
export const SPARQLING_SELECTED = 'sparqling-selected'

export function getOntologyFile() {
  return file
}

export function setOntologyFile(value: File) {
  file = value
}

export function isSparqlingRunning() {
  return isRunning
}

export function setSparqlingRunning(value: boolean) {
  isRunning = value
}

export function setFullPage(value: boolean) {
  isFullPage = value
}

export function isFullPageActive() {
  return isFullPage
}

export function setPreviousOwlVisualizerState(value: boolean) {
  previousOwlVisualizerState = value
}

export function getPreviousOwlVisualizerState() {
  return previousOwlVisualizerState
}

export function setQueryDirtyState(isDirty: boolean) {
  _isQueryDirty = isDirty
}

export function isQueryDirty() {
  return _isQueryDirty
}

export function clear() {
  clearConfig()
  clearEndpoints()
  setQueryBody({
    head: [],
    graph: null as any,
    sparql: ''
  })
  setActiveElement(undefined)
  clearLoadingState()
  setRequestOptions({
    basePath: undefined,
    version: undefined,
    headers: undefined,
    name: undefined,
  })
}