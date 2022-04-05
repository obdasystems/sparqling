import { hideUI } from "../util/show-hide-ui"
import * as ontologyGraph from '../ontology-graph'
import getGscape from "../ontology-graph/get-gscape"
import { startRunButtons } from "../widgets"
import core from "../core"

export default function () {
  hideUI()
  ontologyGraph.clearSelected()
  ontologyGraph.resetHighlights()
  getGscape().widgets.ENTITY_DETAILS.hide()
  startRunButtons.isSparqlingRunning = false
  core.onStop()
}

