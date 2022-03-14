import { EntityTypeEnum, FilterExpressionOperatorEnum, QueryGraph, QueryGraphFilterApiFactory, QueryGraphHeadApiFactory, VarOrConstantTypeEnum } from '../../api/swagger'
import * as queryHead from '../../query-head'
import * as queryGraph from '../../query-graph'
import * as ontologyGraph from '../../ontology-graph'
import onNewBody from '../on-new-body'
import * as queryBody from '../../query-body'
import { sparqlDialog } from '../../widgets'
import { getGraphElementByID, getIri } from '../../util/graph-element-utility'
import { filterDialog } from '../../filters'
import { getHeadElementWithDatatype } from '../../util/head-element-utility'
import { Modality } from '../../filters/filter-function-dialog'

queryHead.onDelete(async headElement => {
  const qgApi = QueryGraphHeadApiFactory()
  const body = queryBody.getBody()
  let newBody = (await qgApi.deleteHeadTerm(headElement.id, body)).data
  onNewBody(newBody)
})

queryHead.onRename(async (headElement, alias) => {
  const qgApi = QueryGraphHeadApiFactory()
  const body = queryBody.getBody()
  headElement.alias = alias
  let newBody = (await qgApi.renameHeadTerm(headElement.id, body)).data
  onNewBody(newBody)
})

queryHead.onLocalize(headElement => {
  let graphElement = getGraphElementByID(headElement.graphElementId)
  queryGraph.centerOnElem(graphElement)
  ontologyGraph.focusNodeByIRI(getIri(graphElement))
})

queryHead.sparqlButton.onClick = () => {
  sparqlDialog.isVisible ? sparqlDialog.hide() : sparqlDialog.show()
}

queryHead.onAddFilter(headElement => {
  const headElemWithDatatype = getHeadElementWithDatatype(headElement)
  if(headElemWithDatatype['entityType'] === EntityTypeEnum.Class) {
    filterDialog.parametersType = VarOrConstantTypeEnum.Iri
  } else {
    filterDialog.parametersType = VarOrConstantTypeEnum.Constant
  }

  filterDialog.modality = Modality.DEFINE
  filterDialog._id = null
  filterDialog.operator = null
  filterDialog.parameters = [{
    type: VarOrConstantTypeEnum.Var,
    constantType: headElemWithDatatype['dataType'],
    value: headElement.id
  }]
  filterDialog.show()
})

queryHead.onEditFilter((filterId) => {
  const filter = queryBody.getFilterById(filterId)
  filterDialog.modality = Modality.EDIT
  filterDialog._id = filterId
  filterDialog.operator = filter.expression?.operator
  filterDialog.parameters = filter.expression?.parameters
  filterDialog.parametersType = filter.expression?.parameters[1]?.type
  filterDialog.show()
})