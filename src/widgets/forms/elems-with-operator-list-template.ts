import { html, css } from 'lit'
import { UI } from 'grapholscape'
import { Filter, FilterExpressionOperatorEnum, FunctionNameEnum, GroupByElement, Function, GroupByElementAggregateFunctionEnum } from '../../api/swagger'
import { edit, rubbishBin } from '../assets/icons'

export interface FilterWithID {
  id: number,
  value: Filter
}

export function getElemWithOperatorList(list: Filter[])
export function getElemWithOperatorList(list: GroupByElement[])
export function getElemWithOperatorList(list: Function[])
export function getElemWithOperatorList(list: FilterWithID[], editElemCallback, deleteElemCallback)
export function getElemWithOperatorList(list: any, editElemCallback?, deleteElemCallback?) {
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
      
      const editButton = new UI.GscapeButton(edit, 'Edit Filter')
      const deleteButton = new UI.GscapeButton(rubbishBin, 'Delete Filter')
      if (editElemCallback) {
        editButton.onClick = () => editElemCallback(elemWithOperator.id)
      }

      if (deleteElemCallback) {
        deleteButton.onClick = () => deleteElemCallback(elemWithOperator.id)
        deleteButton.classList.add('danger')
      }

      return html`
        <div class="elem-with-operator">
          <div
            class="operator"
            title="${operatorFullName}"
          >
            ${operator}</div>

          ${parameters
            ? html`
              <div class="parameters">
                ${parameters?.map((param, index) => {
                  if (index === 0) return null
                  return html`
                    <div class="parameter">
                      ${param.value}
                    </div>
                  `
                })}
              </div>
            `
            : null
          }
          ${editElemCallback ? editButton : null}
          ${deleteElemCallback ? deleteButton : null}
        </div>
      `
    })}
  `
}