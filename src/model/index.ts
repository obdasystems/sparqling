export * from './query-body'
export * from './filters'

let file: File
let isInitialised = false
let basePath: string | undefined = undefined

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

export function setBasePath(newBasePath: string) {
  basePath = newBasePath
}

export function getBasePath() { return basePath }