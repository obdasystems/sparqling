import cytoscape, { CollectionReturnValue, EventObject, Stylesheet } from 'cytoscape'
import klay from 'cytoscape-klay'
import cola from 'cytoscape-cola'
import cxtmenu from 'cytoscape-cxtmenu'
import compoundDragAndDrop from 'cytoscape-compound-drag-and-drop'
import { GraphElement, EntityTypeEnum, Entity } from '../../api/swagger/models'
import getStylesheet from './style'
import { Theme } from 'grapholscape'
import { commandList, Command } from './cxt-menu-commands'
import { DisplayedNameType } from '../displayed-name-type'

cytoscape.use(klay)
cytoscape.use(cola)
cytoscape.use(cxtmenu)
cytoscape.use(compoundDragAndDrop)

const DISPLAYED_NAME = 'displayed_name'

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
  private _onJoinCallback = (node1ID: string, node2ID: string) => { }
  
  constructor(container?: HTMLDivElement, dragAndDropCompundOptions?) {

    this.cy.on('tap', `node[type = ${EntityTypeEnum.Class}]`, e => {
      //this.selectedGraphNode = this.getGraphElementByID(e.target.id())
      this._onNodeSelectionCallback(e.target.id())
    })

    let cy = this.cy as any
    cy.on('cdnddrop', (e: EventObject, parent:CollectionReturnValue, dropSibling: CollectionReturnValue) => {
      if (!parent.empty() && !dropSibling.empty()) {
        // avoid creating a compound node
        dropSibling.move({ parent: null })
        e.target.move({parent: null})
        parent.remove()

        this._onJoinCallback(e.target.id(), dropSibling.id())
      }
    })
    if (container) {
      this.cy.mount(container)
      this.menu = (this.cy as any).cxtmenu(this.menuOption)
    }
  }

  /**
   * Get an elem by its id
   * @param elemID the node/edge ID
   * @returns a cytoscape representation of the element or null if it does not exist
   */
  public getElementById(elemID: string) {
    const elem = this.cy.$id(elemID)
    return elem.empty() ? null : elem
  }

  /**
   * Add a node to the query graph
   */
  public addNode(node: GraphElement) {
    if (!node) return
    const existingNode = this.getElementById(node.id)

    if (node.entities?.length > 1 && existingNode?.children().length !== node.entities?.length) {
      node.entities.forEach((child: Entity, i: number) => {
        if (!existingNode.children().some( c => c[0].data('iri') === child.iri)) {
          this.cy.add({ data: this.getDataObj(node, i) })
        }
      })
    } else if (!existingNode) {
      this.cy.add({ data: this.getDataObj(node) })
    }
  }

  public addEdge(sourceNode: GraphElement, targetNode: GraphElement, edgeData?: GraphElement) {
    let newEdgeData: any
    //const sourceCyNode = this.getElementById(sourceNode.id)
    const targetCyNode = this.getElementById(targetNode.id)
    if (!targetCyNode) {
      this.addNode(targetNode)
    }

    newEdgeData = edgeData
      // get data object since it's an entity and set source and target
      ? this.getDataObj(edgeData)
      // not an entity (e.g. dataProperty connectors)
      : { id: `${sourceNode.id}-${targetNode.id}`, type: targetNode.entities[0].type } 
    
    const cyEdge = this.getElementById(newEdgeData.id)
    // if edge is already in graph, make sure it has the right source and target
    // a join operation might have changed one of the two
    if (cyEdge) {
      cyEdge.move({
        source: sourceNode.id,
        target: targetNode.id
      })
      return // no need to add a new edge
    }

    newEdgeData.source = sourceNode.id
    newEdgeData.target = targetNode.id
    this.cy.add({ data: newEdgeData})
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

  public onJoin(callback: (node1ID: string, node2ID: string) => void) {
    this._onJoinCallback = callback
  }

  /**
   * Given a graphElement, build a data object for its instance in cytoscape
   * @param graphElement the graphElement you want to get data from
   * @param i the index of the entity you want are interested to
   * @returns the data object for cytoscape's instanc of the graphElement
   */
  private getDataObj(graphElement: GraphElement, i = null) {
    let data = graphElement.entities[i || 0]
    if (i !== null) {
      data.parent = graphElement.id
      data.id = data.iri
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

  public canStartJoin: (nodeID: string) => boolean
  public isJoinAllowed: (targetNodeID: string, startNodeID: string) => boolean
  private coumpoundDragAndDrop = (this.cy as any).compoundDragAndDrop(this.compoundDragAndDropOption)

  private get compoundDragAndDropOption() {
    return {
      grabbedNode: (node: CollectionReturnValue) => this.canStartJoin(node.id()),
      dropTarget: (dropTarget: CollectionReturnValue) =>
        this.isJoinAllowed(dropTarget?.id(), this.cy.$(':grabbed').id()),
      dropSibling: (dropTarget: CollectionReturnValue, grabbedNode: CollectionReturnValue) => 
        this.isJoinAllowed(dropTarget?.id(), this.cy.$(':grabbed').id())
    }
  }
}