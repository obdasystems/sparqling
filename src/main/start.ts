import { StandaloneApi } from '../api/swagger'
import core from '../core'
import * as model from '../model'
import * as ontologyGraph from '../ontology-graph'
import * as queryGraph from '../query-graph'
import sparqlingStyle from '../ontology-graph/style'
import getGscape from '../ontology-graph/get-gscape'
import { getIri } from '../util/graph-element-utility'
import { showUI } from '../util/show-hide-ui'
import { startRunButtons } from '../widgets'
import { CollectionReturnValue, Core } from 'cytoscape'
import { DisplayedNameType } from '../query-graph/displayed-name-type'
import { Theme, Type } from 'grapholscape'
import * as OntologyGraphHandlers from '../handlers/og-handlers'
import { refreshHighlights } from '../ontology-graph'
import { handlePromise } from './handle-promises'

export default function () {
  if (model.isStandalone()) {
    const standaloneApi = new StandaloneApi()
    const ontologyFile = model.getOntologyFile()

    // If current ontology is already loaded, do not perform upload again
    ontologyFile.text().then(ontologyString => {
      handlePromise(standaloneApi.standaloneOntologyGrapholGet()).then(grapholFile => {
        if (ontologyString.trim() === grapholFile.trim()) {
          startSparqling()
        } else {
          handlePromise(new StandaloneApi().standaloneOntologyUploadPost(model.getOntologyFile())).then(_ => startSparqling())
        }
      })
    })
  } else {
    startSparqling()
  }

  function startSparqling() {
    init()
    getGscape().widgets.OWL_VISUALIZER.disable()
    showUI()
    startRunButtons.isSparqlingRunning = true
    ontologyGraph.highlightSuggestions(getIri(model.getSelectedGraphElement()))
    core.onStart()
  }
}

function init() {
  if (model.isSparqlingInitialised()) return
  const gscape = getGscape()
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
  gscape.onEntitySelection(async (cyEntity: CollectionReturnValue) => {
    if (startRunButtons.isSparqlingRunning)
      OntologyGraphHandlers.handleEntitySelection(cyEntity)
  })
  gscape.onDiagramChange(() => {
    setHandlers(gscape.renderer.cy)
    ontologyGraph.addStylesheet(gscape.renderer.cy, sparqlingStyle)
  })

  gscape.onRendererChange(async () => {
    ontologyGraph.addStylesheet(gscape.renderer.cy, sparqlingStyle)
    await gscape.SimplifiedOntologyPromise
    refreshHighlights()
  })

  model.setInitialised(true)
}

function setHandlers(cy: Core) {
  // [diplayed_name] select only nodes with a defined displayed name, 
  // avoid fake nodes (for inverse/nonInverse functional obj properties)
  const objPropertiesSelector = `[displayed_name][type = "${Type.OBJECT_PROPERTY}"]`
  cy.on('mouseover', objPropertiesSelector, e => {
    if (startRunButtons.isSparqlingRunning)
      ontologyGraph.showRelatedClassesWidget(e.target, e.renderedPosition)
  })
  cy.on('mouseout', objPropertiesSelector, e => {
    if (startRunButtons.isSparqlingRunning)
      ontologyGraph.hideRelatedClassesWidget()
  })
}