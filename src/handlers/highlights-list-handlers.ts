import { TypesEnum, ui } from "grapholscape"
import { Branch, OntologyGraphApi, OntologyPath, QueryGraphBGPApi } from "../api/swagger"
import { handlePromise } from "../main/handle-promises"
import onNewBody from "../main/on-new-body"
import * as model from "../model"
import { getEntityOccurrence, getGscape } from '../ontology-graph'
import getClassesList from "../util/get-classes-list"
import getPrefixedIri from "../util/get-prefixed-iri"
import { highlightsList } from "../widgets"
import addAnnotation from "./annotations-handlers"
import { handleEntitySelection, handleObjectPropertySelection } from "./og-handlers"

highlightsList.onSuggestionLocalization((entityIri) => {
  if (!model.isFullPageActive())
    getGscape().centerOnEntity(entityIri)
})

highlightsList.onSuggestionAddToQuery((entityIri, entityType, relatedClass) => {
  switch (entityType) {
    case TypesEnum.CLASS:
    case TypesEnum.DATA_PROPERTY:
      const entityOccurrence = getEntityOccurrence(entityIri)

      if (entityOccurrence)
        handleEntitySelection(entityIri, entityType, entityOccurrence)
      break

    case TypesEnum.OBJECT_PROPERTY:
      if (relatedClass) {
        const objectPropertyBranch = model.getActualHighlights()?.objectProperties?.find((b: Branch) => {
          if (b.objectPropertyIRI)
            return b.objectPropertyIRI === entityIri || getPrefixedIri(b.objectPropertyIRI) === entityIri
        })
        const relatedClassOccurrence = getEntityOccurrence(relatedClass)
        if (objectPropertyBranch && relatedClassOccurrence) {
          handleObjectPropertySelection(objectPropertyBranch, relatedClassOccurrence)
        }
      }
  }
})

highlightsList.onAddLabel(() => addAnnotation('label'))
highlightsList.onAddComment(() => addAnnotation('comment'))

highlightsList.onShortestPathClick(() => handlePathRequest(false))

highlightsList.onFindPathsClick(() => handlePathRequest(true))


function handlePathRequest(kShortest: boolean) {
  const gscape = getGscape()
  const shortestPathDialog = new ui.ShortestPathDialog()

  shortestPathDialog.classes = getClassesList(gscape)
  const activeGraphElement = model.getActiveElement()
  if (activeGraphElement?.iri) {
    shortestPathDialog.class1EditEnabled = false
    shortestPathDialog.class1 = activeGraphElement.iri.fullIri
  }

  shortestPathDialog.onConfirm((sourceClassIri, targetClassIri) => {
    const ogApi = new OntologyGraphApi(undefined, model.getBasePath())
    const pathPromise = ogApi.highligthsPaths(sourceClassIri, targetClassIri, kShortest, model.getRequestOptions())
    
    handlePromise(pathPromise).then((paths: OntologyPath[]) => {
      if (paths.length === 1) {
        addPath(paths[0], activeGraphElement)
      } else {
        const pathSelector = new ui.PathSelector(gscape.theme)
        pathSelector.paths = paths
        pathSelector.addEventListener('path-selection', ((evt: ui.PathSelectionEvent) => {
          addPath(evt.detail, activeGraphElement)
        }) as EventListener)

        pathSelector.getDisplayedName = (entity) => {
          if (!entity.iri)
            return
      
          const grapholEntity = gscape.ontology.getEntity(entity.iri)
          return grapholEntity?.getDisplayedName(gscape.entityNameType, gscape.language)
        }

        gscape.uiContainer?.appendChild(pathSelector)
        pathSelector.show()
      }
    })
  })
  
  gscape.uiContainer?.appendChild(shortestPathDialog)
  shortestPathDialog.show()
}

function addPath(path: OntologyPath, activeGraphElement?: model.ActiveElement) {
  if (activeGraphElement && activeGraphElement.graphElement.id !== undefined) {
    const qgApi = new QueryGraphBGPApi(undefined, model.getBasePath())
    const addPathPromise = qgApi.addPathToQueryGraph(
      activeGraphElement.graphElement.id,
      JSON.stringify(path),
      model.getQueryBody(),
      model.getRequestOptions()
    )

    handlePromise(addPathPromise).then(newBody => {
      onNewBody(newBody)
    })
  }
}