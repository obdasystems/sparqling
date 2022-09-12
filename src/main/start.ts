import { Core } from 'cytoscape'
import { GrapholTypesEnum, LifecycleEvent, ui, EntityNameType, GrapholscapeTheme, Grapholscape } from 'grapholscape'
import { StandaloneApi } from '../api/swagger'
import core from '../core'
import * as OntologyGraphHandlers from '../handlers/og-handlers'
import * as model from '../model'
import * as ontologyGraph from '../ontology-graph'
import { refreshHighlights } from '../ontology-graph'
import getGscape from '../ontology-graph/get-gscape'
import sparqlingStyle from '../ontology-graph/style'
import * as queryGraph from '../query-graph'
import { widget as queryHeadWidget } from '../query-head'
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
    queryHeadWidget.allowPreview = true
    startSparqling()
  }

  function startSparqling() {
    (getGscape().widgets.get(ui.WidgetEnum.OWL_VISUALIZER) as any).disable()
    showUI()
    model.setSparqlingRunning(true)
    startRunButtons.canQueryRun = model.getQueryBody()?.graph && !model.isStandalone() && core.onQueryRun !== undefined
    startRunButtons.endpoints = model.getEndpoints()
    startRunButtons.selectedEndpointName = model.getSelectedEndpoint()?.name
    startRunButtons.requestUpdate()
    const selectedGraphElement = model.getActiveElement()?.graphElement
    if (selectedGraphElement) {
      const selectedGraphElementIri = getIri(selectedGraphElement)

      if (selectedGraphElementIri)
        ontologyGraph.highlightSuggestions(selectedGraphElementIri)

    }
    core.onStart()
  }
}