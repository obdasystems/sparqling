import cytoscape, { CollectionReturnValue, Stylesheet } from 'cytoscape'
import klay from 'cytoscape-klay'
import cola from 'cytoscape-cola'
import cxtmenu from 'cytoscape-cxtmenu'
import { GraphElement, EntityTypeEnum, Entity } from '../api/swagger/models'
import getStylesheet from './style'
import { Theme, Nod } from 'grapholscape'
import { commandList, Command } from './cxt-menu-commands'

cytoscape.use(klay)
cytoscape.use(cola)
cytoscape.use(cxtmenu)

const DISPLAYED_NAME = 'displayed_name'
export enum DisplayedNameType {
  full = 'iri',
  prefixed = 'prefixedIri',
  label = 'labels',
}

/**
 * Class for creating, updating and manipulating the query's BGP
 */
export default class BGPRenderer {
  private cy = cytoscape({
    style: [] as Stylesheet[],
    wheelSensitivity: 0.4,
    maxZoom: 2,
  })
  private layoutOptions = {
    nodeDimensionsIncludeLabels: true,
    name: 'klay',
    fit: false, // Whether to fit
    klay: {
      direction: 'RIGHT',
      spacing: 60
    }
  }

  private radialLayoutOpt = (node) => {
    const p = node.position()
    return {
      name: 'concentric',
      avoidOverlap: true,
      fit:false,
      concentric: (node) => {
        if (node.data('type') === EntityTypeEnum.Class) {
          return 2 // higher value means center
        } else {
          return 1 // lower value means outside center
        }
      },
      boundingBox: {
        x1: p.x - 2,
        x2: p.x + 2,
        y1: p.y - 2,
        y2: p.y + 2
      },
      levelWidth: () => { return 1 },
    }
  }
  private _onNodeSelectionCallback = (nodeId: string) => { }
  private _displayedNameType: DisplayedNameType = DisplayedNameType.full
  private _language = ''
  private menu: any
  private _onAddHeadCallback = (id: string) => { }
  private _onDeleteCallback = (id: string) => { }

  constructor(container?: HTMLDivElement) {

    this.cy.on('tap', 'node[type = "class"]', e => {
      //this.selectedGraphNode = this.getGraphElementByID(e.target.id())
      this._onNodeSelectionCallback(e.target.id())
    })

    if (container) {
      this.cy.mount(container)
      this.menu = (this.cy as any).cxtmenu(this.menuOption)
    }
  }

  /**
   * Get a node by its id
   * @param nodeID the node ID
   * @returns a cytoscape representation of the node or null if it does not exist
   */
  public getNodeById(nodeID: string) {
    const node = this.cy.$id(nodeID)
    return node.empty() ? null : node
  }

  /**
   * Add a node to the query graph
   */
  public addNode(node: GraphElement) {
    if (!this.getNodeById(node.id)) {
      this.cy.add({ data: this.getDataObj(node) })
    } else if (node.entities.length > 1) {
      node.entities.forEach( (_e: any, i: number) => {
        this.cy.add({ data: this.getDataObj(node, i) })
      })
    }
  }

  public addEdge(sourceNode: GraphElement, targetNode: GraphElement, edgeData?: GraphElement) {
    this.addNode(targetNode)
    const edge = edgeData
      ? this.getDataObj(edgeData) // the edge is an entity, get its data
      : { id: `${sourceNode.id}-${targetNode.id}`, type: targetNode.entities[0].type } // the edge is not an entity

    if (this.cy.$id(edge.id).empty()) {
      edge.source = sourceNode.id
      edge.target = targetNode.id
      this.cy.add({ data: edge })
    }
  }

  /**
   * Remove a node from query graph, it will remove also all subsequent nodes
   */
  public removeNode(nodeID: any) {
    this.cy.$id(nodeID).remove()
  }

  /**
   * Select a node given its id and return the node in cytoscape representation
   */
  public selectNode(nodeId: string): cytoscape.CollectionReturnValue {
    return this.cy.$id(nodeId).select()
  }

