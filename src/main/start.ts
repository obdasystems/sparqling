import { Core } from 'cytoscape'
import { GrapholTypesEnum, LifecycleEvent, ui, EntityNameType, GrapholscapeTheme } from 'grapholscape'
import { StandaloneApi } from '../api/swagger'
import core from '../core'
import * as OntologyGraphHandlers from '../handlers/og-handlers'
import * as model from '../model'
import * as ontologyGraph from '../ontology-graph'
import { refreshHighlights } from '../ontology-graph'
import getGscape from '../ontology-graph/get-gscape'
import sparqlingStyle from '../ontology-graph/style'
import * as queryGraph from '../query-graph'
import { getIri } from '../util/graph-element-utility'
import { showUI } from '../util/show-hide-ui'
import { startRunButtons } from '../widgets'
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
          handlePromise(standaloneApi.standaloneOntologyUploadPost(model.getOntologyFile())).then(_ => startSparqling())
        }
      })
    })
  } else {
    startSparqling()
  }

  function startSparqling() {
    init();
    (getGscape().widgets.get(ui.WidgetEnum.OWL_VISUALIZER) as any).disable()
    showUI()
    model.setSparqlingRunning(true)
    startRunButtons.canQueryRun = model.getQueryBody()?.graph && !model.isStandalone() && core.onQueryRun !== undefined
    startRunButtons.requestUpdate()
    const selectedGraphElement = model.getSelectedGraphElement()
    if (selectedGraphElement) {
      const selectedGraphElementIri = getIri(selectedGraphElement)

      if (selectedGraphElementIri)
        ontologyGraph.highlightSuggestions(selectedGraphElementIri)

    }
    core.onStart()
  }
}

function init() {
  if (model.isSparqlingInitialised()) return
  const gscape = getGscape()
  ontologyGraph.addStylesheet(gscape.renderer.cy, sparqlingStyle(gscape.theme))

  if (gscape.renderer.cy)
    setHandlers(gscape.renderer.cy)

  // gscape.on(LifecycleEvent.LanguageChange, (newLanguage: string) => queryGraph.setLanguage(newLanguage))
  gscape.on(LifecycleEvent.EntityNameTypeChange, (newNameType: EntityNameType) => {
    // queryGraph.setDisplayedNameType(newNameType, gscape.language)
  })

  gscape.on(LifecycleEvent.ThemeChange, (newTheme: GrapholscapeTheme) => {
    queryGraph.setTheme(newTheme)
    ontologyGraph.addStylesheet(gscape.renderer.cy, sparqlingStyle(newTheme))
  })

  gscape.on(LifecycleEvent.DiagramChange, () => {
    if (gscape.renderer.cy) {
      setHandlers(gscape.renderer.cy)
      ontologyGraph.addStylesheet(gscape.renderer.cy, sparqlingStyle(gscape.theme))
    }
    refreshHighlights()
  })

  gscape.on(LifecycleEvent.RendererChange, () => {
    ontologyGraph.addStylesheet(gscape.renderer.cy, sparqlingStyle(gscape.theme))
    refreshHighlights()
  })

  model.setInitialised(true)
}

function setHandlers(cy: Core) {
  // [diplayed_name] select only nodes with a defined displayed name, 
  // avoid fake nodes (for inverse/nonInverse functional obj properties)
  const objPropertiesSelector = `[iri][type = "${GrapholTypesEnum.OBJECT_PROPERTY}"]`
  cy.on('mouseover', objPropertiesSelector, e => {
    if (model.isSparqlingRunning())
      ontologyGraph.showRelatedClassesWidget(e.target.data('iri'), e.renderedPosition)
  })
  cy.on('mouseout', objPropertiesSelector, e => {
    if (model.isSparqlingRunning())
      ontologyGraph.hideRelatedClassesWidget()
  })

  cy.on('dblclick', `[iri]`, e => {
    if (model.isSparqlingRunning())
      OntologyGraphHandlers.handleEntitySelection(e.target)
  })
}