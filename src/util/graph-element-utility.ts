import { Entity, EntityTypeEnum, GraphElement } from "../api/swagger"
import * as queryBody from '../query-handler/query-body'

export function getGraphElementByID(id: string | number) {
  const graph = queryBody.getBody()?.graph
  return findGraphElement(graph, (elem) => elem.id === id)
}

export function getGraphElementByIRI(iri: string) {
  const graph = queryBody.getBody()?.graph
  return findGraphElement(graph, (elem) => graphElementHasIri(elem, iri))
}

/**
 * Find an element in the query-graph satisfying the test condition
 * @param graph the element to test
 * @param test boolean test function
 * @returns the first element satisfying the condition
 */
export function findGraphElement(graph: GraphElement, test: (elem: GraphElement) => boolean): GraphElement {
  if (!graph) return null
  
  if (test(graph)) return graph

  if (graph.children) {
    for (let child of graph.children) {
      let res = findGraphElement(child, test)
      if (res) return res
    }
  }
}

/**
 * Get the iri of an entity contained in a GraphElement
 * @param elem the GraphElement to extract IRI from
 * @param i the entity index in the array, default first one
 * @returns 
 */
export function getIri(elem: GraphElement, i = 0): string {
  return elem?.entities[i]?.iri
}

export function getEntityType(elem: GraphElement): EntityTypeEnum {
  return elem?.entities[0]?.type
}

export function graphElementHasIri(elem: GraphElement, iri: string) {
  return elem?.entities?.some( (entity: Entity) => {
    return entity.iri === iri || entity.prefixedIri === iri
  })
}

export function canStartJoin(elem: GraphElement): boolean {
  if (!elem) return false

  return elem.entities?.length === 1
      && getEntityType(elem) === EntityTypeEnum.Class
}

export function isJoinAllowed(targetElem: GraphElement, startElem: GraphElement): boolean {
  if (!targetElem || !startElem) return false

  const areBothClasses = 
    getEntityType(startElem) === EntityTypeEnum.Class &&
    getEntityType(targetElem) === EntityTypeEnum.Class
  const doesTargetHasSameIri = graphElementHasIri(targetElem, getIri(startElem))
  return areBothClasses && doesTargetHasSameIri
}