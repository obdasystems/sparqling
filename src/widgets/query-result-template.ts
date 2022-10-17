import { ui } from "grapholscape";
import { css, html } from "lit";
import { QueryResult } from "../main";

export function queryResultTemplate(queryResult: QueryResult, includeSearch = false, onSearch?: () => void) {  
  return html`
    <table id="query-results">
      <tr>${queryResult.headTerms.map(columnName => html`<th>${columnName}</th>`)}</tr>
      ${queryResult.results.map(resultRow => {
        return html`<tr>${resultRow.map(resultItem => html`<td>${resultItem.value}</td>`)}</tr>`
      })}
    </table>
    ${queryResult.results.length === 0
      ? html`
      <div class="blank-slate">
        ${ui.icons.searchOff}
        <div class="header">No results available</div>
      </div>
      `
      : null
    }
  `
}

export const queryResultTemplateStyle = css`
  #query-results {
    width: 100%;
    background: var(--gscape-color-bg-inset);
    border-radius: var(--gscape-border-radius);
    border: solid 1px var(--gscape-color-border-subtle);
    border-collapse: collapse;
    white-space: pre;
  }

  #query-results th {
    border-bottom: solid 1px var(--gscape-color-border-subtle);
  }

  #query-results td, #query-results th {
    padding: 4px 8px
  }

  #query-results tr:hover {
    background-color: var(--gscape-color-neutral-muted);
  }
`