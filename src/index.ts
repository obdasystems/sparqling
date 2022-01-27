import cytoscape, { CollectionReturnValue, StylesheetStyle } from 'cytoscape'
import { fullGrapholscape, Type } from 'grapholscape'
import { QueryGraphApi, StandaloneApi } from './api/swagger/api'
import { Highlights, QueryGraph } from './api/swagger/models'
import { grapholscape as gscapeContainer } from './get-container'
import * as ontologyGraph from './ontology-graph/ontology-graph'
import QueryManager from './query-graph'
//import { getHighlights, getQueryGraphNode, putQueryGraphNodeDataProperty, putQueryGraphNodeObjectProperty } from './api/api_stub'
import sparqlingStyle from './style/style'
import { EntityTypeEnum } from './api/swagger/models'

const { CONCEPT, OBJECT_PROPERTY, DATA_PROPERTY } = Type

export default async function sparqling(sparqlingContainer: HTMLDivElement, file: string | File, isStandalone?: boolean) {
  //for (const key in containers) { sparqlingContainer.appendChild(containers[key]) }
  sparqlingContainer.appendChild(gscapeContainer)
  const gscape = await fullGrapholscape(file, gscapeContainer, { owl_translator: false })
  ontologyGraph.init(gscape)
  const queryManager = new QueryManager(gscape)

  const qgApi = new QueryGraphApi()

  if (isStandalone) {
    if (typeof file === 'string')
      file = new File([file], `${gscape.ontology.name}-from-string.graphol`)

    new StandaloneApi().standaloneOntologyUploadPost(file as File)
  }

  gscape.showDiagram(0)
  addStylesheet(gscape.renderer.cy, sparqlingStyle)
  gscape.onDiagramChange(() => addStylesheet(gscape.renderer.cy, sparqlingStyle))
  gscape.onRendererChange(() => addStylesheet(gscape.renderer.cy, sparqlingStyle))
  // gscape.onBackgroundClick(() => resetHighlights(gscape.renderer.cy))
  gscape.onThemeChange(() => addStylesheet(gscape.renderer.cy, sparqlingStyle))
  gscape.onLanguageChange((newLanguage: string) => queryManager.setLanguage(newLanguage))
  gscape.onEntityNameTypeChange((newNameType: string) => {
    queryManager.setDisplayedNameType(newNameType, gscape.languages.selected)
  })

  queryManager.setDisplayedNameType(gscape.actualEntityNameType, gscape.languages.selected)
  let lastObjProperty: cytoscape.CollectionReturnValue

  gscape.onEntitySelection(async (cyEntity: CollectionReturnValue) => {
    let clickedIRI: string = cyEntity.data('iri').fullIri
    let newQueryGraph: QueryGraph

    const iriInQueryGraph = queryManager.qg ? queryManager.getGraphElementByIRI(clickedIRI) : null
    const selectedGraphNode = queryManager.selectedGraphNode
    const isIriHighlighted = ontologyGraph.isHighlighted(clickedIRI)

    switch (cyEntity.data('type')) {
      case OBJECT_PROPERTY:
        lastObjProperty = cyEntity
        if (queryManager.selectedGraphNode) {
          ontologyGraph.findNextClassFromObjProperty(cyEntity).then(result => {
            lastObjProperty['direct'] = result.objPropertyFromApi.direct
            gscape.centerOnNode(result.connectedClass.id(), 1.8)
          })
            .finally(() => cyEntity.unselect())
        }
        break

      case CONCEPT:
        /**
         * if it's not the first click, 
         * the class is not highlighted, 
         * it's not connected to a objectProperty 
         * and it's not already in the queryGraph, then skip this click
         */ 
        if (queryManager.qg?.graph && !isIriHighlighted && !lastObjProperty && !iriInQueryGraph) {
          //cyEntity.unselect()
          console.log('selection ignored for class '+ clickedIRI)
          return
        }
        
        if (clickedIRI !== selectedGraphNode?.entities[0].iri) {
          try {
            if (lastObjProperty) {
              newQueryGraph = (await qgApi.putQueryGraphObjectProperty(
                queryManager.qg, "", lastObjProperty.data('iri').fullIri, clickedIRI,
                lastObjProperty['direct'],
                selectedGraphNode.id
              )).data

            } else if (queryManager.qg?.graph && iriInQueryGraph && isIriHighlighted) {
              newQueryGraph = (await qgApi.putQueryGraphClass(
                queryManager.qg, '',
                clickedIRI,
                selectedGraphNode.id)).data
            } else
              newQueryGraph = (await qgApi.getQueryGraph(clickedIRI)).data

            queryManager.qg = newQueryGraph
          } catch (error) { console.error(error) }
        }

        queryManager.selectGraphElement(clickedIRI)
        ontologyGraph.resetHighlights()
        ontologyGraph.highlightSuggestions(clickedIRI)
        lastObjProperty = null
        break

      case DATA_PROPERTY:
        if (!isIriHighlighted) {
          cyEntity.unselect()
          return
        }

        if (queryManager.selectedGraphNode?.entities[0].type === EntityTypeEnum.Class) {
          queryManager.qg = (await qgApi.putQueryGraphDataProperty(
            queryManager.qg, '', clickedIRI, queryManager.selectedGraphNode.id
          )).data
          
          // select the current selected class on the ontology, prevent from selecting the attribute
          gscape.selectEntityOccurrences(queryManager.selectedGraphNode?.entities[0].iri)
        }
        lastObjProperty = null
        break
    }
  })

  function addStylesheet(cy: any, stylesheet: StylesheetStyle[]) {
    stylesheet.forEach( styleObj => {
      cy.style().selector(styleObj.selector).style(styleObj.style)
    })
  }
}