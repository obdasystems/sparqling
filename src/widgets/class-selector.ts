import { ui } from "grapholscape";
import { getGscape } from "../ontology-graph";

export const classSelector = new ui.GscapeEntitySelector()
classSelector.hide()

export function initClassSelector() {
  const entities = getGscape().ontology.entities
  classSelector.entityList = []
  entities.forEach(entity => {
    classSelector.entityList.push({ value: entity, viewOccurrences: new Map() })
  })
}