import { CollectionReturnValue } from "cytoscape"
import { Type } from "grapholscape"
import { QueryGraphApiFactory } from "../api/swagger"
import { EntityTypeEnum, QueryGraph } from "../api/swagger/models"
import * as ontologyGraph from "../ontology-graph"
import getGscape from "../ontology-graph/get-gscape"
import * as queryGraph from "../query-graph"
import { getEntityType, graphElementHasIri } from "../util/graph-element-utility"
import * as queryBody from "./query-body"
import onNewBody from "./on-new-body"
import { getIri } from '../util/graph-element-utility'


const { CONCEPT, OBJECT_PROPERTY, DATA_PROPERTY } = Type
let lastObjProperty: CollectionReturnValue
//let selectedGraphElement: GraphElement
let isIriHighlighted: boolean
let iriInQueryGraph: boolean
let clickedIRI: string
const qgApi = QueryGraphApiFactory()
// const iriInQueryGraph = actualBody ? queryManager.getGraphElementByIRI(clickedIRI) : null

export async function onEntitySelection(cyEntity: CollectionReturnValue) {
  let clickedIRI = cyEntity.data('iri').fullIri
  const selectedGraphElement = queryBody.getSelectedGraphElement()

  if (getIri(selectedGraphElement) === clickedIRI) return

  let gscape = getGscape()
  let newBody: QueryGraph = null
  switch (cyEntity.data('type')) {
    case OBJECT_PROPERTY: {
      let result = await handleObjectPropertySelection(cyEntity)
      if (result && result.connectedClass) {
        gscape.centerOnNode(result.connectedClass.id(), 1.8)
      }
      break
    }
    case CONCEPT: {
      newBody = await handleConceptSelection(cyEntity)
      if (newBody) {
        onNewBody(newBody)
      }

      queryBody.setSelectedGraphElement(queryGraph.selectElement(clickedIRI))
      ontologyGraph.resetHighlights()
      ontologyGraph.highlightSuggestions(clickedIRI)
      break
    }
    case DATA_PROPERTY: {
      let newBody: QueryGraph = null
      newBody = await handleDataPropertySelection(cyEntity)
      // select the current selected class on the ontology, prevent from selecting the attribute
      gscape.selectEntityOccurrences(getIri(selectedGraphElement))
      if (newBody)
        onNewBody(newBody)
      break
    }
  }
}

async function handleObjectPropertySelection(cyEntity: CollectionReturnValue) {
  getInitialInfo(cyEntity)
  if (queryBody.getSelectedGraphElement()) {
    lastObjProperty = cyEntity
    const result = await ontologyGraph.findNextClassFromObjProperty(cyEntity).finally(() => cyEntity.unselect())
    lastObjProperty['direct'] = result.objPropertyFromApi.direct
    // gscape.centerOnNode(result.connectedClass.id(), 1.8)
    return result
  }
}

async function handleConceptSelection(cyEntity: CollectionReturnValue): Promise<QueryGraph> {

  getInitialInfo(cyEntity)
  let newQueryGraph: QueryGraph
  let actualBody = queryBody.getBody()
  /**
   * if it's not the first click, 
   * the class is not highlighted, 
   * it's not connected to a objectProperty 
   * and it's not already in the queryGraph, then skip this click
   */
  if (actualBody?.graph && !isIriHighlighted && !lastObjProperty && !iriInQueryGraph) {
    //cyEntity.unselect()
    console.log('selection ignored for class ' + clickedIRI)
    return
  }

  let selectedGraphElement = queryBody.getSelectedGraphElement()
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

async function handleDataPropertySelection(cyEntity: CollectionReturnValue): Promise<QueryGraph> {

  getInitialInfo(cyEntity)

  if (!isIriHighlighted) {
    cyEntity.unselect()
    return null
  }

  let newQueryGraph: QueryGraph
  const actualBody = queryBody.getBody()
  const selectedGraphElement = queryBody.getSelectedGraphElement()
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