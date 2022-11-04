import { GrapholTypesEnum } from "grapholscape"
import { Branch, EntityTypeEnum } from "../api/swagger"
import { getActualHighlights, isFullPageActive } from "../model"
import { getEntityOccurrence, getGscape } from '../ontology-graph'
import getPrefixedIri from "../util/get-prefixed-iri"
import { highlightsList } from "../widgets"
import { handleEntitySelection, handleObjectPropertySelection } from "./og-handlers"

highlightsList.onSuggestionLocalization((entityIri) => {
  if (!isFullPageActive())
    getGscape().centerOnEntity(entityIri)
})

highlightsList.onSuggestionAddToQuery((entityIri, entityType, relatedClass) => {
  switch (entityType) {
    case EntityTypeEnum.Class:
    case EntityTypeEnum.DataProperty:
      const grapholEntityType = entityType === EntityTypeEnum.Class ? GrapholTypesEnum.CLASS : GrapholTypesEnum.DATA_PROPERTY
      const entityOccurrence = getEntityOccurrence(entityIri)

      if (entityOccurrence)
        handleEntitySelection(getGscape().ontology.prefixedToFullIri(entityIri) || entityIri, grapholEntityType, entityOccurrence)
      break

    case EntityTypeEnum.ObjectProperty:
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