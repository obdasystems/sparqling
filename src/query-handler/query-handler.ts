import { CollectionReturnValue } from "cytoscape"
import { Grapholscape, Theme, Type } from "grapholscape"
import { QueryGraphApiFactory } from "../api/swagger"
import { EntityTypeEnum, GraphElement, HeadElement, QueryGraph } from "../api/swagger/models"
import { handleConceptSelection, handleDataPropertySelection, handleObjectPropertySelection } from "./handle-entity-selection"
import * as queryGraph from "../query-graph"
import * as queryHead from "../query-head"
import * as ontologyGraph from "../ontology-graph"
import { findGraphElement, getEntityType, getGraphElementByID, getGraphElementByIRI, getIri } from "../query-graph/graph-element-utility"
import { sparqlDialog } from "../widgets"
import { emptyQueryMsg } from "../widgets/assets/texts"

const { CONCEPT, OBJECT_PROPERTY, DATA_PROPERTY } = Type
let body: QueryGraph
let gscape: Grapholscape
const qgApi = QueryGraphApiFactory()

export let selectedGraphElement: GraphElement

export function init(grapholscape: Grapholscape) {
  gscape = grapholscape

  gscape.onLanguageChange((newLanguage: string) => queryGraph.setLanguage(newLanguage))
  gscape.onEntityNameTypeChange((newNameType: string) => {
    queryGraph.setDisplayedNameType(newNameType, gscape.languages.selected)
  })

  queryGraph.setDisplayedNameType(gscape.actualEntityNameType, gscape.languages.selected)
  queryGraph.setTheme(gscape.themesController.actualTheme)
  gscape.onThemeChange((newTheme: Theme) => queryGraph.setTheme(newTheme))

  gscape.onEntitySelection(async (cyEntity: CollectionReturnValue) => {
    let clickedIRI = cyEntity.data('iri').fullIri

    if (getIri(selectedGraphElement) === clickedIRI) return

    let newBody: QueryGraph = null
    switch (cyEntity.data('type')) {
      case OBJECT_PROPERTY: {
        let result = await handleObjectPropertySelection(cyEntity, selectedGraphElement)
        if (result && result.connectedClass) {
          gscape.centerOnNode(result.connectedClass.id(), 1.8)
        }
        break
      }
      case CONCEPT: {
        newBody = await handleConceptSelection(cyEntity, body, selectedGraphElement)
        if (newBody) {
          updateQueryBody(newBody)
        }

        selectedGraphElement = queryGraph.selectElement(clickedIRI)
        ontologyGraph.resetHighlights()
        ontologyGraph.highlightSuggestions(clickedIRI)
        break
      }
      case DATA_PROPERTY: {
        let newBody: QueryGraph = null
        newBody = await handleDataPropertySelection(cyEntity, body, selectedGraphElement)
        // select the current selected class on the ontology, prevent from selecting the attribute
        gscape.selectEntityOccurrences(getIri(selectedGraphElement))
        if (newBody)
          updateQueryBody(newBody)
        break
      }
    }
  })

  // Add query graph and query head widgets to grapholscape instance
  const uiContainer = gscape.container.querySelector('#gscape-ui')
  uiContainer.insertBefore(queryGraph.widget, uiContainer.firstChild)
  uiContainer.insertBefore(queryHead.widget, uiContainer.firstChild)

  queryGraph.onAddHead(async graphElement => {
    let newBody = (await qgApi.addHeadTerm(body, graphElement.id)).data
    if (newBody)
      updateQueryBody(newBody)
  })

  queryGraph.onDelete(async graphElement => {
    let newBody = (await qgApi.deleteGraphElementId(body, graphElement.id)).data
    if (newBody) {
      if (newBody.graph && !getGraphElementByID(newBody?.graph, selectedGraphElement.id)) {
        // if we deleted selectedGraphElem, then select its parent
        selectedGraphElement = findGraphElement(body.graph, ge => {
          return ge.children?.find(c => {
            if (c.children?.find(c2 => c2.id === graphElement.id))
              return true
          })
        })

        ontologyGraph.resetHighlights()
        gscape.unselectEntity([])
        ontologyGraph.focusNodeByIRI(getIri(selectedGraphElement))
        ontologyGraph.highlightSuggestions(getIri(selectedGraphElement))
        queryGraph.selectElement(selectedGraphElement.id) // force selecting a new class
      }

      // empty query
      if (!newBody.graph) {
        selectedGraphElement = null
        ontologyGraph.resetHighlights()
        gscape.unselectEntity([])
      }

      updateQueryBody(newBody)
    }

  })

  queryGraph.onJoin(async (ge1, ge2) => {
    let newBody = (await qgApi.putQueryGraphJoin(body, ge1.id, ge2.id)).data
    if (newBody) {
      selectedGraphElement = ge1
      updateQueryBody(newBody)
    }
  })

  queryGraph.onElementClick((graphElement, cyNode) => {

    // move ontology graph to show selected obj/data property
    ontologyGraph.focusNodeByIRI(getIri(graphElement))

    if (getEntityType(graphElement) === EntityTypeEnum.Class) {
      let previousGraphElem = selectedGraphElement
      let iri: string
      // If it's a child, use its own iri to find it on the ontology graph
      // if it's a parent, use the first iri he has in its entity list instead
      if (cyNode.isChild()) {
        selectedGraphElement = getGraphElementByIRI(body.graph, graphElement.id) // child nodes have IRI as id
        iri = graphElement.id
      } else {
        selectedGraphElement = graphElement
        iri = getIri(selectedGraphElement)
      }

      if (previousGraphElem !== graphElement)
        ontologyGraph.highlightSuggestions(iri)
      // const elems = gscape.ontology.getEntityOccurrences(iri)
      // const elem = elems.find((occ: any) => occ.data('diagram_id') === gscape.actualDiagramID)
      // gscape.centerOnNode(elem.id())
    }

    // keep focus on selected class
    queryGraph.selectElement(selectedGraphElement.id)
  })

  queryHead.onDelete(async headElement => {
    let newBody = (await qgApi.deleteHeadTerm(body, headElement.id)).data
    updateQueryBody(newBody)
  })

  queryHead.onRename(async (headElement, alias) => {
    headElement.alias = alias
    let newBody = (await qgApi.renameHeadTerm(body, headElement.id)).data
    updateQueryBody(newBody)
  })

  queryHead.onLocalize(headElement => {
    let graphElement = getGraphElementByID(body.graph, headElement.graphElementId)
    queryGraph.centerOnElem(graphElement)
    ontologyGraph.focusNodeByIRI(getIri(graphElement))
  })

  queryHead.sparqlButton.onClick = () => {
    sparqlDialog.isVisible ? sparqlDialog.hide() : sparqlDialog.show()
  }
}

function updateQueryBody(newBody: QueryGraph) {
  body = newBody
  queryGraph.setGraph(body.graph)
  queryGraph.render(body.graph)
  queryGraph.removeNodesNotInQuery()

  queryHead.setHead(body.head)
  queryHead.render(body.head.map((headElem: HeadElement) => {
    let relatedGraphElem = getGraphElementByID(body.graph, headElem.graphElementId)
    headElem['entityType'] = getEntityType(relatedGraphElem)
    headElem['dataType'] = headElem['entityType'] === EntityTypeEnum.DataProperty
      ? ontologyGraph.guessDataType(getIri(relatedGraphElem))
      : null
    return headElem
  }))

  sparqlDialog.text = body?.sparql ? body.sparql : emptyQueryMsg()
}
