import { CollectionReturnValue, Core } from "cytoscape"
import { focusNodeByIRI } from "./focus-node"
import { OntologyGraphApi } from "../api/swagger"
import { Highlights } from "../api/swagger"
import * as model from "../model"
import { getIri } from "../util/graph-element-utility"
import { highlightsList } from "../widgets"
import getGscape from "./get-gscape"
import { handlePromise } from "../main/handle-promises"

let actualHighlights: Highlights | undefined

highlightsList.onSuggestionSelection(iri => focusNodeByIRI(iri))

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

export function highlightSuggestions(clickedIRI: string) {
  if (!clickedIRI) return
  resetHighlights()
  const ogApi = new OntologyGraphApi()
  handlePromise(ogApi.highligths(clickedIRI)).then(newHighlights => {
    actualHighlights = newHighlights
    performHighlights(clickedIRI)
    highlightsList.highlights = transformHighlightsToPrefixedIRIs()
  })
}

export function resetHighlights() {
  const gscape = getGscape()
  Object.values(gscape.ontologies).forEach((ontology: any) => {
    ontology?.diagrams?.forEach((diagram: any) => {
      let cy: Core = diagram?.cy
      cy.$('.sparqling-selected').removeClass('sparqling-selected')
      cy.$('.highlighted').removeClass('highlighted')
      cy.$('.faded')
        .removeClass('faded')
        .selectify()
    })
  })
  actualHighlights = undefined
  highlightsList.highlights = undefined
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

  // select all nodes having iri = clickedIRI
  for (const node of gscape.ontology.getEntityOccurrences(clickedIRI)) {
    if (node.data('diagram_id') === gscape.actualDiagramID) {
      node.addClass('sparqling-selected')
      break
    }
  }

  const highlightedElems = gscape.renderer.cy.$('.highlighted, .sparqling-selected')
  const fadedElems = gscape.renderer.cy.elements().difference(highlightedElems)
  fadedElems.addClass('faded')
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


  function getPrefixedIri(iri: string) {
    const destructuredIRI = ontology.destructureIri(iri)
    if (destructuredIRI) {
      return destructuredIRI.prefixed
    } else {
      return iri
    }
  }
}