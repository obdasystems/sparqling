import { TypesEnum, ui } from "grapholscape";
import { EntityTypeEnum } from "../api/swagger";
import { hasEntityEmptyUnfolding } from "../model";
import { getGscape } from "../ontology-graph";

export const classSelector = new ui.GscapeEntitySelector()

classSelector.style.top = '20%'
classSelector.style.left = '50%'
classSelector.style.transform = 'translate(-50%)'
classSelector.style.width = '40%'
classSelector.style.minWidth = '150px'
classSelector.style.position = 'absolute'
classSelector.hide()

export function initClassSelector() {
  classSelector.entityList = ui.createEntitiesList(getGscape(), {
    [TypesEnum.CLASS]: 1,
    areAllFiltersDisabled: false,
  }).map(e => {
    e.disabled = hasEntityEmptyUnfolding(e.value.iri.fullIri, EntityTypeEnum.Class)
    return e
  })
}