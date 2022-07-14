import { hideUI } from "../util/show-hide-ui"
import * as ontologyGraph from '../ontology-graph'
import getGscape from "../ontology-graph/get-gscape"
import * as model from "../model"
import core from "../core"
import { startRunButtons } from "../widgets"

export default function () {
  if (model.isSparqlingRunning()) {
    hideUI()
    ontologyGraph.clearSelected()
    ontologyGraph.resetHighlights()
    getGscape().widgets.ENTITY_DETAILS.hide()
    model.setSparqlingRunning(false)
    startRunButtons.startSparqlingButton.highlighted = false
    startRunButtons.canQueryRun = false
    core.onStop()
  }
}

