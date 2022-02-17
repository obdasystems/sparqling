import { Grapholscape, Type } from 'grapholscape'
import { Core } from 'cytoscape'

let gscape: Grapholscape

export default () => gscape

export function setGrapholscapeInstance(grapholscape: Grapholscape) {
  gscape = grapholscape

  function setHandlers(cy: Core) {
    // [diplayed_name] select only nodes with a defined displayed name, 
    // avoid fake nodes (for inverse/nonInverse functional obj properties)
    const objPropertiesSelector = `[displayed_name][type = "${Type.OBJECT_PROPERTY}"]`
    cy.on('mouseover', objPropertiesSelector, e => console.log(e.target))
    cy.on('mouseout', objPropertiesSelector, e => console.log(e.target))
  }
}

export function clearSelected() {
  gscape.ontology.diagrams.forEach((diagram: any) => {
    diagram.unselectAll()
  })
}

export function isIriSelected(iri: string) {
  let sparqlingSelectedIri = gscape.renderer.cy.$('.sparqling-selected').data().iri
  return sparqlingSelectedIri.full === iri || sparqlingSelectedIri.prefixed === iri
}