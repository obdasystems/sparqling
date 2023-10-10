import { AxiosResponse } from "axios"
import { Highlights, QueryGraph } from "../api/swagger"
import { setLoading, increaseLoadingProcesses, decreaseLoadingProcesses, getNumberLoadingProcesses, isLoading, EmptyUnfoldingEntities } from "../model"
import { errorsDialog, loadingDialog, startRunButtons } from "../widgets"
import { ui } from "grapholscape"
import { getGscape } from "../ontology-graph"

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
export function handlePromise(promise: Promise<AxiosResponse<EmptyUnfoldingEntities, any>>, showError?: boolean): Promise<EmptyUnfoldingEntities>
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
          let errorText = `${error.name}: ${error.message}`
          if (error.response) {
            if (error.response.status === 401) {
              const lo = document.getElementById("logout")
              lo?.click()
            } else if (error.response.data) {
              errorText += `\n\nServer message: ${error.response.data}`
            }
          }

          ui.showMessage(errorText, 'Error', getGscape().uiContainer, 'error')
        }
      })
      .finally(() => stopLoading())
  }
}

export function startLoading() {
  setLoading(true)
  // Show loading dialog only for long waiting times
  setTimeout(() => {
    if (isLoading()) // after awhile if still loading, show loading dialog
      loadingDialog.show()
  }, 500)
  increaseLoadingProcesses()
  startRunButtons.startLoadingAnimation()
}

export function stopLoading() {
  decreaseLoadingProcesses()

  if (getNumberLoadingProcesses() === 0) {
    setLoading(false)
    loadingDialog.hide()
    startRunButtons.stopLoadingAnimation()
  }
}