import { StylesheetStyle } from "cytoscape"
import { EntityOccurrence } from "grapholscape"
import getGscape from "./get-gscape"

/**
 * Get the entity occurrence (elementId, diagramId).
 * Prefer instance in actual diagram, pick first one in the list as fallback
 * @param entityIri the entity's IRI to look for
 */
export function getEntityOccurrence(entityIri: string): EntityOccurrence | undefined {
  const gscape = getGscape()
  // Prefer instance in actual diagram, first one as fallback
  const selectedClassEntity = gscape.ontology.getEntity(entityIri)
  const selectedClassOccurrences = selectedClassEntity.occurrences.get(gscape.renderState)
  if (selectedClassOccurrences) {
    return selectedClassOccurrences?.find(occurrence => occurrence.diagramId === gscape.diagramId) ||
      selectedClassOccurrences[0]
  }
}

export function addStylesheet(cy: any, stylesheet: StylesheetStyle[]) {
  stylesheet.forEach(styleObj => {
    cy.style().selector(styleObj.selector).style(styleObj.style)
  })
}