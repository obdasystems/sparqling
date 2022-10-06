import { Iri } from 'grapholscape'
import { GraphElement, QueryGraph, QueryGraphBGPApi } from '../api/swagger'
import { addSuggestionsInIncremental } from '../main/incremental'
import { handlePromise } from '../main/handle-promises'
import onNewBody from '../main/on-new-body'
import * as model from '../model'
import { getGscape } from '../ontology-graph'
import * as queryGraph from '../query-graph'
import { getdiffNew, graphElementHasIri } from '../util/graph-element-utility'
import { updateEndpoints } from '../model'


queryGraph.onIncrementalClassSelection((classIri: string) => {
  const qgBGPApi = new QueryGraphBGPApi(undefined, model.getBasePath())
  const activeClass = model.getActiveElement()

  if (activeClass?.graphElement.id) {
    const oldQueryGraph = model.getQueryBody()?.graph
    handlePromise(qgBGPApi.putQueryGraphClass(
      activeClass?.graphElement.id, '',
      classIri,
      model.getQueryBody(),
      model.getRequestOptions()
    )).then(async newQueryBody => {
      onNewBody(newQueryBody)
      updateActiveElement(classIri, oldQueryGraph, newQueryBody.graph)
    })
  }
})

queryGraph.onIncrementalDataPropertySelection(dataPropertyIri => {
  const qgBGPApi = new QueryGraphBGPApi(undefined, model.getBasePath())
  const activeClass = model.getActiveElement()

  if (activeClass?.graphElement.id) {
    handlePromise(qgBGPApi.putQueryGraphDataProperty(
      activeClass.graphElement.id, '',
      dataPropertyIri,
      model.getQueryBody(),
      model.getRequestOptions(),
    )).then(newQueryBody => onNewBody(newQueryBody))
  }
})

queryGraph.onIncrementalObjectPropertySelection((objectPropertyIri, relatedClassIri, isDirect) => {
  const qgBGPApi = new QueryGraphBGPApi(undefined, model.getBasePath())
  const activeClass = model.getActiveElement()
  const oldQueryBody = model.getQueryBody()

  if (activeClass?.graphElement.id) {
    handlePromise(qgBGPApi.putQueryGraphObjectProperty(
      activeClass.graphElement.id, '',
      objectPropertyIri, relatedClassIri,
      isDirect,
      model.getQueryBody(),
      model.getRequestOptions()
    )).then(newQueryBody => {
      onNewBody(newQueryBody)
      updateActiveElement(relatedClassIri, oldQueryBody.graph, newQueryBody.graph)
    })
  }
})

function updateActiveElement(newSelectedIri: string, oldQueryGraph: GraphElement, newQueryGraph: GraphElement) {
  const newGraphElements = getdiffNew(oldQueryGraph, newQueryGraph)
  // The node to select is the one having the clickedIri among the new nodes
  const newActiveElement = newGraphElements.find(ge => graphElementHasIri(ge, newSelectedIri))
  if (newActiveElement && newActiveElement.id) {
    const grapholscape = getGscape()

    queryGraph.selectElement(newActiveElement.id)
    model.setActiveElement({
      graphElement: newActiveElement,
      iri: new Iri(newSelectedIri, getGscape().ontology.namespaces),
    })

    grapholscape.renderer.renderState['activeClass'] = grapholscape.renderer.cy?.$id(newActiveElement.id)
  }
}