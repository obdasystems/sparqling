import { html, HTMLTemplateResult } from 'lit'
import { Filter, FilterExpressionOperatorEnum, FunctionNameEnum, GroupByElement, Function, GroupByElementAggregateFunctionEnum, VarOrConstantConstantTypeEnum, VarOrConstant } from '../../api/swagger'
import { edit, rubbishBin } from '../assets/icons'
import trayButtonTemplate from '../tray-button-template'

export interface FilterWithID {
  id: number,
  value: Filter
}

export function getElemWithOperatorList(list: Filter[]): HTMLTemplateResult
export function getElemWithOperatorList(list: GroupByElement[]): HTMLTemplateResult
export function getElemWithOperatorList(list: Function[]): HTMLTemplateResult
export function getElemWithOperatorList(list: FilterWithID[], editElemCallback, deleteElemCallback): HTMLTemplateResult
export function getElemWithOperatorList(list?: any, editElemCallback?, deleteElemCallback?): HTMLTemplateResult {
  return html`
    ${list?.map((elemWithOperator: any) => {
      const elem = elemWithOperator.value || elemWithOperator
      const operator = elem?.expression?.operator || elem.name || elem.aggregateFunction
      if (!operator) return null

      const parameters = elem.expression?.parameters || elem.parameters

      const operatorFullName =
        Object.keys(FilterExpressionOperatorEnum).find(k => FilterExpressionOperatorEnum[k] === elem.expression?.operator)
        || Object.keys(FunctionNameEnum).find(k => FunctionNameEnum[k] === elem.name)
        || Object.keys(GroupByElementAggregateFunctionEnum).find(k => GroupByElementAggregateFunctionEnum[k] === elem.aggregateFunction)
      
      // const editButton = new UI.GscapeButton(edit, 'Edit Filter')
      // const deleteButton = new UI.GscapeButton(rubbishBin, 'Delete Filter')
      // if (editElemCallback) {
      //   editButton.onClick = () => editElemCallback(elemWithOperator.id)
      // }

      // if (deleteElemCallback) {
      //   deleteButton.onClick = () => deleteElemCallback(elemWithOperator.id)
      //   deleteButton.classList.add('danger')
      // }

      return html`
        <div class="elem-with-operator">
          <div class="chip" title="${operatorFullName}">${operator}</div>

          ${parameters
            ? html`
              <div class="parameters">
                ${parameters?.map((param: VarOrConstant, index:number) => {
                  if (index === 0) return null
                  let value = param.value
                  if (param.constantType === VarOrConstantConstantTypeEnum.DateTime) {
                    value = value?.split('T')[0] || value // Take only date from ISO format 2022-01-01T00:00:....
                  }

                  if (operator === FilterExpressionOperatorEnum.Regex && index === 2) {
                    return html`<div class="parameter ellipsed"><strong>Flags:</strong><span style="margin-left: 8px">${value}</span></div>`
                  } else {
                    return html`<div class="parameter ellipsed">${value}</div>`
                  }
                })}
              </div>
            `
            : null
          }

          <div>
            ${editElemCallback 
              ? trayButtonTemplate('Edit', edit, undefined, `edit-${elemWithOperator.id}`, () => editElemCallback(elemWithOperator.id))
              : null
            }
            ${deleteElemCallback
              ? trayButtonTemplate('Delete', rubbishBin, undefined, `delete-${elemWithOperator.id}`, () => deleteElemCallback(elemWithOperator.id))
              : null
            }
          </div>
        </div>
      `
    })}
  `
}