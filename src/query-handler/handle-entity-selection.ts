import { CollectionReturnValue } from "cytoscape"
import { Grapholscape } from "grapholscape"
import { QueryGraphApiFactory } from "../api/swagger"
import { EntityTypeEnum, GraphElement, QueryGraph } from "../api/swagger/models"
import * as ontologyGraph from "../ontology-graph"
import * as queryGraph from "../query-graph"
import { getEntityType, graphElementHasIri } from "../query-graph/graph-element-utility"

let lastObjProperty: CollectionReturnValue
//let selectedGraphElement: GraphElement
let isIriHighlighted: boolean
let iriInQueryGraph: boolean
let clickedIRI: string
const qgApi = QueryGraphApiFactory()
// const iriInQueryGraph = actualBody ? queryManager.getGraphElementByIRI(clickedIRI) : null


export async function handleObjectPropertySelection(cyEntity: CollectionReturnValue, selectedGraphElement: GraphElement) {
  getInitialInfo(cyEntity)
  if (selectedGraphElement) {
    lastObjProperty = cyEntity
    const result = await ontologyGraph.findNextClassFromObjProperty(cyEntity).finally(() => cyEntity.unselect())
    lastObjProperty['direct'] = result.objPropertyFromApi.direct
    // gscape.centerOnNode(result.connectedClass.id(), 1.8)
    return result
  }
}

export async function handleConceptSelection(
  cyEntity: CollectionReturnValue, 
  actualBody: QueryGraph,
  selectedGraphElement: GraphElement
): Promise<QueryGraph> {
  
  getInitialInfo(cyEntity)
  let newQueryGraph: QueryGraph
  /**
   * if it's not the first click, 
   * the class is not highlighted, 
   * it's not connected to a objectProperty 
   * and it's not already in the queryGraph, then skip this click
   */ 
   if (actualBody?.graph && !isIriHighlighted && !lastObjProperty && !iriInQueryGraph) {
    //cyEntity.unselect()
    console.log('selection ignored for class '+ clickedIRI)
    return
  }
  
  if (!graphElementHasIri(selectedGraphElement, clickedIRI)) {
    try {
      if (lastObjProperty) {
        // this comes after a selection of a object property
        newQueryGraph = (await qgApi.putQueryGraphObjectProperty(
          actualBody, "", lastObjProperty.data('iri').fullIri, clickedIRI,
          lastObjProperty['direct'],
          selectedGraphElement.id
        )).data

      } else if (actualBody?.graph && isIriHighlighted) {
        newQueryGraph = (await qgApi.putQueryGraphClass(
          actualBody, '',
          clickedIRI,
          selectedGraphElement.id)).data
      } else if (!actualBody?.graph) {
        // initial selection
        newQueryGraph = (await qgApi.getQueryGraph(clickedIRI)).data
      }
    } catch (error) { console.error(error) }
  }
  lastObjProperty = null
  return newQueryGraph
}

export async function handleDataPropertySelection(
    cyEntity: CollectionReturnValue, 
    actualBody: QueryGraph,
    selectedGraphElement: GraphElement
  ): Promise<QueryGraph> {

  getInitialInfo(cyEntity)
  let newQueryGraph: QueryGraph

  if (!isIriHighlighted) {
    cyEntity.unselect()
    return null
  }

  if (getEntityType(selectedGraphElement) === EntityTypeEnum.Class) {
    newQueryGraph = (await qgApi.putQueryGraphDataProperty(
      actualBody, '', clickedIRI, selectedGraphElement.id
    )).data
  }
  lastObjProperty = null
  return newQueryGraph
}

function getInitialInfo(cyEntity: CollectionReturnValue) {
  clickedIRI = cyEntity.data('iri').fullIri
  //selectedGraphElement = queryGraph.getSelectedGraphElement()
  isIriHighlighted = ontologyGraph.isHighlighted(clickedIRI)
  iriInQueryGraph = queryGraph.iriInQueryGraph(clickedIRI)
}