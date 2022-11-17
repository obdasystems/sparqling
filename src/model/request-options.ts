export type SparqlingRequestOptions = {
  basePath?: string,
  version?: string,
  name?: string,
  headers?: any,
}

let _requestOptions: SparqlingRequestOptions = {
  basePath: undefined,
  version: undefined,
  headers: undefined,
  name: undefined,
}

export function setRequestOptions(requestOptions: SparqlingRequestOptions) {
  _requestOptions = requestOptions
}

export function getBasePath() { return _requestOptions.basePath }
export function getVersion() { return _requestOptions.version }
export function getName() {  return _requestOptions.name }
export function getHeaders() { return _requestOptions.headers }

export function getRequestOptions() {
  // { params: { version: 'version' }, headers: { "x-monolith-session-id": '0de2de0a-af44-4046-a91b-46b10394f068', 'Access-Control-Allow-Origin': '*', } }
  return {
    params: { version: _requestOptions.version },
    headers: _requestOptions.headers,
  }
}

export function isStandalone() {
  return _requestOptions.basePath ? false : true
}