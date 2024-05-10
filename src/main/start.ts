import { ui } from 'grapholscape'
import { StandaloneApi } from '../api/swagger'
import core from '../core'
import * as model from '../model'
import getGscape from '../ontology-graph/get-gscape'
import { getIris } from '../util/graph-element-utility'
import { hideUI, showUI } from '../util/show-hide-ui'
import { startRunButtons } from '../widgets'
import { moveUIForColorLegend } from '../widgets/move-ui-for-color-legend'
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

    /**
     * Close color legend and move left column container up on colors activations
     */
    const entityColorButton = (getGscape().widgets.get(ui.WidgetEnum.COLOR_BUTTON) as ui.GscapeButton);
    const entityColorLegend = (getGscape().widgets.get(ui.WidgetEnum.INCREMENTAL_FILTERS) as unknown as ui.IDropPanelMixin);
    if (entityColorButton) {
      const previousCallback = entityColorButton.onclick as any

      entityColorButton.onclick = (e) => {
        if (previousCallback)
          previousCallback(e)

        moveUIForColorLegend(entityColorButton.active)
      }

      moveUIForColorLegend(entityColorButton.active)
      entityColorLegend?.closePanel()
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
    }
    core.onStart()
  }
}