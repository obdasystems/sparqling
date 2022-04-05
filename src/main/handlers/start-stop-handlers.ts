import core from "../../core";
import { getQueryBody } from "../../model";
import { startRunButtons } from "../../widgets";
import start from "../start";
import stop from "../stop";

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