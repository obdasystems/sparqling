import { Grapholscape } from 'grapholscape'
import core from './core'
import * as model from './model'
import * as ontologyGraph from './ontology-graph'
import * as queryGraph from './query-graph'
// import * as queryHead from './query-head'
import { leftColumnContainer } from './util/get-container'
import * as widgets from './widgets'
import * as handlers from './handlers'
import { SparqlingRequestOptions } from './model/request-options'
import clearQuery from './main/clear-query'

/**
 * Initialise sparqling on a grapholscape instance
 * @param gscape the grapholscape instance (ontology graph)
 * @param file the ontology .graphol, in string or Blob representation
 * @returns a core object, see ./core.ts
 */
export function sparqlingStandalone(gscape: Grapholscape, file: string | Blob) {
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
      model.setInitialised(false) // need to initialise everything again
    }
    model.setRequestOptions(requestOptions)
  }
  return sparqlingCore
}

function getCore(gscape: Grapholscape, file: string | Blob) {
  if (file && gscape) {
    let ontologyFile = new File([file], `${gscape.ontology.name}-from-string.graphol`)

    // model.setStandalone(basePath !== undefined || basePath !== null)
    model.setOntologyFile(ontologyFile)

    // if (basePath) {
    //   model.setBasePath(basePath)
    // }

    //sparqlingContainer.appendChild(gscapeContainer)
    //const gscape = await fullGrapholscape(file, gscapeContainer, { owl_translator: false })

    const actualGrapholscape = ontologyGraph.getGscape()
    if (actualGrapholscape !== gscape)
      model.setInitialised(false)
    
      ontologyGraph.setGrapholscapeInstance(gscape)

    // leftColumnContainer.appendChild(widgets.highlightsList as any)
    // leftColumnContainer.appendChild(queryHead.widget as any)

    // Add query graph and query head widgets to grapholscape instance
    const uiContainer = gscape.container.querySelector('.gscape-ui')
    uiContainer?.insertBefore(queryGraph.widget, uiContainer.firstChild)
    // uiContainer.insertBefore(leftColumnContainer, uiContainer.firstChild)
    // uiContainer.appendChild(widgets.relatedClassDialog)
    // uiContainer.appendChild(widgets.sparqlDialog)
    // uiContainer.appendChild(widgets.filterDialog)
    // uiContainer.appendChild(widgets.filterListDialog)
    // uiContainer.appendChild(widgets.functionDialog)
    // uiContainer.appendChild(widgets.errorsDialog)
    // uiContainer.appendChild(widgets.aggregationDialog)

    uiContainer?.querySelector('.gscape-ui-buttons-tray')?.appendChild(widgets.startRunButtons)

    queryGraph.setDisplayedNameType(gscape.entityNameType, gscape.language)
    queryGraph.setTheme(gscape.theme)

    handlers // hack, just mention the handlers to make the module be evaluated 

    return core
  } else {
    return null
  }
}