  /**
   * Arrange nodes in nice positions
   */
  public arrange() {
    const dataPropertySelector = `node[type = "${EntityTypeEnum.DataProperty}"]`
    const classSelector = `node[type = "${EntityTypeEnum.Class}"]`
    
    this.cy.layout(this.layoutOptions).run()
    this.cy.$(classSelector).forEach( node => {
      const dataProperties = node.neighborhood(dataPropertySelector)
      if (!dataProperties.empty()) {
        let layoutConcentric = node.union(dataProperties).layout(this.radialLayoutOpt(node))
        layoutConcentric.run()
      }
    })

    this.cy.fit()
    //dataPropSources.lock()
    // apply floaty layout only to dataproperties
    //this.cy.$(dataPropertySelector).closedNeighborhood().layout(this.radialLayoutOpt).run()
    //dataPropSources.unlock()
  }

  /**
   * Unselect element by id, if you don't specify the id, every selected node is unselected
   */
  public unselect(nodeId?: string) {
    nodeId ? this.cy.$id(nodeId).unselect : this.elements.unselect()
  }

  public setDisplayedNameType(newDisplayedNameType: DisplayedNameType, language?: string) {
    this.cy.elements(`[${DISPLAYED_NAME}]`).forEach(elem => {
      if (newDisplayedNameType === DisplayedNameType.label) {
        if (!language) throw Error('can\'t display labels not knowing which language')
        elem.data(DISPLAYED_NAME, elem.data(DisplayedNameType.label)[language].replace(/\r?\n|\r/g,''))
      } else {
        elem.data(DISPLAYED_NAME, elem.data(newDisplayedNameType))
      }
    })

    this._displayedNameType = newDisplayedNameType
    this._language = language
  }

  /**
   * Perform an action on a node selection, 
   * the callback you pass will be passed the id of selected node
   */
   public onNodeSelect(callback: (id: string) => void) {
    this._onNodeSelectionCallback = callback
  }

  /**
   * Register callback to be called when user add element to head, 
   * @param callback the callback you pass will be passed the id of the involved node
   */
  public onAddHead(callback: (id: string) => void ) {
    this._onAddHeadCallback = callback
  }

  /**
   * Register callback to be called when user delete an element, 
   * @param callback the callback you pass will be passed the id of the involved node
   */
  public onDelete(callback: (id: string) => void) {
    this._onDeleteCallback = callback
  }

  private getDataObj(graphElement: GraphElement, i = null) {
    let data = graphElement.entities[i || 0]
    if (i !== null) {
      data.parent = graphElement.id
      data.id = `${graphElement.id}-${i}`
    } else {
      data.id = graphElement.id
    }

    data.displayed_name = (this._displayedNameType === DisplayedNameType.label)
      ? data[this._displayedNameType][this._language].replace(/\r?\n|\r/g,'')
      : data[this._displayedNameType] || data[DisplayedNameType.full] || data[DisplayedNameType.prefixed]

    return data
  }

  // ***************** CXT COMMANDS CALLBACKS ***********************

  // private handleElementSelection(elem: CollectionReturnValue) {
  //   if (elem.data('type') === EntityTypeEnum.Class) {
  //     this._onNodeSelectionCallback(elem.id())
  //   }
  // }

  private handleAddHead(elem: CollectionReturnValue) {
    this._onAddHeadCallback(elem.id())
  }

  private handleDelete(elem:CollectionReturnValue) {
    this._onDeleteCallback(elem.id())
  }


  // ***************** GETTERS & SETTERS *************************
  public get container() { return this.cy.container() }

  public set theme(newTheme: Theme) {
    this.cy.style(getStylesheet(newTheme))
  }

  public get nodes() {
    return this.cy.nodes()
  }

  public get edges() {
    return this.cy.edges()
  }

  public get elements() {
    return this.cy.elements()
  }

  private get menuOption() {
    const getCallback = (command: Command, elem: CollectionReturnValue) => {
      switch (command) {
        // case Command.select:
        //   this.handleElementSelection(elem)
        //   break
        case Command.addHead: 
          this.handleAddHead(elem)
          break
        case Command.delete: 
          this.handleDelete(elem)
          break
      }
    }

    return {
      selector: '*',
      commands: commandList(getCallback),
      // openMenuEvents: 'tap',
      // fillColor: '',
      // activeFillColor: '',
      // itemColor: '',
    }
  }
}