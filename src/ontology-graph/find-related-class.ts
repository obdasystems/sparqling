import { CollectionReturnValue } from "cytoscape"
import { getActualHighlights } from "./highlights"
import { Branch } from "../api/swagger"
import getGscape from "./get-gscape"
import { listSelectionDialog, relatedClassDialog } from "../widgets"
import { classSelectDialogTitle } from "../widgets/assets/texts"
import EventPosition from "../util/event-position"
import { getSelectedGraphElement } from "../query-body"
import * as GEUtility from "../util/graph-element-utility"
import { isHighlighted } from "./highlights"

let _onRelatedClassSelection = (objectProperty: Branch, relatedClass: CollectionReturnValue) => { }

export function findNextClassFromObjProperty(objProperty: CollectionReturnValue):
  Promise<{ objPropertyFromApi: any, connectedClass: CollectionReturnValue }> {
  const actualHighlights = getActualHighlights()
  if (!actualHighlights) return
  const gscape = getGscape()
  let result: { objPropertyFromApi: any; connectedClass: CollectionReturnValue } = {
    objPropertyFromApi: undefined,
    connectedClass: undefined
  }

  result.objPropertyFromApi = actualHighlights.objectProperties.find((o: Branch) =>
    gscape.ontology.checkEntityIri(objProperty, o.objectPropertyIRI)
  )

  return new Promise((resolve, reject) => {
    if (!result.objPropertyFromApi.relatedClasses) reject()

    if (result.objPropertyFromApi.relatedClasses.length === 1) {
      result.connectedClass = gscape.ontology.getEntityOccurrences(
        result.objPropertyFromApi.relatedClasses[0])[0] as CollectionReturnValue

      result.connectedClass.selectify()
      resolve(result)
    } else {
      listSelectionDialog.title = classSelectDialogTitle()
      // Use prefixed iri if possible, full iri as fallback
      listSelectionDialog.list = result.objPropertyFromApi.relatedClasses.map((iri: string) => {
        return gscape.ontology.destructureIri(iri)
          ? gscape.ontology.destructureIri(iri).prefixed
          : iri
      })
      //listSelectionDialog.show()
      listSelectionDialog.onSelection((iri: string) => {
        result.connectedClass = (gscape.ontology.getEntityOccurrences(iri)[0] as CollectionReturnValue)
        result.connectedClass.selectify()
        resolve(result)
        listSelectionDialog.hide()
      })
    }
  })
}


export function showRelatedClassesWidget(objProperty: CollectionReturnValue, position: EventPosition) {
  const actualHighlights = getActualHighlights()
  if (!actualHighlights || !isHighlighted(objProperty.data('iri').fullIri)) return
  const gscape = getGscape()

  // let result: { objPropertyFromApi: Branch; connectedClass: CollectionReturnValue } = {
  //   objPropertyFromApi: undefined,
  //   connectedClass: undefined
  // }

  let objPropertyFromApi = actualHighlights.objectProperties.find((o: Branch) =>
    gscape.ontology.checkEntityIri(objProperty, o.objectPropertyIRI)
  )

  if (!objPropertyFromApi.relatedClasses || objPropertyFromApi.relatedClasses.length <= 0) {
    return
  }

  //listSelectionDialog.title = classSelectDialogTitle()
  // Use prefixed iri if possible, full iri as fallback
  relatedClassDialog.list = objPropertyFromApi.relatedClasses.map((iri: string) => {
    return gscape.ontology.destructureIri(iri)
      ? gscape.ontology.destructureIri(iri).prefixed
      : iri
  })

  relatedClassDialog.class = GEUtility.getPrefixedIri(getSelectedGraphElement()) || GEUtility.getIri(getSelectedGraphElement())
  relatedClassDialog.objProperty = objProperty.data('iri').prefixed
  relatedClassDialog.show(position)
  relatedClassDialog.onSelection((iri: string) => {
    try {
      let connectedClass = (gscape.ontology.getEntityOccurrences(iri)[0] as CollectionReturnValue)
      connectedClass.selectify()
      relatedClassDialog.hide()
      _onRelatedClassSelection(objPropertyFromApi, connectedClass)
    } catch (e) {console.error(e)}
  })
}

export function hideRelatedClassesWidget() {
  relatedClassDialog.list = []
  relatedClassDialog.hide()
}

export function onRelatedClassSelection(callback: (objectProperty: Branch, relatedClass: CollectionReturnValue) => void) {
  _onRelatedClassSelection = callback
}