import FilterFunctionDialog, { CLASS_FIELD_ERROR, Modality } from "../base-form-dialog"
import { getFormTemplate, getSelect } from "../form-template"
import { html } from 'lit'
import { FilterExpressionOperatorEnum, GroupByElementAggregateFunctionEnum } from "../../../api/swagger"
import { FormID } from "../../../util/filter-function-interface"
import { UI } from "grapholscape"
import { addFilter, filter } from "../../assets/icons"

export default class AggregationDialog extends FilterFunctionDialog {
  private showHavingFormButton = new UI.GscapeButton(addFilter, "Add Having")
  private definingHaving: boolean


  constructor() {
    super()
    this.saveButton.label = "Save Aggregation"
    this.showHavingFormButton.label = "Filter Groups - Having"
    this.showHavingFormButton.classList.add('flat')
    this.havingOperator = GroupByElementAggregateFunctionEnum.Avarage
  }

  render() {
    return html`
      <gscape-dialog title="${this.modality} Aggregate Function for ${this.variable?.value}">
        <div class="dialog-body">
          <div id="select-aggregate-function">
            ${getSelect(this.aggregateOperator || "Aggregate Function", GroupByElementAggregateFunctionEnum)}
          </div>
          ${this.showHavingFormButton}

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

  onSubmit(callback: (headElementId: FormID, havingOperator: any, havingParameters: any[], aggregateOperator: GroupByElementAggregateFunctionEnum) => void) {
    this.submitCallback = callback
  }

  setAsCorrect(customText?: string): void {
    super.setAsCorrect()
    this.saveButton.hide()
  }

  show() {
    super.show()
    this.saveButton.show()
  }

  
}

customElements.define('sparqling-aggregation-dialog', AggregationDialog as any)