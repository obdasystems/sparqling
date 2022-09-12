import core from "../core";
import { getEndpoints, getQueryBody, getSelectedEndpoint, setSelectedEndpoint, updateEndpoints } from "../model";
import { startRunButtons } from "../widgets";
import start from "../main/start";
import stop from "../main/stop";

startRunButtons.onSparqlingStart(() => {
  try {
    start()
  } catch(error) {
    console.log('caught')
    console.log(error)
    return
  }
  core.onStart()
})

startRunButtons.onSparqlingStop(() => {
  stop()
  core.onStop()
})

startRunButtons.onQueryRun(() => {
  if (core.onQueryRun)
    core.onQueryRun(getQueryBody()?.sparql)
})

startRunButtons.onEndpointChange((newEndpointName) => {
  const newEndpoint = getEndpoints().find(e => e.name === newEndpointName)
  if (newEndpoint) {
    setSelectedEndpoint(newEndpoint)
    startRunButtons.selectedEndpointName = newEndpoint.name
  }
})

startRunButtons.onTogglePanel = () => {
  updateEndpoints()
  startRunButtons.endpoints = getEndpoints()
  startRunButtons.selectedEndpointName = getSelectedEndpoint()?.name
}