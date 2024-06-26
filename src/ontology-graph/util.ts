import { Core, StylesheetStyle } from "cytoscape"
import { GrapholElement, RendererStatesEnum } from "grapholscape"
import getGscape from "./get-gscape"

/**
 * Get the entity occurrence (elementId, diagramId).
 * Prefer instance in actual diagram, pick first one in the list as fallback
 * @param entityIri the entity's IRI to look for
 */
export function getEntityOccurrence(entityIri: string): GrapholElement | undefined {
  const gscape = getGscape()
  // Prefer instance in actual diagram, first one as fallback
  const selectedClassEntity = gscape.ontology.getEntity(entityIri)

  if (selectedClassEntity) {
    // If the current representation has no occurrences, then take the original ones
    let selectedClassOccurrences =
      selectedClassEntity.occurrences.get(gscape.renderState || RendererStatesEnum.GRAPHOL) ||
      selectedClassEntity.occurrences.get(RendererStatesEnum.GRAPHOL)

    if (selectedClassOccurrences) {
      return selectedClassOccurrences?.find(occurrence => occurrence.diagramId === gscape.diagramId) ||
        selectedClassOccurrences[0]
    }
  }
}

export function addStylesheet(cy: Core, stylesheet: StylesheetStyle[]) {
  stylesheet.forEach(styleObj => {
    (cy.style() as any).selector(styleObj.selector).style(styleObj.style)
  })
}