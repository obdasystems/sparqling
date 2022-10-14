import { Iri } from 'grapholscape'
import { QueryGraph, QueryGraphBGPApiFactory, QueryGraphHeadApiFactory, QueryGraphOptionalApiFactory } from '../api/swagger'
import { clearQuery, performHighlights, showQueryResultInDialog } from '../main'
import { handlePromise } from '../main/handle-promises'
import onNewBody from '../main/on-new-body'
import * as model from '../model'
import * as ontologyGraph from '../ontology-graph'
import getGscape from '../ontology-graph/get-gscape'
import * as queryGraph from '../query-graph'
import * as queryHead from '../query-head'
import HeadElementComponent from '../query-head/qh-element-component'
import * as GEUtility from '../util/graph-element-utility'
import { filterDialog, filterListDialog, highlightsList, sparqlDialog } from '../widgets'
import showFormDialog from './show-form-dialog'

queryGraph.onAddHead(async graphElement => {
  if (graphElement?.id) {
    const qgApi = QueryGraphHeadApiFactory(undefined, model.getBasePath())
    const body = model.getQueryBody()
    handlePromise(qgApi.addHeadTerm(graphElement.id, body, model.getRequestOptions())).then(newBody => {
      onNewBody(newBody)
    })
  }
})

queryGraph.onDelete((graphElement, iri) => {
  if (!graphElement.id) {
    return
  }

  const qgApi = QueryGraphBGPApiFactory(undefined, model.getBasePath())
  const body = model.getQueryBody()
  const selectedGraphElement = model.getActiveElement()?.graphElement
  const gscape = getGscape()

  if (!iri) {
    handlePromise(qgApi.deleteGraphElementId(graphElement.id, body, model.getRequestOptions())).then(newBody => {
      if (newBody.graph && !GEUtility.findGraphElement(newBody.graph, ge => ge.id === selectedGraphElement?.id)) {
        // if we deleted selectedGraphElem, then select its parent
        let newSelectedGE = GEUtility.findGraphElement(body.graph, ge => {
          return ge.children?.some(c => {
            if (c.children?.find(c2 => c2.id === graphElement.id))
              return true
          }) || false
        })

        let newSelectedGEIri: string | undefined
        if (newSelectedGE) {
          newSelectedGEIri = GEUtility.getIri(newSelectedGE)
          if (newSelectedGEIri) {
            model.setActiveElement({
              graphElement: newSelectedGE,
              iri: new Iri(newSelectedGEIri, gscape.ontology.namespaces)
            })
            performHighlights(newSelectedGEIri)
          }
        }

        if (!model.isFullPageActive()) {
          gscape.unselect()

          if (newSelectedGEIri) {
            gscape.centerOnEntity(newSelectedGEIri)
          }
        }

        if (newSelectedGE?.id) {
          queryGraph.selectElement(newSelectedGE.id) // force selecting a new class
        }
      }

      finalizeDelete(newBody)
    })
  } else { // deleted a children
    handlePromise(qgApi.deleteGraphElementIdClass(graphElement.id, iri, body, model.getRequestOptions())).then(newBody => {
      finalizeDelete(newBody)
    })
  }

  function finalizeDelete(newBody: QueryGraph) {
    if (graphElement.id) {
      model.getOriginGrapholNodes().delete(graphElement.id)
      onNewBody(newBody)
    }
  }
})

queryGraph.onJoin(async (ge1, ge2) => {
  if (ge1.id && ge2.id) {
    const qgApi = QueryGraphBGPApiFactory(undefined, model.getBasePath())
    const body = model.getQueryBody()

    handlePromise(qgApi.putQueryGraphJoin(ge1.id, ge2.id, body, model.getRequestOptions())).then(newBody => {
      const ge1Iri = GEUtility.getIri(ge1)

      if (ge1Iri) {
        model.setActiveElement({
          graphElement: ge1,
          iri: new Iri(ge1Iri, getGscape().ontology.namespaces)
        })
        onNewBody(newBody)
      }
    })
  }
})

queryGraph.onElementClick((graphElement, iri) => {
  const gscape = getGscape()

  // move ontology graph to show origin graphol node or any other iri occurrence
  const originGrapholNodeOccurrence = model.getOriginGrapholNodes().get(graphElement.id + iri)
  if (originGrapholNodeOccurrence) {
    gscape.centerOnElement(originGrapholNodeOccurrence.elementId, originGrapholNodeOccurrence.diagramId, 1.5)
    gscape.selectElement(originGrapholNodeOccurrence.elementId)
  } else {
    gscape.selectEntity(iri)
  }

  if (GEUtility.isClass(graphElement)) {
    // if the new graphElement is different from the current selected one the select it
    if (model.getActiveElement()?.graphElement !== graphElement) {
      model.setActiveElement({
        graphElement: graphElement,
        iri: new Iri(iri, gscape.ontology.namespaces)
      })

      performHighlights(iri)
    }
  }

  // keep focus on selected class
  const activeElement = model.getActiveElement()
  if (activeElement?.graphElement.id)
    queryGraph.selectElement(activeElement.graphElement.id)
})

queryGraph.onMakeOptional(graphElement => {
  if (graphElement.id) {
    const qgOptionalApi = QueryGraphOptionalApiFactory(undefined, model.getBasePath())
    const body = model.getQueryBody()
    handlePromise(qgOptionalApi.newOptionalGraphElementId(graphElement.id, body, model.getRequestOptions())).then(newBody => {
      onNewBody(newBody)
    })
  }
})

queryGraph.onRemoveOptional(graphElement => {
  if (graphElement.id) {
    const qgOptionalApi = QueryGraphOptionalApiFactory(undefined, model.getBasePath())
    const body = model.getQueryBody()
    handlePromise(qgOptionalApi.removeOptionalGraphElementId(graphElement.id, body, model.getRequestOptions())).then(newBody => {
      onNewBody(newBody)
    })
  }
})

queryGraph.onAddFilter(graphElement => {
  showFormDialog(graphElement, filterDialog)
})

queryGraph.onSeeFilters(graphElement => {
  if (graphElement.id && queryHead.widget.shadowRoot) {
    for (const headElementComponent of queryHead.widget.shadowRoot.querySelectorAll('head-element')) {
      const headElemC = headElementComponent as HeadElementComponent
      if (headElemC.graphElementId === graphElement.id) {
        headElemC.focus()
        headElemC.openPanel()
        headElemC.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }

    // if not in query head, show dialog
    const filtersOnVariable = model.getFiltersOnVariable(graphElement.id)
    if (filtersOnVariable)
      filterListDialog.filterList = filtersOnVariable

    filterListDialog.variable = graphElement.id
    filterListDialog.show()
  }
})

queryGraph.onShowExamples(graphElement => {
  const iri = GEUtility.getIri(graphElement)
  if (iri) {
    showQueryResultInDialog(iri)
  }
})

queryGraph.widget.onSparqlButtonClick = () => sparqlDialog.isVisible ? sparqlDialog.hide() : sparqlDialog.show()

queryGraph.widget.onQueryClear = () => { clearQuery() }