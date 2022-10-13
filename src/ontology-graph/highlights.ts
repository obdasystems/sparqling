import cytoscape from "cytoscape"
import { OntologyGraphApi } from "../api/swagger"
import { Highlights } from "../api/swagger"
import * as model from "../model"
import { getIri } from "../util/graph-element-utility"
import { highlightsList } from "../widgets"
import getGscape from "./get-gscape"
import { handlePromise } from "../main/handle-promises"
import getPrefixedIri from "../util/get-prefixed-iri"
import { EntityOccurrence, RendererStatesEnum } from "grapholscape"

export function highlightIRI(iri: string) {
  const gscape = getGscape()

  let iriOccurrences = gscape.ontology.getEntityOccurrences(iri)?.get(RendererStatesEnum.GRAPHOL)
  if (iriOccurrences) {
    addHighlightedClassToEntityOccurrences(iriOccurrences) 
  }
  if (gscape.renderState !== RendererStatesEnum.GRAPHOL) {
    const occurrencesInActualRendererState = gscape.ontology.getEntityOccurrences(iri)?.get(gscape.renderState)
    if (occurrencesInActualRendererState) {
      addHighlightedClassToEntityOccurrences(occurrencesInActualRendererState)
    }
  }
}

export function highlightSuggestions(clickedIRI: string) {
  if (!clickedIRI) return
  resetHighlights()
  model.computeHighlights(clickedIRI).then(_ => {
    performHighlights(clickedIRI)
    highlightsList.allHighlights = model.transformHighlightsToPrefixedIRIs()
  })
}

export function resetHighlights() {
  const gscape = getGscape()

  gscape.ontology.diagrams.forEach(diagram => {
    for (let [_, diagramRepresentation] of diagram.representations) {
      diagramRepresentation.cy.$(`.${model.SPARQLING_SELECTED}`).removeClass(model.SPARQLING_SELECTED)
      diagramRepresentation.cy.$(`.${model.HIGHLIGHT_CLASS}`).removeClass(model.HIGHLIGHT_CLASS)
      diagramRepresentation.cy.$(`.${model.FADED_CLASS}`).removeClass(model.FADED_CLASS).selectify()
    }
  })

  highlightsList.allHighlights = undefined
  model.clearHighlights()
}

export function refreshHighlights() {
  let activeElement = model.getActiveElement()
  if (activeElement) {
    performHighlights(activeElement.iri.fullIri)
  }
}

function performHighlights(clickedIRI: string) {
  const gscape = getGscape()
  const highlights = model.getActualHighlights()
  highlights?.classes?.forEach((iri: string) => highlightIRI(iri))
  highlights?.dataProperties?.forEach((iri: string) => highlightIRI(iri))
  highlights?.objectProperties?.forEach((o: any) => highlightIRI(o.objectPropertyIRI))

  const iriOccurrences = gscape.ontology.getEntityOccurrences(clickedIRI)?.get(RendererStatesEnum.GRAPHOL)
  if (gscape.renderState !== RendererStatesEnum.GRAPHOL) {
    const occurrencesInActualRendererState = gscape.ontology.getEntityOccurrences(clickedIRI)?.get(gscape.renderState)
    if (occurrencesInActualRendererState)
      iriOccurrences?.push(...occurrencesInActualRendererState)
  }
  if (iriOccurrences) {
    // select all nodes having iri = clickedIRI
    for (const occurrence of iriOccurrences) {
      const diagram = gscape.ontology.getDiagram(occurrence.diagramId)
      const occurrenceCyElement = diagram?.representations.get(gscape.renderState)?.cy.$id(occurrence.elementId)
      occurrenceCyElement?.addClass(model.SPARQLING_SELECTED)
    }

    const highlightedElems = gscape.renderer.cy?.$('.highlighted, .sparqling-selected') || cytoscape().collection()
    const fadedElems = gscape.renderer.cy?.elements().difference(highlightedElems)
    fadedElems?.addClass(model.FADED_CLASS)
  }
  //fadedElems.unselectify()
}


function addHighlightedClassToEntityOccurrences(entityOccurrences: EntityOccurrence[]) {
  const gscape = getGscape()
  entityOccurrences.forEach(occurrence => {
    if (occurrence.diagramId === gscape.diagramId)
      gscape.renderer.cy?.$id(occurrence.elementId).addClass(model.HIGHLIGHT_CLASS)
  })
}