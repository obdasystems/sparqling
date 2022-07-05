export * from './query-body'
export * from './filters'
export * from './request-options'

let file: File
let isInitialised = false

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