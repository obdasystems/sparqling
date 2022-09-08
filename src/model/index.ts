export * from './query-body'
export * from './filters'
export * from './request-options'
export * from './loading-state'
export * from './endpoints'

let file: File
let isInitialised = false
let isRunning = false

export function getOntologyFile() {
  return file
}

export function setOntologyFile(value: File) {
  file = value
}

export function isSparqlingInitialised() {
  return isInitialised
}

export function setInitialised(value: boolean) {
  isInitialised = value
}

export function isSparqlingRunning() {
  return isRunning
}

export function setSparqlingRunning(value: boolean) {
  isRunning = value
}