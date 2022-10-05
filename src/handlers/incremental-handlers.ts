import { Iri } from 'grapholscape'
import { QueryGraphBGPApi } from '../api/swagger'
import { addSuggestionsInIncremental } from '../main/incremental'
import { handlePromise } from '../main/handle-promises'
import onNewBody from '../main/on-new-body'
import * as model from '../model'
import { getGscape } from '../ontology-graph'
import * as queryGraph from '../query-graph'
import { getdiffNew, graphElementHasIri } from '../util/graph-element-utility'


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
    )).then(async newQueryGraph => {
      onNewBody(newQueryGraph)
      const newGraphElements = getdiffNew(oldQueryGraph, newQueryGraph.graph)
      // The node to select is the one having the clickedIri among the new nodes
      const newActiveElement = newGraphElements.find(ge => graphElementHasIri(ge, classIri))
      if (newActiveElement && newActiveElement.id) {
        const grapholscape = getGscape()

        queryGraph.selectElement(newActiveElement.id)
        model.setActiveElement({
          graphElement: newActiveElement,
          iri: new Iri(classIri, getGscape().ontology.namespaces),
        })

        grapholscape.renderer.renderState['activeClass'] = grapholscape.renderer.cy?.$id(newActiveElement.id)
      }
    })
  }
})

queryGraph.onIncrementalObjectPropertySelection((objectPropertyIri, relatedClassIri, isDirect) => {
  const qgBGPApi = new QueryGraphBGPApi(undefined, model.getBasePath())
  const activeClass = model.getActiveElement()

  if (activeClass?.graphElement.id) {
    handlePromise(qgBGPApi.putQueryGraphObjectProperty(
      activeClass.graphElement.id, '',
      objectPropertyIri, relatedClassIri,
      isDirect,
      model.getQueryBody(),
      model.getRequestOptions()
    )).then(newQueryGraph => onNewBody(newQueryGraph))
  }
})