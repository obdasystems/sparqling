import { CollectionReturnValue } from "cytoscape"
import { Grapholscape, Theme, Type } from "grapholscape"
import { QueryGraphApiFactory } from "../api/swagger"
import { EntityTypeEnum, GraphElement, HeadElement, QueryGraph } from "../api/swagger/models"
import { handleConceptSelection, handleDataPropertySelection, handleObjectPropertySelection } from "./handle-entity-selection"
import * as queryGraph from "../query-graph"
import * as queryHead from "../query-head"
import * as ontologyGraph from "../ontology-graph"
import { getGraphElementByID, getGraphElementByIRI } from "../query-graph/graph-element-utility"
import { messageDialog } from "../widgets"

const { CONCEPT, OBJECT_PROPERTY, DATA_PROPERTY } = Type
let body: QueryGraph
let gscape: Grapholscape
const qgApi = QueryGraphApiFactory()

export let selectedGraphElement: GraphElement

export function init(grapholscape: Grapholscape) {
  gscape = grapholscape

  gscape.onLanguageChange((newLanguage: string) => queryGraph.setLanguage(newLanguage))
  gscape.onEntityNameTypeChange((newNameType: string) => {
    queryGraph.setDisplayedNameType(newNameType, gscape.languages.selected)
  })

  queryGraph.setDisplayedNameType(gscape.actualEntityNameType, gscape.languages.selected)
  queryGraph.setTheme(gscape.themesController.actualTheme)
  gscape.onThemeChange( (newTheme: Theme) => queryGraph.setTheme(newTheme))

  gscape.onEntitySelection(async (cyEntity: CollectionReturnValue) => {
    let newBody: QueryGraph = null
    switch (cyEntity.data('type')) {
      case OBJECT_PROPERTY: {
        let result = await handleObjectPropertySelection(cyEntity, selectedGraphElement)
        if (result && result.connectedClass) {
          gscape.centerOnNode(result.connectedClass.id(), 1.8)
        }
        break
      }
      case CONCEPT: {
        newBody = await handleConceptSelection(cyEntity, body, selectedGraphElement)
        if (newBody) {
          updateQueryBody(newBody)
        }

        let clickedIRI = cyEntity.data('iri').fullIri
        selectedGraphElement = queryGraph.selectElement(clickedIRI)
        ontologyGraph.resetHighlights()
        ontologyGraph.highlightSuggestions(clickedIRI)
        break
      }
      case DATA_PROPERTY: {
        let newBody: QueryGraph = null
        newBody = await handleDataPropertySelection(cyEntity, body, selectedGraphElement)
        // select the current selected class on the ontology, prevent from selecting the attribute
        gscape.selectEntityOccurrences(selectedGraphElement?.entities[0].iri)
        if (newBody)
          updateQueryBody(newBody)
        break
      }
    }
  })

  // Add query graph and query head widgets to grapholscape instance
  const uiContainer = gscape.container.querySelector('#gscape-ui')
  uiContainer.insertBefore(queryGraph.widget, uiContainer.firstChild)
  uiContainer.insertBefore(queryHead.widget, uiContainer.firstChild)

  queryGraph.onAddHead( async graphElement => {
    let newBody = (await qgApi.addHeadTerm(body, graphElement.id)).data
    if (newBody)
      updateQueryBody(newBody)
  })
  
  queryGraph.onDelete( async graphElement => {
    let newBody = (await qgApi.deleteGraphElementId(body, graphElement.id)).data
    if (newBody) {
      ontologyGraph.resetHighlights()
      gscape.unselectEntity([])
      selectedGraphElement = null
      updateQueryBody(newBody)
    }
    
  })

  queryGraph.onJoin( async (ge1, ge2) => {
    let newBody = (await qgApi.putQueryGraphJoin(body, ge1.id, ge2.id)).data
    if (newBody) {
      selectedGraphElement = ge1
      updateQueryBody(newBody)
    }
  })

  queryGraph.onElementClick( (graphElement, cyNode) => {
    if (graphElement.entities[0]?.type === EntityTypeEnum.Class) {
      let iri: string
      // If it's a child, use its own iri to find it on the ontology graph
      // if it's a parent, use the first iri he has in its entity list instead
      if (cyNode.isChild()) {
        selectedGraphElement =  getGraphElementByIRI(body.graph, graphElement.id) // child nodes have IRI as id
        iri = graphElement.id
      } else {
        selectedGraphElement =  graphElement
        iri = selectedGraphElement?.entities[0].iri
      }

      const elems = gscape.ontology.getEntityOccurrences(iri)
      const elem = elems.find((occ: any) => occ.data('diagram_id') === gscape.actualDiagramID)
      gscape.centerOnNode(elem.id())
    } else {
      // move ontology graph to show selected obj/data property
      ontologyGraph.focusNodeByIRI(graphElement.entities[0].iri)
    }

    // keep focus on selected class
    queryGraph.selectElement(selectedGraphElement.id)
  })

  queryHead.onDelete( async headElement => {
    let newBody = (await qgApi.deleteHeadTerm(body, headElement.id)).data
    updateQueryBody(newBody)
  })

  queryHead.sparqlButton.onClick = () => {
    if (!messageDialog.isVisible) {
      messageDialog.message = {
        type: 'SPARQL',
        text: body?.sparql || 'Empty Query'
      }
      messageDialog.show()
    } else {
      messageDialog.hide()
    }
  }
}

