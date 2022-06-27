import * as queryGraph from './query-graph'
import * as queryHead from './query-head'
import * as model from './model'
import { startRunButtons } from './widgets'
import start from './main/start'
import stop from './main/stop'

export default {
  queryGraph: queryGraph,
  queryHead: queryHead,
  getQueryBody: model.getQueryBody,
  startStopButton: startRunButtons.startSparqlingButton,
  runQueryButton: startRunButtons.runQueryButton,
  onQueryRun: (sparqlQuery: string) => { },
  onStop: () => { },
  onStart: () => { },
  start: start,
  stop: stop,
}