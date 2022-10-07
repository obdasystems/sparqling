import { getQueryBody, isFullPageActive, setFullPage } from "../model";
import * as queryGraph from '../query-graph'
import * as ontologyGraph from '../ontology-graph'
import { bgpContainer } from "../util/get-container"
import { ui } from "grapholscape"
import sparqlingStyle from '../ontology-graph/style'
import { classSelector, initClassSelector } from "../widgets";
import { cy } from "../query-graph/renderer";

export function stopFullpage() {
  if (!isFullPageActive()) return

  const grapholscape = ontologyGraph.getGscape()
  setFullPage(false)
  queryGraph.widget.withoutBGP = false
  queryGraph.setContainer(bgpContainer)
  setTimeout(() => cy.fit(), 500)
  grapholscape.renderer.mount();
  (grapholscape.widgets.get(ui.WidgetEnum.DIAGRAM_SELECTOR) as unknown as ui.IBaseMixin).enable()
  classSelector.hide()
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
  queryGraph.widget.withoutBGP = true

  const queryBody = getQueryBody()

  if (!queryBody || !queryBody.graph) {
    // show class selector

    if (classSelector.entityList.length === 0) {
      initClassSelector()
    }
    classSelector.show()
  }
}