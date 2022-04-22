import SparqlingFormDialog, { Modality } from "../base-form-dialog"
import { getFormTemplate } from "../form-template"
import { html } from 'lit'
import { FunctionNameEnum, VarOrConstant } from "../../../api/swagger"
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
          ${getFormTemplate(this.operator, this.parametersIriOrConstants, FunctionNameEnum, this.datatype)}
        
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
}

customElements.define('sparqling-function-dialog', FunctionDialog as any)