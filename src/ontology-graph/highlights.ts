import cytoscape from "cytoscape"
import { EntityOccurrence, RendererStatesEnum } from "grapholscape"
import * as model from "../model"
import { hasEntityEmptyUnfolding } from "../model"
import getGscape from "./get-gscape"

export function highlightIRI(iri: string) {
  if (hasEntityEmptyUnfolding(iri))
    return

  const gscape = getGscape()

  if (!gscape.renderState) return

  let iriOccurrences = gscape.ontology.getEntityOccurrences(iri)?.get(RendererStatesEnum.GRAPHOL)
  if (iriOccurrences) {
    addClassToEntityOccurrences(iriOccurrences, model.HIGHLIGHT_CLASS)
  }
  if (gscape.renderState !== RendererStatesEnum.GRAPHOL) {
    const occurrencesInActualRendererState = gscape.ontology.getEntityOccurrences(iri)?.get(gscape.renderState)
    if (occurrencesInActualRendererState) {
      addClassToEntityOccurrences(occurrencesInActualRendererState, model.HIGHLIGHT_CLASS)
    }
  }
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
  const gscape = getGscape()

  if (!gscape.renderState) return

  const iriOccurrences = gscape.ontology.getEntityOccurrences(iri)?.get(RendererStatesEnum.GRAPHOL)
  if (gscape.renderState !== RendererStatesEnum.GRAPHOL) {
    const occurrencesInActualRendererState = gscape.ontology.getEntityOccurrences(iri)?.get(gscape.renderState)
    if (occurrencesInActualRendererState)
      iriOccurrences?.push(...occurrencesInActualRendererState)
  }
  if (iriOccurrences) {
    // select all nodes having iri = clickedIRI
    addClassToEntityOccurrences(iriOccurrences, model.SPARQLING_SELECTED)
    for (const occurrence of iriOccurrences) {
      const diagram = gscape.ontology.getDiagram(occurrence.diagramId)
      const occurrenceCyElement = diagram?.representations.get(gscape.renderState)?.cy.$id(occurrence.elementId)
      occurrenceCyElement?.addClass(model.SPARQLING_SELECTED)
    }
  }
}


function addClassToEntityOccurrences(entityOccurrences: EntityOccurrence[], classToAdd: string) {
  const gscape = getGscape()
  entityOccurrences.forEach(occurrence => {
    if (occurrence.diagramId === gscape.diagramId) {
      const cyElem = gscape.renderer.cy?.$id(occurrence.elementId)

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