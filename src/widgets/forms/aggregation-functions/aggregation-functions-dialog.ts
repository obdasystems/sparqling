import { UI } from "grapholscape"
import { html } from 'lit'
import { FilterExpressionOperatorEnum, GroupByElementAggregateFunctionEnum, VarOrConstantConstantTypeEnum } from "../../../api/swagger"
import { FormID } from "../../../util/filter-function-interface"
import { addFilter } from "../../assets/icons"
import SparqlingFormDialog, { CLASS_FIELD_ERROR } from "../base-form-dialog"
import { getFormTemplate, getSelect } from "../form-template"

export default class AggregationDialog extends SparqlingFormDialog {
  private showHavingFormButton = new UI.GscapeButton(addFilter, "Add Having")
  private definingHaving: boolean = false

  static get properties() {
    const props = super.properties

    props.definingHaving = { attribute: false }
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
      <gscape-dialog title="${this.modality} Aggregate Function for ${this.variable?.value}">
        <div class="dialog-body">
          <div id="select-aggregate-function">
            ${getSelect(this.aggregateOperator || "Aggregate Function", GroupByElementAggregateFunctionEnum)}
          </div>

          ${!this.definingHaving ? this.showHavingFormButton : null}

          ${getFormTemplate(
            this.operator, 
            this.parametersIriOrConstants, 
            FilterExpressionOperatorEnum, 
            this.datatype,
            "Having"
          )}
          <div class="bottom-buttons">
            ${this.saveButton}
          </div>
        </div>
      </gscape-dialog>
    `
  }

  handleSubmit(): void {
    if (this.definingHaving) {
      super.handleSubmit()
    } else {
      let errorsFound = false
      if (!this.isAggregateOperatorValid) {
        errorsFound = true
        this.selectAggregateOperatorElem.classList.add(CLASS_FIELD_ERROR.cssText)
        this.addMessage('Select aggregate function', 'error-message')
      }
  
      if (!errorsFound) {
        this.resetErrors()
        this.submitCallback(this._id, this.operator, this.parameters, this.aggregateOperator)
      }
    }
  }
 
  updated(): void {
    super.updated()

    const formSection = this.innerDialog.querySelector('.form').parentNode 
    if (!this.definingHaving) {
      formSection.classList.add('hide')
    } else {
      formSection.classList.remove('hide')
    }
  }

  onSubmit(callback: (headElementId: FormID, havingOperator: any, havingParameters: any[], aggregateOperator: GroupByElementAggregateFunctionEnum) => void) {
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
  }

  protected get datatype(): VarOrConstantConstantTypeEnum {
    return super.datatype
  }
  
}

customElements.define('sparqling-aggregation-dialog', AggregationDialog as any)