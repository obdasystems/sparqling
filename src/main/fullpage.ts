import { getQueryBody, isFullPageActive, setFullPage } from "../model";
import * as queryGraph from '../query-graph'
import * as ontologyGraph from '../ontology-graph'
import { bgpContainer } from "../util/get-container"
import { RendererStatesEnum, ui } from "grapholscape"
import sparqlingStyle from '../ontology-graph/style'
import { classSelector, initClassSelector } from "../widgets";
import { cy } from "../query-graph/renderer";

let hadIncremental = false
let incrementalIndex: number
let incrementalViewRendererState: any

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

  if (hadIncremental) {
    const rendererSelector = grapholscape.widgets.get(ui.WidgetEnum.RENDERER_SELECTOR) as unknown as any
    rendererSelector.rendererStates.splice(incrementalIndex, 0, incrementalViewRendererState)
    rendererSelector.requestUpdate()
  }
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

  const rendererSelector = grapholscape.widgets.get(ui.WidgetEnum.RENDERER_SELECTOR) as unknown as any
  const rendererStates: RendererStatesEnum[] = rendererSelector.rendererStates.map(rs => rs.id)
  if (rendererStates.includes(RendererStatesEnum.INCREMENTAL)) {
    hadIncremental = true
    incrementalIndex = rendererStates.indexOf(RendererStatesEnum.INCREMENTAL)

    incrementalViewRendererState = rendererSelector.rendererStates.splice(
      incrementalIndex,
      1
    )[0]
    rendererSelector.requestUpdate()
  }
}