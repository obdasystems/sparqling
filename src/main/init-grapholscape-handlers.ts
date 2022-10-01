import cytoscape, { Core } from "cytoscape"
import { LifecycleEvent, EntityNameType, GrapholscapeTheme, Grapholscape, GrapholTypesEnum, RendererStatesEnum, ui, FloatyRendererState, GrapholRendererState, IncrementalRendererState, LiteRendererState, setGraphEventHandlers } from "grapholscape"
import { OntologyGraphHandlers } from "../handlers"
import { getGscape, refreshHighlights } from "../ontology-graph"
import * as model from '../model'
import * as ontologyGraph from '../ontology-graph'
import * as queryGraph from '../query-graph'
import sparqlingStyle from '../ontology-graph/style'
import SparqlingIncrementalRendererState from "../query-graph/renderer/incremental-renderer"
import { cy as queryGraphCy } from "../query-graph/renderer/"
import { bgpContainer } from "../util/get-container"

export default function init() {
  const gscape = getGscape()
  ontologyGraph.addStylesheet(gscape.renderer.cy, sparqlingStyle(gscape.theme));

  (gscape.widgets.get(ui.WidgetEnum.RENDERER_SELECTOR) as any).onRendererStateSelection = (rendererState) => {
    handleRendererStateSelection(rendererState, gscape)
  }

  if (gscape.renderer.cy && gscape.renderState !== RendererStatesEnum.INCREMENTAL)
    setHandlers(gscape.renderer.cy)

  gscape.on(LifecycleEvent.LanguageChange, (newLanguage: string) => queryGraph.setLanguage(newLanguage))
  gscape.on(LifecycleEvent.EntityNameTypeChange, (newNameType: EntityNameType) => {
    queryGraph.setDisplayedNameType(newNameType, gscape.language)
  })

  gscape.on(LifecycleEvent.ThemeChange, (newTheme: GrapholscapeTheme) => {
    queryGraph.setTheme(newTheme)
    ontologyGraph.addStylesheet(gscape.renderer.cy, sparqlingStyle(newTheme))
  })

  gscape.on(LifecycleEvent.DiagramChange, () => onChangeDiagramOrRenderer(gscape))

  gscape.on(LifecycleEvent.RendererChange, () => onChangeDiagramOrRenderer(gscape))
}

function onChangeDiagramOrRenderer(gscape: Grapholscape) {
  if (gscape.renderer.cy && gscape.renderState !== RendererStatesEnum.INCREMENTAL) {
    setHandlers(gscape.renderer.cy)
    ontologyGraph.addStylesheet(gscape.renderer.cy, sparqlingStyle(gscape.theme))
  }
  refreshHighlights()
}

function setHandlers(cy: Core) {
  // [diplayed_name] select only nodes with a defined displayed name, 
  // avoid fake nodes (for inverse/nonInverse functional obj properties)
  const objPropertiesSelector = `[iri][type = "${GrapholTypesEnum.OBJECT_PROPERTY}"]`
  cy.on('mouseover', objPropertiesSelector, e => {
    if (model.isSparqlingRunning())
      ontologyGraph.showRelatedClassesWidget(e.target.data('iri'), e.renderedPosition)
  })
  cy.on('mouseout', objPropertiesSelector, e => {
    if (model.isSparqlingRunning())
      ontologyGraph.hideRelatedClassesWidget()
  })

  cy.on('dblclick', `[iri]`, e => {
    if (model.isSparqlingRunning())
      OntologyGraphHandlers.handleEntitySelection(e.target.data().iri, e.target.data().type, { elementId: e.target.id(), diagramId: getGscape().diagramId })
  })
}

function handleRendererStateSelection(rendererState: RendererStatesEnum, grapholscape: Grapholscape) {
  const previousState = grapholscape.renderState
  if (rendererState !== grapholscape.renderState) {

    switch (rendererState) {
      case RendererStatesEnum.GRAPHOL:
        grapholscape.setRenderer(new GrapholRendererState())
        break

      case RendererStatesEnum.GRAPHOL_LITE:
        grapholscape.setRenderer(new LiteRendererState())
        break

      case RendererStatesEnum.FLOATY:
        grapholscape.setRenderer(new FloatyRendererState())
        break
    }

    const diagramSelector = grapholscape.widgets.get(ui.WidgetEnum.DIAGRAM_SELECTOR) as unknown as ui.IBaseMixin
    const entitySelector = grapholscape.widgets.get(ui.WidgetEnum.ENTITY_SELECTOR) as unknown as ui.IBaseMixin

    if (rendererState === RendererStatesEnum.INCREMENTAL) {
      const incrementalRendererState = new SparqlingIncrementalRendererState(queryGraphCy)
      
      grapholscape.setRenderer(incrementalRendererState);
      entitySelector.hide()
      //initIncremental(incrementalRendererState, grapholscape);

      diagramSelector.hide()

      // if (grapholscape.renderer.cy?.elements().size() === 0) {
      //   entitySelector.show()
      // }
    } else {
      diagramSelector.show()
      entitySelector.hide()

      if (previousState === RendererStatesEnum.INCREMENTAL) {
        queryGraphCy.unmount()
        queryGraphCy.mount(bgpContainer)
        queryGraphCy.resize()
        queryGraphCy.fit()
        
        grapholscape.renderer.mount()
        if (grapholscape.renderer.diagram) {
          setGraphEventHandlers(grapholscape.renderer.diagram, grapholscape.lifecycle, grapholscape.ontology)
        }
        onChangeDiagramOrRenderer(grapholscape)
      }
    }
  }
}