import { RendererStatesEnum, setGraphEventHandlers, ui } from 'grapholscape';
import * as model from '../model'
import { getGscape } from '../ontology-graph';
import { SparqlingIncrementalRendererState, cy as queryGraphCy } from '../query-graph/renderer';
import { bgpContainer } from '../util/get-container';
import addSuggestionsInIncremental from './add-suggestions-in-incremental';

export { addSuggestionsInIncremental }

const getDiagramSelector = () => getGscape().widgets.get(ui.WidgetEnum.DIAGRAM_SELECTOR) as unknown as ui.IBaseMixin
const getEntitySelector = () => getGscape().widgets.get(ui.WidgetEnum.ENTITY_SELECTOR) as unknown as ui.IBaseMixin

export function startIncremental() {
  model.setIncremental(true)

  const incrementalRendererState = new SparqlingIncrementalRendererState(queryGraphCy)
  const grapholscape = getGscape()
  grapholscape.setRenderer(incrementalRendererState)
  getEntitySelector().hide()
  getDiagramSelector().hide()

  const activeElement = model.getActiveElement()
  if (activeElement) {
    if (activeElement.graphElement.id)
      incrementalRendererState.activeClass = queryGraphCy.$id(activeElement.graphElement.id)
    addSuggestionsInIncremental(activeElement.iri.fullIri)
  }
}

export function stopIncremental(previousRendererState: RendererStatesEnum) {
  getDiagramSelector().show()
  getEntitySelector().hide()

  if (previousRendererState === RendererStatesEnum.INCREMENTAL) {
    queryGraphCy.unmount()
    queryGraphCy.mount(bgpContainer)
    queryGraphCy.resize()
    queryGraphCy.fit()
    
    const grapholscape = getGscape()
    grapholscape.renderer.mount()
    if (grapholscape.renderer.diagram) {
      setGraphEventHandlers(grapholscape.renderer.diagram, grapholscape.lifecycle, grapholscape.ontology)
    }
  }
}