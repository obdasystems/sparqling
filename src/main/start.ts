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
import { leftColumnContainer } from '../util/get-container'

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

    /**
     * Close color legend and move left column container up on colors activations
     */
    const entityColorButton = (getGscape().widgets.get(ui.WidgetEnum.COLOR_BUTTON) as ui.GscapeButton);
    const entityColorLegend = (getGscape().widgets.get(ui.WidgetEnum.ENTITY_COLOR_LEGEND) as ui.GscapeEntityColorLegend);
    if (entityColorButton) {
      const previousCallback = entityColorButton.onclick as any

      entityColorButton.onclick = (e) => {
        if (previousCallback)
          previousCallback(e)

        leftColumnContainer.style.bottom = entityColorButton.active ? '40px' : '0'
        leftColumnContainer.style.height = entityColorButton.active ? 'calc(100% - 80px)' : 'calc(100% - 40px)'
        entityColorLegend?.closePanel()
      } 
    }

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