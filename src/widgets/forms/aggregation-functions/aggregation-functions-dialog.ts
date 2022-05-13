import { UI } from "grapholscape"
import { html } from 'lit'
import { FilterExpressionOperatorEnum, GroupByElementAggregateFunctionEnum, VarOrConstant } from "../../../api/swagger"
import { FormID } from "../../../util/filter-function-interface"
import { addFilter, sigma } from "../../assets/icons"
import SparqlingFormDialog from "../base-form-dialog"
import { getFormTemplate, getSelect } from "../form-template"
import { validateSelectElement } from "../validate-form"

export default class AggregationDialog extends SparqlingFormDialog {
  private showHavingFormButton = new UI.GscapeButton(addFilter, "Add Having")
  private definingHaving: boolean = false
  private distinct: boolean = false
  private submitCallback: (
    headElementId: FormID,
    aggregateOperator: GroupByElementAggregateFunctionEnum,
    distinct:boolean,
    havingOperator: FilterExpressionOperatorEnum,
    havingParameters: VarOrConstant[]
  ) => void

  static get properties() {
    const props = super.properties

    props.definingHaving = { attribute: false }
    props.distinct = { attribute: false }
    return props
  }
  constructor() {
    super()
    this.saveButton.label = "Save Aggregation"
    this.showHavingFormButton.label = "Filter Groups - Having"
    this.showHavingFormButton.classList.add('flat')
    this.showHavingFormButton.onClick = () => { this.definingHaving = true }
    this.havingOperator = GroupByElementAggregateFunctionEnum.Avarage
    this.formTitle = "Having"
    this.left_icon = sigma
  }

  render() {
    return html`
      <gscape-head title="${this.modality} Aggregate Function for ${this.variableName}" class="drag-handler"></gscape-head>
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
          ? this.showHavingFormButton
          : getFormTemplate(this, Object.values(FilterExpressionOperatorEnum))
        }
        <div class="bottom-buttons">
          ${this.saveButton}
        </div>
      </div>
    `
  }

  firstUpdated(): void {
    super.firstUpdated()
    this.selectAggregateOperatorElem.onchange = (e) => this.onAggregateOperatorChange(e.currentTarget.value)
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
    this.submitCallback(this._id, this.aggregateOperator, this.distinct, this.operator as FilterExpressionOperatorEnum, this.parameters)
  }

  onSubmit(callback: { (headElementId: FormID, aggregateOperator: GroupByElementAggregateFunctionEnum, distinct: boolean, havingOperator: FilterExpressionOperatorEnum, havingParameters: VarOrConstant[]): void }) {
    this.submitCallback = callback
  }

  setAsCorrect(customText?: string): void {
    super.setAsCorrect(customText)
    this.saveButton.hide()
  }

  show() {
    super.show()
    this.saveButton.show()
    this.definingHaving = false
    this.distinct = false
    this.distinctCheckboxElem.checked = this.distinct
    this.aggregateOperator = null
  }

  private onAggregateOperatorChange(value: GroupByElementAggregateFunctionEnum) {
    this.aggregateOperator = value
  }

  private onDistinctChange(e: MouseEvent) {
    this.distinct = (e.target as HTMLFormElement).checked
  }

  protected get isAggregateOperatorValid() {
    return Object.values(GroupByElementAggregateFunctionEnum).includes(this.aggregateOperator)
  }

  protected get selectAggregateOperatorElem() {
    return this.shadowRoot.querySelector('#select-aggregate-function > select')
  }

  private get distinctCheckboxElem() {
    return this.shadowRoot.querySelector('#distinct-checkbox')
  }
}

customElements.define('sparqling-aggregation-dialog', AggregationDialog as any)