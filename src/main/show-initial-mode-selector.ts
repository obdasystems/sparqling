import { ui } from "grapholscape";
import { getGscape } from "../ontology-graph";
import { lightbulb } from "../widgets/assets/icons";
import { startFullPage, stopFullPage } from "./fullpage";
import start from "./start";

export default function showInitialModeSelector() {
  const modeSelector = new ui.GscapeFullPageSelector()
  modeSelector.title = 'Do you want to use the Ontology Graph?'
  modeSelector.options = [
    {
      name: 'Only Suggestions',
      description: 'You do not need to know the ontology graph. Start from a class and proceed using our suggestions.',
      icon: lightbulb,
      id: 'full-page'
    },
    {
      name: 'Ontology Graph & Suggestions',
      description: 'Use the ontology graph and our suggestions to build your query.',
      icon: ui.icons.bubbles,
      id: 'standard'
    },
  ]

  modeSelector.onOptionSelection = (optionId: string) => {
    start().then(_ => {
      if (optionId === 'full-page') {
        startFullPage()
      } else {
        stopFullPage()
      }
    })
  }

  getGscape().container.appendChild(modeSelector)
}