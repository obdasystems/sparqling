import { GrapholTypesEnum } from 'grapholscape'
import { QueryGraphBGPApi } from '../api/swagger'
import addSuggestionsInIncremental from '../main/add-suggestions-in-incremental'
import { handlePromise } from '../main/handle-promises'
import onNewBody from '../main/on-new-body'
import * as model from '../model'
import * as queryGraph from '../query-graph'
import { handleEntitySelection } from './og-handlers'


queryGraph.onIncrementalClassSelection((classIri: string) => {
  const qgBGPApi = new QueryGraphBGPApi(undefined, model.getBasePath())
  const activeClass = model.getActiveElement()

  if (activeClass?.graphElement.id) {
    handlePromise(qgBGPApi.putQueryGraphClass(
      activeClass?.graphElement.id, '',
      classIri,
      model.getQueryBody(),
      model.getRequestOptions()
    )).then(newQueryGraph => onNewBody(newQueryGraph))
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