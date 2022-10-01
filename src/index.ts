import { Grapholscape, ui } from 'grapholscape'
import core from './core'
import * as model from './model'
import * as ontologyGraph from './ontology-graph'
import * as queryGraph from './query-graph'
import * as queryHead from './query-head'
import { leftColumnContainer } from './util/get-container'
import * as widgets from './widgets'
import * as handlers from './handlers'
import { SparqlingRequestOptions } from './model/request-options'
import clearQuery from './main/clear-query'
import { initGrapholscapeHandlers } from './main'
import { cy as queryGraphCy } from './query-graph/renderer/'

/**
 * Initialise sparqling on a grapholscape instance
 * @param gscape the grapholscape instance (ontology graph)
 * @param file the ontology .graphol, in string or Blob representation
 * @returns a core object, see ./core.ts
 */
export function sparqlingStandalone(gscape: Grapholscape, file: string | Blob) {
  window['sCy'] = queryGraphCy
  return getCore(gscape, file)
}

export function sparqling(gscape: Grapholscape, file: string | Blob, requestOptions: SparqlingRequestOptions) {
  const sparqlingCore = getCore(gscape, file)

  if (sparqlingCore) {
    const currentRequestOptions = model.getRequestOptions()

    // if there's a new ontology, discard the current query and set current instance as not initialised
    if (requestOptions.version !== currentRequestOptions.params.version || requestOptions.basePath !== model.getBasePath()) {
      clearQuery()
      sparqlingCore.stop()
    }
    model.setRequestOptions(requestOptions)
  }
  return sparqlingCore
}

function getCore(gscape: Grapholscape, file: string | Blob) {
  if (file && gscape) {
    let ontologyFile = new File([file], `${gscape.ontology.name}-from-string.graphol`)

    model.setOntologyFile(ontologyFile)

    const actualGrapholscape = ontologyGraph.getGscape()
    if (actualGrapholscape !== gscape) {

      // Remove restart button in incremental renderer, if present
      const rendererSelector = gscape.widgets.get(ui.WidgetEnum.RENDERER_SELECTOR) as any
      if (rendererSelector) {
        rendererSelector.onIncrementalRefresh = null
      }

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

      uiContainer?.querySelector('.gscape-ui-buttons-tray')?.appendChild(widgets.startRunButtons)
    }
    queryGraph.setDisplayedNameType(gscape.entityNameType, gscape.language)
    queryGraph.setTheme(gscape.theme)

    handlers // hack, just mention the handlers to make the module be evaluated

    if (model.isSparqlingRunning() && model.getQueryBody()) {
      // be sure grapholscape's highlights gets updated with the actual query state
      ontologyGraph.refreshHighlights()
    }

    return core
  } else {
    return null
  }
}