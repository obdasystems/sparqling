import FilterFunctionDialog, { Modality } from "../filter-function-dialog"
import { getFormTemplate } from "../filter-function-form-template"
import { html } from 'lit'
import { FunctionNameEnum, VarOrConstant } from "../../api/swagger"

export default class FunctionDialog extends FilterFunctionDialog {
  _id: string;
  protected submitCallback = (
    id: string,
    op: FunctionNameEnum,
    parameters: VarOrConstant[]
  ) => { }
  private isCorrect: boolean

  constructor() {
    super()
    this.saveButton.label = "Save Function"
  }

  render() {
    return html`
      <gscape-dialog title="${this.modality} Function for ${this.variable?.value}">
        <div class="dialog-body">
          ${getFormTemplate(this.operator, this.parametersIriOrConstants, FunctionNameEnum, this.datatype)}
        
          <div class="bottom-buttons">
            ${this.saveButton}
          </div>
        </div>
      </gscape-dialog>
    `
  }

  onSubmit(callback: (id: string, op: FunctionNameEnum, parameters: VarOrConstant[]) => void) {
    this.submitCallback = callback
  }

  setAsCorrect(customText?: string): void {
    super.setAsCorrect()
    this.saveButton.hide()
  }

  show() {
    super.show()
    this.saveButton.show()
  }
}

customElements.define('sparqling-function-dialog', FunctionDialog as any)