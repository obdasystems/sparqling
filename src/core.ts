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
  onQueryReset?: () => void,
  onShowResults?: () => void,
  onEndpointSelection?: (endpoint: MastroEndpoint) => void,
  onShowSettings?: () => void,
  onToggleCatalog?: () => void,
  redirectToSPARQLPage?: () => void,
  onStart: () => void,
  onStop: () => void,
  start: () => void,
  stop: () => void,
  loadQuery: (queryGraph: QueryGraph, queryName: string) => void,
  setQueryDirtyState: (isDirty: boolean) => void,
  setQueryName: (queryName: string) => void,
}

export default {
  getSelectedEndpoint: () => model.getSelectedEndpoint()?.name,
  getQueryBody: model.getQueryBody,
  startStopButton: startRunButtons.startSparqlingButton,
  runQueryButton: startRunButtons.runQueryButton,
  onQueryRun: undefined,
  onQuerySave: undefined,
  onQueryReset: undefined,
  onShowSettings: undefined,
  onEndpointSelection: undefined,
  onToggleCatalog: undefined,
  redirectToSPARQLPage: undefined,
  onStop: () => { },
  onStart: () => { },
  start: start,
  stop: stop,
  loadQuery: loadQuery,
  setQueryDirtyState: (isDirty: boolean) => {
    model.setQueryDirtyState(isDirty)
    startRunButtons.requestUpdate()
  },
  setQueryName: (queryName: string) => startRunButtons.queryName = queryName
} as Core