import { hideUI } from "../util/show-hide-ui"
import * as ontologyGraph from '../ontology-graph'
import getGscape from "../ontology-graph/get-gscape"
import * as model from "../model"
import core from "../core"
import { startRunButtons } from "../widgets"
import { ui } from "grapholscape"

export default function () {
  if (model.isSparqlingRunning()) {
    hideUI()
    ontologyGraph.clearSelected()
    ontologyGraph.resetHighlights();
    (getGscape().widgets.get(ui.WidgetEnum.ENTITY_DETAILS) as any).hide()
    model.setSparqlingRunning(false)
    startRunButtons.canQueryRun = false
    startRunButtons.requestUpdate()
    core.onStop()
  }
}

