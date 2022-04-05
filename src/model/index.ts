export * from './query-body'
export * from './filters'

let file: File

export function getOntologyFile() {
  return file
}

export function setOntologyFile(value: File) {
  file = value
}