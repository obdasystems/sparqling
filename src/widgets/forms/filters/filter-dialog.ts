import { ui } from "grapholscape";
import { html } from "lit";
import { FilterExpressionOperatorEnum, VarOrConstant } from "../../../api/swagger";
import { FormID, FormOperator } from "../../../util/filter-function-interface";
import { filter, rubbishBin } from "../../assets/icons";
import SparqlingFormDialog, { Modality } from "../base-form-dialog";
import { getFormTemplate } from "../form-template";
import RegexFlagSelection from "./regex-flag-selection";

export default class FilterDialog extends SparqlingFormDialog {
  protected deleteCallback = (filterId: number) => { }

  static styles = super.styles

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
          ${getFormTemplate(this, this.operators)}
          
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

  // protected handleSubmit(): void {
  //   if (this.regexFlagSelector) {
  //     this.parameters?.push({
  //       value: Array.from(this.regexFlagSelector.selectedFlags).join(''),
  //       type: VarOrConstantTypeEnum.Constant,
  //       constantType: VarOrConstantConstantTypeEnum.String
  //     })
  //   }

  //   super.handleSubmit()
  // }

  get caseSensitiveCheckbox() {
    return this.shadowRoot?.querySelector('#case-sensitive') as HTMLInputElement | null
  }

  get isCaseSensitive() {
    return this.caseSensitiveCheckbox?.checked
  }

  protected get operators(): FormOperator[] {
    return Object.values(FilterExpressionOperatorEnum)
  }
}

customElements.define('sparqling-filter-dialog', FilterDialog as any)