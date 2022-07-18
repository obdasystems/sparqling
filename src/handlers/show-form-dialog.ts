import { GraphElement, HeadElement, VarOrConstantTypeEnum } from "../api/swagger"
// import { guessDataType } from "../ontology-graph"
import * as GEUtility from "../util/graph-element-utility"
import SparqlingFormDialog, { Modality } from "../widgets/forms/base-form-dialog"
import FilterDialog from "../widgets/forms/filters/filter-dialog"


export default function(element: HeadElement | GraphElement, formDialog: SparqlingFormDialog) {
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
  
  formDialog.operator = undefined
  formDialog.parameters = [{
    type: VarOrConstantTypeEnum.Var,
    // constantType: guessDataType(graphElementIri),
    value: graphElement.id
  }]
  
  formDialog.variableName = variableName || graphElement.id
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