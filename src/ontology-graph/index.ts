import { CollectionReturnValue, NodeSingular, StylesheetStyle } from "cytoscape"
import { OntologyGraphApi } from "../api/swagger"
import { Branch, Highlights } from "../api/swagger/models"
import { ClassSelectionDialog, messageDialog } from "../widgets"
import sparqlingStyle from './style'

const ogApi = new OntologyGraphApi()
let gscape: any
let actualHighlights: Highlights

const selectClassDialog = new ClassSelectionDialog()

export function init(grapholscape: any) {
  gscape = grapholscape
  gscape.container.querySelector('#gscape-ui').appendChild(selectClassDialog)
  gscape.container.querySelector('#gscape-ui').appendChild(messageDialog)

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
  actualHighlights = (await ogApi.highligths(clickedIRI)).data
  actualHighlights.classes?.forEach((iri: string) => highlightIRI(iri))
  actualHighlights.dataProperties?.forEach((iri: string) => highlightIRI(iri))
  actualHighlights.objectProperties?.forEach((o: any) => highlightIRI(o.objectPropertyIRI))

  let highlightedElems = gscape.renderer.cy.$('.highlighted, :selected')
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

  console.log(actualHighlights)

  return new Promise((resolve, reject) => {
    if (!result.objPropertyFromApi.relatedClasses) reject()

    if (result.objPropertyFromApi.relatedClasses.length === 1) {
      result.connectedClass = gscape.ontology.getEntityOccurrences(
        result.objPropertyFromApi.relatedClasses[0])[0] as CollectionReturnValue
      resolve(result)
    } else {
      // Use prefixed iri if possible, full iri as fallback
      selectClassDialog.classes = result.objPropertyFromApi.relatedClasses.map((iri: string) => {
        return gscape.ontology.destructureIri(iri)
          ? gscape.ontology.destructureIri(iri).prefixed
          : iri
      })
      selectClassDialog.show()
      selectClassDialog.onSelection( (iri: string) => {
        result.connectedClass = (gscape.ontology.getEntityOccurrences(iri)[0] as CollectionReturnValue)
        resolve(result)
        selectClassDialog.hide()
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
  gscape.renderer.cy.$('.highlighted').removeClass('highlighted')
  gscape.renderer.cy.$('.faded').removeClass('faded')
  actualHighlights = null
}

/**
 * Select a node without firing cytoscape's selection event
 */
export function selectNode(nodeID: string) {
  let node: CollectionReturnValue = gscape.ontology.getElem(nodeID)

  if (node.data('diagram_id') !== gscape.actualDiagramID) {
    gscape.performActionInvolvingOntology( () => {
      gscape.showDiagram(node.data('diagram_id'))
      gscape.setViewport({
        x: node.position('x'),
        y: node.position('y'),
        zoom: 1
      })
      node.addClass('selected')
    })
  }
}

function addStylesheet(cy: any, stylesheet: StylesheetStyle[]) {
  stylesheet.forEach( styleObj => {
    cy.style().selector(styleObj.selector).style(styleObj.style)
  })
}