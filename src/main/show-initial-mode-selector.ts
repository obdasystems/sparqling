import { ui } from "grapholscape";
import { getGscape } from "../ontology-graph";
import sparqlingIcon from "../widgets/assets/sparqling-icon";
import { startFullpage } from "./fullpage";
import start from "./start";

export default function showInitialModeSelector() {
  const modeSelector = new ui.GscapeFullPageSelector()
  modeSelector.title = 'How do you want to use sparqling?'
  modeSelector.options = [
    {
      name: 'Standard',
      description: 'Use the ontology graph and our suggestions to build your query',
      icon: sparqlingIcon,
      id: 'standard'
    },
    {
      name: 'Full Page',
      description: 'You do not need to know the ontology graph. Start from a class and proceed using our suggestions.',
      icon: ui.icons.enterFullscreen,
      id: 'full-page'
    },
  ]

  modeSelector.onOptionSelection = (optionId: string) => {
    if (optionId === 'full-page') {
      start().then(_ => {
        console.log('done')
        startFullpage()
      })
      
    } else {
      (getGscape().widgets.get(ui.WidgetEnum.INITIAL_RENDERER_SELECTOR) as any).show()
    }
  }

  getGscape().container.appendChild(modeSelector)
}