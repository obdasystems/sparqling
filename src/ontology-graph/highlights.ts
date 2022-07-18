import cytoscape from "cytoscape"
import { OntologyGraphApi } from "../api/swagger"
import { Highlights } from "../api/swagger"
import * as model from "../model"
import { getIri } from "../util/graph-element-utility"
// import { highlightsList } from "../widgets"
import getGscape from "./get-gscape"
import { handlePromise } from "../main/handle-promises"
import { Iri } from "grapholscape"

let actualHighlights: Highlights | undefined
export const HIGHLIGHT_CLASS = 'highlighted'
export const FADED_ClASS = 'faded'
export const SPARQLING_SELECTED = 'sparqling-selected'

// highlightsList.onSuggestionSelection(iri => getGscape().centerOnEntity(iri))

export const getActualHighlights = () => actualHighlights

export function highlightIRI(iri: string) {
  const gscape = getGscape()
  let iriOccurrences = gscape.ontology.getEntityOccurrences(iri)?.get(gscape.renderState)
  if (iriOccurrences) {
    iriOccurrences.forEach(occurrence => {
      if (occurrence.diagramId === gscape.diagramId)
      gscape.renderer.cy?.$id(occurrence.elementId).addClass(HIGHLIGHT_CLASS)
    })
  }
}

export function highlightSuggestions(clickedIRI: string) {
  if (!clickedIRI) return
  resetHighlights()
  const ogApi = new OntologyGraphApi(undefined, model.getBasePath())
  handlePromise(ogApi.highligths(clickedIRI, undefined, model.getRequestOptions())).then(newHighlights => {
    actualHighlights = newHighlights
    performHighlights(clickedIRI)
    // highlightsList.highlights = transformHighlightsToPrefixedIRIs()
  })
}

export function resetHighlights() {
  const gscape = getGscape()

  gscape.ontology.diagrams.forEach(diagram => {
    for (let [_, diagramRepresentation] of diagram.representations) {
      diagramRepresentation.cy.$(`.${SPARQLING_SELECTED}`).removeClass(SPARQLING_SELECTED)
      diagramRepresentation.cy.$(`.${HIGHLIGHT_CLASS}`).removeClass(HIGHLIGHT_CLASS)
      diagramRepresentation.cy.$(`.${FADED_ClASS}`).removeClass(FADED_ClASS).selectify()
    }
  })
  actualHighlights = undefined
  // highlightsList.highlights = undefined
}

export function isHighlighted(iri: string): boolean {
  // if ((actualHighlights as AxiosError).isAxiosError) return true
  return actualHighlights?.classes?.includes(iri) ||
    actualHighlights?.dataProperties?.includes(iri) ||
    actualHighlights?.objectProperties?.map(obj => obj.objectPropertyIRI).includes(iri) || false
}

export function refreshHighlights() {
  let selectedGraphElem = model.getSelectedGraphElement()
  if (selectedGraphElem) {
    const selectedGraphElemIri = getIri(selectedGraphElem)
    if (selectedGraphElemIri)
      performHighlights(selectedGraphElemIri)
  }
}

function performHighlights(clickedIRI: string) {
  const gscape = getGscape()
  actualHighlights?.classes?.forEach((iri: string) => highlightIRI(iri))
  actualHighlights?.dataProperties?.forEach((iri: string) => highlightIRI(iri))
  actualHighlights?.objectProperties?.forEach((o: any) => highlightIRI(o.objectPropertyIRI))

  const iriOccurrences = gscape.ontology.getEntityOccurrences(clickedIRI)?.get(gscape.renderState)
  if (iriOccurrences) {
    // select all nodes having iri = clickedIRI
    for (const occurrence of iriOccurrences) {
      const diagram = gscape.ontology.getDiagram(occurrence.diagramId)
      const occurrenceCyElement = diagram?.representations.get(gscape.renderState)?.cy.$id(occurrence.elementId)
      occurrenceCyElement?.addClass(SPARQLING_SELECTED)
    }

    const highlightedElems = gscape.renderer.cy?.$('.highlighted, .sparqling-selected') || cytoscape().collection()
    const fadedElems = gscape.renderer.cy?.elements().difference(highlightedElems)
    fadedElems?.addClass(FADED_ClASS)
  }
  //fadedElems.unselectify()
}

function transformHighlightsToPrefixedIRIs(): Highlights {
  let transformedHighlights: Highlights = JSON.parse(JSON.stringify(actualHighlights))
  const ontology = getGscape().ontology
  transformedHighlights.classes = transformedHighlights.classes?.map(iri => getPrefixedIri(iri))
  transformedHighlights.dataProperties = transformedHighlights.dataProperties?.map(iri => getPrefixedIri(iri))
  transformedHighlights.objectProperties = transformedHighlights.objectProperties?.map(branch => {
    branch.objectPropertyIRI = getPrefixedIri(branch.objectPropertyIRI || '')
    return branch
  })
  return transformedHighlights


  function getPrefixedIri(iriValue: string) {
    const iri = new Iri(iriValue, getGscape().ontology.namespaces)
    return iri.prefixed || iriValue
  }
}