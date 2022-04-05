import core from "../core";
import { getQueryBody } from "../model";
import { startRunButtons } from "../widgets";
import start from "../main/start";
import stop from "../main/stop";

startRunButtons.onSparqlingStart(() => {
  start()
  core.onStart()
})

startRunButtons.onSparqlingStop(() => {
  stop()
  core.onStop()
})

startRunButtons.onQueryRun(() => {
  core.onQueryRun(getQueryBody()?.sparql)
})