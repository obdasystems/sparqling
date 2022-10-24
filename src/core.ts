import * as model from './model'
import { startRunButtons } from './widgets'
import start from './main/start'
import stop from './main/stop'
import { QueryGraph } from './api/swagger'
import loadQuery from './main/load-query'

interface Core {
  getQueryBody: () => QueryGraph,
  startStopButton: any,
  runQueryButton: any,
  onQueryRun?: (queryString: string) => void,
  onQuerySave?: (queryGraph: QueryGraph) => void,
  onShowSettings?: () => void,
  redirectToSPARQLPage?: () => void,
  onStart: () => void,
  onStop: () => void,
  start: () => void,
  stop: () => void,
}

export default {
  getQueryBody: model.getQueryBody,
  startStopButton: startRunButtons.startSparqlingButton,
  runQueryButton: startRunButtons.runQueryButton,
  onQueryRun: undefined,
  onQuerySave: undefined,
  onShowSettings: undefined,
  redirectToSPARQLPage: undefined,
  onStop: () => { },
  onStart: () => { },
  start: start,
  stop: stop,
  loadQuery: loadQuery,
} as Core