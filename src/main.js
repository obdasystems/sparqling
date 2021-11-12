import { fullGrapholscape as Grapholscape} from 'grapholscape'
import {getHighlights} from './api/api_stub'
import highlightStyle from './highlight-style';

export default async function useGrapholscape(file) {
  document.getElementById('home').style.display = 'none';
  grapholscape_container.style.display = 'block';

  /**
   * @type {Grapholscape}
   */
  const gs = await Grapholscape(file, grapholscape_container)
  gs.showDiagram(0)
  sparqling(gs)
}

/**
 * 
 * @param {Grapholscape} grapholscape 
 */
function sparqling( grapholscape ) {
  let cy = grapholscape.renderer.cy

  cy.style().selector('.highlighted').style(highlightStyle).update()

  let ontology = grapholscape.ontology
  let clickedIRIs = []
  let highlights = []
  console.log(ontology)

  grapholscape.onEntitySelection( entity => {
    let clickedIRI = entity.iri.prefix + entity.iri.remaining_chars
    cy.$('.highlighted').removeClass('highlighted')
    if (entity.type === 'Object Property') {
      findNextClassFromObjProperty( entity )
      return
    }

    try{
      highlights = getHighlights(ontology.name, ontology.version, clickedIRI)
    } catch {
      console.warn('wrong iri')
      return
    }
    
    clickedIRIs.push(clickedIRI)
    
    highlights.classes.forEach(iri => highlightIRI(iri))
    highlights.dataProperties.forEach( iri => highlightIRI(iri))
    highlights.objectProperties.forEach( o => highlightIRI(o.objectPropertyIRI) )
  })

  function findNextClassFromObjProperty(objProperty) {
    let objPropertyIri = objProperty.iri.prefix + objProperty.iri.remaining_chars
    let objPropertyFromApi = highlights.objectProperties.find( o => o.objectPropertyIRI === objPropertyIri)

    if (objPropertyFromApi) {
      if (objPropertyFromApi.relatedClasses.length > 1) { // TODO show popup dialog}
      } else if (objPropertyFromApi.relatedClasses.length === 1) {
        let connectedClasses = cy.$id(objProperty.id).neighborhood('node').neighborhood('node.concept')
        for (const i in connectedClasses) {
          let classPrefixedIri = connectedClasses[i].data('iri').prefix + connectedClasses[i].data('iri').remaining_chars
          if ( classPrefixedIri === objPropertyFromApi.relatedClasses[0] ) {
            connectedClasses[i].select()
            break
          }
        }
      }
    }
  }

  function highlightIRI(iri) {
    //let diagramID = grapholscape.view.actual_diagram_id
    let nodes = ontology.getEntityOccurrences(iri)
    nodes.forEach( n => cy.getElementById(n.data.id).addClass('highlighted') )
  }

  function selectIRI(iri) {
    //let diagramID = grapholscape.view.actual_diagram_id

    let nodes = ontology.getOccurrences(iri)

    nodes.forEach( n => cy.getElementById(n.data.id).select())
  }
}