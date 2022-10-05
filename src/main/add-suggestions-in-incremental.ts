import { NodeSingular } from "cytoscape"
import { GrapholTypesEnum, RendererStatesEnum } from "grapholscape"
import * as model from "../model"
import { getGscape } from "../ontology-graph"

export default async function (classIri: string) {
  const highlights = await model.computeHighlights(classIri)
  const grapholscape = getGscape()

  highlights.classes?.forEach((classIri, i) => {
    const newSuggestionId = `class-suggestion-${i}`
    addEntitySuggestion(classIri, newSuggestionId)
    addEdgeForEntitySuggestion(newSuggestionId, GrapholTypesEnum.CLASS)
  })

  highlights.dataProperties?.forEach((dataPropertyIri, i) => {
    const newSuggestionId =  `data-property-suggestion-${i}`
    addEntitySuggestion(dataPropertyIri, newSuggestionId)
    addEdgeForEntitySuggestion(newSuggestionId, GrapholTypesEnum.DATA_PROPERTY)
  })

  grapholscape.renderer.renderState.runLayout()
}

function addEntitySuggestion(iri: string, id: string) {
  const grapholscape = getGscape()
  const grapholEntity = grapholscape.ontology.getEntity(iri)

  const entityOccurrences = grapholEntity.occurrences.get(RendererStatesEnum.GRAPHOL)
  if (entityOccurrences) {
    const grapholElement = grapholscape.ontology.getGrapholElement(entityOccurrences[0].elementId, entityOccurrences[0].diagramId).clone()
    const cyElem = grapholElement.getCytoscapeRepr(grapholEntity)[0]
    cyElem.data.id = id
    const newAddedSuggestion: NodeSingular | undefined = grapholscape.renderer.cy?.add(cyElem)
    if (newAddedSuggestion) {
      newAddedSuggestion?.data('isSuggestion', true)
      newAddedSuggestion?.addClass(model.FADED_CLASS)
    }
  }
}

function addEdgeForEntitySuggestion(suggestionId: string, type: GrapholTypesEnum) {
  const grapholscape = getGscape()

  const activeElement = model.getActiveElement()

  if (grapholscape.renderer.cy && activeElement) {
    if (type === GrapholTypesEnum.CLASS) {
      type = GrapholTypesEnum.INCLUSION
    }
    grapholscape.renderer.cy?.add({
      data: {
        source: activeElement.graphElement.id,
        target: suggestionId,
        type: type,
        isSuggestion: true,
      },
      classes: model.FADED_CLASS,
    })
  }
}