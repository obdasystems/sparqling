import { AxiosPromise, AxiosResponse } from "axios"
import { Highlights, QueryGraph } from "../api/swagger"
import { setLoading, increaseLoadingProcesses, decreaseLoadingProcesses, getNumberLoadingProcesses } from "../model"
import { errorsDialog, startRunButtons } from "../widgets"

function isResponseError(response) {
  return !response || response?.code === 1 || response?.type === 'error'
}

function getErrorMessage(response) {
  if (isResponseError(response))
    return response.message
}

export function handlePromise(promise: Promise<AxiosResponse<Highlights, any>>, showError?: boolean): Promise<Highlights>
export function handlePromise(promise: Promise<AxiosResponse<QueryGraph, any>>, showError?: boolean): Promise<QueryGraph>
export function handlePromise(promise: Promise<AxiosResponse<void, any>>, showError?: boolean): Promise<void>
export function handlePromise(promise: Promise<AxiosResponse<string, any>>, showError?: boolean): Promise<string>
export function handlePromise(promise: Promise<AxiosResponse<any, any>>, showError?: boolean): Promise<any>
export function handlePromise(promise: Promise<AxiosResponse<unknown, unknown>>, showError = true): Promise<unknown> {
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
          errorsDialog.errorText = `${error.name} : ${error.message}`
          errorsDialog.show()
        }
      })
      .finally(() => stopLoading())
  }
}

export function startLoading() {
  setLoading(true)
  increaseLoadingProcesses()
  startRunButtons.startLoadingAnimation()
}

export function stopLoading() {
  decreaseLoadingProcesses()

  if (getNumberLoadingProcesses() === 0) {
    setLoading(false)
    startRunButtons.stopLoadingAnimation()
  }
}