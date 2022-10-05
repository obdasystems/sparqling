import { GrapholTypesEnum } from 'grapholscape'
import { FADED_CLASS } from '../../../model'
import { cy } from '../cy'
import SparqlingIncrementalRendererState from './incremental-renderer'

export { SparqlingIncrementalRendererState }

let onClassSelectionCallback = (classIri: string) => { }
let onObjectPropertySelectionCallback = (objectPropertyIri: string, relatedClassiri: string, isDirect: boolean) => { }

cy.on('dbltap', `node[?isSuggestion]`, (evt) => {
  if (evt.target) {
    switch(evt.target.data().type) {
      case GrapholTypesEnum.CLASS:
        onClassSelectionCallback(evt.target.data().iri)
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

export function onIncrementalObjectPropertySelection(callback: (objectPropertyIri: string, relatedClassiri: string, isDirect: boolean) => void) {
  onObjectPropertySelectionCallback = callback
}

export function resetSuggestions() {
  cy.elements('[?isSuggestion]').remove()
  cy.elements().unlock()
}