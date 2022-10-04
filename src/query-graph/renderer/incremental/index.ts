import { EntityTypeEnum } from '../../../api/swagger'
import { getActiveElement, HIGHLIGHT_CLASS } from '../../../model'
import { cy } from '../cy'
import SparqlingIncrementalRendererState from './incremental-renderer'

export { SparqlingIncrementalRendererState }

let onClassSelectionCallback = (classIri: string) => { }
let onObjectPropertySelectionCallback = (objectPropertyIri: string, relatedClassiri: string, isDirect: boolean) => { }

cy.on('dbltap', `node.highlighted[type = "class"]`, (evt) => {
  // cy.$(`.${HIGHLIGHT_CLASS}`).remove()
  console.log(evt.target)
})

export function onIncrementalClassSelection(callback: (classIri: string) => void) {
  onClassSelectionCallback = callback
}

export function onIncrementalObjectPropertySelection(callback: (objectPropertyIri: string, relatedClassiri: string, isDirect: boolean) => void) {
  onObjectPropertySelectionCallback = callback
}


export function addClassSuggestion(classIri: string) {
  const activeGraphElement = getActiveElement()?.graphElement

  if (activeGraphElement?.id) {
    const activeClass = cy.$id(activeGraphElement.id)
    if (activeClass.nonempty()) {
      const newClassSuggestionNode = cy.add({
        data: {
          iri: classIri,
          type: EntityTypeEnum.Class,
          displayed_name: classIri,
        },
        classes: HIGHLIGHT_CLASS
      })

      cy.add({
        data: {
          source: activeGraphElement.id,
          target: newClassSuggestionNode.id(),
        }
      })
    }
  }
}

export function addObjectPropertySuggestion(objectPropertyIri: string, relatedClassIri: string, isDirect = true) {

}

export function addDataPropertySuggestion(dataPropertyIri: string) {

}