import * as model from '../model'
import * as ontologyGraph from '../ontology-graph'
import { highlightsList } from '../widgets'

export function performHighlights(iri: string) {
  // Highlight suggestions for the actual clicked iri (might be a child node)
  model.computeHighlights(iri).then(_ => {
    highlightsList.allHighlights = model.transformHighlightsToPrefixedIRIs()
    if (!model.isFullPageActive()) {
      ontologyGraph.performHighlights(iri)
    }
  })
}

export function clearHighlights() {
  model.clearHighlights()
  if (!model.isFullPageActive())
    ontologyGraph.resetHighlights()

  highlightsList.allHighlights = undefined
}