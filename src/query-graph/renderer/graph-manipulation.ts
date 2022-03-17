import { CollectionReturnValue, SingularData } from "cytoscape"
import { UI } from 'grapholscape'
import tippy, { sticky } from "tippy.js"
import { Entity, EntityTypeEnum, GraphElement, Optional } from "../../api/swagger"
import { getFiltersOnVariable } from "../../query-body"
import { filter } from "../../widgets/assets/icons"
import { DisplayedNameType } from "../displayed-name-type"
import cy, { getDisplayedNameType, getLanguage } from './cy'
import { getElementById, getElements } from "./getters"
import { addOrRemoveFilterIcon, removeHasFilterIcon } from "./has-filter-icon"
import { klayLayoutOpt, radialLayoutOpt } from "./layout-options"

export const DISPLAYED_NAME = 'displayed_name'

let elementClickCallback: (nodeId: string, iri: string) => void

cy.on('tap', 'node, edge', e => {
  // if it's an entity (class, data property or obj property)
  if (Object.values(EntityTypeEnum).includes(e.target.data().type)) {
    // if it's a child, the ID of the selected elem is the id of the parent
    let elemID = e.target.isChild() ? e.target.data().parent : e.target.id()
    elementClickCallback(elemID, e.target.data().iri)
  }
})


/**
 * Add a node to the query graph
 */
export function addNode(node: GraphElement) {
  if (!node) return
  const newNodeData = getDataObj(node)
  const existingNode = getElementById(node.id)
  let newNode: CollectionReturnValue

  if (node.entities?.length > 1 && existingNode?.children().length !== node.entities?.length) {
    node.entities.forEach((child: Entity, i: number) => {
      if (!existingNode.children().some(c => c[0].data('iri') === child.iri)) {
        newNode = cy.add({ data: getDataObj(node, i) })
        arrange()
      }
    })
    return
  }
  
  if (!existingNode) {
    newNode = cy.add({ data: newNodeData })
    arrange()
  } else {
    existingNode.removeData()
    existingNode.data(newNodeData)
  }

  newNode = newNode || existingNode
  addOrRemoveFilterIcon(newNode)
}

export function addEdge(sourceNode: GraphElement, targetNode: GraphElement, edgeData?: GraphElement) {
  let newEdgeData: any
  //const sourceCyNode = getElementById(sourceNode.id)
  const targetCyNode = getElementById(targetNode.id)
  if (!targetCyNode) {
    addNode(targetNode)
  }

  newEdgeData = edgeData
    // get data object since it's an entity and set source and target
    ? getDataObj(edgeData)
    // not an entity (e.g. dataProperty connectors)
    : { id: `${sourceNode.id}-${targetNode.id}`, type: targetNode.entities[0].type }

  const cyEdge = getElementById(newEdgeData.id)
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
  cy.add({ data: newEdgeData })
  arrange()
}

/**
 * Remove a node from query graph, it will remove also all subsequent nodes
 */
export function removeNode(nodeID: any) {
  const node = getElementById(nodeID)
  if (!node || node.empty()) return

  removeHasFilterIcon(node)
  node.remove()
}

/**
 * Select a node given its id and return the node in cytoscape representation
 */
export function selectNode(nodeId: string): cytoscape.CollectionReturnValue {
  getElements().removeClass('sparqling-selected')
  let cyNode = cy.$id(nodeId)
  cyNode.addClass('sparqling-selected')
  return cyNode
}

/**
 * Arrange nodes in nice positions
 */
export function arrange() {
  const dataPropertySelector = `node[type = "${EntityTypeEnum.DataProperty}"]`
  const classSelector = `node[type = "${EntityTypeEnum.Class}"]`

  cy.layout(klayLayoutOpt).run()
  cy.$(classSelector).forEach(node => {
    const dataProperties = node.neighborhood(dataPropertySelector)
    if (!dataProperties.empty()) {
      let layoutConcentric = node.union(node.children()).union(dataProperties).layout(radialLayoutOpt(node))
      layoutConcentric.run()
    }
  })

  cy.fit()
  //dataPropSources.lock()
  // apply floaty layout only to dataproperties
  //cy.$(dataPropertySelector).closedNeighborhood().layout(radialLayoutOpt).run()
  //dataPropSources.unlock()
}

export function renderOptionals(optionals: Optional[]) {
  clearOptionals()
  optionals?.forEach(opt => {
    opt.graphIds.forEach((elemId: string) => getElementById(elemId).data('optional', true))
  })
}

export function clearOptionals() {
  getElements().filter('[?optional]').data('optional', false)
}

/**
 * Unselect element by id, if you don't specify the id, every selected node is unselected
 */
export function unselect(nodeId?: string) {
  nodeId ? cy.$id(nodeId).unselect : getElements().unselect()
}

export function updateDisplayedNames() {
  cy.elements(`[${DISPLAYED_NAME}]`).forEach(elem => {
    elem.data(DISPLAYED_NAME, getDisplayedName(elem.data()))
  })
}

export function onElementClick(callback: (nodeId: string, iri: string) => void) {
  elementClickCallback = callback
}

/**
 * Given a graphElement, build a data object for its instance in cytoscape
 * @param graphElement the graphElement you want to get data from
 * @param i the index of the entity you want are interested to
 * @returns the data object for cytoscape's instanc of the graphElement
 */
function getDataObj(graphElement: GraphElement, i = null) {
  let data = Object.assign({}, graphElement.entities[i || 0] as any)
  if (i !== null) {
    data.parent = graphElement.id
    data.id = `${graphElement.id}-${data.iri}`
  } else {
    data.id = graphElement.id
  }
  data.hasFilters = getFiltersOnVariable(`?${graphElement.id}`)?.length > 0 ? true : false
  data.displayed_name = getDisplayedName(data)

  return data
}

function getDisplayedName(data: object) {
  let labels = data[DisplayedNameType.label]
  const displayedNameType = getDisplayedNameType()

  if (displayedNameType === DisplayedNameType.label && labels)
    // use first language found if the actual one is not available
    return labels[getLanguage] || labels[Object.keys(labels)[0]]
  else
    return data[displayedNameType] || data[DisplayedNameType.prefixed] || data[DisplayedNameType.full]
}