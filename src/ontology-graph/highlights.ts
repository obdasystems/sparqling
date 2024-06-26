import cytoscape from "cytoscape"
import { GrapholElement, RendererStatesEnum } from "grapholscape"
import * as model from "../model"
import { hasEntityEmptyUnfolding } from "../model"
import getGscape from "./get-gscape"
import { GraphElement } from "../api/swagger"
import { getIri } from "../util/graph-element-utility"

export function highlightIRI(iri: string) {
  if (hasEntityEmptyUnfolding(iri))
    return

  addClassToEntity(iri, model.HIGHLIGHT_CLASS)
}

export function resetHighlights() {
  const gscape = getGscape()

  gscape.ontology.diagrams.forEach(diagram => {
    for (let [_, diagramRepresentation] of diagram.representations) {
      diagramRepresentation.cy.$(`.${model.SPARQLING_SELECTED}`).removeClass(model.SPARQLING_SELECTED)
      diagramRepresentation.cy.$(`.${model.HIGHLIGHT_CLASS}`).removeClass(model.HIGHLIGHT_CLASS)
      diagramRepresentation.cy.$(`.${model.FADED_CLASS}`).removeClass(model.FADED_CLASS)
    }
  })
}

export function fadeEntitiesNotHighlighted() {
  const gscape = getGscape()

  if (!gscape.renderState) return

  const highlightedElems = gscape.renderer.cy?.$('.highlighted, .sparqling-selected') || cytoscape().collection()
  const fadedElems = gscape.renderer.cy?.elements().difference(highlightedElems)
  fadedElems?.addClass(model.FADED_CLASS)
}

export function selectEntity(iri: string) {
  addClassToEntity(iri, model.SPARQLING_SELECTED)
}

export function centerOnGraphElement(graphElement: GraphElement, iri?: string) {
  const gscape = getGscape()
  const iriToFocus = iri || getIri(graphElement)
  if (iriToFocus) {
    // move ontology graph to show origin graphol node or any other iri occurrence
    const originGrapholNodeOccurrence = model.getOriginGrapholNodes().get(graphElement.id + iriToFocus)
    if (originGrapholNodeOccurrence) {
      gscape.centerOnElement(originGrapholNodeOccurrence.id, originGrapholNodeOccurrence.diagramId, 1.5)
      gscape.selectElement(originGrapholNodeOccurrence.id)
    } else {
      gscape.selectEntity(iriToFocus, undefined, 1.5)
    }
  }
}

function addClassToEntity(iri: string, classToAdd: string) {
  const gscape = getGscape()

  if (!gscape.renderState) return

  gscape.renderer.cy?.batch(() => {
    const iriOccurrences = gscape.ontology.getEntityOccurrences(iri, gscape.diagramId)
    if (iriOccurrences) {
      // select all nodes having iri = clickedIRI
      addClassToEntityOccurrences(iriOccurrences.get(RendererStatesEnum.GRAPHOL) || [], classToAdd)
      if (gscape.renderState && gscape.renderState !== RendererStatesEnum.GRAPHOL) {
        addClassToEntityOccurrences(iriOccurrences.get(gscape.renderState) || [], classToAdd)
      }
    }
  })
}


function addClassToEntityOccurrences(entityOccurrences: GrapholElement[], classToAdd: string) {
  const gscape = getGscape()
  entityOccurrences.forEach(occurrence => {
    if (occurrence.diagramId === gscape.diagramId) {
      const cyElem = gscape.renderer.cy?.$id(occurrence.id)

      cyElem?.addClass(classToAdd)

      if (classToAdd === model.HIGHLIGHT_CLASS || classToAdd === model.SPARQLING_SELECTED)
        cyElem?.removeClass(model.FADED_CLASS)
    }
  })
}

export function fadeEntity(iri: string) {
  const gscape = getGscape()

  if (!gscape.renderState) return

  let iriOccurrences = gscape.ontology.getEntityOccurrences(iri)?.get(RendererStatesEnum.GRAPHOL)
  if (iriOccurrences) {
    addClassToEntityOccurrences(iriOccurrences, model.FADED_CLASS)
  }
  if (gscape.renderState !== RendererStatesEnum.GRAPHOL) {
    const occurrencesInActualRendererState = gscape.ontology.getEntityOccurrences(iri)?.get(gscape.renderState)
    if (occurrencesInActualRendererState) {
      addClassToEntityOccurrences(occurrencesInActualRendererState, model.FADED_CLASS)
    }
  }
}