import { getActualHighlights } from "./highlights"
import { Branch } from "../api/swagger"
import getGscape from "./get-gscape"
import { relatedClassDialog } from "../widgets"
import EventPosition from "../util/event-position"
import { isHighlighted } from "./highlights"
import { EntityOccurrence, Iri } from "grapholscape"
import { getEntityOccurrence } from "./util"
import { getActiveElement } from "../model"

let _onRelatedClassSelection = (objectProperty: Branch, relatedClass: EntityOccurrence) => { }

export function showRelatedClassesWidget(objPropertyIri: string, position: EventPosition) {
  const actualHighlights = getActualHighlights()
  if (!actualHighlights || !isHighlighted(objPropertyIri)) return
  const gscape = getGscape()

  const objPropertyEntity = gscape.ontology.getEntity(objPropertyIri)

  let objPropertyFromApi = actualHighlights.objectProperties?.find((o: Branch) => {
    if (o?.objectPropertyIRI)
      return objPropertyEntity.iri.equals(o.objectPropertyIRI)
  })

  if (!objPropertyFromApi || !objPropertyFromApi.relatedClasses || objPropertyFromApi.relatedClasses.length <= 0) {
    return
  }

  //listSelectionDialog.title = classSelectDialogTitle()
  // Use prefixed iri if possible, full iri as fallback
  relatedClassDialog.list = objPropertyFromApi.relatedClasses.map((iriValue: string) => {
    const iri = new Iri(iriValue, gscape.ontology.namespaces)
    return iri.prefixed
  })

  const activeElement = getActiveElement()
  if (activeElement) {
    relatedClassDialog.class = activeElement.iri.prefixed || activeElement.iri.fullIri

    relatedClassDialog.objProperty = objPropertyEntity.iri.prefixed
    relatedClassDialog.reverseArrow = !objPropertyFromApi.direct
    relatedClassDialog.showInPosition(position)
    relatedClassDialog.onSelection = (selectedClassIri: string) => {
      try {
        if (objPropertyFromApi) {
          const relatedClassOccurrence = getEntityOccurrence(selectedClassIri)

          if (relatedClassOccurrence)
            _onRelatedClassSelection(objPropertyFromApi, relatedClassOccurrence)
        }
      } catch (e) { console.error(e) }
    }
  }
}

export function hideRelatedClassesWidget() {
  relatedClassDialog.list = []
  relatedClassDialog.hide()
}

export function onRelatedClassSelection(callback: (objectProperty: Branch, relatedClass: EntityOccurrence) => void) {
  _onRelatedClassSelection = callback
}