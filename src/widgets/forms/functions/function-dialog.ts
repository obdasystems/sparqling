import SparqlingFormDialog from "../base-form-dialog"
import { getFormTemplate } from "../form-template"
import { html } from 'lit'
import { FunctionNameEnum, VarOrConstant, VarOrConstantConstantTypeEnum } from "../../../api/swagger"
import { FormID } from "../../../util/filter-function-interface"
import { functionIcon } from "../../assets/icons"
import { ui } from "grapholscape"

export default class FunctionDialog extends SparqlingFormDialog {

  constructor() {
    super()
  }

  render() {
    this.title = `${this.modality} function for ${this.variableName}`
    return html`
      <div class="gscape-panel">
        <div class="top-bar">
          <div id="widget-header" class="bold-text">
            ${functionIcon}
            <span>${this.title}</span>
          </div>

          <gscape-button 
            id="toggle-panel-button"
            size="s" 
            type="subtle"
            @click=${this.hide}
          > 
            <span slot="icon">${ui.icons.close}</span>
          </gscape-button>
        </div>

        <div class="dialog-body">
          ${getFormTemplate(this, this.operators)}
          
          <div class="bottom-buttons">
            <gscape-button label="Cancel" @click=${this.hide}></gscape-button>
            ${this.canSave
              ? html`
                <gscape-button type="primary" @click=${this.handleSubmit} label="Save Function"></gscape-button>
              `
              : null
            }
          </div>
        </div>
      </div>
    `
  }

  onSubmit(callback: (headElementId: FormID, functionOperator: FunctionNameEnum, parameters: VarOrConstant[]) => void) {
    this.submitCallback = callback
  }

  setAsCorrect(customText?: string): void {
    super.setAsCorrect(customText)
    this.canSave = false
  }

  setDefaultOperator() {
    this.operator = this.operators[0]
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