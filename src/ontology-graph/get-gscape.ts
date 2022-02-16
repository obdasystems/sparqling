import { Grapholscape } from 'grapholscape'

let gscape: Grapholscape

export default () => gscape

export function setGrapholscapeInstance(grapholscape: Grapholscape) {
  gscape = grapholscape
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