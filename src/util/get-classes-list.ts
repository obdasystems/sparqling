import { Grapholscape, TypesEnum, ui } from "grapholscape";
import { hasEntityEmptyUnfolding } from "../model";
import { EntityTypeEnum } from "../api/swagger";

export default function getClassesList(grapholscape: Grapholscape) {
  return ui.createEntitiesList(grapholscape, {
    [TypesEnum.CLASS]: 1,
    areAllFiltersDisabled: false,
  }).map(e => {
    e.disabled = hasEntityEmptyUnfolding(e.value.iri.fullIri, EntityTypeEnum.Class)
    return e
  })
}