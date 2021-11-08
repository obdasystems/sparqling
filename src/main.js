import GrapholScape from 'grapholscape'
import Ontology from 'grapholscape/src/model/ontology';
import {getHighlights} from './api/api_stub'
import highlightStyle from './highlight-style';

export default function useGrapholscape(file) {
  document.getElementById('home').style.display = 'none';
  grapholscape_container.style.display = 'block';

  let g = new GrapholScape(file, grapholscape_container).then( grapholscape => {
    grapholscape.showDiagram(0)

    sparqling(grapholscape)
  })
}


function sparqling( grapholscape ) {
  let cy = grapholscape.view.renderer.cy

  
  /**
   * @type {Ontology}
   */
  let ontology = grapholscape.ontology

  cy.on('select', 'node', e => {
    let clickedIRI = e.target.data('iri').full_iri
    let highlights
    console.log(clickedIRI)
    try{
      highlights = getHighlights(ontology.name, ontology.version, clickedIRI)
    } catch {
      grapholscape.view.showDialog('warning', 'Wrong entity')
    }

    highlights?.selectedClasses.forEach( iri => selectIRI(iri))
    highlights?.highlightedEntities.classes.forEach(iri => highlightIRI(iri))
    highlights?.highlightedEntities.dataProperties.forEach( iri => highlightIRI(iri))
    highlights?.highlightedEntities.objectProperties.map( o => o.objectPropertyIRI).forEach(iri => {
      highlightIRI(iri)
    })
    cy.$('.highlighted').style(highlightStyle)
  })


  function highlightIRI(iri) {
    //let diagramID = grapholscape.view.actual_diagram_id

    let nodes = ontology.getOccurrences(iri)
    nodes.forEach( n => { cy.getElementById(n.data.id).addClass('highlighted') })
  }

  function selectIRI(iri) {
    //let diagramID = grapholscape.view.actual_diagram_id

    let nodes = ontology.getOccurrences(iri)

    nodes.forEach( n => cy.getElementById(n.data.id).select())
  }
}