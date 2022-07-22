import { ui } from 'grapholscape'
import { QueryGraph, QueryGraphBGPApiFactory, QueryGraphHeadApiFactory, QueryGraphOptionalApiFactory } from '../api/swagger'
import { clearQuery } from '../main'
import { handlePromise } from '../main/handle-promises'
import onNewBody from '../main/on-new-body'
import * as model from '../model'
import * as ontologyGraph from '../ontology-graph'
import getGscape from '../ontology-graph/get-gscape'
import * as queryGraph from '../query-graph'
// import * as queryHead from '../query-head'
import * as GEUtility from '../util/graph-element-utility'
import { filterDialog } from '../widgets'
// import { clearQueryButton, filterDialog, filterListDialog, sparqlButton, sparqlDialog } from '../widgets'
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
  const selectedGraphElement = model.getSelectedGraphElement()
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

        model.setSelectedGraphElement(newSelectedGE)
        ontologyGraph.resetHighlights()
        gscape.unselect()

        if (newSelectedGE) {
          const newSelectedGEIri = GEUtility.getIri(newSelectedGE)
          if (newSelectedGEIri) {
            gscape.centerOnEntity(newSelectedGEIri)
            ontologyGraph.highlightSuggestions(newSelectedGEIri)
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
      model.setSelectedGraphElement(ge1)
      onNewBody(newBody)
    })
  }
})

queryGraph.onElementClick((graphElement, iri) => {
  const gscape = getGscape()

  // move ontology graph to show origin graphol node or any other iri occurrence
  const originGrapholNodeOccurrence = model.getOriginGrapholNodes().get(graphElement.id + iri)
  if (originGrapholNodeOccurrence) {
    gscape.centerOnElement(originGrapholNodeOccurrence.elementId, originGrapholNodeOccurrence.diagramId)
  } else {
    gscape.centerOnEntity(iri)
  }

  if (GEUtility.isClass(graphElement)) {
    // if the new graphElement is different from the current selected one the select it
    if (model.getSelectedGraphElement() !== graphElement) {
      model.setSelectedGraphElement(graphElement)

      // Highlight suggestions for the actual clicked iri (might be a child node)
      ontologyGraph.highlightSuggestions(iri)
    }
  }
  const entityDetailsWidget = gscape.widgets.get(ui.WidgetEnum.ENTITY_DETAILS) as any
  if (entityDetailsWidget)
    entityDetailsWidget.grapholEntity = gscape.ontology.getEntity(iri)

  // keep focus on selected class
  const selectedGraphElem = model.getSelectedGraphElement()
  if (selectedGraphElem?.id)
    queryGraph.selectElement(selectedGraphElem.id)
})

// queryGraph.onMakeOptional(graphElement => {
//   if (graphElement.id) {
//     const qgOptionalApi = QueryGraphOptionalApiFactory(undefined, model.getBasePath())
//     const body = model.getQueryBody()
//     handlePromise(qgOptionalApi.newOptionalGraphElementId(graphElement.id, body, model.getRequestOptions())).then(newBody => {
//       onNewBody(newBody)
//     })
//   }
// })

// queryGraph.onRemoveOptional(graphElement => {
//   if (graphElement.id) {
//     const qgOptionalApi = QueryGraphOptionalApiFactory(undefined, model.getBasePath())
//     const body = model.getQueryBody()
//     handlePromise(qgOptionalApi.removeOptionalGraphElementId(graphElement.id, body, model.getRequestOptions())).then(newBody => {
//       onNewBody(newBody)
//     })
//   }
// })

queryGraph.onAddFilter(graphElement => {
  showFormDialog(graphElement, filterDialog)
})

// queryGraph.onSeeFilters(graphElement => {
//   if (graphElement.id) {
//     for (const headElementComponent of queryHead.widget.shadowRoot.querySelectorAll('head-element')) {
//       if (headElementComponent.graphElementId === graphElement.id) {
//         headElementComponent.focus()
//         headElementComponent.showBody()
//         headElementComponent.scrollIntoView({ behavior: 'smooth' })
//         return
//       }
//     }

//     // if not in query head, show dialog
//     const filtersOnVariable = model.getFiltersOnVariable(graphElement.id)
//     if (filtersOnVariable)
//       filterListDialog.filterList = filtersOnVariable

//     filterListDialog.variable = graphElement.id
//     filterListDialog.show()
//   }
// })

// sparqlButton.onClick = () => {
//   sparqlDialog.isVisible ? sparqlDialog.hide() : sparqlDialog.show()
// }

queryGraph.widget.onQueryClear = () => { clearQuery() }