import { Grapholscape, ui } from "grapholscape";
import { getQueryBody, setFullPage } from "../model";
import * as ontologyGraph from '../ontology-graph';
import sparqlingStyle from '../ontology-graph/style';
import * as queryGraph from '../query-graph';
import { cy } from "../query-graph/renderer";
import { bgpContainer } from "../util/get-container";
import { classSelector, initClassSelector } from "../widgets";

let widgetStates: { [key in ui.WidgetEnum]?: boolean } 

export function stopFullpage() {
  const grapholscape = ontologyGraph.getGscape()
  setFullPage(false)
  queryGraph.widget.withoutBGP = false
  queryGraph.setContainer(bgpContainer)
  setTimeout(() => cy.fit(), 500)
  grapholscape.renderer.mount();
  // (grapholscape.widgets.get(ui.WidgetEnum.DIAGRAM_SELECTOR) as unknown as ui.IBaseMixin).enable()
  enableWidgetsForFullpage(grapholscape)
  classSelector.hide()
  ontologyGraph.addStylesheet(grapholscape.renderer.cy, sparqlingStyle(grapholscape.theme))
}

export function startFullpage() {
  // if (isFullPageActive()) return

  const grapholscape = ontologyGraph.getGscape()
  setFullPage(true)

  grapholscape.renderer.stopRendering();
  disableWidgetsForFullpage(grapholscape)

  // move query graph inside grapholscape main container
  queryGraph.setContainer(grapholscape.renderer.container)
  queryGraph.widget.withoutBGP = true

  const queryBody = getQueryBody()

  if (!queryBody || !queryBody.graph) {
    // show class selector
    initClassSelector()
    classSelector.show()
  }

  // const rendererSelector = grapholscape.widgets.get(ui.WidgetEnum.RENDERER_SELECTOR) as unknown as any
  // const rendererStates: RendererStatesEnum[] = rendererSelector.rendererStates.map(rs => rs.id)
  // if (rendererStates.includes(RendererStatesEnum.INCREMENTAL)) {
  //   hadIncremental = true
  //   incrementalIndex = rendererStates.indexOf(RendererStatesEnum.INCREMENTAL)

  //   incrementalViewRendererState = rendererSelector.rendererStates.splice(
  //     incrementalIndex,
  //     1
  //   )[0]
  //   rendererSelector.requestUpdate()
  // }
}

function disableWidgetsForFullpage(grapholscape: Grapholscape) {
  const settingsWidget = grapholscape.widgets.get(ui.WidgetEnum.SETTINGS) as any
  widgetStates = JSON.parse(JSON.stringify(settingsWidget.widgetStates));
  (grapholscape.widgets.get(ui.WidgetEnum.DIAGRAM_SELECTOR) as unknown as ui.IBaseMixin).disable();
  (grapholscape.widgets.get(ui.WidgetEnum.RENDERER_SELECTOR) as unknown as ui.IBaseMixin).disable();
  (grapholscape.widgets.get(ui.WidgetEnum.FILTERS) as unknown as ui.IBaseMixin).disable();
  (grapholscape.widgets.get(ui.WidgetEnum.ONTOLOGY_EXPLORER) as unknown as ui.IBaseMixin).disable();
  (grapholscape.widgets.get(ui.WidgetEnum.OWL_VISUALIZER) as unknown as ui.IBaseMixin).disable();

  const actualWidgetStates: { [key in ui.WidgetEnum]?: boolean }  = settingsWidget.widgetStates
  delete actualWidgetStates[ui.WidgetEnum.DIAGRAM_SELECTOR]
  delete actualWidgetStates[ui.WidgetEnum.RENDERER_SELECTOR]
  delete actualWidgetStates[ui.WidgetEnum.FILTERS]
  delete actualWidgetStates[ui.WidgetEnum.ONTOLOGY_EXPLORER]
  delete actualWidgetStates[ui.WidgetEnum.LAYOUT_SETTINGS]
  delete actualWidgetStates[ui.WidgetEnum.OWL_VISUALIZER]

  settingsWidget.requestUpdate()
}

function enableWidgetsForFullpage(grapholscape: Grapholscape) {
  const settingsWidget = grapholscape.widgets.get(ui.WidgetEnum.SETTINGS) as any
  settingsWidget.widgetStates = widgetStates

  Object.entries(widgetStates).forEach(([key, widgetState]) => {
    if (widgetState)
      (grapholscape.widgets.get(key as ui.WidgetEnum) as unknown as ui.IBaseMixin).enable()
  })

  settingsWidget.requestUpdate()
}