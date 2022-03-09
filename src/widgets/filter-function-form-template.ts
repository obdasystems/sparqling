import { FilterExpressionOperatorEnum, FunctionNameEnum, VarOrConstant, VarOrConstantConstantTypeEnum, VarOrConstantTypeEnum } from "../api/swagger"
import { html } from 'lit'

export function filterFormTemplate(
  operator: FilterExpressionOperatorEnum,
  parameters: VarOrConstant[],
  datatype: VarOrConstantConstantTypeEnum) {
  return getFormTemplate(operator, parameters, FilterExpressionOperatorEnum, datatype)
}

export function FunctionFormTemplate(
  operator: FilterExpressionOperatorEnum,
  parameters: VarOrConstant[],
  datatype: VarOrConstantConstantTypeEnum) {
  return getFormTemplate(operator, parameters, FunctionNameEnum, datatype)
}

function getFormTemplate(
  operator: FilterExpressionOperatorEnum | FunctionNameEnum,
  parameters: VarOrConstant[],
  operators: typeof FilterExpressionOperatorEnum | typeof FunctionNameEnum,
  datatype: VarOrConstantConstantTypeEnum) {
  return html`
    <div class="form">
      <div class="selects-wrapper">
        ${getSelect(operator, operators)}
        ${getSelect(datatype, VarOrConstantConstantTypeEnum)}
      </div>
      <div class="input-wrapper">
        ${parameters.map(parmeter => {
    html`${getInput(parmeter.value, "Set input value")}`
  })}
        ${operator === FilterExpressionOperatorEnum.In || operator === FilterExpressionOperatorEnum.NotIn
      ? html`${this.localizeButton}`
      : null
    }
      </div>
    </div>
  `
}

function getInput(value?: string, titleText = '', id: string | number = '') {
  let placeholder = value || 'value'
  return html`
    <input
      placeholder="${placeholder}" 
      value="${value}"
      title="${titleText}"
    />`
}

function getSelect(defaultOpt: string, options: object) {
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