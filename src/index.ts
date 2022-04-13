import { Grapholscape } from 'grapholscape'
import core from './core'
import * as model from './model'
import * as ontologyGraph from './ontology-graph'
import * as queryGraph from './query-graph'
import * as queryHead from './query-head'
import { leftColumnContainer } from './util/get-container'
import * as widgets from './widgets'
import * as handlers from './handlers'

export default function sparqling(gscape: Grapholscape, file?: string | File, isStandalone?: boolean) {
  if (file && gscape) {
    if (typeof file === 'string')
      file = new File([file], `${gscape.ontology.name}-from-string.graphol`)

    model.setStandalone(isStandalone)
    model.setOntologyFile(file)

    //sparqlingContainer.appendChild(gscapeContainer)
    //const gscape = await fullGrapholscape(file, gscapeContainer, { owl_translator: false })
    ontologyGraph.setGrapholscapeInstance(gscape)
  
    leftColumnContainer.appendChild(widgets.highlightsList as any)
    leftColumnContainer.appendChild(queryHead.widget as any)
  
    // Add query graph and query head widgets to grapholscape instance
    const uiContainer = gscape.container.querySelector('#gscape-ui')
    uiContainer.insertBefore(queryGraph.widget, uiContainer.firstChild)
    uiContainer.insertBefore(leftColumnContainer, uiContainer.firstChild)
    uiContainer.appendChild(widgets.relatedClassDialog)
    uiContainer.appendChild(widgets.sparqlDialog)
    uiContainer.appendChild(widgets.filterDialog)
    uiContainer.appendChild(widgets.filterListDialog)
    uiContainer.appendChild(widgets.functionDialog)
    uiContainer.appendChild(widgets.errorsDialog)
    uiContainer.appendChild(widgets.aggregationDialog)
  
    gscape.container.querySelector('#gscape-ui-bottom-container').appendChild(widgets.startRunButtons)
  
    queryGraph.setDisplayedNameType(gscape.actualEntityNameType, gscape.languages.selected)
    queryGraph.setTheme(gscape.themesController.actualTheme)
    
    if (model.isStandalone()) {
      widgets.startRunButtons.startSparqlingButton.enabled = true
    }

    handlers // hack, just mention the handlers to make the module be evaluated 

    return core
  } else {
    return null
  }
}