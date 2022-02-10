import { CollectionReturnValue } from 'cytoscape'
import { Grapholscape, Theme } from 'grapholscape'
import { StandaloneApi } from './api/swagger/api'
import * as ontologyGraph from './ontology-graph'
import { refreshHighlights } from './ontology-graph'
import sparqlingStyle from './ontology-graph/style'
import * as queryGraph from './query-graph'
import './query-handler'
import { onEntitySelection } from './query-handler'
import * as queryHead from './query-head'
import { listSelectionDialog, sparqlDialog } from './widgets'

export default function sparqling(gscape: Grapholscape, file?: string | File, isStandalone?: boolean) {
  //sparqlingContainer.appendChild(gscapeContainer)
  //const gscape = await fullGrapholscape(file, gscapeContainer, { owl_translator: false })
  ontologyGraph.setGrapholscapeInstance(gscape)

  // Add query graph and query head widgets to grapholscape instance
  const uiContainer = gscape.container.querySelector('#gscape-ui')
  uiContainer.insertBefore(queryGraph.widget, uiContainer.firstChild)
  uiContainer.insertBefore(queryHead.widget, uiContainer.firstChild)
  uiContainer.appendChild(listSelectionDialog)
  uiContainer.appendChild(sparqlDialog)

  gscape.onLanguageChange((newLanguage: string) => queryGraph.setLanguage(newLanguage))
  gscape.onEntityNameTypeChange((newNameType: string) => {
    queryGraph.setDisplayedNameType(newNameType, gscape.languages.selected)
  })

  queryGraph.setDisplayedNameType(gscape.actualEntityNameType, gscape.languages.selected)
  queryGraph.setTheme(gscape.themesController.actualTheme)
  gscape.onThemeChange((newTheme: Theme) => queryGraph.setTheme(newTheme))

  gscape.onEntitySelection(async (cyEntity: CollectionReturnValue) => onEntitySelection(cyEntity))

  ontologyGraph.addStylesheet(gscape.renderer.cy, sparqlingStyle)
  gscape.onDiagramChange(() => ontologyGraph.addStylesheet(gscape.renderer.cy, sparqlingStyle))
  gscape.onThemeChange(() => ontologyGraph.addStylesheet(gscape.renderer.cy, sparqlingStyle))
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
}