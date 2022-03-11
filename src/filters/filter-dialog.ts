import { html } from "lit";
import { FilterExpressionOperatorEnum } from "../api/swagger";
import { getFormTemplate } from "../widgets/filter-function-form-template";
import FilterFunctionDialog from "./filter-function-dialog";

export default class FilterDialog extends FilterFunctionDialog {
  constructor() {
    super()
    this.saveButton.label = "Save Filter"
  }

  render() {
    return html`
      <gscape-dialog title="Define Filter for ${this.variable?.value}">
        <div class="dialog-body">
        ${getFormTemplate(this.operator, this.parametersIriOrConstants, FilterExpressionOperatorEnum, this.datatype)}
        ${this.saveButton}
        </div>
      </gscape-dialog>
    `
  }
}

customElements.define('sparqling-filter-dialog', FilterDialog as any)