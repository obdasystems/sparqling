import SparqlingFormDialog, { Modality } from "../base-form-dialog"
import { getFormTemplate } from "../form-template"
import { html } from 'lit'
import { FunctionNameEnum, VarOrConstant, VarOrConstantConstantTypeEnum } from "../../../api/swagger"
import { FormID } from "../../../util/filter-function-interface"

export default class FunctionDialog extends SparqlingFormDialog {
  private isCorrect: boolean

  constructor() {
    super()
    this.saveButton.label = "Save Function"
  }

  render() {
    return html`
      <gscape-dialog title="${this.modality} Function for ${this.variableName}">
        <div class="dialog-body">
          ${getFormTemplate(this.operator, this.parametersIriOrConstants, this.operators, this.datatype, this.parametersType)}
        
          <div class="bottom-buttons">
            ${this.saveButton}
          </div>
        </div>
      </gscape-dialog>
    `
  }

  onSubmit(callback: (headElementId: FormID, functionOperator: FunctionNameEnum, parameters: VarOrConstant[]) => void) {
    this.submitCallback = callback
  }

  setAsCorrect(customText?: string): void {
    super.setAsCorrect(customText)
    this.saveButton.hide()
  }

  show() {
    super.show()
    this.saveButton.show()
  }

  protected onDatatypeChange(value: VarOrConstantConstantTypeEnum): void {
    super.onDatatypeChange(value)
    this.selectOperatorElem.value = null
  }

  protected get operators() {
    switch(this.datatype) {
      case VarOrConstantConstantTypeEnum.String:
        return this.operatorsOnString
      
      case VarOrConstantConstantTypeEnum.Decimal:
        return this.operatorsOnNumber

      case VarOrConstantConstantTypeEnum.DateTime:
        return this.operatorsOnDate

      default:
        return this.operatorsOnString
    }
  }

  private get operatorsOnString() {
    return [
      FunctionNameEnum.Concat, 
      FunctionNameEnum.Contains, 
      FunctionNameEnum.Lcase, 
      FunctionNameEnum.Substr,
      FunctionNameEnum.Ucase
    ]
  }

  private get operatorsOnNumber() {
    return [
      FunctionNameEnum.Add,
      FunctionNameEnum.Subctract,
      FunctionNameEnum.Multiply,
      FunctionNameEnum.Divide,
      FunctionNameEnum.Round,
      FunctionNameEnum.Ceil,
      FunctionNameEnum.Floor
    ]
  }

  private get operatorsOnDate() {
    return [
      FunctionNameEnum.Year,
      FunctionNameEnum.Month,
      FunctionNameEnum.Day,
      FunctionNameEnum.Hours,
      FunctionNameEnum.Minutes,
      FunctionNameEnum.Seconds,
    ]
  }
}

customElements.define('sparqling-function-dialog', FunctionDialog as any)