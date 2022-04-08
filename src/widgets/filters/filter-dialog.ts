import { html } from "lit";
import { FilterExpressionOperatorEnum, VarOrConstant } from "../../api/swagger";
import { getFormTemplate } from "../filter-function-form-template";
import FilterFunctionDialog, { Modality } from "../filter-function-dialog";

export default class FilterDialog extends FilterFunctionDialog {
  _id: number
  protected submitCallback = (
    id: number,
    op: FilterExpressionOperatorEnum,
    parameters: VarOrConstant[]
  ) => { }
  protected deleteCallback = (filterId: number) => { }

  constructor() {
    super()
    this.saveButton.label = "Save Filter"
  }

  render() {
    return html`
      <gscape-dialog title="${this.modality} Filter for ${this.variable?.value}">
        <div class="dialog-body">
        ${getFormTemplate(this.operator, this.parametersIriOrConstants, FilterExpressionOperatorEnum, this.datatype)}
        
        <div class="bottom-buttons">
          ${this.saveButton}
          ${this.modality === Modality.EDIT ? this.deleteButton : null}
        </div>
        </div>
      </gscape-dialog>
    `
  }

  onSubmit(callback: (id: number, operator: FilterExpressionOperatorEnum, parameters: VarOrConstant[]) => void) {
    this.submitCallback = callback
  }

  onDelete(callback: (filterId: number) => void) {
    this.deleteCallback = callback
  }
}

customElements.define('sparqling-filter-dialog', FilterDialog as any)