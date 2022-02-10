import { UI } from 'grapholscape'
import { QueryGraphApiFactory } from '../api/swagger'
import { EntityTypeEnum } from '../api/swagger/models'
import * as ontologyGraph from '../ontology-graph'
import getGscape from '../ontology-graph/get-gscape'
import * as queryGraph from '../query-graph'
import onNewBody from './on-new-body'
import * as queryBody from './query-body'
import * as GEUtility from '../util/graph-element-utility'

queryGraph.onAddHead(async graphElement => {
  const qgApi = QueryGraphApiFactory()
  const body = queryBody.getBody()
  let newBody = (await qgApi.addHeadTerm(body, graphElement.id)).data
  if (newBody)
    onNewBody(newBody)
})

queryGraph.onDelete(async graphElement => {
  const qgApi = QueryGraphApiFactory()
  const body = queryBody.getBody()
  const selectedGraphElement = queryBody.getSelectedGraphElement()
  const gscape = getGscape()

  let newBody = (await qgApi.deleteGraphElementId(body, graphElement.id)).data
  if (newBody) {
    if (newBody.graph && graphElement === selectedGraphElement) {
      // if we deleted selectedGraphElem, then select its parent
      let newSelectedGE = GEUtility.findGraphElement(body.graph, ge => {
        return ge.children?.find(c => {
          if (c.children?.find(c2 => c2.id === graphElement.id))
            return true
        })
      })
      
      queryBody.setSelectedGraphElement(newSelectedGE)
      ontologyGraph.resetHighlights()
      gscape.unselectEntity([])
      ontologyGraph.focusNodeByIRI(GEUtility.getIri(newSelectedGE))
      ontologyGraph.highlightSuggestions(GEUtility.getIri(newSelectedGE))
      queryGraph.selectElement(newSelectedGE.id) // force selecting a new class
    }

    // empty query
    if (!newBody.graph) {
      queryBody.setSelectedGraphElement(null)
      ontologyGraph.resetHighlights()
      gscape.unselectEntity([])
    }

    onNewBody(newBody)
  }
})

queryGraph.onJoin(async (ge1, ge2) => {
  const qgApi = QueryGraphApiFactory()
  const body = queryBody.getBody()

  let newBody = (await qgApi.putQueryGraphJoin(body, ge1.id, ge2.id)).data
  if (newBody) {
    queryBody.setSelectedGraphElement(ge1)
    onNewBody(newBody)
  }
})

queryGraph.onElementClick((graphElement, cyNode) => {
  const gscape = getGscape()
  // move ontology graph to show selected obj/data property
  ontologyGraph.focusNodeByIRI(GEUtility.getIri(graphElement))
  UI.entityDetails.setEntity(gscape.ontology.getEntityOccurrences(GEUtility.getIri(graphElement))[0])

  if (GEUtility.getEntityType(graphElement) === EntityTypeEnum.Class) {
    let previousGraphElem = queryBody.getSelectedGraphElement()
    let iri: string
    let newSelectedGE
    // If it's a child, use its own iri to find it on the ontology graph
    // if it's a parent, use the first iri he has in its entity list instead
    if (cyNode.isChild()) {
      newSelectedGE = GEUtility.getGraphElementByIRI(graphElement.id) // child nodes have IRI as id
      iri = graphElement.id
    } else {
      newSelectedGE = graphElement
      iri = GEUtility.getIri(newSelectedGE)
    }

    queryBody.setSelectedGraphElement(newSelectedGE)

    if (previousGraphElem !== graphElement)
      ontologyGraph.highlightSuggestions(iri)
    // const elems = gscape.ontology.getEntityOccurrences(iri)
    // const elem = elems.find((occ: any) => occ.data('diagram_id') === gscape.actualDiagramID)
    // gscape.centerOnNode(elem.id())
  }

  // keep focus on selected class
  queryGraph.selectElement(queryBody.getSelectedGraphElement().id)
})