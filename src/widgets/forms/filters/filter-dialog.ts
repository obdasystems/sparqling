import { html } from "lit";
import { FilterExpressionOperatorEnum, VarOrConstant } from "../../../api/swagger";
import { getFormTemplate } from "../form-template";
import SparqlingFormDialog, { Modality } from "../base-form-dialog";
import { FormID } from "../../../util/filter-function-interface";
import { checkmark, filter, rubbishBin } from "../../assets/icons";
import { ui } from "grapholscape";

export default class FilterDialog extends SparqlingFormDialog {
  protected deleteCallback = (filterId: number) => { }

  static styles = super.styles

  constructor() {
    super()
    // this.saveButton.label = "Save Filter"
  }

  render() {
    this.title = `${this.modality} filter for ${this.variableName}`
    return html`
      <div class="gscape-panel">
        <div class="top-bar">
          <div id="widget-header" class="bold-text">
            ${filter}
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
          ${getFormTemplate(this, Object.values(FilterExpressionOperatorEnum))}
          
          <div class="bottom-buttons">
            ${this.modality === Modality.EDIT
              ? html`
                <gscape-button type="subtle" title="Delete" style="margin-right: auto" id="delete-button" @click=${this.handleDeleteClick}>
                  <span slot="icon">${rubbishBin}</span>
                </gscape-button>
              `
              : null
            }
            <gscape-button label="Cancel" @click=${this.hide}></gscape-button>
            <gscape-button type="primary" @click=${this.handleSubmit} label="Save Filter"></gscape-button>
          </div>
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

  private handleDeleteClick() {
      this.deleteCallback(this._id as number)
  }
}

customElements.define('sparqling-filter-dialog', FilterDialog as any)