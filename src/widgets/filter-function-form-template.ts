import { FilterExpressionOperatorEnum, FunctionNameEnum, VarOrConstant, VarOrConstantConstantTypeEnum, VarOrConstantTypeEnum } from "../api/swagger"
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
  operators: typeof FilterExpressionOperatorEnum | typeof FunctionNameEnum,
  datatype: VarOrConstantConstantTypeEnum) {

  const op:string = operator || "Operator"
  const dt:string = datatype || "Datatype"
  const addInputButton = new UI.GscapeButton(UI.icons.plus, "Add input value")
  addInputButton.id = "add-input-btn"

  return html`
    <div class="form">
      <div class="selects-wrapper">
        <div id="select-operator">
          <label>Operator</label>
          ${getSelect(op, operators)}
        </div>
        <div id="select-datatype">
          <label>Datatype</label>
          ${getSelect(dt, VarOrConstantConstantTypeEnum)}
        </div>
      </div>
      <div class="inputs-wrapper">
        ${parameters?.map((parameter, index) => getInput(index, parameter.value, "Set input value"))}
        ${operator === FilterExpressionOperatorEnum.In ||
          operator === FilterExpressionOperatorEnum.NotIn
          ? html`${addInputButton}`
          : null
        }
      </div>
    </div>
    <div id="message-tray"></div>
  `
}

function getInput(index: number, value?: string, titleText = '') {
  let placeholder = value || 'value'
  return html`
    <input
      placeholder="${placeholder}" 
      value="${value}"
      title="${titleText}"
      index="${index + 1}"
    />`
}

function getSelect(defaultOpt: string, options: object = {}) {
  const isDefaultAlreadySet = Object.values(options).includes(defaultOpt)
  return html`
    <select>
      ${isDefaultAlreadySet ? null : html`<option selected>${defaultOpt}</option>`}
      ${Object.keys(options).map(key => {
        if (options[key] === defaultOpt)
          return html`<option value="${key}" selected>${options[key]}</option>`
        else
          return html`<option value="${key}">${options[key]}</option>`
      })}
    </select>
  `
}