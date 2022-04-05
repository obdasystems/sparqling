import { QueryGraph } from "../api/swagger";
import { startRunButtons } from "../widgets";

let loading: boolean

export function setLoading() {
  loading = true
  startRunButtons.startLoadingAnimation()
}

export function stopLoading() {
  loading = false
  startRunButtons.stopLoadingAnimation()
}

export function isLoading() { return loading }