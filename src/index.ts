import { Grapholscape, RendererStatesEnum, ui } from 'grapholscape'
import core from './core'
import * as handlers from './handlers'
import { initGrapholscapeHandlers, performHighlightsEmptyUnfolding, start } from './main'
import clearQuery from './main/clear-query'
import { startFullPage, stopFullPage } from './main/fullpage'
import onNewBody from './main/on-new-body'
import showInitialModeSelector from './main/show-initial-mode-selector'
import * as model from './model'
import { SparqlingRequestOptions } from './model/request-options'
import * as ontologyGraph from './ontology-graph'
import * as queryGraph from './query-graph'
import * as queryHead from './query-head'
import { leftColumnContainer } from './util/get-container'
import * as widgets from './widgets'

/**
 * Initialise sparqling on a grapholscape instance
 * @param gscape the grapholscape instance (ontology graph)
 * @param file the ontology .graphol, in string or Blob representation
 * @returns a core object, see ./core.ts
 */
export function sparqlingStandalone(gscape: Grapholscape, file: string | Blob) {
  model.clear()
  const sparqlingCore = getCore(gscape, file)
  showInitialModeSelector()
  return sparqlingCore
}

export async function sparqling(gscape: Grapholscape, file: string | Blob, requestOptions: SparqlingRequestOptions, config?: model.SparqlingConfig) {
  model.clear()
  model.setConfig(config)
  if (gscape.renderState === RendererStatesEnum.INCREMENTAL) {
    (gscape.widgets.get(ui.WidgetEnum.ENTITY_SELECTOR) as any).hide()
  }

  const sparqlingCore = getCore(gscape, file)

  if (sparqlingCore) {
    model.setRequestOptions(requestOptions)

    if (model.getQueryBody()?.graph)
      await clearQuery()
    else
      onNewBody(model.getQueryBody())

    await model.updateEndpoints()
    widgets.startRunButtons.endpoints = model.getEndpoints()
    widgets.startRunButtons.selectedEndpointName = model.getSelectedEndpoint()?.name
    widgets.startRunButtons.allowOntologyGraph = config?.allowOntologyGraph !== false

    const useOntologyGraph = localStorage.getItem('obda-systems.sparqling-ontologyGraph')
    if (useOntologyGraph === 'true' && config?.allowOntologyGraph !== false) {
      model.isSparqlingRunning() ? stopFullPage() : start().then(stopFullPage)
    } else if (useOntologyGraph === 'false' || config?.allowOntologyGraph === false) {
      model.isSparqlingRunning() ? startFullPage() : start().then(startFullPage)
    } else {
      showInitialModeSelector()
    }
  }
  return sparqlingCore
}

function getCore(gscape: Grapholscape, file: string | Blob) {
  if (file && gscape) {
    let ontologyFile = new File([file], `${gscape.ontology.name}-from-string.graphol`)

    model.setOntologyFile(ontologyFile)

    const actualGrapholscape = ontologyGraph.getGscape()
    if (actualGrapholscape !== gscape) {
      ontologyGraph.setGrapholscapeInstance(gscape)
      initGrapholscapeHandlers()
    }

    leftColumnContainer.appendChild(queryHead.widget)
    leftColumnContainer.appendChild(widgets.highlightsList)
    // Add query graph and query head widgets to grapholscape instance
    const uiContainer = gscape.container.querySelector('.gscape-ui')
    if (uiContainer) {
      uiContainer.insertBefore(queryGraph.widget, uiContainer.firstChild)
      uiContainer.insertBefore(leftColumnContainer, uiContainer.firstChild)
      uiContainer.appendChild(widgets.relatedClassDialog)
      uiContainer.appendChild(widgets.sparqlDialog)
      uiContainer.appendChild(widgets.filterDialog)
      uiContainer.appendChild(widgets.filterListDialog)
      uiContainer.appendChild(widgets.functionDialog)
      uiContainer.appendChild(widgets.aggregationDialog)
      uiContainer.appendChild(widgets.previewDialog)
      uiContainer.appendChild(widgets.errorsDialog)
      uiContainer.appendChild(widgets.classSelector)
      uiContainer.appendChild(widgets.loadingDialog)
      uiContainer.appendChild(widgets.startRunButtons)
    }
    queryGraph.setDisplayedNameType(gscape.entityNameType, gscape.language)
    queryGraph.setTheme(gscape.theme)

    handlers // hack, just mention the handlers to make the module be evaluated
    return core
  } else {
    return null
  }
}

export { queryGraph }