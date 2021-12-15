import cytoscape from 'cytoscape'
import klay from 'cytoscape-klay'
import style from './style'

cytoscape.use( klay )
/**
 * Class for creating, updating and manipulating the query graph
 * 
 */
class QueryGraphRenderer {
  /**
   * @param {HTMLElement} container the container in which the query graph will be rendered
   */
  constructor(container) {
    
    this.cy = cytoscape({ 
      container: container,
      style: style,
    })

    this.cy.on('tap', 'node[type = "class"]', e => {
      this.selectedGraphNode = this.getGraphElementByID(e.target.id())
      this._onNodeSelectionCallback(this.selectedGraphNode)
    })

    this._graph = {}
    this.selectedGraphNode = null
    this._onNodeSelectionCallback = () => {}
    this.layoutOptions = {
      nodeDimensionsIncludeLabels: true,
      name: 'klay',
      fit: true, // Whether to fit
      padding: 150, // Padding on fit
      klay: {
        direction: 'RIGHT',
        spacing: 80
      }
    }
  }

  static _recursiveFind(elem, check) {
    if (check(elem)) return elem

    for (let child of elem.children) {
      let res = QueryGraphRenderer._recursiveFind(child, check)
      if (res) return res
    }
  }

  /**
   * Add a node to the query graph
   * @param {} node 
   */
  addNode(id, node) {

  }

  /**
   * Remove a node from query graph, it will remove also all subsequent nodes
   * @param {number} nodeID 
   */
  removeNode(nodeID) {}

  onNodeSelect(callback) {
    this._onNodeSelectionCallback = callback
  }

  selectNode(nodeID) {
    this.cy.$id(nodeID).select()
    this.selectedGraphNode = this.getGraphElementByID(nodeID)
  }

  getGraphElementByID(nodeID) {
    return QueryGraphRenderer._recursiveFind(this.graph, (elem) => elem.id == nodeID)
  }

  getGraphElementByIRI(iri) {
    return QueryGraphRenderer._recursiveFind(this.graph, (elem) => elem.entity.iri === iri )
  }

  renderGraph(graphElem, parent = null, objectProperty = null) {
    // add new node only if it does not already exists
    if (this.cy.$id(graphElem.id).empty() && graphElem.entity.type !== 'objectProperty') {
      
      this.cy.add({ data: QueryGraphRenderer.getDataObj(graphElem) })

      if (parent) {
        let edgeData = objectProperty 
          ? QueryGraphRenderer.getDataObj(objectProperty) // the edge is an entity, get its data
          : { id: `${parent.id}-${graphElem.id}` } // the edge is not an entity
        edgeData.source = parent.id
        edgeData.target = graphElem.id

        if (graphElem.entity.type === 'dataProperty') {
          edgeData.type = 'dataProperty'
        }
        this.cy.add({ data: edgeData })
      }

      this.selectedGraphNode = graphElem
      this.cy.elements().unselect()
      this.cy.$id(this.selectedGraphNode.id).select()
      this.cy.layout(this.layoutOptions).run()
    }

    if (graphElem.entity.type === 'objectProperty') {
      graphElem.children.forEach( childGraphElem => this.renderGraph(childGraphElem, parent, graphElem))
    } else {
      graphElem.children.forEach( childGraphElem => this.renderGraph(childGraphElem, graphElem))
    }
  }

  set graph(newGraph) {
    this._graph = newGraph
    this.renderGraph(newGraph)
  }

  get graph() { return this._graph}

  static getDataObj(graphElement) {
    let data = graphElement.entity
    data.id = graphElement.id

    return data
  }
}

export default QueryGraphRenderer