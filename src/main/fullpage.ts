import { getQueryBody, isFullPageActive, setFullPage } from "../model";
import * as queryGraph from '../query-graph'
import * as ontologyGraph from '../ontology-graph'
import { bgpContainer } from "../util/get-container"
import { ui } from "grapholscape"
import sparqlingStyle from '../ontology-graph/style'
import { classSelector, initClassSelector } from "../widgets";

export function stopFullpage() {
  if (!isFullPageActive()) return

  const grapholscape = ontologyGraph.getGscape()
  setFullPage(false)
  queryGraph.setContainer(bgpContainer)
  grapholscape.renderer.mount();
  (grapholscape.widgets.get(ui.WidgetEnum.DIAGRAM_SELECTOR) as unknown as ui.IBaseMixin).enable()
  ontologyGraph.addStylesheet(grapholscape.renderer.cy, sparqlingStyle(grapholscape.theme))
}

export function startFullpage() {
  if (isFullPageActive()) return

  const grapholscape = ontologyGraph.getGscape()
  setFullPage(true)

  grapholscape.renderer.stopRendering();
  (grapholscape.widgets.get(ui.WidgetEnum.DIAGRAM_SELECTOR) as unknown as ui.IBaseMixin).disable()

  // move query graph inside grapholscape main container
  queryGraph.setContainer(grapholscape.renderer.container)

  const queryBody = getQueryBody()

  if (!queryBody || !queryBody.graph) {
    // show class selector

    if (classSelector.entityList.length === 0) {
      initClassSelector()
    }
    classSelector.show()
  }
}