import * as model from '../model'
import * as ontologyGraph from '../ontology-graph'
import { getIris } from '../util/graph-element-utility'
import { highlightsList } from '../widgets'

export function performHighlights(iri: string): void
export function performHighlights(iri: string[]): void
export function performHighlights(iri: string | string[]) {
  const _iris = typeof iri === 'string' ? [iri] : iri
  // Highlight suggestions for the actual clicked iri (might be a child node)
  clearHighlights()
  for (let iri of _iris) {
    model.computeHighlights(iri).then(highlights => {
      highlightsList.allHighlights = model.transformHighlightsToPrefixedIRIs()
      if (!model.isFullPageActive()) {
        const activeElement = model.getActiveElement()
        let activeElementIris: string[] = []

        if (activeElement)
          activeElementIris = getIris(activeElement?.graphElement)

        highlights?.classes?.forEach((iri: string) => {
          if (!activeElement || !activeElementIris.includes(iri))
            ontologyGraph.highlightIRI(iri)
        })
        highlights?.dataProperties?.forEach((iri: string) => ontologyGraph.highlightIRI(iri))
        highlights?.objectProperties?.forEach((o: any) => ontologyGraph.highlightIRI(o.objectPropertyIRI))

        ontologyGraph.fadeEntitiesNotHighlighted()
      }
    })
  }
}

export function clearHighlights() {
  model.clearHighlights()
  if (!model.isFullPageActive())
    ontologyGraph.resetHighlights()

  highlightsList.allHighlights = undefined
  performHighlightsEmptyUnfolding()
}

export function refreshHighlights() {
  let activeElement = model.getActiveElement()
  if (activeElement?.graphElement) {
    performHighlights(getIris(activeElement.graphElement))
  }
}

export function performHighlightsEmptyUnfolding() {
  for (const mwsEntity of model.getEmptyUnfoldingEntities()) {
    ontologyGraph.fadeEntity(mwsEntity.entityIRI)
  }
}