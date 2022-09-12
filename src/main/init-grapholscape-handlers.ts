import { Core } from "cytoscape"
import { LifecycleEvent, EntityNameType, GrapholscapeTheme, Grapholscape, GrapholTypesEnum } from "grapholscape"
import { OntologyGraphHandlers } from "../handlers"
import { getGscape, refreshHighlights } from "../ontology-graph"
import * as model from '../model'
import * as ontologyGraph from '../ontology-graph'
import * as queryGraph from '../query-graph'
import sparqlingStyle from '../ontology-graph/style'

export default function init() {
  // if (model.isSparqlingInitialised()) return
  const gscape = getGscape()
  ontologyGraph.addStylesheet(gscape.renderer.cy, sparqlingStyle(gscape.theme))

  if (gscape.renderer.cy)
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

  model.setInitialised(true)
}

function onChangeDiagramOrRenderer(gscape: Grapholscape) {
  if (gscape.renderer.cy) {
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
      OntologyGraphHandlers.handleEntitySelection(e.target.data().iri, e.target.data().type, { elementId: e.target.id(), diagramId: getGscape().diagramId})
  })
}