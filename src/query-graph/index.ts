import { Theme } from "grapholscape"
import { QueryGraphApi } from "../api/swagger"
import { GraphElement, HeadElement, QueryGraph } from "../api/swagger/models"
import { EntityTypeEnum } from "../api/swagger/models"
import { bgpContainer } from "../get-container"
import QueryHeadWidget from "../query-head/qh-widget"
import QueryGraphWidget from "./qg-widget"
import BGPRenderer, { DisplayedNameType } from "./renderer"
import * as OntologyGraph from '../ontology-graph/ontology-graph'

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
    this.bgp.onNodeSelect((nodeId: string) => {
      this._selectedGraphNode = this.getGraphElementByID(nodeId)

      const elems = gscape.ontology
        .getEntityOccurrences(this._selectedGraphNode.entities[0].iri)

      let elem = elems.find((occ: any) => occ.data('diagram_id') === gscape.actualDiagramID)
      if (!elem) elem = elems[0]

      const diagram = gscape.ontology.getDiagram(elem.data('diagram_id'))
      diagram.cy.$(':selected').unselect()
      gscape.centerOnNode(elem.id())
    })

    this.bgp.onAddHead(async (nodeId: string) => {
      this.qg = (await qgApi.addHeadTerm(this.qg, nodeId)).data
    })

    this.bgp.onDelete( async (elemId: string) => {
      this.qg = (await qgApi.deleteGraphElementId(this.qg, elemId)).data
      OntologyGraph.resetHighlights()
      gscape.unselectEntity([])
      this._selectedGraphNode = null
    })

    this.bgp.theme = gscape.themesController.actualTheme
    gscape.onThemeChange( (newTheme: Theme) => this.bgp.theme = newTheme)
  }

  public getGraphElementByID(id: string | number) {
    return recursiveFind(this.graph, (elem) => elem.id === id)
  }

  public getGraphElementByIRI(iri: string) {
    return recursiveFind(this.graph, (elem) =>
      (elem.entities[0].iri === iri) || (elem.entities[0].prefixedIri === iri)
    )
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
    // add new node only if it does not already exists
    // classes are allowed cause there might be multiple entities for a single graphElement (compound nodes)
    if ((!this.bgp.getNodeById(graphElem.id) || type === Class) && type !== ObjectProperty ) {
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
    setTimeout(() => {
      this.bgp.elements.forEach( elem => {
        if ( elem.data('displayed_name') && !this.getGraphElementByID(elem.id()))
          this.bgp.removeNode(elem.id())
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