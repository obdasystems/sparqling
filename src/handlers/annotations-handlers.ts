import { AnnotationsKind } from "grapholscape"
import { QueryGraphBGPApi } from "../api/swagger"
import { handlePromise } from "../main/handle-promises"
import onNewBody from "../main/on-new-body"
import * as model from "../model"

export default async function addAnnotation(annotationKind: AnnotationsKind) {
  if (annotationKind !== AnnotationsKind.label && annotationKind !== AnnotationsKind.comment) {
    console.warn(`Annotations of kind [${annotationKind}] are not supported yet.`)
    return
  }

  const qgBGPApi = new QueryGraphBGPApi(undefined, model.getBasePath())

  const activeElement = model.getActiveElement()

  if (activeElement?.graphElement.id) {
    const newQueryBody = await handlePromise(qgBGPApi.putQueryGraphDataProperty(
      activeElement.graphElement.id,
      '',
      `rdfs:${annotationKind}`,
      model.getQueryBody(),
      model.getRequestOptions()
    ))

    if (newQueryBody)
      onNewBody(newQueryBody)
  }
}