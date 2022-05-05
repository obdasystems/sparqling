import { UI } from "grapholscape"
import { html } from 'lit'
import { FilterExpressionOperatorEnum, GroupByElementAggregateFunctionEnum, VarOrConstant, VarOrConstantConstantTypeEnum } from "../../../api/swagger"
import { FormID } from "../../../util/filter-function-interface"
import { addFilter } from "../../assets/icons"
import SparqlingFormDialog from "../base-form-dialog"
import { getFormTemplate, getSelect } from "../form-template"

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
  }

  render() {
    return html`
      <gscape-dialog title="${this.modality} Aggregate Function for ${this.variableName}">
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
            : getFormTemplate(
                this.operator,
                this.parametersIriOrConstants,
                Object.values(FilterExpressionOperatorEnum),
                this.datatype,
                this.parametersType,
                "Having"
              )
          }
          <div class="bottom-buttons">
            ${this.saveButton}
          </div>
        </div>
      </gscape-dialog>
    `
  }

  firstUpdated(): void {
    super.firstUpdated()
    this.selectAggregateOperatorElem.onchange = (e) => this.onAggregateOperatorChange(e.currentTarget.value)
  }

  handleSubmit(): void {
    if (this.selectAggregateOperatorElem.reportValidity()) {
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

  private onAggregateOperatorChange(value: string) {
    this.aggregateOperator = GroupByElementAggregateFunctionEnum[value]
  }

  private onDistinctChange(e: MouseEvent) {
    this.distinct = (e.target as HTMLFormElement).checked
  }

  protected get datatype(): VarOrConstantConstantTypeEnum {
    return super.datatype
  }

  protected set datatype(value) {
    super.datatype = value
  }

  protected get isAggregateOperatorValid() {
    return Object.values(GroupByElementAggregateFunctionEnum).includes(this.aggregateOperator)
  }

  protected get selectAggregateOperatorElem() {
    return this.innerDialog.querySelector('#select-aggregate-function > select')
  }

  private get distinctCheckboxElem() {
    return this.innerDialog.querySelector('#distinct-checkbox')
  }
}

customElements.define('sparqling-aggregation-dialog', AggregationDialog as any)