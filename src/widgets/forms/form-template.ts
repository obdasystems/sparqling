import { ui } from "grapholscape"
import { html } from 'lit'
import { FilterExpressionOperatorEnum, VarOrConstantConstantTypeEnum, VarOrConstantTypeEnum } from "../../api/swagger"
import SparqlingFormDialog from "./base-form-dialog"

export function getFormTemplate(formComponent: SparqlingFormDialog, operators: string[]) {

  const op: string = formComponent.operator || "Operator"
  const dt: string = formComponent.datatype || "Datatype"
  // const addInputButton = new UI.GscapeButton(UI.icons.plus, "Add input value")
  // addInputButton.id = "add-input-btn"

  return html`
    <div class="section">
      ${formComponent.formTitle ? html`<div class="header">${formComponent.formTitle}</div>` : null}
      <form id="form-dialog" class="form" action="javascript:void(0)" onsubmit="this.handleSubmit">
        <div class="selects-wrapper">
          <div id="select-operator">
            <label>Operator</label>
            ${getSelect(op, operators)}
          </div>
          ${formComponent.parametersType === VarOrConstantTypeEnum.Constant
            ? html`
              <div id="select-datatype">
                <label>Datatype</label>
                ${getSelect(dt, Object.values(VarOrConstantConstantTypeEnum), formComponent.datatype !== undefined)}
              </div>`
            : null
          }
        </div>
        <div class="inputs-wrapper">
          ${formComponent.parametersIriOrConstants?.map((parameter, index) => getInput(index, formComponent.datatype, parameter.value, "Set input value"))}
          ${formComponent.operator === FilterExpressionOperatorEnum.In ||
            formComponent.operator === FilterExpressionOperatorEnum.NotIn
            ? html`
              <div>
                <gscape-button id="add-input-btn" type="subtle" title="Add input value">
                  <span slot="icon">${ui.icons.plus}</span>
                </gscape-button>
                ${formComponent.parameters && formComponent.parameters.length > 3 // at least 3 custom inputs to remove one
                  ? html`
                    <gscape-button id="remove-input-btn" type="subtle" title="Remove input value">
                      <span slot="icon">${ui.icons.minus}</span>
                    </gscape-button>
                  `
                  : null
                }
              </div>
            `
            : null
          }
        </div>
      </form>
    </div>
    <div id="message-tray"></div>
  `
}

function getInput(index: number, datatype?: VarOrConstantConstantTypeEnum, value?: string, titleText = '') {
  if (datatype === VarOrConstantConstantTypeEnum.DateTime) {
    value = value?.split('T')[0] || 'value' // Take only date from ISO format 2022-01-01T00:00:....
  }
  let placeholder = value || 'value'

  return html`
    <input
      type="${getInputType(datatype)}"
      placeholder="${placeholder}"
      value="${value}"
      title="${titleText}"
      index="${index + 1}"
      required
    />`
}

export function getSelect(defaultOpt: string, options: string[], disabled = false) {
  const isDefaultAlreadySet = options.includes(defaultOpt)
  return html`
    <select required ?disabled=${disabled}>
      ${isDefaultAlreadySet ? null : html`<option value="" hidden selected>${defaultOpt}</option>`}
      ${options.map(op => {
        if (op === defaultOpt)
          return html`<option value="${op}" selected>${op}</option>`
        else
          return html`<option value="${op}">${op}</option>`
      })}
    </select>
  `
}

function getInputType(datatype?: VarOrConstantConstantTypeEnum) {
  switch(datatype) {
    case VarOrConstantConstantTypeEnum.DateTime:
      return 'date'
    case VarOrConstantConstantTypeEnum.Decimal:
      return 'number'

    case VarOrConstantConstantTypeEnum.String:
      return 'text'

    default:
      return ''
  }
}