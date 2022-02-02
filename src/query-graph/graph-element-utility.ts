import { Entity, EntityTypeEnum, GraphElement } from "../api/swagger/models";

export function getGraphElementByID(elem: GraphElement, id: string | number) {
  return findGraphElement(elem, (elem) => elem.id === id)
}

export function getGraphElementByIRI(elem: GraphElement, iri: string) {
  return findGraphElement(elem, (elem) => graphElementHasIri(elem, iri))
}

/**
 * Find an element in the query-graph satisfying the test condition
 * @param elem the element to test
 * @param test boolean test function
 * @returns the first element satisfying the condition
 */
export function findGraphElement(elem: GraphElement, test: (elem: GraphElement) => boolean): GraphElement {
  if (!elem) return null
  
  if (test(elem)) return elem

  if (elem.children) {
    for (let child of elem.children) {
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
      && elem.entities[0].type === EntityTypeEnum.Class
}

export function isJoinAllowed(targetElem: GraphElement, startElem: GraphElement): boolean {
  if (!targetElem || !startElem) return false

  const areBothClasses = 
    startElem.entities[0].type === EntityTypeEnum.Class &&
    targetElem.entities[0].type === EntityTypeEnum.Class
  const doesTargetHasSameIri = graphElementHasIri(targetElem, startElem.entities[0].iri)
  return areBothClasses && doesTargetHasSameIri
}