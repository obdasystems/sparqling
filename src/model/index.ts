export * from './query-body'
export * from './filters'
export * from './request-options'
export * from './loading-state'
export * from './endpoints'
export * from './highlights'

let file: File
let isRunning = false
let isFullPage = false
export let previousOwlVisualizerState: boolean

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