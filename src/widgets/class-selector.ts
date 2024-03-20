import { ui } from "grapholscape";
import { getGscape } from "../ontology-graph";
import getClassesList from "../util/get-classes-list";

export const classSelector = new ui.IncrementalInitialMenu()

classSelector.hide()

export function initClassSelector() {
  const entitySelector = classSelector.shadowRoot?.querySelector('gscape-entity-selector')
  if (entitySelector) {
    entitySelector['fullEntityList'] = []
    const searchInput = entitySelector.shadowRoot?.querySelector('input')
    if (searchInput)
      searchInput.value = ''
  }
  
  classSelector.classes = getClassesList(getGscape())
}