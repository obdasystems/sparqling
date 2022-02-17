import { CollectionReturnValue } from "cytoscape"
import { Type } from "grapholscape"
import { GraphElement, QueryGraphApiFactory, QueryGraph } from "../../api/swagger"
import * as ontologyGraph from "../../ontology-graph"
import getGscape from "../../ontology-graph/get-gscape"
import * as queryGraph from "../../query-graph"
import { getdiffNew, graphElementHasIri, isClass } from "../../util/graph-element-utility"
import * as queryBody from "../../query-body"
import onNewBody from "../on-new-body"


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

  if (graphElementHasIri(selectedGraphElement, clickedIRI)) {
    if (!ontologyGraph.isIriSelected(clickedIRI)) {
      ontologyGraph.resetHighlights()
      ontologyGraph.highlightSuggestions(clickedIRI)
    }
    return
  }

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

      let newGraphElements: GraphElement[] = []
      if (newBody) {
        newGraphElements = getdiffNew(queryBody.getBody()?.graph, newBody.graph)
        onNewBody(newBody)
      }

      const newSelectedGraphElement = newGraphElements.find(ge => graphElementHasIri(ge, clickedIRI))
      if (newSelectedGraphElement)
        queryBody.setSelectedGraphElement(queryGraph.selectElement(newSelectedGraphElement.id))

      ontologyGraph.resetHighlights()
      ontologyGraph.highlightSuggestions(clickedIRI)
      break
    }
    case DATA_PROPERTY: {
      newBody = await handleDataPropertySelection(cyEntity)
      if (newBody)
        onNewBody(newBody)
      break
    }
  }

  gscape.unselectEntity([])
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
  try {
    if (lastObjProperty) {
      // this comes after a selection of a object property
      newQueryGraph = (await qgApi.putQueryGraphObjectProperty(
        selectedGraphElement.id, "", lastObjProperty.data('iri').fullIri, clickedIRI,
        lastObjProperty['direct'],
        actualBody
      )).data

    } else if (actualBody?.graph && isIriHighlighted) {
      newQueryGraph = (await qgApi.putQueryGraphClass(
        selectedGraphElement.id, '',
        clickedIRI,
        actualBody)).data
    } else if (!actualBody?.graph) {
      // initial selection
      newQueryGraph = (await qgApi.getQueryGraph(clickedIRI)).data
    }
  } catch (error) { console.error(error) }
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
  if (isClass(selectedGraphElement)) {
    newQueryGraph = (await qgApi.putQueryGraphDataProperty(
      selectedGraphElement.id, '', clickedIRI, actualBody
    )).data
  }
  lastObjProperty = null
  return newQueryGraph
}

function getInitialInfo(cyEntity: CollectionReturnValue) {
  clickedIRI = cyEntity.data('iri').fullIri
  //selectedGraphElement = queryGraph.getSelectedGraphElement()
  isIriHighlighted = ontologyGraph.isHighlighted(clickedIRI)
  iriInQueryGraph = queryGraph.isIriInQueryGraph(clickedIRI)
}