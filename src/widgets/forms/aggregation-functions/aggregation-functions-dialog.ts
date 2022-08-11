import { ui } from "grapholscape"
import { html, PropertyValueMap } from 'lit'
import { FilterExpressionOperatorEnum, GroupByElementAggregateFunctionEnum, VarOrConstant, VarOrConstantConstantTypeEnum } from "../../../api/swagger"
import { FormID } from "../../../util/filter-function-interface"
import { addFilter, sigma } from "../../assets/icons"
import SparqlingFormDialog from "../base-form-dialog"
import { getFormTemplate, getSelect } from "../form-template"
import { validateSelectElement } from "../validate-form"

export default class AggregationDialog extends SparqlingFormDialog {
  // private showHavingFormButton = new UI.GscapeButton(addFilter, "Add Having")
  definingHaving: boolean = false
  distinct: boolean = false
  formTitle = 'Having'

  static get properties() {
    const props = super.properties
    const newProps = {
      definingHaving: { type: Boolean, state: true },
      distinct: { type: Boolean, state: true },
    }

    return Object.assign(props, newProps)
  }

  render() {
    this.title = `${this.modality} aggregate function for ${this.variableName}`
    return html`
      <div class="gscape-panel">
        <div class="top-bar">
          <div id="widget-header" class="bold-text">
            ${sigma}
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
          <div style="text-align: center;">
            <div id="select-aggregate-function">
              ${getSelect(this.aggregateOperator || "Aggregate Function", Object.values(GroupByElementAggregateFunctionEnum))}
            </div>
            <div style="margin: 10px 0">
              <label>
                <input id="distinct-checkbox" type="checkbox" @click="${this.onDistinctChange}" ?checked=${this.distinct}>
                Only distinct values
              </label>
            </div>
          </div>
          
          ${!this.definingHaving
            ? html`
                <gscape-button title="Add Having" label="Filter Groups - Having" @click=${this.handleHavingButtonClick}>
                  <span slot="icon">${addFilter}</span>
                </gscape-button>
                <div id="message-tray"></div>
              `
            : getFormTemplate(this, Object.values(FilterExpressionOperatorEnum))
          }
          
          <div class="bottom-buttons">
            <gscape-button label="Cancel" @click=${this.hide}></gscape-button>
            <gscape-button type="primary" @click=${this.handleSubmit} label="Save Function"></gscape-button>
          </div>
        </div>
      </div>
    `
  }

  handleHavingButtonClick() {
    this.definingHaving = true
  }

  handleSubmit(): void {
    if (validateSelectElement(this.selectAggregateOperatorElem)) {
      if (this.definingHaving)
        super.handleSubmit() // this evaluate validity of the having too
      else
        this.onValidSubmit()
    }
  }

  protected onValidSubmit(): void {
    if (this._id && this.aggregateOperator && this.parameters)
      this.submitCallback(this._id, this.aggregateOperator, this.distinct, this.operator as FilterExpressionOperatorEnum, this.parameters)
  }

  onSubmit(callback: { (headElementId: FormID, aggregateOperator: GroupByElementAggregateFunctionEnum, distinct: boolean, havingOperator: FilterExpressionOperatorEnum, havingParameters: VarOrConstant[]): void }) {
    this.submitCallback = callback
  }

  setAsCorrect(customText?: string): void {
    super.setAsCorrect(customText)
    this.shadowRoot?.querySelector('gscape-button[type = "primary"]')?.remove()
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.firstUpdated(_changedProperties)

    if (this.selectAggregateOperatorElem) {
      this.selectAggregateOperatorElem.onchange = () => this.onAggregateOperatorChange(this.selectAggregateOperatorElem.value as GroupByElementAggregateFunctionEnum)
    }
  }

  private onAggregateOperatorChange(value: GroupByElementAggregateFunctionEnum) {
    this.aggregateOperator = value
  }

  private onDistinctChange(e: MouseEvent) {
    this.distinct = (e.target as HTMLFormElement).checked
  }

  protected get isAggregateOperatorValid() {
    return this.aggregateOperator && Object.values(GroupByElementAggregateFunctionEnum).includes(this.aggregateOperator)
  }

  protected get selectAggregateOperatorElem() {
    return this.shadowRoot?.querySelector('#select-aggregate-function > select') as HTMLSelectElement
  }

  get distinctCheckboxElem() {
    return this.shadowRoot?.querySelector('#distinct-checkbox')
  }

  get datatype(): VarOrConstantConstantTypeEnum | undefined {
    return super.datatype
  }

  public set datatype(value: VarOrConstantConstantTypeEnum | undefined) {
    super.datatype = value
  }
}

customElements.define('sparqling-aggregation-dialog', AggregationDialog as any)