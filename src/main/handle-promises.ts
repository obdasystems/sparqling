import { AxiosPromise, AxiosResponse } from "axios"
import { Highlights, QueryGraph } from "../api/swagger"
import { errorsDialog } from "../widgets"
import { setLoading, stopLoading } from "./loading-state"

function isResponseError(response) {
  return !response || response?.code === 1 || response?.type === 'error'
}

function getErrorMessage(response) {
  if (isResponseError(response))
    return response.message
}

export function handlePromise(promise: AxiosPromise<Highlights>): Promise<Highlights>
export function handlePromise(promise: AxiosPromise<QueryGraph>): Promise<QueryGraph>
export function handlePromise(promise: Promise<AxiosResponse<void>>): Promise<void>
export function handlePromise(promise: AxiosPromise<any>): Promise<any> {
  return new Promise(executor)

  function executor(resolve) {
    setLoading()
    promise
      .then(response => {
        if (isResponseError(response.data)) {
          throw new Error(getErrorMessage(response.data))
        } else {
          resolve(response.data)
        }
      })
      .catch(error => {
        errorsDialog.text = `${error.name} : ${error.message}`
        errorsDialog.show()
      })
      .finally(() => stopLoading())
  }
}