import { Grapholscape, Type } from 'grapholscape'
import { CollectionReturnValue, Core } from 'cytoscape'

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
  let sparqlingSelectedNode: CollectionReturnValue = gscape.renderer.cy.$('.sparqling-selected')
  if (sparqlingSelectedNode.empty())
    return false
  else {
    const sparqlingSelectedIri = sparqlingSelectedNode.first().data().iri
    return sparqlingSelectedIri.full === iri || sparqlingSelectedIri.prefixed === iri
  }
}