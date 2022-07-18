// import * as queryGraph from './query-graph'
// import * as queryHead from './query-head'
import * as model from './model'
import { startRunButtons } from './widgets'
import start from './main/start'
import stop from './main/stop'
import { QueryGraph } from './api/swagger'

interface Core {
  // queryGraph: typeof queryGraph,
  // queryHead: typeof queryHead,
  getQueryBody: () => QueryGraph,
  startStopButton: any,
  runQueryButton: any,
  onQueryRun?: (queryString: string) => void,
  onStart: () => void,
  onStop: () => void,
  start: () => void,
  stop: () => void,
}

export default {
  // queryGraph: queryGraph,
  // queryHead: queryHead,
  getQueryBody: model.getQueryBody,
  startStopButton: startRunButtons.startSparqlingButton,
  runQueryButton: startRunButtons.runQueryButton,
  onQueryRun: undefined,
  onStop: () => { },
  onStart: () => { },
  start: start,
  stop: stop,
} as Core