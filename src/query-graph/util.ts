import { Entity, GraphElement } from "../api/swagger/models"

export function graphElementHasIri(elem: GraphElement, iri: string) {
  return elem?.entities?.some( (entity: Entity) => {
    return entity.iri === iri || entity.prefixedIri === iri
  })
}