import { ui } from "grapholscape"
import { html } from 'lit'
import { FilterExpressionOperatorEnum, VarOrConstantConstantTypeEnum, VarOrConstantTypeEnum } from "../../api/swagger"
import { getLoadingSpinner } from "../loading-spinner"
import { queryResultTemplate } from "../query-result-template"
import SparqlingFormDialog from "./base-form-dialog"
import { regexFlags } from "./filters/regex-flag-selection"

export function getFormTemplate(formComponent: SparqlingFormDialog, operators: string[]) {

  const op: string = formComponent.operator || operators[0]
  const dt: string = formComponent.datatypeFromOntology || VarOrConstantConstantTypeEnum.String
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
                ${getSelect(dt, Object.values(VarOrConstantConstantTypeEnum), formComponent.datatypeFromOntology !== undefined)}
              </div>`
            : null
          }
        </div>
        <div class="inputs-wrapper">
          ${formComponent.parametersIriOrConstants?.map((parameter, index) => getInput(index, formComponent.datatypeFromOntology, parameter.value, "Set input value"))}
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

          ${formComponent.acceptExamples
            ? html`
              <gscape-button 
                id="show-examples" 
                label="Show/Hide Examples"
                size='s' 
                title="Show/Hide examples"
              >
              </gscape-button>
            `
            : null
          }
        </div>
        ${formComponent.operator === FilterExpressionOperatorEnum.Regex
            ? html`
              <sparqling-regex-flag-select
                flags=${JSON.stringify(regexFlags)}
              ></sparqling-regex-flag-select>
            `
            : null
          }
      </form>
    </div>
    ${formComponent.examples
      ? html`
        ${formComponent.parametersType === VarOrConstantTypeEnum.Constant
          ? html`<input id="search-examples-input" placeholder="Search Examples" type="text" />`
          : null
        } 
        ${queryResultTemplate(formComponent.examples)}
      `
      : null
    }
    ${formComponent.loadingExamples ? getLoadingSpinner() : null }
    <div id="message-tray"></div>
  `
}

function getInput(index: number, datatype?: string, value: string = '', titleText = '') {
  if (datatype === VarOrConstantConstantTypeEnum.DateTime) {
    value = value?.split('T')[0] || 'value' // Take only date from ISO format 2022-01-01T00:00:....
  }
  let placeholder = value || 'value'

  const input = document.createElement('input')
  input.type = getInputType(datatype)
  input.placeholder = placeholder
  input.title = titleText
  input.setAttribute('index', (index + 1).toString())
  input.required = true
  input.value = value

  return html`${input}`
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

function getInputType(datatype?: VarOrConstantConstantTypeEnum | string) {
  switch(datatype) {
    case VarOrConstantConstantTypeEnum.DateTime:
      return 'date'
    case VarOrConstantConstantTypeEnum.Decimal:
    case 'xsd:integer':
    case 'xsd:int':
      return 'number'

    case VarOrConstantConstantTypeEnum.String:
      return 'text'

    default:
      return ''
  }
}