import { Core } from "cytoscape"
import { EntityNameType, Grapholscape, GrapholscapeTheme, GrapholTypesEnum, LifecycleEvent, RendererStatesEnum, storeConfigEntry } from "grapholscape"
import { OntologyGraphHandlers } from "../handlers"
import * as model from '../model'
import * as ontologyGraph from '../ontology-graph'
import { getGscape, refreshHighlights } from "../ontology-graph"
import sparqlingStyle from '../ontology-graph/style'
import * as queryGraph from '../query-graph'
import { stopFullpage } from "./fullpage"

export default function init() {
  const gscape = getGscape()
  if (gscape.renderer.cy)
    ontologyGraph.addStylesheet(gscape.renderer.cy, sparqlingStyle(gscape.theme));

  if (gscape.renderer.cy && gscape.renderState !== RendererStatesEnum.INCREMENTAL)
    setHandlers(gscape.renderer.cy)

  gscape.on(LifecycleEvent.LanguageChange, (newLanguage: string) => queryGraph.setLanguage(newLanguage))
  gscape.on(LifecycleEvent.EntityNameTypeChange, (newNameType: EntityNameType) => {
    queryGraph.setDisplayedNameType(newNameType, gscape.language)
  })

  gscape.on(LifecycleEvent.ThemeChange, (newTheme: GrapholscapeTheme) => {
    queryGraph.setTheme(newTheme)
    if (gscape.renderer.cy)
      ontologyGraph.addStylesheet(gscape.renderer.cy, sparqlingStyle(newTheme))
  })

  gscape.on(LifecycleEvent.DiagramChange, () => onChangeDiagramOrRenderer(gscape))

  gscape.on(LifecycleEvent.RendererChange, () => onChangeDiagramOrRenderer(gscape))
}

function onChangeDiagramOrRenderer(gscape: Grapholscape) {
  if (model.isFullPageActive()) {
    stopFullpage()
  }

  if (gscape.renderer.cy && gscape.renderState !== RendererStatesEnum.INCREMENTAL) {
    setHandlers(gscape.renderer.cy)
    ontologyGraph.addStylesheet(gscape.renderer.cy, sparqlingStyle(gscape.theme))
  }

  if (gscape.renderState !== RendererStatesEnum.INCREMENTAL && model.isSparqlingRunning())
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