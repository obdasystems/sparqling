import { html, css } from 'lit'
import { UI } from 'grapholscape'
import { edit, rubbishBin } from '../assets/icons'
import { Filter, FilterExpressionOperatorEnum } from '../../api/swagger'

export interface FilterWithID {
  id: number,
  value: Filter
} 

export function getFilterListTemplate(filterList: FilterWithID[], editFilterCallback, deleteFilterCallback) {
  return html`
    ${filterList?.map(filter => {
      const editButton = new UI.GscapeButton(edit, 'Edit Filter')
      editButton.onClick = () => editFilterCallback(filter.id)
      const deleteButton = new UI.GscapeButton(rubbishBin, 'Delete Filter')
      deleteButton.onClick = () => deleteFilterCallback(filter.id)
      deleteButton.classList.add('danger')
      return html`
        <div class="filter">
          <div
            class="operator"
            title="${Object.keys(FilterExpressionOperatorEnum).find(k => FilterExpressionOperatorEnum[k] === filter.value.expression.operator)}"
          >
            ${filter.value.expression.operator}</div>
          <div class="parameters">
            ${filter.value?.expression?.parameters?.map((param, index) => {
              if (index === 0) return null
              return html`
                <div class="parameter">
                  ${param.value}
                </div>
              `
            })}
          </div>
          ${editButton}
          ${deleteButton}
        </div>
      `
    })}
  `
}

export function getFilterListStyle() {
  return css`
    .filter {
      display: flex;
      gap: 10px;
      align-items:center;
    }

    .parameters {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex-grow:2;
      min-width: 0;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .operator {
      font-weight:bold;
      font-size:110%;
    }

    .operator, .parameter {
      padding: 4px 6px;
      padding-bottom: 2px;
      border-radius: 6px;
      background-color: var(--theme-gscape-primary);
      color: var(--theme-gscape-on-primary);
      line-height: 1;
    }
  `
}