function updateQueryBody(newBody: QueryGraph) {
  body = newBody
  queryGraph.setGraph(body.graph)
  queryGraph.render(body.graph)
  queryGraph.removeNodesNotInQuery()
  queryHead.render(body.head.map( (headElem: HeadElement) => {
    let relatedGraphElem = getGraphElementByID(body.graph, headElem.graphElementId)
    headElem['entityType'] = relatedGraphElem?.entities[0].type
    headElem['dataType'] = headElem['entityType'] === EntityTypeEnum.DataProperty
      ? ontologyGraph.guessDataType(relatedGraphElem?.entities[0].iri)
      : null
    console.log(headElem['dataType'])
    return headElem
  }))
}

function changeSelectedGraphElement(newGraphElement: GraphElement) {
  
}


// export class QueryManager {

//   constructor(gscape: any) {
    // this._qhWidget.onDeleteHeadElement(async (headElementId:number) => {
    //   console.log(headElementId)
    //   let headElement = this.qg.head.filter( (e: HeadElement) => e.id === headElementId)
    //   this.qg = (await qgApi.deleteHeadTerm(this.qg, headElement)).data
    // })


    // this.bgp.onNodeSelect((nodeId) => {
    //   const cyNode = this.bgp.getElementById(nodeId)
    //   let elems: any

    //   // If it's a child, use its own iri to find it on the ontology graph
    //   // if it's a parent, use the first iri he has in its entity list instead
    //   if (cyNode.isChild()) {
    //     this._selectedGraphNode =  this.getGraphElementByIRI(nodeId) // child nodes have IRI as id
    //     elems = gscape.ontology.getEntityOccurrences(cyNode.data().iri)
    //   } else {
    //     this._selectedGraphNode =  this.getGraphElementByID(nodeId)
    //     elems = gscape.ontology.getEntityOccurrences(this._selectedGraphNode.entities[0].iri)
    //   }

    //   let elem = elems.find((occ: any) => occ.data('diagram_id') === gscape.actualDiagramID)
    //   if (!elem) elem = elems[0]

    //   const diagram = gscape.ontology.getDiagram(elem.data('diagram_id'))
    //   diagram.cy.$(':selected').unselect()
    //   gscape.centerOnNode(elem.id())
    // })

    // this.bgp.onAddHead(async (nodeId) => {
    //   this.qg = (await qgApi.addHeadTerm(this.qg, nodeId)).data
    // })

    
    // this.bgp.onDelete( async (elemId) => {
    //   this.qg = (await qgApi.deleteGraphElementId(this.qg, elemId)).data
    //   OntologyGraph.resetHighlights()
    //   gscape.unselectEntity([])
    //   this._selectedGraphNode = null
    // })

    // this.bgp.onJoin( async (elem1ID, elem2ID) => {
    //   this.qg = (await qgApi.putQueryGraphJoin(this.qg, elem1ID, elem2ID)).data
    //   this._selectedGraphNode = this.getGraphElementByID(elem1ID)
    // })

    // this.bgp.theme = gscape.themesController.actualTheme
    // gscape.onThemeChange( (newTheme: Theme) => this.bgp.theme = newTheme)
  // }

  // public setDisplayedNameType(newDisplayedNameType: string, language: string) {
  //   this.bgp.setDisplayedNameType(DisplayedNameType[newDisplayedNameType], language)
  // }

  // public setLanguage(newLanguage: string) {
  //   this.bgp.setDisplayedNameType(DisplayedNameType.label, newLanguage)
  // }

  // set qg(newQueryGraph: QueryGraph) {
  //   this._qg = newQueryGraph
  //   this.renderGraph(this.qg.graph)
  //   // remove elements not in query anymore, asynchronously
  //   setTimeout(() => {
  //     this.bgp.elements.forEach( elem => {
  //       if ( elem.data('displayed_name') && !this.getGraphElementByID(elem.id())) {
  //         /**
  //          * remove it if elem is:
  //          *  - not a child
  //          *  - a child and its iri is not in the query anymore
  //          */
  //         if (!elem.isChild() || !this.getGraphElementByIRI(elem.data('iri')))
  //           this.bgp.removeNode(elem.id())
  //       }
  //     })
  //   },0)
  //   this.renderHead(this.qg.head)
  // }

//   get qg() { return this._qg }

//   get graph() { return this._qg.graph }

//   get selectedGraphNode() { return this._selectedGraphNode }
// }