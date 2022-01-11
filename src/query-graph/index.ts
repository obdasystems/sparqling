import { Theme } from "grapholscape"
import { GraphElement, QueryGraph } from "../api/swagger/models"
import { EntityTypeEnum } from "../api/swagger/models"
import { bgpContainer } from "../get-container"
import QueryGraphWidget from "./qg-widget"
import BGPRenderer, { DisplayedNameType } from "./renderer"

const { Class, ObjectProperty, DataProperty } = EntityTypeEnum

export default class QueryManager {
  private _qgWidget = new QueryGraphWidget(bgpContainer)
  private bgp: BGPRenderer
  private _qg: QueryGraph
  private _selectedGraphNode: GraphElement
  public gscape: any

  constructor(gscape: any) {
    this.gscape = gscape

    // Add query graph widget to grapholscape instance
    gscape.container
      .querySelector('#gscape-ui')
      .querySelector('#gscape-ui-bottom-container')
      .appendChild(this._qgWidget as any)

    this.bgp = new BGPRenderer(bgpContainer)
    this.bgp.onNodeSelect((nodeId: string) => {
      console.log(this.qg)
      this._selectedGraphNode = this.getGraphElementByID(nodeId)

      const elems = gscape.ontology
        .getEntityOccurrences(this._selectedGraphNode.entities[0].iri)

      let elem = elems.find((occ: any) => occ.data('diagram_id') === gscape.actualDiagramID)
      if (!elem) elem = elems[0]

      const diagram = gscape.ontology.getDiagram(elem.data('diagram_id'))
      diagram.cy.$(':selected').unselect()
      gscape.centerOnNode(elem.id())
    })

    this.bgp.theme = gscape.themesController.actualTheme
    gscape.onThemeChange( (newTheme: Theme) => this.bgp.theme = newTheme)
  }

  public getGraphElementByID(id: string | number) {
    return recursiveFind(this.graph, (elem) => elem.id == id)
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
    const type = graphElem.entities[0].type
    // add new node only if it does not already exists
    // classes are allowed cause there might be multiple entities for a single graphElement (compound nodes)
    console.log((!this.bgp.getNodeById(graphElem.id) || type === Class) && type !== ObjectProperty)
    if ((!this.bgp.getNodeById(graphElem.id) || type === Class) && type !== ObjectProperty ) {
      this.bgp.addNode(graphElem)
      console.log('added '+ graphElem.id)
      console.log(parent)
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

  public setDisplayedNameType(newDisplayedNameType: string, language: string) {
    this.bgp.setDisplayedNameType(DisplayedNameType[newDisplayedNameType], language)
  }

  public setLanguage(newLanguage: string) {
    this.bgp.setDisplayedNameType(DisplayedNameType.label, newLanguage)
  }

  set qg(newQueryGraph: QueryGraph) {
    this._qg = newQueryGraph
    this.renderGraph(this.qg.graph)
  }

  get qg() { return this._qg }

  get graph() { return this._qg.graph }

  get selectedGraphNode() { return this._selectedGraphNode }
}

function recursiveFind(elem: GraphElement, check: (elem: GraphElement) => boolean): GraphElement {
  if (check(elem)) return elem

  if (elem.children) {
    for (let child of elem.children) {
      let res = recursiveFind(child, check)
      if (res) return res
    }
  }
}