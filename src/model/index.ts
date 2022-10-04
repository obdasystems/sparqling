export * from './query-body'
export * from './filters'
export * from './request-options'
export * from './loading-state'
export * from './endpoints'
export * from './highlights'

let file: File
let isRunning = false
let isIncremental = false

export const HIGHLIGHT_CLASS = 'highlighted'
export const FADED_ClASS = 'faded'
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

export function setIncremental(value: boolean) {
  isIncremental = value
}

export function isIncrementalActive() {
  return isIncremental
}