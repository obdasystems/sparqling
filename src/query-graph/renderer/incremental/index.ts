import { Collection, EdgeCollection, EdgeSingular } from 'cytoscape'
import { GrapholTypesEnum } from 'grapholscape'
import { FADED_CLASS } from '../../../model'
import { cy } from '../cy'
import SparqlingIncrementalRendererState from './incremental-renderer'

export { SparqlingIncrementalRendererState }

let onClassSelectionCallback = (classIri: string) => { }
let onDataPropertySelectionCallback = (dataPropertyIri: string) => { }
let onObjectPropertySelectionCallback = (objectPropertyIri: string, relatedClassiri: string, isDirect: boolean) => { }

cy.on('dbltap', `[iri][?isSuggestion]`, (evt) => {
  if (evt.target) {
    switch (evt.target.data().type) {
      case GrapholTypesEnum.CLASS:
        const connectedObjectProperty: EdgeSingular | undefined = evt.target.connectedEdges(`[type = "${GrapholTypesEnum.OBJECT_PROPERTY}"]`).first()
        if (connectedObjectProperty?.nonempty()) {
          let isDirect = true
          if (connectedObjectProperty.target() !== evt.target) {
            isDirect = false
          }
          onObjectPropertySelectionCallback(
            connectedObjectProperty.data().iri,
            evt.target.data().iri,
            isDirect
          )
        } else {
          onClassSelectionCallback(evt.target.data().iri)
        }
        
        break

      case GrapholTypesEnum.DATA_PROPERTY:
        onDataPropertySelectionCallback(evt.target.data().iri)
        break

      case GrapholTypesEnum.OBJECT_PROPERTY:
        const relatedClass = evt.target.connectedNodes('[?isSuggestion]').first()
        let isDirect = true
        if (evt.target.target() !== relatedClass) {
          isDirect = false
        }
        onObjectPropertySelectionCallback(evt.target.data().iri, relatedClass.data().iri, isDirect)
    }
  }

})

cy.on('mouseover', '[?isSuggestion]', evt => {
  if (evt.target) {
    if (evt.target.isNode())
      evt.target.closedNeighborhood('[?isSuggestion]')?.removeClass(FADED_CLASS)
    else
      evt.target.union(evt.target.connectedNodes('[?isSuggestion]'))?.removeClass(FADED_CLASS)
  }
})

cy.on('mouseout', '[?isSuggestion]', evt => {
  if (evt.target.isNode())
    evt.target.closedNeighborhood('[?isSuggestion]')?.addClass(FADED_CLASS)
  else
    evt.target.union(evt.target.connectedNodes('[?isSuggestion]'))?.addClass(FADED_CLASS)
})

export function onIncrementalClassSelection(callback: (classIri: string) => void) {
  onClassSelectionCallback = callback
}

export function onIncrementalDataPropertySelection(callback: (dataPropertyIri: string) => void) {
  onDataPropertySelectionCallback = callback
}

export function onIncrementalObjectPropertySelection(callback: (objectPropertyIri: string, relatedClassiri: string, isDirect: boolean) => void) {
  onObjectPropertySelectionCallback = callback
}

export function resetSuggestions() {
  cy.elements('[?isSuggestion]').remove()
  cy.elements().unlock()
}