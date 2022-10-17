import { GrapholTypesEnum, ui } from "grapholscape";
import { getGscape } from "../ontology-graph";

export const classSelector = new ui.GscapeEntitySelector()
classSelector.searchEntityComponent[GrapholTypesEnum.DATA_PROPERTY] = undefined
classSelector.searchEntityComponent[GrapholTypesEnum.OBJECT_PROPERTY] = undefined
classSelector.searchEntityComponent[GrapholTypesEnum.INDIVIDUAL] = undefined

classSelector.hide()

export function initClassSelector() {
  const entities = getGscape().ontology.entities
  let entitiesViewData: ui.EntityViewData[] = []
  entities.forEach(entity => {
    if (entity.is(GrapholTypesEnum.CLASS))
      entitiesViewData.push({ value: entity, viewOccurrences: new Map() })
  })

  classSelector.entityList = entitiesViewData
}