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

let actualHighlights: Highlights | undefined

// highlightsList.onSuggestionLocalization(iri => getGscape().centerOnEntity(iri))

export const getActualHighlights = () => actualHighlights

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
  const ogApi = new OntologyGraphApi(undefined, model.getBasePath())
  handlePromise(ogApi.highligths(clickedIRI, undefined, model.getRequestOptions())).then(newHighlights => {
    actualHighlights = newHighlights
    performHighlights(clickedIRI)
    highlightsList.allHighlights = transformHighlightsToPrefixedIRIs()
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
  actualHighlights = undefined
  highlightsList.allHighlights = undefined
}

export function isHighlighted(iri: string): boolean {
  // if ((actualHighlights as AxiosError).isAxiosError) return true
  return actualHighlights?.classes?.includes(iri) ||
    actualHighlights?.dataProperties?.includes(iri) ||
    actualHighlights?.objectProperties?.map(obj => obj.objectPropertyIRI).includes(iri) || false
}

export function refreshHighlights() {
  let activeElement = model.getActiveElement()
  if (activeElement) {
    performHighlights(activeElement.iri.fullIri)
  }
}

function performHighlights(clickedIRI: string) {
  const gscape = getGscape()
  actualHighlights?.classes?.forEach((iri: string) => highlightIRI(iri))
  actualHighlights?.dataProperties?.forEach((iri: string) => highlightIRI(iri))
  actualHighlights?.objectProperties?.forEach((o: any) => highlightIRI(o.objectPropertyIRI))

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

function transformHighlightsToPrefixedIRIs(): Highlights {
  let transformedHighlights: Highlights = JSON.parse(JSON.stringify(actualHighlights))
  transformedHighlights.classes = transformedHighlights.classes?.map(iri => getPrefixedIri(iri))
  transformedHighlights.dataProperties = transformedHighlights.dataProperties?.map(iri => getPrefixedIri(iri))
  transformedHighlights.objectProperties = transformedHighlights.objectProperties?.map(branch => {
    branch.objectPropertyIRI = getPrefixedIri(branch.objectPropertyIRI || '')
    branch.relatedClasses = branch.relatedClasses?.map(iri => getPrefixedIri(iri))
    return branch
  })
  return transformedHighlights
}

function addHighlightedClassToEntityOccurrences(entityOccurrences: EntityOccurrence[]) {
  const gscape = getGscape()
  entityOccurrences.forEach(occurrence => {
    if (occurrence.diagramId === gscape.diagramId)
      gscape.renderer.cy?.$id(occurrence.elementId).addClass(model.HIGHLIGHT_CLASS)
  })
}