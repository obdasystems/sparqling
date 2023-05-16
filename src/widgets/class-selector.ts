import { GrapholTypesEnum, ui } from "grapholscape";
import { EntityTypeEnum } from "../api/swagger";
import { hasEntityEmptyUnfolding } from "../model";
import { getGscape } from "../ontology-graph";

export const classSelector = new ui.GscapeEntitySelector()

classSelector.hide()

export function initClassSelector() {
  classSelector.entityList = ui.createEntitiesList(getGscape(), {
    [GrapholTypesEnum.CLASS]: 1,
    areAllFiltersDisabled: false,
  })

  classSelector.updateComplete.then(() => {
    classSelector.entityList.map(e => e.value.iri).forEach((classIri, i) => {
      const classElementInList = classSelector.shadowRoot?.querySelector(`gscape-entity-list-item[iri = "${classIri.fullIri}"]`);
      (classElementInList as HTMLElement).style.opacity = '1'
      if (hasEntityEmptyUnfolding(classIri.fullIri, EntityTypeEnum.Class)) {
        if (classElementInList) {
          (classElementInList as HTMLElement).style.opacity = '0.5'
        }
      }
    })
  })
}