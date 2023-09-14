import { CollectionReturnValue } from "cytoscape"
import { TypesEnum, Iri, GrapholElement } from "grapholscape"
import { Branch, GraphElement, QueryGraph, QueryGraphBGPApi, QueryGraphExtraApi } from "../api/swagger"
import { performHighlights } from "../main"
import { handlePromise } from "../main/handle-promises"
import onNewBody from "../main/on-new-body"
import * as model from "../model"
import { isIriHighlighted } from "../model"
import * as ontologyGraph from "../ontology-graph"
import { selectEntity } from "../ontology-graph"
import getGscape from "../ontology-graph/get-gscape"
import * as queryGraph from "../query-graph"
import { getdiffNew, getIris, graphElementHasIri, isClass } from "../util/graph-element-utility"


let lastObjProperty: Branch | null

export async function handleEntitySelection(entityIriString: string, entityType: TypesEnum, entityOccurrence: GrapholElement) {
  const gscape = getGscape()
  const entityIri = new Iri(entityIriString, gscape.ontology.namespaces)
  const activeElement = model.getActiveElement()

  if (activeElement && graphElementHasIri(activeElement.graphElement, entityIriString) && !lastObjProperty) {
    return
  }

  switch (entityType) {
    case TypesEnum.OBJECT_PROPERTY: {
      // let result = await handleObjectPropertySelection(cyEntity)
      // if (result && result.connectedClass) {
      //   gscape.centerOnNode(result.connectedClass.id(), 1.8)
      // }
      break
    }
    case TypesEnum.CLASS: {
      handleConceptSelection(entityIriString)?.then(newBody => {
        if (!newBody) return

        // Get nodes not present in the old graph
        const newGraphElements = getdiffNew(model.getQueryBody()?.graph, newBody.graph)
        const newSelectedGraphElement = setOriginNode(entityOccurrence, newGraphElements, entityIriString)
        // performHighlights(entityIriString)
        onNewBody(newBody)

        // after onNewBody because we need to select the element after rendering phase
        if (newSelectedGraphElement && newSelectedGraphElement.id) {
          // The node to select is the one having the clickedIri among the new nodes
          queryGraph.selectElement(newSelectedGraphElement.id)
          model.setActiveElement({
            graphElement: newSelectedGraphElement,
            iri: entityIri,
          })

          const selectedClassesIris = getIris(newSelectedGraphElement)
          performHighlights(selectedClassesIris)
          selectedClassesIris.forEach(iri => selectEntity(iri))
        }
      })
      break
    }
    case TypesEnum.DATA_PROPERTY: {
      handleDataPropertySelection(entityIriString)?.then(newBody => {
        if (!newBody) return

        const newGraphElements = getdiffNew(model.getQueryBody()?.graph, newBody.graph)
        setOriginNode(entityOccurrence, newGraphElements, entityIriString)
        onNewBody(newBody)
      })
      break
    }
  }

  gscape.unselect()
}

ontologyGraph.onRelatedClassSelection(handleObjectPropertySelection)

export function handleObjectPropertySelection(branch: Branch, relatedClassEntityOccurrence: GrapholElement) {
  const gscape = getGscape()
  lastObjProperty = branch

  if (!model.isFullPageActive()) {
    gscape.centerOnElement(relatedClassEntityOccurrence.id, relatedClassEntityOccurrence.diagramId)
    gscape.selectElement(relatedClassEntityOccurrence.id)
  }

  const relatedClassCyElement = gscape.renderState
    ? gscape.ontology.getDiagram(relatedClassEntityOccurrence.diagramId)
      ?.representations.get(gscape.renderState)
      ?.cy.$id(relatedClassEntityOccurrence.id)
    : null

  if (relatedClassCyElement)
    handleEntitySelection(relatedClassCyElement.data().iri, relatedClassCyElement.data().type, relatedClassEntityOccurrence)
}

