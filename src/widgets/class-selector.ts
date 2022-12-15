import { GrapholTypesEnum, ui } from "grapholscape";
import { getGscape } from "../ontology-graph";

export const classSelector = new ui.GscapeEntitySelector()

classSelector.hide()

export function initClassSelector() {
  classSelector.entityList = ui.createEntitiesList(getGscape(), {
    [GrapholTypesEnum.CLASS]: 1,
    areAllFiltersDisabled: false,
  })
}