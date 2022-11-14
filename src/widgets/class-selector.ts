import { GrapholTypesEnum, ui } from "grapholscape";
import { getGscape } from "../ontology-graph";

export const classSelector = new ui.GscapeEntitySelector()
classSelector.searchEntityComponent[GrapholTypesEnum.DATA_PROPERTY] = undefined
classSelector.searchEntityComponent[GrapholTypesEnum.OBJECT_PROPERTY] = undefined
classSelector.searchEntityComponent[GrapholTypesEnum.INDIVIDUAL] = undefined

classSelector.hide()

export function initClassSelector() {
  classSelector.entityList = ui.createEntitiesList(getGscape(), {
    [GrapholTypesEnum.CLASS]: true,
    areAllFiltersDisabled: false,
  })
}