import { fullGrapholscape } from 'grapholscape'
import { getHighlights } from './api/api_stub'
import highlightStyle from './highlight-style';

export default function useGrapholscape(file) {
  document.getElementById('home').style.display = 'none';
  grapholscape_container.style.display = 'block';

  sparqling(file, grapholscape_container)
}

async function sparqling(file, container) {
  let a
  const gscape = await fullGrapholscape(file, container)
  gscape.showDiagram(0)
  setHighlightedStylesheet(gscape.renderer.cy, highlightStyle)

  gscape.onRendererChange(_ => setHighlightedStylesheet(gscape.renderer.cy, highlightStyle))
  gscape.onBackgroundClick(_ => resetHighlights(gscape.renderer.cy))
  gscape.onThemeChange(_ => setHighlightedStylesheet(gscape.renderer.cy, highlightStyle))
  let clickedIRIs = []
  let highlights = []

  gscape.onEntitySelection(entity => {
    let clickedIRI = entity.data('iri').prefixed
    console.log(clickedIRI)

    resetHighlights(gscape.renderer.cy)

    if (entity.data('type') === 'role') {
      findNextClassFromObjProperty(entity)
      return
    }

    try {
      highlights = getHighlights(gscape.ontology.name, gscape.ontology.version, clickedIRI)
    } catch {
      console.warn('wrong iri')
      return
    }

    clickedIRIs.push(clickedIRI)

    highlights.classes.forEach(iri => highlightIRI(iri))
    highlights.dataProperties.forEach(iri => highlightIRI(iri))
    highlights.objectProperties.forEach(o => highlightIRI(o.objectPropertyIRI))
  })

  function findNextClassFromObjProperty(objProperty) {
    let objPropertyFromApi = highlights.objectProperties.find(o =>
      gscape.ontology.checkEntityIri(objProperty, o.objectPropertyIRI)
    )

    if (objPropertyFromApi) {
      if (objPropertyFromApi.relatedClasses.length > 1) {
        // TODO show popup dialog
      } else if (objPropertyFromApi.relatedClasses.length === 1) {

        let connectedClasses = objProperty.isEdge() ?
          objProperty.connectedNodes('.concept') :
          objProperty.neighborhood('node').neighborhood('node.concept')

        for (const i in connectedClasses) {
          if (connectedClasses[i].selected()) continue
          let classPrefixedIri = connectedClasses[i].data('iri').prefixed
          if (classPrefixedIri === objPropertyFromApi.relatedClasses[0]) {
            gscape.ontology.diagrams.forEach(d => {
              gscape.selectEntity(classPrefixedIri, d)
            })
            break
          }
        }
      }
    }
  }

  function highlightIRI(iri) {
    //let diagramID = grapholscape.view.actual_diagram_id
    let nodes = gscape.ontology.getEntityOccurrences(iri)
    if (nodes)
      nodes.forEach(n => n.addClass('highlighted'))
  }

  function setHighlightedStylesheet(cy, style) {
    cy.style().selector('.highlighted').style(style).update()
  }

  function resetHighlights(cy) {
    cy.$('.highlighted').removeClass('highlighted')
  }
}