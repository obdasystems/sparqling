import { fullGrapholscape } from 'grapholscape'
//import { getHighlights, getQueryGraphNode, putQueryGraphNodeDataProperty, putQueryGraphNodeObjectProperty } from './api/api_stub'
import highlightStyle from './style/highlight-style'
import QueryGraphRenderer from './query-graph/renderer'
import { QueryGraphApi, OntologyGraphApi, StandaloneApi } from './api/swagger/api'
import * as containers from './get-container'
import { fileToString } from './util'
import { QueryGraph, GraphElement} from './api/swagger/models'

export default async function sparqling(sparqlingContainer: HTMLDivElement, file: string | Blob) {
  for (const key in containers) { sparqlingContainer.appendChild(containers[key]) }

  const gscape = await fullGrapholscape(file, containers.grapholscape, { owl_translator: false })
  const qgRenderer = new QueryGraphRenderer(containers.sparqlingQueryGraph)
  
  const ogApi = new OntologyGraphApi()
  const qgApi = new QueryGraphApi()
  const soApi = new StandaloneApi()

  let qg: QueryGraph

  if (typeof file !== 'string')
    file = await fileToString(file)
  
  soApi.standaloneOntologyUploadPost(file)

  gscape.showDiagram(0)
  setHighlightedStylesheet(gscape.renderer.cy, highlightStyle)
  gscape.onDiagramChange(() => setHighlightedStylesheet(gscape.renderer.cy, highlightStyle))
  gscape.onRendererChange(() => setHighlightedStylesheet(gscape.renderer.cy, highlightStyle))
  gscape.onBackgroundClick(() => resetHighlights(gscape.renderer.cy))
  gscape.onThemeChange(() => setHighlightedStylesheet(gscape.renderer.cy, highlightStyle))

  let lastObjProperty: any
  let highlights

  gscape.onEntitySelection( async (cyEntity: any) => {
    let clickedIRI: string = cyEntity.data('iri').prefixed
    resetHighlights(gscape.renderer.cy)
    let newQueryGraph: QueryGraph

    switch (cyEntity.data('type')) {
      case '':
        lastObjProperty = cyEntity
        const connectedClass = findNextClassFromObjProperty(cyEntity)
        cyEntity.unselect()
        connectedClass.select()
        break

      case 'concept':
        /*
        if (clickedIRI !== qgRenderer.selectedGraphNode?.entity.iri) {
          try {
            if (lastObjProperty) {
              newQueryGraph = await qgApi.putQueryGraphObjectProperty(
                qg,
                qgRenderer.selectedGraphNode.entity.iri,
                lastObjProperty.data('iri').prefixed,
                clickedIRI,
                true,
                qgRenderer.selectedGraphNode.id
              )

              newQueryGraph = putQueryGraphNodeObjectProperty(null, null,
                qgRenderer.selectedGraphNode.id, // graphNodeId
                null, // sourceClassIri
                lastObjProperty.data('iri').prefixed // predicateIri
              )
            } else {
              newQueryGraph = getQueryGraphNode(null, null, clickedIRI)
            }

            qgRenderer.graph = newQueryGraph.graph
          } catch (error) { console.error(error) }
        }
        */
        qgApi.getQueryGraph(clickedIRI).then(newQueryGraph => {
          console.log(newQueryGraph)
        })
        //highlightSuggestions(clickedIRI)
        lastObjProperty = null
        break
      /*
      case 'attribute':
        if (qgRenderer.selectedGraphNode?.entity.type === 'class') {
          newQueryGraph = putQueryGraphNodeDataProperty(null, null,
            qgRenderer.selectedGraphNode.id,
            null,null)

          qgRenderer.graph = newQueryGraph.graph
        }
        lastObjProperty = null
        break
        */
    }
  })

  qgRenderer.onNodeSelect( selectedQueryGraphNode => {
    console.log(selectedQueryGraphNode.entity.iri)
    let elems = gscape.ontology
      .getEntityOccurrences(selectedQueryGraphNode.entity.iri)

    let elem = elems.find( occ => occ.data('diagram_id') === gscape.actualDiagramID)

    if (!elem) elem = elems[0]

    gscape.centerOnNode(elem.id())
  })

  /*
  function highlightSuggestions(clickedIRI) {
    try {
      highlights = getHighlights(gscape.ontology.name, gscape.ontology.version, clickedIRI)
    } catch {
      console.warn('wrong iri')
      return
    }
    console.log(highlights)
    highlights.classes.forEach(iri => highlightIRI(iri))
    highlights.dataProperties.forEach(iri => highlightIRI(iri))
    highlights.objectProperties.forEach(o => highlightIRI(o.objectPropertyIRI))
  }
*/
  function findNextClassFromObjProperty(objProperty) {
    let objPropertyFromApi = highlights.objectProperties.find(o =>
      gscape.ontology.checkEntityIri(objProperty, o.objectPropertyIRI)
    )

    if (objPropertyFromApi) {
      if (objPropertyFromApi.relatedClasses.length > 1) {
        // TODO show popup dialog
      } else if (objPropertyFromApi.relatedClasses.length === 1) {

        // if it's not and edge, connected classes are attached to domain/range
        // nodes
        let connectedClasses = objProperty.isEdge() 
          ? objProperty.connectedNodes('.concept')
          // TODO: be sure first neighborhood only select range/domain restrictions node
          : objProperty.neighborhood('node').neighborhood('node.concept')

        for (const i in connectedClasses) {
          if (connectedClasses[i].selected()) continue
          let classPrefixedIri = connectedClasses[i].data('iri').prefixed
          if (classPrefixedIri === objPropertyFromApi.relatedClasses[0]) {
            return connectedClasses[i]
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