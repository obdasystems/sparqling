import { AnnotationsKind, GrapholTypesEnum } from "grapholscape"
import { Branch } from "../api/swagger"
import { getActualHighlights, isFullPageActive } from "../model"
import { getEntityOccurrence, getGscape } from '../ontology-graph'
import getPrefixedIri from "../util/get-prefixed-iri"
import { highlightsList } from "../widgets"
import { handleEntitySelection, handleObjectPropertySelection } from "./og-handlers"
import addAnnotation from "./annotations-handlers"

highlightsList.onSuggestionLocalization((entityIri) => {
  if (!isFullPageActive())
    getGscape().centerOnEntity(entityIri)
})

highlightsList.onSuggestionAddToQuery((entityIri, entityType, relatedClass) => {
  switch (entityType) {
    case GrapholTypesEnum.CLASS:
    case GrapholTypesEnum.DATA_PROPERTY:
      const entityOccurrence = getEntityOccurrence(entityIri)

      if (entityOccurrence)
        handleEntitySelection(entityIri, entityType, entityOccurrence)
      break

    case GrapholTypesEnum.OBJECT_PROPERTY:
      if (relatedClass) {
        const objectPropertyBranch = getActualHighlights()?.objectProperties?.find((b: Branch) => {
          if (b.objectPropertyIRI)
            return b.objectPropertyIRI === entityIri || getPrefixedIri(b.objectPropertyIRI) === entityIri
        })
        const relatedClassOccurrence = getEntityOccurrence(relatedClass)
        if (objectPropertyBranch && relatedClassOccurrence) {
          handleObjectPropertySelection(objectPropertyBranch, relatedClassOccurrence)
        }
      }
  }
})

highlightsList.onAddLabel(() => addAnnotation(AnnotationsKind.label))
highlightsList.onAddComment(() => addAnnotation(AnnotationsKind.comment))