import { CollectionReturnValue, NodeSingular, StylesheetStyle } from "cytoscape"
import { OntologyGraphApi } from "../api/swagger"
import { Branch, Highlights, VarOrConstantConstantTypeEnum } from "../api/swagger/models"
import { listSelectionDialog, sparqlDialog } from "../widgets"
import sparqlingStyle from './style'
import { Type } from 'grapholscape'
import { classSelectDialogTitle } from "../widgets/assets/texts"

const ogApi = new OntologyGraphApi()
let gscape: any
let actualHighlights: Highlights

export function init(grapholscape: any) {
  gscape = grapholscape
  gscape.container.querySelector('#gscape-ui').appendChild(listSelectionDialog)
  gscape.container.querySelector('#gscape-ui').appendChild(sparqlDialog)

  gscape.showDiagram(0)
  addStylesheet(gscape.renderer.cy, sparqlingStyle)
  gscape.onDiagramChange(() => addStylesheet(gscape.renderer.cy, sparqlingStyle))
  gscape.onRendererChange(() => addStylesheet(gscape.renderer.cy, sparqlingStyle))
  // gscape.onBackgroundClick(() => resetHighlights(gscape.renderer.cy))
  gscape.onThemeChange(() => addStylesheet(gscape.renderer.cy, sparqlingStyle))
}

export function highlightIRI(iri: string) {
  let nodes = gscape.ontology.getEntityOccurrences(iri)
  if (nodes) {
    nodes.forEach((n: CollectionReturnValue) => {
      n.addClass('highlighted')
    })
  }
}

export async function highlightSuggestions(clickedIRI: string) {
  resetHighlights()
  actualHighlights = (await ogApi.highligths(clickedIRI)).data
  actualHighlights.classes?.forEach((iri: string) => highlightIRI(iri))
  actualHighlights.dataProperties?.forEach((iri: string) => highlightIRI(iri))
  actualHighlights.objectProperties?.forEach((o: any) => highlightIRI(o.objectPropertyIRI))

  // select all nodes having iri = clickedIRI
  gscape.ontology
    .getEntityOccurrences(clickedIRI)
    .forEach((node: CollectionReturnValue) => {
      if (node.data('diagram_id') === gscape.actualDiagramID) node.addClass('sparqling-selected')
    })
  
  let highlightedElems = gscape.renderer.cy.$('.highlighted, .sparqling-selected')
  gscape.renderer.cy.elements().difference(highlightedElems).addClass('faded')
  // gscape.renderer.cy.fit(highlightedElems, '100')
}

export function findNextClassFromObjProperty(objProperty: CollectionReturnValue):
  Promise<{ objPropertyFromApi: any, connectedClass: CollectionReturnValue }> {

  if (!actualHighlights) return
  
  let result: { objPropertyFromApi: any; connectedClass: CollectionReturnValue } = {
    objPropertyFromApi: undefined,
    connectedClass: undefined
  }
  
  result.objPropertyFromApi = actualHighlights.objectProperties.find((o: Branch) =>
    gscape.ontology.checkEntityIri(objProperty, o.objectPropertyIRI)
  )

  return new Promise((resolve, reject) => {
    if (!result.objPropertyFromApi.relatedClasses) reject()

    if (result.objPropertyFromApi.relatedClasses.length === 1) {
      result.connectedClass = gscape.ontology.getEntityOccurrences(
        result.objPropertyFromApi.relatedClasses[0])[0] as CollectionReturnValue
      resolve(result)
    } else {
      listSelectionDialog.title = classSelectDialogTitle()
      // Use prefixed iri if possible, full iri as fallback
      listSelectionDialog.list = result.objPropertyFromApi.relatedClasses.map((iri: string) => {
        return gscape.ontology.destructureIri(iri)
          ? gscape.ontology.destructureIri(iri).prefixed
          : iri
      })
      listSelectionDialog.show()
      listSelectionDialog.onSelection( (iri: string) => {
        result.connectedClass = (gscape.ontology.getEntityOccurrences(iri)[0] as CollectionReturnValue)
        resolve(result)
        listSelectionDialog.hide()
      })
    }
  })
}

export function isHighlighted(iri:string): boolean {
  // if ((actualHighlights as AxiosError).isAxiosError) return true
  return actualHighlights?.classes?.includes(iri) ||
    actualHighlights?.dataProperties?.includes(iri) ||
    actualHighlights?.objectProperties?.map( obj => obj.objectPropertyIRI).includes(iri)
}

export function resetHighlights() {
  gscape.renderer.cy.$('.sparqling-selected').removeClass('sparqling-selected')
  gscape.renderer.cy.$('.highlighted').removeClass('highlighted')
  gscape.renderer.cy.$('.faded').removeClass('faded')
  actualHighlights = null
}

/**
 * Select a node without firing cytoscape's selection event
 */
export async function focusNodeByIRI(iri: string) {
  let occurrences = gscape.ontology.getEntityOccurrences(iri)
  // find the first one in the actual diagram
  let node = occurrences.find((occ: any) => occ.data('diagram_id') === gscape.actualDiagramID)
  if (node) {
    gscape.setViewport(node.position())
  }
}

export function clearSelected() {
  gscape.ontology.diagrams.forEach((diagram:any) => {
    diagram.unselectAll()
  })
}

/**
 * Search a value-domain node in the neighborhood of an Entity
 * @param iri the Entity IRI
 */
export function guessDataType(iri:string): VarOrConstantConstantTypeEnum {
  // search entities in the standard graphol ontologies because in simplified versions
  // datatype are not present
  let nodes: CollectionReturnValue[] = gscape.ontologies.default.getEntityOccurrences(iri)
  // for each node we have, find a range node leading to a datatype
  for (let node of nodes) {
    let valueDomainNodes = node
      .openNeighborhood(`[type = "${Type.RANGE_RESTRICTION}"]`)
      .openNeighborhood(`[type = "${Type.VALUE_DOMAIN}"]`)

    if (valueDomainNodes[0] && valueDomainNodes.length > 0) {
      let valueDomainType = valueDomainNodes[0].data().iri.prefixed // xsd:(??)
      let key = Object.keys(VarOrConstantConstantTypeEnum).find( k => {
        return VarOrConstantConstantTypeEnum[k] === valueDomainType
      })
      if (key) return VarOrConstantConstantTypeEnum[key]
    }
  }
}

function addStylesheet(cy: any, stylesheet: StylesheetStyle[]) {
  stylesheet.forEach( styleObj => {
    cy.style().selector(styleObj.selector).style(styleObj.style)
  })
}