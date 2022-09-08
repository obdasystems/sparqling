import { css, html } from "lit";

export function iriExamplesTemplate(results: string[]) {
  return html`
    <table id="iri-examples">
      ${results.map(resultItem => html`<tr>${resultItem}</tr>`)}
    </table>
  `
}

export const queryResultTemplateStyle = css`
  table {
    width: 100%;
    background: var(--gscape-color-bg-inset);
    padding: 4px 8px;
    border-radius: var(--gscape-border-radius);
    border: solid 1px var(--gscape-color-border-subtle);
  }
`