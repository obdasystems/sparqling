import { CollectionReturnValue, Core } from "cytoscape"
import { OntologyGraphApi } from "../api/swagger"
import { Highlights } from "../api/swagger"
import { getSelectedGraphElement } from "../query-handler/query-body"
import { getIri } from "../util/graph-element-utility"
import getGscape from "./get-gscape"

let actualHighlights: Highlights = null

export const getActualHighlights = () => actualHighlights

export function highlightIRI(iri: string) {
  const gscape = getGscape()
  let nodes = gscape.ontology.getEntityOccurrences(iri)
  if (nodes) {
    nodes.forEach((n: CollectionReturnValue) => {
      n.addClass('highlighted')
    })
  }
}

export async function highlightSuggestions(clickedIRI: string) {
  resetHighlights()
  await retrieveHighlights(clickedIRI)
  performHighlights(clickedIRI)
}

export function resetHighlights() {
  const gscape = getGscape()
  Object.values(gscape.renderersManager.renderers).forEach((renderer: any) => {
    let cy: Core = renderer.cy
    cy.$('.sparqling-selected').removeClass('sparqling-selected')
    cy.$('.highlighted').removeClass('highlighted')
    cy.$('.faded')
      .removeClass('faded')
      .selectify()
  })
  actualHighlights = null
}

export function isHighlighted(iri: string): boolean {
  // if ((actualHighlights as AxiosError).isAxiosError) return true
  return actualHighlights?.classes?.includes(iri) ||
    actualHighlights?.dataProperties?.includes(iri) ||
    actualHighlights?.objectProperties?.map(obj => obj.objectPropertyIRI).includes(iri)
}

export function refreshHighlights() {
  let selectedGraphElem = getSelectedGraphElement()
  if (selectedGraphElem) {
    performHighlights(getIri(selectedGraphElem))
  }
}

async function retrieveHighlights(iri: string) {
  const ogApi = new OntologyGraphApi()
  actualHighlights = (await ogApi.highligths(iri)).data
}

function performHighlights(clickedIRI: string) {
  const gscape = getGscape()
  actualHighlights.classes?.forEach((iri: string) => highlightIRI(iri))
  actualHighlights.dataProperties?.forEach((iri: string) => highlightIRI(iri))
  actualHighlights.objectProperties?.forEach((o: any) => highlightIRI(o.objectPropertyIRI))

  // select all nodes having iri = clickedIRI
  gscape.ontology
    .getEntityOccurrences(clickedIRI)
    .forEach((node: CollectionReturnValue) => {
      if (node.data('diagram_id') === gscape.actualDiagramID) node.addClass('sparqling-selected')
    })

  const highlightedElems = gscape.renderer.cy.$('.highlighted, .sparqling-selected')
  const fadedElems = gscape.renderer.cy.elements().difference(highlightedElems)
  fadedElems.addClass('faded')
  fadedElems.unselectify()
}