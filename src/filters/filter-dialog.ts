import { html } from "lit";
import { FilterExpressionOperatorEnum } from "../api/swagger";
import { getFormTemplate } from "../widgets/filter-function-form-template";
import FilterFunctionDialog, { Modality } from "./filter-function-dialog";

export default class FilterDialog extends FilterFunctionDialog {
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
}

customElements.define('sparqling-filter-dialog', FilterDialog as any)