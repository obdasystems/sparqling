import { CollectionReturnValue, Core } from 'cytoscape'
import { Grapholscape, Theme, Type } from 'grapholscape'
import { StandaloneApi } from './api/swagger/api'
import * as ontologyGraph from './ontology-graph'
import { refreshHighlights } from './ontology-graph'
import sparqlingStyle from './ontology-graph/style'
import * as queryGraph from './query-graph'
import { DisplayedNameType } from './query-graph/displayed-name-type'
import { OntologyGraphHandlers } from './main'
import * as queryHead from './query-head'
import { highlightsList, relatedClassDialog, sparqlDialog, filterDialog, filterListDialog } from './widgets'
import { leftColumnContainer } from './util/get-container'

export default function sparqling(gscape: Grapholscape, file?: string | File, isStandalone?: boolean) {
  //sparqlingContainer.appendChild(gscapeContainer)
  //const gscape = await fullGrapholscape(file, gscapeContainer, { owl_translator: false })
  ontologyGraph.setGrapholscapeInstance(gscape)

  leftColumnContainer.appendChild(highlightsList as any)
  leftColumnContainer.appendChild(queryHead.widget as any)

  // Add query graph and query head widgets to grapholscape instance
  const uiContainer = gscape.container.querySelector('#gscape-ui')
  uiContainer.insertBefore(queryGraph.widget, uiContainer.firstChild)
  uiContainer.insertBefore(leftColumnContainer, uiContainer.firstChild)
  uiContainer.appendChild(relatedClassDialog)
  uiContainer.appendChild(sparqlDialog)
  uiContainer.appendChild(filterDialog)
  uiContainer.appendChild(filterListDialog)

  queryGraph.setDisplayedNameType(gscape.actualEntityNameType, gscape.languages.selected)
  queryGraph.setTheme(gscape.themesController.actualTheme)

  ontologyGraph.addStylesheet(gscape.renderer.cy, sparqlingStyle)

  setHandlers(gscape.renderer.cy)

  gscape.onLanguageChange((newLanguage: string) => queryGraph.setLanguage(newLanguage))
  gscape.onEntityNameTypeChange((newNameType: DisplayedNameType) => {
    queryGraph.setDisplayedNameType(newNameType, gscape.languages.selected)
  })
  gscape.onThemeChange((newTheme: Theme) => {
    queryGraph.setTheme(newTheme)
    ontologyGraph.addStylesheet(gscape.renderer.cy, sparqlingStyle)
  })
  gscape.onEntitySelection(async (cyEntity: CollectionReturnValue) =>
    OntologyGraphHandlers.handleEntitySelection(cyEntity)
  )
  gscape.onDiagramChange(() => {
    setHandlers(gscape.renderer.cy)
    ontologyGraph.addStylesheet(gscape.renderer.cy, sparqlingStyle)
  })

  gscape.onRendererChange(async () => {
    ontologyGraph.addStylesheet(gscape.renderer.cy, sparqlingStyle)
    await gscape.SimplifiedOntologyPromise
    refreshHighlights()
  })

  if (isStandalone && file) {
    if (typeof file === 'string')
      file = new File([file], `${gscape.ontology.name}-from-string.graphol`)

    new StandaloneApi().standaloneOntologyUploadPost(file as File)
  }

  function setHandlers(cy: Core) {
    // [diplayed_name] select only nodes with a defined displayed name, 
    // avoid fake nodes (for inverse/nonInverse functional obj properties)
    const objPropertiesSelector = `[displayed_name][type = "${Type.OBJECT_PROPERTY}"]`
    cy.on('mouseover', objPropertiesSelector, e => {
      ontologyGraph.showRelatedClassesWidget(e.target, e.renderedPosition)
    })
    cy.on('mouseout', objPropertiesSelector, e => {
      ontologyGraph.hideRelatedClassesWidget()
    })
  }
}