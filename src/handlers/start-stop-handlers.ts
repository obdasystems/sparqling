import core from "../core";
import { getQueryBody } from "../model";
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