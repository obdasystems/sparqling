import { CollectionReturnValue } from "cytoscape"
import { getActualHighlights } from "./highlights"
import { Branch } from "../api/swagger/models"
import getGscape from "./get-gscape"
import { listSelectionDialog } from "../widgets"
import { classSelectDialogTitle } from "../widgets/assets/texts"

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
      listSelectionDialog.show()
      listSelectionDialog.onSelection( (iri: string) => {
        result.connectedClass = (gscape.ontology.getEntityOccurrences(iri)[0] as CollectionReturnValue)
        result.connectedClass.selectify()
        resolve(result)
        listSelectionDialog.hide()
      })
    }
  })
}