export async function handleConceptSelection(cyEntity: CollectionReturnValue | string): Promise<QueryGraph | null> {
  const qgBGPApi = new QueryGraphBGPApi(undefined, model.getBasePath())
  const clickedIRI = typeof cyEntity === 'string' ? cyEntity : cyEntity.data().iri
  let newQueryGraph: Promise<QueryGraph | null> = new Promise((resolve) => { resolve(null) })
  let actualBody = model.getQueryBody()
  /**
   * if it's not the first click, 
   * the class is not highlighted, 
   * it's not connected to a objectProperty 
   * and it's not already in the queryGraph, then skip this click
   */
  if (actualBody.graph?.id && !isIriHighlighted(clickedIRI) && !lastObjProperty && !isIriInQueryGraph(clickedIRI)) {
    //cyEntity.unselect()
    console.warn('selection ignored for class ' + clickedIRI)
    return newQueryGraph // empty promise
  }

  let activeElement = model.getActiveElement()

  if (lastObjProperty && lastObjProperty.objectPropertyIRI && activeElement?.graphElement.id) {
    // this comes after a selection of a object property
    newQueryGraph = handlePromise(qgBGPApi.putQueryGraphObjectProperty(
      activeElement.graphElement.id, "", lastObjProperty.objectPropertyIRI, clickedIRI,
      lastObjProperty.direct || false,
      actualBody, model.getRequestOptions()
    ))

  } else if (actualBody.graph?.id && isIriHighlighted(clickedIRI) && activeElement?.graphElement.id) {
    newQueryGraph = handlePromise(qgBGPApi.putQueryGraphClass(
      activeElement.graphElement.id, '',
      clickedIRI,
      actualBody, model.getRequestOptions()))
  } else if (!actualBody.graph?.id) {
    // initial selection
    const tempNewQueryGraph = await handlePromise(qgBGPApi.getQueryGraph(clickedIRI, model.getRequestOptions()))
    const qgExtraApi = new QueryGraphExtraApi(undefined, model.getBasePath())
    newQueryGraph = handlePromise(qgExtraApi.distinctQueryGraph(true, tempNewQueryGraph, model.getRequestOptions()))
  }
  lastObjProperty = null
  return newQueryGraph
}

export async function handleDataPropertySelection(cyEntity: string | CollectionReturnValue): Promise<QueryGraph | null> {

  const clickedIRI = typeof cyEntity === 'string' ? cyEntity : cyEntity.data().iri
  let newQueryGraph: Promise<QueryGraph | null> = new Promise((resolve) => { resolve(null) })


  if (!isIriHighlighted(clickedIRI)) {
    // cyEntity.unselect()
    return newQueryGraph // empty promise
  }

  const actualBody = model.getQueryBody()
  const activeElement = model.getActiveElement()

  if (!activeElement?.graphElement.id) {
    return newQueryGraph // empty promise
  }

  if (isClass(activeElement.graphElement)) {
    const qgBGPApi = new QueryGraphBGPApi(undefined, model.getBasePath())
    newQueryGraph = handlePromise(qgBGPApi.putQueryGraphDataProperty(
      activeElement.graphElement.id, '', clickedIRI, actualBody, model.getRequestOptions()
    ))
  }
  lastObjProperty = null
  return newQueryGraph
}

/**
 * Find the GraphElement corresponding to the clicked entity and set entity as its origin Graphol node
 * @param entityOccurrence The clicked entity occurrence
 * @param graphElements Array of newly added graphElements
 * @returns The GraphElement corresponding to the clicked entity
 */
export function setOriginNode(entityOccurrence: GrapholElement, graphElements: GraphElement[], clickedIri: string) {
  let graphElement = graphElements?.find(ge => graphElementHasIri(ge, clickedIri))
  if (graphElement) {
    model.getOriginGrapholNodes().set(graphElement.id + clickedIri, entityOccurrence)
  }

  return graphElement
}

export function setLastObjectProperty(objProperty: Branch) {
  lastObjProperty = objProperty
}

function isIriInQueryGraph(iri: string) { return queryGraph.isIriInQueryGraph(iri) }