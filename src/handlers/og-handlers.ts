import { CollectionReturnValue } from "cytoscape"
import { Type } from "grapholscape"
import { GraphElement, QueryGraphBGPApiFactory, QueryGraph, Branch } from "../api/swagger"
import * as ontologyGraph from "../ontology-graph"
import getGscape from "../ontology-graph/get-gscape"
import * as queryGraph from "../query-graph"
import { getdiffNew, graphElementHasIri, isClass } from "../util/graph-element-utility"
import * as model from "../model"
import onNewBody from "../main/on-new-body"


const { CONCEPT, OBJECT_PROPERTY, DATA_PROPERTY } = Type
let lastObjProperty: Branch
//let selectedGraphElement: GraphElement
let isIriHighlighted: boolean
let iriInQueryGraph: boolean
let clickedIRI: string
const qgApi = QueryGraphBGPApiFactory()
// const iriInQueryGraph = actualBody ? queryManager.getGraphElementByIRI(clickedIRI) : null

export async function handleEntitySelection(cyEntity: CollectionReturnValue) {
  let clickedIRI = cyEntity.data('iri').fullIri
  const selectedGraphElement = model.getSelectedGraphElement()

  if (graphElementHasIri(selectedGraphElement, clickedIRI) && !lastObjProperty) {
    if (!ontologyGraph.isIriSelected(clickedIRI)) {
      ontologyGraph.resetHighlights()
      ontologyGraph.highlightSuggestions(clickedIRI)
    }
    return
  }

  const gscape = getGscape()
  let newBody: QueryGraph = null
  switch (cyEntity.data('type')) {
    case OBJECT_PROPERTY: {
      // let result = await handleObjectPropertySelection(cyEntity)
      // if (result && result.connectedClass) {
      //   gscape.centerOnNode(result.connectedClass.id(), 1.8)
      // }
      break
    }
    case CONCEPT: {
      newBody = await handleConceptSelection(cyEntity)
      if (newBody) {
        // Get nodes not present in the old graph
        const newGraphElements = getdiffNew(model.getQueryBody()?.graph, newBody.graph)
        const newSelectedGraphElement = setOriginNode(cyEntity, newGraphElements)
        ontologyGraph.resetHighlights()
        ontologyGraph.highlightSuggestions(clickedIRI)
        onNewBody(newBody)

        // after onNewBody because we need to select the element after rendering phase
        if (newSelectedGraphElement) {
          // The node to select is the one having the clickedIri among the new nodes
          model.setSelectedGraphElement(queryGraph.selectElement(newSelectedGraphElement.id))
        }
      }
      break
    }
    case DATA_PROPERTY: {
      newBody = await handleDataPropertySelection(cyEntity)
      if (newBody) {
        const newGraphElements = getdiffNew(model.getQueryBody()?.graph, newBody.graph)
        setOriginNode(cyEntity, newGraphElements)
        onNewBody(newBody)
      }
      break
    }
  }

  gscape.unselectEntity()
}

ontologyGraph.onRelatedClassSelection((branch: Branch, relatedClass) => {
  const gscape = getGscape()
  lastObjProperty = branch
  gscape.centerOnNode(relatedClass.id())
})

async function handleConceptSelection(cyEntity: CollectionReturnValue): Promise<QueryGraph> {

  getInitialInfo(cyEntity)
  let newQueryGraph: QueryGraph
  let actualBody = model.getQueryBody()
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

  let selectedGraphElement = model.getSelectedGraphElement()
  try {
    if (lastObjProperty) {
      // this comes after a selection of a object property
      newQueryGraph = (await qgApi.putQueryGraphObjectProperty(
        selectedGraphElement.id, "", lastObjProperty.objectPropertyIRI, clickedIRI,
        lastObjProperty.direct,
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
  const actualBody = model.getQueryBody()
  const selectedGraphElement = model.getSelectedGraphElement()
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

/**
 * Find the GraphElement corresponding to the clicked entity and set entity as its origin Graphol node
 * @param cyEntity The clicked entity
 * @param graphElements Array of newly added graphElements
 * @returns The GraphElement corresponding to the clicked entity
 */
function setOriginNode(cyEntity: CollectionReturnValue, graphElements: GraphElement[]) {
  let graphElement = graphElements?.find(ge => graphElementHasIri(ge, clickedIRI))
  if (graphElement) {
    model.getOriginGrapholNodes().set(graphElement.id + clickedIRI, cyEntity.id())
  }

  return graphElement
}