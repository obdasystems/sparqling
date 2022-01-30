import { Theme } from "grapholscape"
import { QueryGraphApi } from "../api/swagger"
import { GraphElement, HeadElement, QueryGraph } from "../api/swagger/models"
import { EntityTypeEnum } from "../api/swagger/models"
import { bgpContainer } from "../get-container"
import QueryHeadWidget from "../query-head/qh-widget"
import QueryGraphWidget from "./qg-widget"
import BGPRenderer, { DisplayedNameType } from "./renderer"
import * as OntologyGraph from '../ontology-graph/ontology-graph'
import { canStartJoin, graphElementHasIri, isJoinAllowed } from "./util"

const { Class, ObjectProperty, DataProperty } = EntityTypeEnum

export default class QueryManager {
  private _qgWidget = new QueryGraphWidget(bgpContainer)
  private _qhWidget = new QueryHeadWidget()
  private bgp: BGPRenderer
  private _qg: QueryGraph
  private _selectedGraphNode: GraphElement
  public gscape: any

  constructor(gscape: any) {
    this.gscape = gscape
    const qgApi = new QueryGraphApi()
    // Add query graph and query head widgets to grapholscape instance
    const uiContainer = gscape.container.querySelector('#gscape-ui')
    uiContainer.insertBefore(this._qgWidget, uiContainer.firstChild)
    uiContainer.insertBefore(this._qhWidget, uiContainer.firstChild)
  
    this._qhWidget.onDeleteHeadElement(async (headElementId:number) => {
      console.log(headElementId)
      let headElement = this.qg.head.filter( (e: HeadElement) => e.id === headElementId)
      this.qg = (await qgApi.deleteHeadTerm(this.qg, headElement)).data
    })

    this.bgp = new BGPRenderer(bgpContainer)
    
    // inject tests for allowing joins into renderer, keep renderer logic agnostic
    this.bgp.canStartJoin = (nodeId) => canStartJoin(this.getGraphElementByID(nodeId))
    this.bgp.isJoinAllowed = (targetNodeID, startNodeID) => {
      return isJoinAllowed(
        this.getGraphElementByID(targetNodeID),
        this.getGraphElementByID(startNodeID)
      )
    }

    this.bgp.onNodeSelect((nodeId) => {
      const cyNode = this.bgp.getElementById(nodeId)
      let elems: any

      // If it's a child, use its own iri to find it on the ontology graph
      // if it's a parent, use the first iri he has in its entity list instead
      if (cyNode.isChild()) {
        this._selectedGraphNode =  this.getGraphElementByIRI(nodeId) // child nodes have IRI as id
        elems = gscape.ontology.getEntityOccurrences(cyNode.data().iri)
      } else {
        this._selectedGraphNode =  this.getGraphElementByID(nodeId)
        elems = gscape.ontology.getEntityOccurrences(this._selectedGraphNode.entities[0].iri)
      }

      let elem = elems.find((occ: any) => occ.data('diagram_id') === gscape.actualDiagramID)
      if (!elem) elem = elems[0]

      const diagram = gscape.ontology.getDiagram(elem.data('diagram_id'))
      diagram.cy.$(':selected').unselect()
      gscape.centerOnNode(elem.id())
    })

    this.bgp.onAddHead(async (nodeId) => {
      this.qg = (await qgApi.addHeadTerm(this.qg, nodeId)).data
    })

    this.bgp.onDelete( async (elemId) => {
      this.qg = (await qgApi.deleteGraphElementId(this.qg, elemId)).data
      OntologyGraph.resetHighlights()
      gscape.unselectEntity([])
      this._selectedGraphNode = null
    })

    this.bgp.onJoin( async (elem1ID, elem2ID) => {
      this.qg = (await qgApi.putQueryGraphJoin(this.qg, elem1ID, elem2ID)).data
      this._selectedGraphNode = this.getGraphElementByID(elem1ID)
    })

    this.bgp.theme = gscape.themesController.actualTheme
    gscape.onThemeChange( (newTheme: Theme) => this.bgp.theme = newTheme)
  }

  public getGraphElementByID(id: string | number) {
    return recursiveFind(this.graph, (elem) => elem.id === id)
  }

  public getGraphElementByIRI(iri: string) {
    return recursiveFind(this.graph, (elem) => graphElementHasIri(elem, iri))
  }

  public selectGraphElement(nodeIri: string): void
  public selectGraphElement(nodeId: string): void

  public selectGraphElement(node: string) {
    let graphElem = this.getGraphElementByID(node) || this.getGraphElementByIRI(node)

    this.bgp.unselect()
    if (graphElem) {
      this.bgp.selectNode(graphElem.id)
      this._selectedGraphNode = graphElem
    }
  }

  public renderGraph(graphElem: GraphElement, parent?: GraphElement, objectProperty?: GraphElement) {
    if (!graphElem) return

    const type = graphElem.entities[0].type
    if (type !== ObjectProperty) {
      this.bgp.addNode(graphElem)
      if (parent) {
        this.bgp.addEdge(parent, graphElem, objectProperty)
      }

      this.bgp.arrange()
    }

    // if the actual elem was an object property, it will be added at next step as edge
    // between this elem and its children
    if (type === ObjectProperty) {
      graphElem.children?.forEach((childGraphElem: GraphElement) => this.renderGraph(childGraphElem, parent, graphElem))
    } else {
      graphElem.children?.forEach((childGraphElem: GraphElement) => this.renderGraph(childGraphElem, graphElem))
    }
  }

  public renderHead(headElements: HeadElement[]) {
    this._qhWidget.headElements = headElements
  }

  public setDisplayedNameType(newDisplayedNameType: string, language: string) {
    this.bgp.setDisplayedNameType(DisplayedNameType[newDisplayedNameType], language)
  }

  public setLanguage(newLanguage: string) {
    this.bgp.setDisplayedNameType(DisplayedNameType.label, newLanguage)
  }

  set qg(newQueryGraph: QueryGraph) {
    this._qg = newQueryGraph
    this.renderGraph(this.qg.graph)
    // remove elements not in query anymore, asynchronously
    setTimeout(() => {
      this.bgp.elements.forEach( elem => {
        if ( elem.data('displayed_name') && !this.getGraphElementByID(elem.id())) {
          /**
           * remove it if elem is:
           *  - not a child
           *  - a child and its iri is not in the query anymore
           */
          if (!elem.isChild() || !this.getGraphElementByIRI(elem.data('iri')))
            this.bgp.removeNode(elem.id())
        }
      })
    },0)
    this.renderHead(this.qg.head)
  }

  get qg() { return this._qg }

  get graph() { return this._qg.graph }

  get selectedGraphNode() { return this._selectedGraphNode }
}

function recursiveFind(elem: GraphElement, check: (elem: GraphElement) => boolean): GraphElement {
  if (!elem) return null
  
  if (check(elem)) return elem

  if (elem.children) {
    for (let child of elem.children) {
      let res = recursiveFind(child, check)
      if (res) return res
    }
  }
}