import { html } from "lit";
import { FilterExpressionOperatorEnum, VarOrConstant } from "../../../api/swagger";
import { getFormTemplate } from "../form-template";
import SparqlingFormDialog, { Modality } from "../base-form-dialog";
import { FormID } from "../../../util/filter-function-interface";
import { filter } from "../../assets/icons";

export default class FilterDialog extends SparqlingFormDialog {
  protected deleteCallback = (filterId: number) => { }

  constructor() {
    super()
    this.saveButton.label = "Save Filter"
    this.left_icon = filter
  }

  render() {
    return html`
      <gscape-head title="${this.modality} Filter for ${this.variableName}" class="drag-handler"></gscape-head>
      <div class="dialog-body">
        ${getFormTemplate(this, Object.values(FilterExpressionOperatorEnum))}
        
        <div class="bottom-buttons">
          ${this.saveButton}
          ${this.modality === Modality.EDIT ? this.deleteButton : null}
        </div>
      </div>
    `
  }

  onSubmit(callback: (filterId: FormID, filterOperator: FilterExpressionOperatorEnum, parameters: VarOrConstant[]) => void) {
    this.submitCallback = callback
  }

  onDelete(callback: (filterId: number) => void) {
    this.deleteCallback = callback
  }
}

customElements.define('sparqling-filter-dialog', FilterDialog as any)