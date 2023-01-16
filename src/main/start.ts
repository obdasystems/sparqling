import { ui } from 'grapholscape'
import { StandaloneApi } from '../api/swagger'
import core from '../core'
import * as model from '../model'
import { selectEntity } from '../ontology-graph'
import getGscape from '../ontology-graph/get-gscape'
import { getIri, getIris } from '../util/graph-element-utility'
import { hideUI, showUI } from '../util/show-hide-ui'
import { startRunButtons } from '../widgets'
import { handlePromise } from './handle-promises'
import { performHighlights } from './highlights'

export default async function () {
  let loadingPromise: Promise<any> = Promise.resolve()

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
  }

  loadingPromise.then(_ => startSparqling())
  return loadingPromise

  function startSparqling() {
    const owlVisualizer = (getGscape().widgets.get(ui.WidgetEnum.OWL_VISUALIZER) as unknown as ui.IBaseMixin);
    model.setPreviousOwlVisualizerState(owlVisualizer.enabled)
    owlVisualizer.disable()
    const settingsWidget = (getGscape().widgets.get(ui.WidgetEnum.SETTINGS) as any);
    delete settingsWidget.widgetStates[ui.WidgetEnum.OWL_VISUALIZER]

    hideUI()
    showUI()
    model.setSparqlingRunning(true)
    startRunButtons.canQueryRun = model.getQueryBody()?.graph && !model.isStandalone() && core.onQueryRun !== undefined
    startRunButtons.endpoints = model.getEndpoints()
    startRunButtons.selectedEndpointName = model.getSelectedEndpoint()?.name
    startRunButtons.showResultsEnabled = false
    startRunButtons.requestUpdate()
    const selectedGraphElement = model.getActiveElement()?.graphElement
    if (selectedGraphElement) {
      performHighlights(getIris(selectedGraphElement))
      selectEntity(getIri(selectedGraphElement) || '')
    }
    core.onStart()
  }
}