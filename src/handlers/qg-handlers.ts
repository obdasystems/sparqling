import { newOptionalGraphElementId, removeOptionalGraphElementId } from '../api/api_stub'
import { QueryGraph, QueryGraphBGPApiFactory, QueryGraphHeadApiFactory } from '../api/swagger'
import { filterListDialog } from '../widgets'
import { showFilterDialogForVariable } from './filters-handlers'
import * as ontologyGraph from '../ontology-graph'
import getGscape from '../ontology-graph/get-gscape'
import * as model from '../model'
import * as queryGraph from '../query-graph'
import * as queryHead from '../query-head'
import * as GEUtility from '../util/graph-element-utility'
import onNewBody from '../main/on-new-body'
import { handlePromise } from '../main/handle-promises'

queryGraph.onAddHead(async graphElement => {
  const qgApi = QueryGraphHeadApiFactory()
  const body = model.getQueryBody()
  handlePromise(qgApi.addHeadTerm(graphElement.id, body)).then(newBody => {
    onNewBody(newBody)
  })
})

queryGraph.onDelete((graphElement, iri) => {
  const qgApi = QueryGraphBGPApiFactory()
  const body = model.getQueryBody()
  const selectedGraphElement = model.getSelectedGraphElement()
  const gscape = getGscape()

  if (!iri) {
    handlePromise(qgApi.deleteGraphElementId(graphElement.id, body)).then(newBody => {
      if (newBody.graph && !GEUtility.findGraphElement(newBody.graph, ge => ge === selectedGraphElement)) {
        // if we deleted selectedGraphElem, then select its parent
        let newSelectedGE = GEUtility.findGraphElement(body.graph, ge => {
          return ge.children?.some(c => {
            if (c.children?.find(c2 => c2.id === graphElement.id))
              return true
          })
        })
  
        model.setSelectedGraphElement(newSelectedGE)
        ontologyGraph.resetHighlights()
        gscape.unselectEntity()
        ontologyGraph.focusNodeByIRI(GEUtility.getIri(newSelectedGE))
        ontologyGraph.highlightSuggestions(GEUtility.getIri(newSelectedGE))
        queryGraph.selectElement(newSelectedGE.id) // force selecting a new class
      }
      
      finalizeDelete(newBody)
    })
  } else { // deleted a children
    handlePromise(qgApi.deleteGraphElementIdClass(graphElement.id, iri, body)).then(newBody => {
      finalizeDelete(newBody)
    })
  }

  function finalizeDelete(newBody: QueryGraph) {
    model.getOriginGrapholNodes().delete(graphElement.id)
    onNewBody(newBody)
  }
})

queryGraph.onJoin(async (ge1, ge2) => {
  const qgApi = QueryGraphBGPApiFactory()
  const body = model.getQueryBody()

  handlePromise(qgApi.putQueryGraphJoin(ge1.id, ge2.id, body)).then(newBody => {
    model.setSelectedGraphElement(ge1)
    onNewBody(newBody)
  })
})

queryGraph.onElementClick((graphElement, iri) => {
  const gscape = getGscape()

  if (GEUtility.isClass(graphElement)) {
    // if the new graphElement is different from the current selected one the select it
    if (model.getSelectedGraphElement() !== graphElement) {
      model.setSelectedGraphElement(graphElement)
    }

    // Highlight suggestions for the actual clicked iri (might be a child node)
    ontologyGraph.highlightSuggestions(iri)
  }

  // move ontology graph to show origin graphol node or any other iri occurrence
  const originGrapholNodeId = model.getOriginGrapholNodes().get(graphElement.id + iri)
  if (originGrapholNodeId) {
    ontologyGraph.focusNodeByIdAndDiagram(originGrapholNodeId)
  } else {
    ontologyGraph.focusNodeByIRI(iri)
  }

  gscape.widgets.ENTITY_DETAILS.setEntity(gscape.ontology.getEntityOccurrences(iri)[0])
  // keep focus on selected class
  queryGraph.selectElement(model.getSelectedGraphElement().id)
})

queryGraph.onMakeOptional(graphElement => {
  const qgApi = QueryGraphBGPApiFactory()
  const body = model.getQueryBody()
  let newBody = newOptionalGraphElementId(graphElement.id, body)

  if (newBody)
    onNewBody(newBody)
})

queryGraph.onRemoveOptional(graphElement => {
  const qgApi = QueryGraphBGPApiFactory()
  const body = model.getQueryBody()
  let newBody = removeOptionalGraphElementId(graphElement.id, null, body)

  if (newBody)
    onNewBody(newBody)
})

queryGraph.onAddFilter(graphElement => {
  showFilterDialogForVariable(graphElement)
})

queryGraph.onSeeFilters(graphElement => {
  const body = model.getQueryBody()

  for (const headElementComponent of queryHead.widget.shadowRoot.querySelectorAll('head-element')) {
    if (headElementComponent.graphElementId === graphElement.id) {
      headElementComponent.focus()
      headElementComponent.showBody()
      headElementComponent.scrollIntoView({ behavior: 'smooth' })
      return
    }
  }

  // if not in query head, show dialog
  filterListDialog.filterList = model.getFiltersOnVariable('?' + graphElement.id)
  filterListDialog.variable = graphElement.id
  filterListDialog.show()
})