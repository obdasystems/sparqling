import { CollectionReturnValue } from "cytoscape"
import { EntityOccurrence, GrapholTypesEnum, Iri, RendererStatesEnum } from "grapholscape"
import { Branch, Entity, GraphElement, QueryGraph, QueryGraphBGPApi, QueryGraphExtraApi } from "../api/swagger"
import { handlePromise } from "../main/handle-promises"
import onNewBody from "../main/on-new-body"
import * as model from "../model"
import * as ontologyGraph from "../ontology-graph"
import { onRelatedClassSelection } from "../ontology-graph"
import getGscape from "../ontology-graph/get-gscape"
import * as queryGraph from "../query-graph"
import { getdiffNew, graphElementHasIri, isClass } from "../util/graph-element-utility"


let lastObjProperty: Branch | null

export async function handleEntitySelection(entityIriString: string, entityType: GrapholTypesEnum, entityOccurrence: EntityOccurrence) {
  const gscape = getGscape()
  const entityIri = new Iri(entityIriString, gscape.ontology.namespaces)
  const activeElement = model.getActiveElement()

  if (activeElement && graphElementHasIri(activeElement.graphElement, entityIriString) && !lastObjProperty) {
    if (!ontologyGraph.isIriSelected(entityIri)) {
      ontologyGraph.highlightSuggestions(entityIriString)
    }
    return
  }

  switch (entityType) {
    case GrapholTypesEnum.OBJECT_PROPERTY: {
      if (gscape.renderState === RendererStatesEnum.FLOATY) {
        const cyObjProperty = gscape.renderer.cy?.$id(entityOccurrence.elementId)
        if (cyObjProperty) {
          const relatedClass = cyObjProperty.target() // object properties are edges in floaty
          const relatedClassEntityOccurrence: EntityOccurrence = {
            elementId: relatedClass.id(),
            diagramId: gscape.diagramId,
          }

          const objectPropertyBranch = ontologyGraph.getActualHighlights()?.objectProperties?.find((b: Branch) => {
            if (b.objectPropertyIRI)
              return entityIri.equals(b.objectPropertyIRI)
          })

          if (objectPropertyBranch) {
            handleObjectPropertySelection(objectPropertyBranch, relatedClassEntityOccurrence)
          }
        }
      }
      break
    }
    case GrapholTypesEnum.CLASS: {
      handleConceptSelection(entityIriString)?.then(newBody => {
        if (!newBody) return

        // Get nodes not present in the old graph
        const newGraphElements = getdiffNew(model.getQueryBody()?.graph, newBody.graph)
        const newSelectedGraphElement = setOriginNode(entityOccurrence, newGraphElements, entityIriString)
        ontologyGraph.highlightSuggestions(entityIriString)
        onNewBody(newBody)

        // after onNewBody because we need to select the element after rendering phase
        if (newSelectedGraphElement && newSelectedGraphElement.id) {
          // The node to select is the one having the clickedIri among the new nodes
          queryGraph.selectElement(newSelectedGraphElement.id)
          model.setActiveElement({
            graphElement: newSelectedGraphElement,
            iri: entityIri,
          })
        }
      })
      break
    }
    case GrapholTypesEnum.DATA_PROPERTY: {
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

export function handleObjectPropertySelection(branch: Branch, relatedClassEntityOccurrence: EntityOccurrence) {
  const gscape = getGscape()
  lastObjProperty = branch
  gscape.centerOnElement(relatedClassEntityOccurrence.elementId, relatedClassEntityOccurrence.diagramId)
  gscape.selectElement(relatedClassEntityOccurrence.elementId)
  
  const relatedClassCyElement = gscape.ontology
    .getDiagram(relatedClassEntityOccurrence.diagramId)
    ?.representations.get(gscape.renderState)
    ?.cy.$id(relatedClassEntityOccurrence.elementId)
  
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
  if (actualBody?.graph && !isIriHighlighted(clickedIRI) && !lastObjProperty && !isIriInQueryGraph(clickedIRI)) {
    //cyEntity.unselect()
    console.log('selection ignored for class ' + clickedIRI)
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

  } else if (actualBody?.graph && isIriHighlighted(clickedIRI) && activeElement?.graphElement.id) {
    newQueryGraph = handlePromise(qgBGPApi.putQueryGraphClass(
      activeElement.graphElement.id, '',
      clickedIRI,
      actualBody, model.getRequestOptions()))
  } else if (!actualBody?.graph) {
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
export function setOriginNode(entityOccurrence: EntityOccurrence, graphElements: GraphElement[], clickedIri: string) {
  let graphElement = graphElements?.find(ge => graphElementHasIri(ge, clickedIri))
  if (graphElement) {
    model.getOriginGrapholNodes().set(graphElement.id + clickedIri, entityOccurrence)
  }

  return graphElement
}

export function setLastObjectProperty(objProperty: Branch) {
  lastObjProperty = objProperty
}
function isIriHighlighted(iri: string) { return ontologyGraph.isHighlighted(iri) }
function isIriInQueryGraph(iri: string) { return queryGraph.isIriInQueryGraph(iri) }