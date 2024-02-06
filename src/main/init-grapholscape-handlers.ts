import { Core } from "cytoscape"
import { EntityNameType, Grapholscape, GrapholscapeTheme, TypesEnum, LifecycleEvent, RendererStatesEnum, ui } from "grapholscape"
import { OntologyGraphHandlers } from "../handlers"
import * as model from '../model'
import { hasEntityEmptyUnfolding } from "../model"
import * as ontologyGraph from '../ontology-graph'
import { getGscape, resetHighlights, selectEntity } from "../ontology-graph"
import sparqlingStyle from '../ontology-graph/style'
import * as queryGraph from '../query-graph'
import { getIris } from "../util/graph-element-utility"
import { cxtMenu, highlightsList } from "../widgets"
import { emptyUnfoldingEntityTooltip } from "../widgets/assets/texts"
import { stopFullPage } from "./fullpage"
import { performHighlightsEmptyUnfolding, refreshHighlights } from "./highlights"
import { cy } from "../query-graph/renderer"

export default function init() {
  const gscape = getGscape()
  if (gscape.renderer.cy)
    ontologyGraph.addStylesheet(gscape.renderer.cy, sparqlingStyle(gscape.theme));

  if (gscape.renderer.cy && gscape.renderState !== RendererStatesEnum.INCREMENTAL)
    setHandlers(gscape.renderer.cy)

  gscape.on(LifecycleEvent.LanguageChange, (newLanguage: string) => {
    queryGraph.setLanguage(newLanguage)
    if (gscape.entityNameType === EntityNameType.LABEL) {
      updateSuggestionsDisplayedNames()
    }
  })
  gscape.on(LifecycleEvent.EntityNameTypeChange, (newNameType: EntityNameType) => {
    queryGraph.setDisplayedNameType(newNameType, gscape.language)
    updateSuggestionsDisplayedNames()
  })

  gscape.on(LifecycleEvent.ThemeChange, (newTheme: GrapholscapeTheme) => {
    queryGraph.setTheme(newTheme)
    if (gscape.renderer.cy && gscape.renderer.cy !== cy)
      ontologyGraph.addStylesheet(gscape.renderer.cy, sparqlingStyle(newTheme))
  })

  gscape.on(LifecycleEvent.DiagramChange, () => onChangeDiagramOrRenderer(gscape))

  gscape.on(LifecycleEvent.RendererChange, () => onChangeDiagramOrRenderer(gscape))

  function updateSuggestionsDisplayedNames() {
    const updateDisplayedName = (entity: ui.EntityViewDataUnfolding) => {
      const grapholEntity = gscape.ontology.getEntity(entity.entityViewData.value.iri.fullIri)
      if (grapholEntity)
        entity.entityViewData.displayedName = grapholEntity.getDisplayedName(gscape.entityNameType, gscape.language)
    }

    if (highlightsList.allHighlights) {
      highlightsList.allHighlights.classes.forEach(c => updateDisplayedName(c))
      highlightsList.allHighlights.dataProperties.forEach(dp => updateDisplayedName(dp))
      highlightsList.allHighlights.objectProperties.forEach(op => updateDisplayedName(op))
      highlightsList.requestUpdate()
    }
  }
}

function onChangeDiagramOrRenderer(gscape: Grapholscape) {
  if (model.isFullPageActive()) {
    stopFullPage()
  }

  if (gscape.renderer.cy && gscape.renderState !== RendererStatesEnum.INCREMENTAL) {
    setHandlers(gscape.renderer.cy)
    ontologyGraph.addStylesheet(gscape.renderer.cy, sparqlingStyle(gscape.theme))
  }

  if (gscape.renderState !== RendererStatesEnum.INCREMENTAL && model.isSparqlingRunning()) {
    resetHighlights()
    performHighlightsEmptyUnfolding()
    refreshHighlights()
  }

}

function setHandlers(cy: Core) {
  // [diplayed_name] select only nodes with a defined displayed name, 
  // avoid fake nodes (for inverse/nonInverse functional obj properties)
  const objPropertiesSelector = `[iri][type = "${TypesEnum.OBJECT_PROPERTY}"]`
  cy.on('mouseover', objPropertiesSelector, e => {
    if (model.isSparqlingRunning() && !hasEntityEmptyUnfolding(e.target.data().iri))
      ontologyGraph.showRelatedClassesWidget(e.target.data('iri'), e.renderedPosition)
  })

  cy.on('mouseover', `.${model.FADED_CLASS}`, e => {
    if (hasEntityEmptyUnfolding(e.target.data().iri)) { // show empty unfolding tooltip
      const popperRef = e.target.popperRef()
      const msgSpan = document.createElement('span')
      msgSpan.innerHTML = emptyUnfoldingEntityTooltip()
      cxtMenu.attachTo(popperRef, undefined, [msgSpan])
      setTimeout(() => cxtMenu.tippyWidget.hide(), 1000)
    }
  })

  cy.on('mouseout', objPropertiesSelector, e => {
    if (model.isSparqlingRunning())
      ontologyGraph.hideRelatedClassesWidget()
  })

  cy.on('dblclick', `[iri]`, e => {
    const gscape = getGscape()
    const grapholElment = gscape.ontology.getGrapholElement(e.target.id(), gscape.diagramId, gscape.renderState)
    if (grapholElment &&
      model.isSparqlingRunning() &&
      gscape.diagramId !== undefined &&
      !hasEntityEmptyUnfolding(e.target.data().iri)
    ) {
      OntologyGraphHandlers.handleEntitySelection(e.target.data().iri, e.target.data().type, grapholElment)
    }
  })
}