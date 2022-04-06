import { AxiosPromise, AxiosResponse } from "axios"
import { Highlights, QueryGraph } from "../api/swagger"
import { errorsDialog } from "../widgets"
import { startLoading, stopLoading } from "./loading-state"

function isResponseError(response) {
  return !response || response?.code === 1 || response?.type === 'error'
}

function getErrorMessage(response) {
  if (isResponseError(response))
    return response.message
}

export function handlePromise(promise: AxiosPromise<Highlights>, showError?: boolean): Promise<Highlights>
export function handlePromise(promise: AxiosPromise<QueryGraph>, showError?: boolean): Promise<QueryGraph>
export function handlePromise(promise: Promise<AxiosResponse<void>>, showError?: boolean): Promise<void>
export function handlePromise(promise: Promise<AxiosResponse<string>>, showError?: boolean): Promise<string>
export function handlePromise(promise: AxiosPromise<any>, showError = true): Promise<any> {
  return new Promise(executor)

  function executor(resolve) {
    startLoading()
    promise
      .then(response => {
        if (isResponseError(response.data)) {
          throw new Error(getErrorMessage(response.data))
        } else {
          resolve(response.data)
        }
      })
      .catch(error => {
        console.error(error)
        if (showError) {
          errorsDialog.text = `${error.name} : ${error.message}`
          errorsDialog.show()
        }
      })
      .finally(() => stopLoading())
  }
}