let loading: boolean
let numberLoadingProcesses = 0

export function increaseLoadingProcesses() {
  numberLoadingProcesses += 1
}

export function decreaseLoadingProcesses() {
  numberLoadingProcesses -= 1
}

export function getNumberLoadingProcesses() {
  return numberLoadingProcesses
}


export function isLoading() { return loading }

export function setLoading(value: boolean) {
  loading = value
}

export function clearLoadingState() {
  loading = false
  numberLoadingProcesses = 0
}