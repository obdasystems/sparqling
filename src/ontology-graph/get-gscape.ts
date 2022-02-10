import { StylesheetStyle } from 'cytoscape'
import { Grapholscape } from 'grapholscape'
import sparqlingStyle from './style'

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