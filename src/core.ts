import * as model from './model'
import { startRunButtons } from './widgets'
import start from './main/start'
import stop from './main/stop'
import { QueryGraph } from './api/swagger'
import loadQuery from './main/load-query'
import { MastroEndpoint } from './model'

interface Core {
  getSelectedEndpoint: () => string | undefined,
  getQueryBody: () => QueryGraph,
  startStopButton: any,
  runQueryButton: any,
  onQueryRun?: (queryString: string) => void,
  onQuerySave?: (queryGraph: QueryGraph) => void,
  onShowResults?: () => void,
  onEndpointSelection?: (endpoint: MastroEndpoint) => void,
  onShowSettings?: () => void,
  onToggleCatalog?: () => void,
  redirectToSPARQLPage?: () => void,
  onStart: () => void,
  onStop: () => void,
  start: () => void,
  stop: () => void,
  loadQuery: (queryGraph: QueryGraph) => void,
}

export default {
  getSelectedEndpoint: () => model.getSelectedEndpoint()?.name,
  getQueryBody: model.getQueryBody,
  startStopButton: startRunButtons.startSparqlingButton,
  runQueryButton: startRunButtons.runQueryButton,
  onQueryRun: undefined,
  onQuerySave: undefined,
  onShowSettings: undefined,
  onEndpointSelection: undefined,
  onToggleCatalog: undefined,
  redirectToSPARQLPage: undefined,
  onStop: () => { },
  onStart: () => { },
  start: start,
  stop: stop,
  loadQuery: loadQuery,
} as Core