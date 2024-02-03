import { Iri, ui } from 'grapholscape'
import { QueryGraph, QueryGraphBGPApiFactory, QueryGraphHeadApiFactory, QueryGraphOptionalApiFactory } from '../api/swagger'
import { clearQuery, performHighlights, showExamplesInDialog } from '../main'
import { handlePromise } from '../main/handle-promises'
import onNewBody from '../main/on-new-body'
import * as model from '../model'
import getGscape from '../ontology-graph/get-gscape'
import * as queryGraph from '../query-graph'
import { cy } from '../query-graph/renderer'
import * as queryHead from '../query-head'
import HeadElementComponent from '../query-head/qh-element-component'
import { bgpContainer } from '../util/get-container'
import * as GEUtility from '../util/graph-element-utility'
import { exitFullscreenButton, filterDialog, filterListDialog, previewDialog, sparqlDialog } from '../widgets'
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
  const oldSelectedGraphElement = model.getActiveElement()?.graphElement

  if (!iri) {
    handlePromise(qgApi.deleteGraphElementId(graphElement.id, body, model.getRequestOptions())).then(newBody => {
      if (newBody.graph && !GEUtility.findGraphElement(newBody.graph, ge => ge.id === oldSelectedGraphElement?.id)) {
        // if we deleted selectedGraphElem, then select its parent
        let newSelectedGE = GEUtility.findGraphElement(body.graph, ge => {
          return ge.children?.some(c => {
            if (c.children?.find(c2 => c2.id === graphElement.id))
              return true
          }) || false
        })
        newBody.activeGraphElementId = newSelectedGE?.id
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
      onNewBody(newBody)
    })
  }
})

queryGraph.onElementClick((graphElement, clickedIri) => {
  const gscape = getGscape()

  if (GEUtility.isClass(graphElement)) {
    // if the new graphElement is different from the current selected one the select it
    if (model.getActiveElement()?.graphElement !== graphElement) {
      model.setActiveElement({
        graphElement: graphElement,
        iri: new Iri(clickedIri, gscape.ontology.namespaces)
      })

      performHighlights(GEUtility.getIris(graphElement))
    }
  }

  if (!model.isFullPageActive()) {
    gscape.selectEntity(clickedIri)
  }

  const entityDetails = gscape.widgets.get(ui.WidgetEnum.ENTITY_DETAILS) as any
  entityDetails.setGrapholEntity(gscape.ontology.getEntity(clickedIri))
  entityDetails.show()

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
  if (graphElement.id) {
    previewDialog.examplesSearchValue = undefined
    showExamplesInDialog(graphElement.id)
  }
})

queryGraph.widget.onSparqlButtonClick = () => sparqlDialog.isVisible ? sparqlDialog.hide() : sparqlDialog.show()

queryGraph.widget.onQueryClear = () => {
  ui.showMessage(
    'Are you sure to reset the query?',
    'Confirm Action',
    getGscape().uiContainer
  ).onConfirm(clearQuery)
}

queryGraph.widget.onFullScreenEnter = () => {
  bgpContainer.requestFullscreen().then(() => setTimeout(() => cy.fit(), 200))
  bgpContainer.appendChild(exitFullscreenButton)

  exitFullscreenButton.onclick = () => { // exit fullscreen
    document.exitFullscreen().then(() => setTimeout(() => cy.fit(), 200))
    exitFullscreenButton.remove()
  }
}

queryGraph.widget.onCenterDiagram = () => cy.fit()