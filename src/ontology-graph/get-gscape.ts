import { Grapholscape } from "grapholscape"

let gscape: Grapholscape

export default () => gscape

export function setGrapholscapeInstance(grapholscape: Grapholscape) {
  gscape = grapholscape
}

export function clearSelected() {
  for (const diagram of gscape.ontology.diagrams) {
    for (const [_, diagramRepresentation] of diagram.representations) {
      diagramRepresentation.cy.elements().unselect()
    }
  }
}

export function isIriSelected(iri: string) {
  let sparqlingSelectedNode = gscape.renderer?.cy?.$('.sparqling-selected')
  if (!sparqlingSelectedNode || sparqlingSelectedNode?.empty())
    return false
  else {
    const sparqlingSelectedIri = sparqlingSelectedNode.first().data().iri
    return sparqlingSelectedIri.full === iri || sparqlingSelectedIri.prefixed === iri
  }
}