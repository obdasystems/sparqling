import { UI } from 'grapholscape'
import { newOptionalGraphElementId, removeOptionalGraphElementId } from '../../api/api_stub'
import { QueryGraphBGPApiFactory, QueryGraphHeadApiFactory } from '../../api/swagger'
import { showFilterDialogForVariable } from '../../filters'
import * as ontologyGraph from '../../ontology-graph'
import getGscape from '../../ontology-graph/get-gscape'
import * as queryBody from '../../query-body'
import * as queryGraph from '../../query-graph'
import * as GEUtility from '../../util/graph-element-utility'
import onNewBody from '../on-new-body'

queryGraph.onAddHead(async graphElement => {
  const qgApi = QueryGraphHeadApiFactory()
  const body = queryBody.getBody()
  let newBody = (await qgApi.addHeadTerm(graphElement.id, body)).data
  if (newBody)
    onNewBody(newBody)
})

queryGraph.onDelete(async graphElement => {
  const qgApi = QueryGraphBGPApiFactory()
  const body = queryBody.getBody()
  const selectedGraphElement = queryBody.getSelectedGraphElement()
  const gscape = getGscape()

  let newBody = (await qgApi.deleteGraphElementId(graphElement.id, body)).data
  if (newBody) {
    if (newBody.graph && graphElement === selectedGraphElement) {
      // if we deleted selectedGraphElem, then select its parent
      let newSelectedGE = GEUtility.findGraphElement(body.graph, ge => {
        return ge.children?.some(c => {
          if (c.children?.find(c2 => c2.id === graphElement.id))
            return true
        })
      })

      queryBody.setSelectedGraphElement(newSelectedGE)
      ontologyGraph.resetHighlights()
      gscape.unselectEntity()
      ontologyGraph.focusNodeByIRI(GEUtility.getIri(newSelectedGE))
      ontologyGraph.highlightSuggestions(GEUtility.getIri(newSelectedGE))
      queryGraph.selectElement(newSelectedGE.id) // force selecting a new class
    }

    // empty query
    if (!newBody.graph) {
      queryBody.setSelectedGraphElement(null)
      ontologyGraph.resetHighlights()
      gscape.unselectEntity()
    }

    queryBody.getOriginGrapholNodes().delete(graphElement.id)
    onNewBody(newBody)
  }
})

queryGraph.onJoin(async (ge1, ge2) => {
  const qgApi = QueryGraphBGPApiFactory()
  const body = queryBody.getBody()

  let newBody = (await qgApi.putQueryGraphJoin(ge1.id, ge2.id, body)).data
  if (newBody) {
    queryBody.setSelectedGraphElement(ge1)
    onNewBody(newBody)
  }
})

queryGraph.onElementClick((graphElement, iri) => {
  const gscape = getGscape()

  if (GEUtility.isClass(graphElement)) {
    // if the new graphElement is different from the current selected one the select it
    if (queryBody.getSelectedGraphElement() !== graphElement) {
      queryBody.setSelectedGraphElement(graphElement)
    }

    // Highlight suggestions for the actual clicked iri (might be a child node)
    ontologyGraph.highlightSuggestions(iri)
  }

  // move ontology graph to show origin graphol node or any other iri occurrence
  const originGrapholNodeId = queryBody.getOriginGrapholNodes().get(graphElement.id+iri)
  if (originGrapholNodeId) {
    ontologyGraph.focusNodeByIdAndDiagram(originGrapholNodeId)
  } else {
    ontologyGraph.focusNodeByIRI(iri)
  }
  
  UI.entityDetails.setEntity(gscape.ontology.getEntityOccurrences(iri)[0])
  // keep focus on selected class
  queryGraph.selectElement(queryBody.getSelectedGraphElement().id)
})

queryGraph.onMakeOptional(graphElement => {
  const qgApi = QueryGraphBGPApiFactory()
  const body = queryBody.getBody()
  let newBody = newOptionalGraphElementId(graphElement.id, body)

  if (newBody)
    onNewBody(newBody)
})

queryGraph.onRemoveOptional(graphElement => {
  const qgApi = QueryGraphBGPApiFactory()
  const body = queryBody.getBody()
  let newBody = removeOptionalGraphElementId(graphElement.id, null, body)

  if (newBody)
    onNewBody(newBody)
})

queryGraph.onAddFilter(graphElement => {
  showFilterDialogForVariable(graphElement)
})