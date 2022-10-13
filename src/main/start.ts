import { ui } from 'grapholscape'
import { LitElement } from 'lit'
import { StandaloneApi } from '../api/swagger'
import core from '../core'
import * as model from '../model'
import * as ontologyGraph from '../ontology-graph'
import getGscape from '../ontology-graph/get-gscape'
import { widget as queryHeadWidget } from '../query-head'
import { getIri } from '../util/graph-element-utility'
import { showUI } from '../util/show-hide-ui'
import { startRunButtons } from '../widgets'
import { handlePromise } from './handle-promises'

export default async function () {
  let loadingPromise: Promise<any> = new Promise(() => { })

  if (model.isStandalone()) {
    const standaloneApi = new StandaloneApi()
    const ontologyFile = model.getOntologyFile()

    // If current ontology is already loaded, do not perform upload again
    await ontologyFile.text().then(async ontologyString => {
      await handlePromise(standaloneApi.standaloneOntologyGrapholGet()).then(grapholFile => {
        if (ontologyString.trim() === grapholFile.trim()) {
          startSparqling()
        } else {
          loadingPromise = handlePromise(standaloneApi.standaloneOntologyUploadPost(model.getOntologyFile()))
          loadingPromise.then(_ => startSparqling())
        }
      })
    })
  } else {
    queryHeadWidget.allowPreview = true
    startSparqling()
  }

  return loadingPromise

  function startSparqling() {
    const owlVisualizer = (getGscape().widgets.get(ui.WidgetEnum.OWL_VISUALIZER) as unknown as ui.IBaseMixin);
    model.setPreviousOwlVisualizerState(owlVisualizer.enabled)
    owlVisualizer.disable()
    const settingsWidget = (getGscape().widgets.get(ui.WidgetEnum.SETTINGS) as any);
    delete settingsWidget.widgetStates[ui.WidgetEnum.OWL_VISUALIZER]

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