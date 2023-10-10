import { ui } from "grapholscape";
import { getGscape } from "../ontology-graph";
import getClassesList from "../util/get-classes-list";

export const classSelector = new ui.IncrementalInitialMenu()

classSelector.hide()

export function initClassSelector() {
  classSelector.classes = getClassesList(getGscape())
}