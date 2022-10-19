import { ui } from "grapholscape";
import { isFullPageActive, setFullPage } from "../model";
import { getGscape } from "../ontology-graph";
import sparqlingIcon from "../widgets/assets/sparqling-icon";
import { startFullpage, stopFullpage } from "./fullpage";
import start from "./start";

export default function showInitialModeSelector() {
  const modeSelector = new ui.GscapeFullPageSelector()
  modeSelector.title = 'How do you want to build your query?'
  modeSelector.options = [
    {
      name: 'Standard',
      // description: 'Use the ontology graph and our suggestions to build your query',
      icon: sparqlingIcon,
      id: 'standard'
    },
    {
      name: 'Query Path',
      // description: 'You do not need to know the ontology graph. Start from a class and proceed using our suggestions.',
      icon: ui.icons.enterFullscreen,
      id: 'full-page'
    },
  ]

  modeSelector.onOptionSelection = (optionId: string) => {
    if (optionId === 'full-page') {
      start().then(_ => {
        startFullpage()
      })
      getGscape().renderer.stopRendering()
      
    } else {
      if (isFullPageActive())
        stopFullpage();
      (getGscape().widgets.get(ui.WidgetEnum.INITIAL_RENDERER_SELECTOR) as any).show()
    }
  }

  getGscape().container.appendChild(modeSelector)
}