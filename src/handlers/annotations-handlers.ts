import { QueryGraphBGPApi } from "../api/swagger"
import { handlePromise } from "../main/handle-promises"
import onNewBody from "../main/on-new-body"
import * as model from "../model"

export default async function addAnnotation(annotationKind: string) {
  if (annotationKind !== 'label' && annotationKind !== 'comment') {
    console.warn(`Annotations of kind [${annotationKind}] are not supported yet.`)
    return
  }

  const qgBGPApi = new QueryGraphBGPApi(undefined, model.getBasePath())

  const activeElement = model.getActiveElement()

  if (activeElement?.graphElement.id) {
    const newQueryBody = await handlePromise(qgBGPApi.putQueryGraphAnnotation(
      activeElement.graphElement.id,
      '',
      `http://www.w3.org/2000/01/rdf-schema#${annotationKind}`,
      model.getQueryBody(),
      model.getRequestOptions()
    ))

    if (newQueryBody)
      onNewBody(newQueryBody)
  }
}