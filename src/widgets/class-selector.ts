import { GrapholTypesEnum, ui } from "grapholscape";
import { EntityTypeEnum } from "../api/swagger";
import { getEmptyUnfoldingEntities, hasEntityEmptyUnfolding } from "../model";
import { getGscape } from "../ontology-graph";

export const classSelector = new ui.GscapeEntitySelector()

classSelector.hide()

export function initClassSelector() {
  classSelector.entityList = ui.createEntitiesList(getGscape(), {
    [GrapholTypesEnum.CLASS]: 1,
    areAllFiltersDisabled: false,
  })
  classSelector.entityList.map(e => e.value.iri).forEach((classIri, i) => {
    if (hasEntityEmptyUnfolding(classIri.fullIri, EntityTypeEnum.Class)) {
      classSelector.entityList.splice(i, 1)
    }
  })
  classSelector.requestUpdate()
}