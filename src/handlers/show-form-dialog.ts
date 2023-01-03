import { FilterExpressionOperatorEnum, GraphElement, HeadElement, VarOrConstantConstantTypeEnum, VarOrConstantTypeEnum } from "../api/swagger"
import { isStandalone } from "../model"
import { getGscape } from "../ontology-graph"
import * as GEUtility from "../util/graph-element-utility"
import AggregationDialog from "../widgets/forms/aggregation-functions/aggregation-functions-dialog"
import SparqlingFormDialog, { Modality } from "../widgets/forms/base-form-dialog"
import FilterDialog from "../widgets/forms/filters/filter-dialog"
import FunctionDialog from "../widgets/forms/functions/function-dialog"


export default function (element: HeadElement | GraphElement, formDialog: SparqlingFormDialog) {
  let graphElement: GraphElement | undefined
  let variableName: string | undefined

  if (isHeadElement(element) && element.graphElementId) {
    graphElement = GEUtility.getGraphElementByID(element.graphElementId)
    variableName = element.alias
  } else if (isGraphElement(element)) {
    graphElement = element
  }

  if (!graphElement) return
  const graphElementIri = GEUtility.getIri(graphElement)
  if (!graphElementIri) return

  if (GEUtility.isClass(graphElement)) {
    formDialog.parametersType = VarOrConstantTypeEnum.Iri
  } else {
    formDialog.parametersType = VarOrConstantTypeEnum.Constant
  }

  formDialog.modality = Modality.DEFINE

  if (formDialog instanceof FilterDialog) {
    formDialog._id = undefined // filterDialog's id is filter id, a filter has an ID only after adding it
  } else {
    formDialog._id = element.id
  }

  formDialog.parameters = [{
    type: VarOrConstantTypeEnum.Var,
    constantType: undefined,
    value: graphElement.id
  }]

  formDialog.datatypeFromOntology = getGscape().ontology.getEntity(graphElementIri)?.datatype
  formDialog.addInputValue() // default with one input

  if (formDialog instanceof FunctionDialog) {
    (formDialog as FunctionDialog).setDefaultOperator()
  }

  if (formDialog instanceof FilterDialog || formDialog instanceof AggregationDialog) {
    formDialog.operator = FilterExpressionOperatorEnum.Equal
  }

  formDialog.variableName = variableName || graphElement.id
  formDialog.examples = undefined
  formDialog.acceptExamples = !isStandalone() && (GEUtility.isClass(graphElement) || GEUtility.isDataProperty(graphElement))
  formDialog.examplesSearchValue = undefined
  formDialog.loadingExamples = false
  formDialog.canSave = true
  formDialog.show()
}


function isHeadElement(element: any): element is HeadElement {
  if ((element as HeadElement).graphElementId)
    return true
  else
    return false
}

function isGraphElement(element: any): element is GraphElement {
  if ((element as GraphElement).entities)
    return true
  else
    return false
} 