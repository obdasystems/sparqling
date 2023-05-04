import { Grapholscape, GrapholTypesEnum, ui, util } from 'grapholscape'
import * as model from '../model'
import { hasEntityEmptyUnfolding } from '../model'
import * as ontologyGraph from '../ontology-graph'
import { getIris } from '../util/graph-element-utility'
import { highlightsList } from '../widgets'

export function performHighlights(iri: string): void
export function performHighlights(iri: string[]): void
export function performHighlights(iri: string | string[]) {
  const _iris = typeof iri === 'string' ? [iri] : iri
  // Highlight suggestions for the actual clicked iri (might be a child node)
  clearHighlights()
  highlightsList.loading = true
  for (let iri of _iris) {
    const grapholscape = ontologyGraph.getGscape()
    model.computeHighlights(iri).then(highlights => {
      highlightsList.allHighlights = {
        classes: highlights.classes?.map(iri => {
          return _getEntityViewDataUnfolding(iri, grapholscape)
        }).filter(e => e !== undefined) as ui.EntityViewDataUnfolding[] || [],

        dataProperties: highlights.dataProperties?.map(iri => {
          return _getEntityViewDataUnfolding(iri, grapholscape)
        }).filter(e => e !== undefined) as ui.EntityViewDataUnfolding[] || [],

        objectProperties: highlights.objectProperties?.map(op => {
          if (op.objectPropertyIRI) {
            const grapholEntity = grapholscape.ontology.getEntity(op.objectPropertyIRI)
            if (grapholEntity) {
              const objPropViewData = util.grapholEntityToEntityViewData(grapholEntity, grapholscape)
              return {
                entityViewData: objPropViewData,
                hasUnfolding: hasEntityEmptyUnfolding(op.objectPropertyIRI, GrapholTypesEnum.OBJECT_PROPERTY),
                connectedClasses: op.relatedClasses
                  ?.map(rc => _getEntityViewDataUnfolding(rc, grapholscape))
                  .filter(rc => rc !== undefined) as ui.EntityViewDataUnfolding[] || [],
                direct: op.direct,
              } as ui.ViewObjectPropertyUnfolding
            }
          }
        }).filter(e => e !== undefined) as ui.ViewObjectPropertyUnfolding[] || [],
      }

      highlightsList.loading = false

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

function _getEntityViewDataUnfolding(entityIri: string, grapholscape: Grapholscape) {
  const grapholEntity = grapholscape.ontology.getEntity(entityIri)
  if (grapholEntity)
    return util.getEntityViewDataUnfolding(grapholEntity, grapholscape, hasEntityEmptyUnfolding)
}