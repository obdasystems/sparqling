import { FilterExpressionOperatorEnum, FunctionNameEnum, GroupByElementAggregateFunctionEnum, VarOrConstant, VarOrConstantConstantTypeEnum, VarOrConstantTypeEnum } from "../../api/swagger"
import { html } from 'lit'
import { UI } from 'grapholscape'

// export function getfilterFormTemplate(
//   operator: FilterExpressionOperatorEnum,
//   parameters: VarOrConstant[],
//   datatype: VarOrConstantConstantTypeEnum) {
//   return getFormTemplate(operator, parameters, FilterExpressionOperatorEnum, datatype)
// }

// export function getFunctionFormTemplate(
//   operator: FilterExpressionOperatorEnum,
//   parameters: VarOrConstant[],
//   datatype: VarOrConstantConstantTypeEnum) {
//   return getFormTemplate(operator, parameters, FunctionNameEnum, datatype)
// }


export function getFormTemplate(
  operator: FilterExpressionOperatorEnum | FunctionNameEnum,
  parameters: VarOrConstant[],
  operators: string[],
  datatype: VarOrConstantConstantTypeEnum,
  formTitle?: string) {

  const op:string = operator || "Operator"
  const dt:string = datatype || "Datatype"
  const addInputButton = new UI.GscapeButton(UI.icons.plus, "Add input value")
  addInputButton.id = "add-input-btn"

  return html`
    <div class="section">
      ${formTitle ? html`<div class="section-header">${formTitle}</div>` : null}
      <form id="form-dialog" class="form" action="javascript:void(0)" onsubmit="this.handleSubmit">
        <div class="selects-wrapper">
          <div id="select-operator">
            <label>Operator</label>
            ${getSelect(op, operators)}
          </div>
          <div id="select-datatype">
            <label>Datatype</label>
            ${getSelect(dt, Object.values(VarOrConstantConstantTypeEnum))}
          </div>
        </div>
        <div class="inputs-wrapper">
          ${parameters?.map((parameter, index) => getInput(index, datatype, parameter.value, "Set input value"))}
          ${operator === FilterExpressionOperatorEnum.In ||
            operator === FilterExpressionOperatorEnum.NotIn
            ? html`${addInputButton}`
            : null
          }
        </div>
      </form>
    </div>
    <div id="message-tray"></div>
  `
}

function getInput(index: number, datatype: VarOrConstantConstantTypeEnum, value?: string, titleText = '') {
  if (datatype === VarOrConstantConstantTypeEnum.DateTime) {
    value = value?.split('T')[0] || 'value' // Take only date from ISO format 2022-01-01T00:00:....
  }
  let placeholder = value || 'value'
  return html`
    <input
      class="input-elem"
      type="${getInputType(datatype)}"
      placeholder="${placeholder}"
      value="${value}"
      title="${titleText}"
      index="${index + 1}"
      required
    />`
}

export function getSelect(defaultOpt: string, options: string[]) {
  const isDefaultAlreadySet = options.includes(defaultOpt)
  return html`
    <select required>
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

function getInputType(datatype: VarOrConstantConstantTypeEnum) {
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