import { Grapholscape, loadConfig, ui } from "grapholscape";
import { getQueryBody, setFullPage } from "../model";
import * as ontologyGraph from '../ontology-graph';
import sparqlingStyle from '../ontology-graph/style';
import * as queryGraph from '../query-graph';
import { cy } from "../query-graph/renderer";
import { bgpContainer } from "../util/get-container";
import { classSelector, highlightsList, initClassSelector, startRunButtons } from "../widgets";
import { moveUIForColorLegend } from "../widgets/move-ui-for-color-legend";
import { refreshHighlights } from "./highlights";

let widgetStates: { [key in ui.WidgetEnum]?: { enabled: boolean, visible: boolean } } = {}

export function stopFullPage() {
  const grapholscape = ontologyGraph.getGscape()
  setFullPage(false)
  queryGraph.widget.withoutBGP = false
  queryGraph.setContainer(bgpContainer)
  setTimeout(() => cy.fit(), 500)

  if (!grapholscape.renderState || (!loadConfig().selectedRenderer && grapholscape.renderers.length > 1)) {
    (grapholscape.widgets.get(ui.WidgetEnum.INITIAL_RENDERER_SELECTOR) as any)?.show()
    grapholscape.showDiagram(0)
  } else {
    if (grapholscape.diagramId === undefined || !grapholscape.renderer.diagram) {
      grapholscape.showDiagram(0)
    } else {
      grapholscape.renderer.cy = grapholscape.renderer.diagram.representations.get(grapholscape.renderState)?.cy
      grapholscape.renderer.mount()
    }
  }

  enableWidgetsForFullpage(grapholscape)
  classSelector.hide()
  if (grapholscape.renderer.cy)
    ontologyGraph.addStylesheet(grapholscape.renderer.cy, sparqlingStyle(grapholscape.theme))

  queryGraph.setTheme(grapholscape.theme)
  highlightsList.style.marginTop = '60px'
  refreshHighlights()
  startRunButtons.ontologyGraphEnabled = true
  localStorage.setItem('obda-systems.sparqling-ontologyGraph', 'true')
}

export function startFullPage() {
  const grapholscape = ontologyGraph.getGscape()
  setFullPage(true)

  grapholscape.renderer.stopRendering();
  disableWidgetsForFullpage(grapholscape)

  // move query graph inside grapholscape main container
  queryGraph.setContainer(grapholscape.renderer.container)
  queryGraph.widget.withoutBGP = true
  grapholscape.renderer.cy = cy

  const queryBody = getQueryBody()

  if (!queryBody || !queryBody.graph || !queryBody.graph.id) {
    // show class selector
    initClassSelector()
    classSelector.show()
  }

  highlightsList.style.marginTop = '10px'
  moveUIForColorLegend((grapholscape.widgets.get(ui.WidgetEnum.COLOR_BUTTON) as any).active)
  startRunButtons.ontologyGraphEnabled = false
  localStorage.setItem('obda-systems.sparqling-ontologyGraph', 'false')
}

function disableWidgetsForFullpage(grapholscape: Grapholscape) {
  let widget: ui.IBaseMixin
  grapholscape.widgets.forEach((w, widgetKey) => {
    widget = w as unknown as ui.IBaseMixin
    widgetStates[widgetKey] = { enabled: widget.enabled, visible: widget.isVisible }
    switch (widgetKey) {
      case ui.WidgetEnum.DIAGRAM_SELECTOR:
      case ui.WidgetEnum.RENDERER_SELECTOR:
      case ui.WidgetEnum.FILTERS:
      case ui.WidgetEnum.ONTOLOGY_EXPLORER:
      case ui.WidgetEnum.OWL_VISUALIZER:
      case ui.WidgetEnum.COLOR_BUTTON:
      case ui.WidgetEnum.ENTITY_COLOR_LEGEND:
        widget.disable()
        break

      case ui.WidgetEnum.ENTITY_DETAILS:
        (widget as any).showOccurrences = false
    }
  })
}

function enableWidgetsForFullpage(grapholscape: Grapholscape) {
  let widget: ui.IBaseMixin
  Object.entries(widgetStates).forEach(([key, widgetState]) => {
    
    if (widgetState.enabled && key !== ui.WidgetEnum.OWL_VISUALIZER) {
      widget = (grapholscape.widgets.get(key as ui.WidgetEnum) as unknown as ui.IBaseMixin)
      widget.enable()
      if (!widgetState.visible) {
        widget.hide() // keep it enabled but hidden if it was hidden before
      }

      if (key === ui.WidgetEnum.ENTITY_DETAILS) {
        (widget as any).showOccurrences = true
      }
    }
  })
}