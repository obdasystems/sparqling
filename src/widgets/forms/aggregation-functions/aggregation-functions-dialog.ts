import { UI } from "grapholscape"
import { html } from 'lit'
import { FilterExpressionOperatorEnum, GroupByElementAggregateFunctionEnum, VarOrConstantConstantTypeEnum } from "../../../api/swagger"
import { FormID } from "../../../util/filter-function-interface"
import { addFilter } from "../../assets/icons"
import SparqlingFormDialog, { CLASS_FIELD_ERROR, ValidationCheck } from "../base-form-dialog"
import { getFormTemplate, getSelect } from "../form-template"

export default class AggregationDialog extends SparqlingFormDialog {
  private showHavingFormButton = new UI.GscapeButton(addFilter, "Add Having")
  private definingHaving: boolean = false
  private aggregateOperatorValidityCheck: ValidationCheck

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

  firstUpdated(): void {
    super.firstUpdated()
    this.aggregateOperatorValidityCheck = {
      name: 'isAggregateOperatorValid',
      errorMessage: 'Select Aggregate Function',
      elem: this.selectAggregateOperatorElem
    }
    this.selectAggregateOperatorElem.onchange = (e) => this.onAggregateOperatorChange(e.currentTarget.value)
  }

  handleSubmit(): void {
    if (this.definingHaving) {
      super.handleSubmit()
    } else {
      super.handleSubmit([this.aggregateOperatorValidityCheck])
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

    this.validationChecks.push(this.aggregateOperatorValidityCheck)
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

  private onAggregateOperatorChange(value: string) {
    this.aggregateOperator = GroupByElementAggregateFunctionEnum[value]
    this.selectAggregateOperatorElem.classList.remove(CLASS_FIELD_ERROR.cssText)
  }

  protected get datatype(): VarOrConstantConstantTypeEnum {
    return super.datatype
  }

  protected get isAggregateOperatorValid() {
    return Object.values(GroupByElementAggregateFunctionEnum).includes(this.aggregateOperator)
  }

  protected get selectAggregateOperatorElem() {
    return this.innerDialog.querySelector('#select-aggregate-function > select')
  }
}

customElements.define('sparqling-aggregation-dialog', AggregationDialog as any)