import { startRunButtons } from "../widgets";

let loading: boolean
let numberLoadingProcesses = 0

export function startLoading() {
  loading = true
  numberLoadingProcesses += 1
  startRunButtons.startLoadingAnimation()
}

export function stopLoading() {
  numberLoadingProcesses -= 1

  if (numberLoadingProcesses === 0) {
    loading = false
    startRunButtons.stopLoadingAnimation()
  }
}

export function isLoading() { return loading }