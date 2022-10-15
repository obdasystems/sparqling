import { GrapholTypesEnum, ui } from "grapholscape";
import { getGscape } from "../ontology-graph";

export const classSelector = new ui.GscapeEntitySelector()
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