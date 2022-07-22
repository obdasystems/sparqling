import { CollectionReturnValue } from "cytoscape"
import { getActualHighlights } from "./highlights"
import { Branch } from "../api/swagger"
import getGscape from "./get-gscape"
import { relatedClassDialog } from "../widgets"
import { classSelectDialogTitle } from "../widgets/assets/texts"
import EventPosition from "../util/event-position"
import { getSelectedGraphElement } from "../model"
import * as GEUtility from "../util/graph-element-utility"
import { isHighlighted } from "./highlights"
import { Iri } from "grapholscape"

let _onRelatedClassSelection = (objectProperty: Branch, relatedClass: CollectionReturnValue) => { }

// export function findNextClassFromObjProperty(objProperty: CollectionReturnValue):
//   Promise<{ objPropertyFromApi?: Branch, connectedClass?: CollectionReturnValue } | undefined> {

//   const actualHighlights = getActualHighlights()
//   if (!actualHighlights) return new Promise((resolve) => { resolve(undefined) })
//   const gscape = getGscape()
//   let result: { objPropertyFromApi?: Branch; connectedClass?: CollectionReturnValue } = {
//     objPropertyFromApi: undefined,
//     connectedClass: undefined
//   }

//   const grapholObjectProperty = gscape.ontology.getEntity(objProperty.data('iri'))

//   result.objPropertyFromApi = actualHighlights.objectProperties?.find((o: Branch) => {
//     if (o?.objectPropertyIRI)
//       gscape.ontology.checkEntityIri(objProperty, o.objectPropertyIRI)
//   })

//   return new Promise((resolve, reject) => {
//     if (!result.objPropertyFromApi?.relatedClasses) reject()

//     if (result.objPropertyFromApi?.relatedClasses?.length === 1) {
//       result.connectedClass = gscape.ontology.getEntityOccurrences(
//         result.objPropertyFromApi.relatedClasses[0])[0] as CollectionReturnValue

//       result.connectedClass.selectify()
//       resolve(result)
//     } else {
//       listSelectionDialog.title = classSelectDialogTitle()
//       // Use prefixed iri if possible, full iri as fallback
//       listSelectionDialog.list = result.objPropertyFromApi?.relatedClasses?.map((iri: string) => {
//         return gscape.ontology.destructureIri(iri)
//           ? gscape.ontology.destructureIri(iri)?.prefixed
//           : iri
//       })
//       //listSelectionDialog.show()
//       listSelectionDialog.onSelection((iri: string) => {
//         result.connectedClass = (gscape.ontology.getEntityOccurrences(iri)[0] as CollectionReturnValue)
//         result.connectedClass.selectify()
//         resolve(result)
//         listSelectionDialog.hide()
//       })
//     }
//   })
// }


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

  const selectedGraphElement = getSelectedGraphElement()
  if (selectedGraphElement) {
    relatedClassDialog.class = GEUtility.getPrefixedIri(selectedGraphElement) || GEUtility.getIri(selectedGraphElement)

    relatedClassDialog.objProperty = objPropertyEntity.iri.prefixed
    relatedClassDialog.reverseArrow = !objPropertyFromApi.direct
    relatedClassDialog.showInPosition(position)
    relatedClassDialog.onSelection = (selectedClassIri: string) => {
      try {
        if (objPropertyFromApi) {
          // Prefer instance in actual diagram, first one as fallback
          const selectedClassEntity = gscape.ontology.getEntity(selectedClassIri)
          const selectedClassOccurrences = selectedClassEntity.occurrences.get(gscape.renderState)
          if (selectedClassOccurrences) {
            const connectedClass = 
              selectedClassOccurrences?.find(occurrence => occurrence.diagramId === gscape.diagramId) ||
              selectedClassOccurrences[0]

            const connectedClassCyElement = gscape.ontology
              .getDiagram(connectedClass.diagramId)
              ?.representations.get(gscape.renderState)
              ?.cy.$id(connectedClass.elementId)
              
              
            relatedClassDialog.hide()

            if (connectedClassCyElement)
              _onRelatedClassSelection(objPropertyFromApi, connectedClassCyElement)
          }
        }
      } catch (e) { console.error(e) }
    }
  }
}

export function hideRelatedClassesWidget() {
  relatedClassDialog.list = []
  relatedClassDialog.hide()
}

export function onRelatedClassSelection(callback: (objectProperty: Branch, relatedClass: CollectionReturnValue) => void) {
  _onRelatedClassSelection = callback
}