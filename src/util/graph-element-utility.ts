import { Entity, EntityTypeEnum, GraphElement } from "../api/swagger"
import * as model from '../model/'

export function getGraphElementByID(id: string | number): GraphElement | undefined {
  const graph = model.getQueryBody()?.graph
  return findGraphElement(graph, (elem) => elem.id === id)
}

export function getGraphElementByIRI(iri: string): GraphElement | undefined {
  const graph = model.getQueryBody()?.graph
  return findGraphElement(graph, (elem) => graphElementHasIri(elem, iri))
}

/**
 * Find an element in the query-graph satisfying the test condition
 * @param graph the element to test
 * @param test boolean test function
 * @returns the first element satisfying the condition
 */
export function findGraphElement(graph: GraphElement, test: (elem: GraphElement) => boolean): GraphElement | undefined {
  if (!graph) return

  if (test(graph)) return graph

  if (graph.children) {
    for (let child of graph.children) {
      let res = findGraphElement(child, test)
      if (res) return res
    }
  }

  return
}

/**
 * Get the iri of an entity contained in a GraphElement
 * @param elem the GraphElement to extract IRI from
 * @param i the entity index in the array, default first one
 * @returns 
 */
export function getIri(elem: GraphElement, i = 0): string | undefined {
  if (elem?.entities)
    return elem?.entities[i]?.iri
}

/**
 * Get the prefixed iri of an entity contained in a GraphElement
 * @param elem the GraphElement to extract IRI from
 * @param i the entity index in the array, default first one
 * @returns 
 */
 export function getPrefixedIri(elem: GraphElement, i = 0): string | undefined {
  if (elem?.entities)
    return elem.entities[i].prefixedIri
}

export function getEntityType(elem: GraphElement): EntityTypeEnum | undefined {
  if (elem?.entities)
    return elem.entities[0].type
}

export function graphElementHasIri(elem: GraphElement, iri: string) {
  return elem?.entities?.some((entity: Entity) => {
    return entity.iri === iri || entity.prefixedIri === iri
  }) || false
}

export function canStartJoin(elem: GraphElement): boolean {
  if (!elem) return false

  return elem.entities?.length === 1 && isClass(elem)
}

export function isJoinAllowed(targetElem: GraphElement, startElem: GraphElement): boolean {
  if (!targetElem || !startElem) return false

  const areBothClasses = isClass(startElem) && isClass(targetElem)
  const startElemIri = getIri(startElem)
  const doesTargetHasSameIri = startElemIri ? graphElementHasIri(targetElem, startElemIri) : false
  return areBothClasses && doesTargetHasSameIri
}

export function isClass(graphElement: GraphElement) {
  return getEntityType(graphElement) === EntityTypeEnum.Class
}

export function isDataProperty(graphElement: GraphElement) {
  return getEntityType(graphElement) === EntityTypeEnum.DataProperty
}

export function isObjectProperty(graphElement: GraphElement) {
  return getEntityType(graphElement) === EntityTypeEnum.ObjectProperty || isInverseObjectProperty(graphElement)
    
}

export function isInverseObjectProperty(graphElement: GraphElement) {
  return getEntityType(graphElement) === EntityTypeEnum.InverseObjectProperty
}
/**
 * Return a set of GraphElements which are present in newGraph and not in oldGraph
 */
export function getdiffNew(oldGraph: GraphElement, newGraph: GraphElement): GraphElement[] {
  if (!oldGraph) return [newGraph]
  let result: GraphElement[] = []

  let res = findGraphElement(oldGraph, e => areGraphElementsEqual(e, newGraph))
  if (!res) result.push(newGraph)

  if (newGraph?.children) {
    for (let graphElement of newGraph.children) {
      let res2 = getdiffNew(oldGraph, graphElement)
      if (res2) result.push(...res2)
    }
  }

  return result
}


export function areGraphElementsEqual(ge1: GraphElement, ge2: GraphElement): boolean {
  if (!ge1.id || !ge2.id) return false

  const hasSameId = ge1.id === ge2.id
  const hasSameFilters = model.getFiltersOnVariable(ge1.id) === model.getFiltersOnVariable(ge2.id)
  const hasSameEntities = JSON.stringify(ge1.entities) === JSON.stringify(ge2.entities)
  
  return hasSameId && hasSameFilters && hasSameEntities
}

export function getParentFromChildId(id: string) {
  const splittedId = id.split('-')
  const parentId = splittedId[0]
  const childIri = splittedId[1]
  const graph = model.getQueryBody()?.graph
  return findGraphElement(graph, ge => graphElementHasIri(ge, childIri) && ge.id === parentId)
}