import { Entity, EntityTypeEnum, GraphElement } from "../api/swagger/models"

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