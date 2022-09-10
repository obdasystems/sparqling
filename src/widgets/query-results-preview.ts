import { ui } from "grapholscape";
import { css, html, LitElement, PropertyValueMap } from "lit";
import { QueryResult } from "../main";
import { preview } from "./assets/icons";
import { getLoadingSpinner, loadingSpinnerStyle } from "./loading-spinner";
import { queryResultTemplate, queryResultTemplateStyle } from "./query-result-template";
import sparqlingWidgetStyle from "./sparqling-widget-style";

export default class SparqlingQueryResults extends ui.BaseMixin(LitElement) {
  result?: QueryResult
  isLoading = false
  title = 'Query Results Preview'

  static properties = {
    result: { attribute: false },
    isLoading: { attribute: false, type: Boolean }
  }

  static styles = [
    ui.baseStyle,
    loadingSpinnerStyle,
    sparqlingWidgetStyle,
    queryResultTemplateStyle,
    css`
      :host {
        position: absolute;
        top: 100px;
        left: 50%;
        transform: translate(-50%, 0);
        min-width: 200px;
        max-width: 800px;
      }

      .dialog-body {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
        padding: 8px;
        max-height: 400px;
        overflow: scroll;
        scrollbar-width: inherit;
      }

      .gscape-panel {
        max-height: 450px;
      }
    `
  ]

  render() {
    return html`
    <div class="gscape-panel">
      <div class="top-bar">
        <div id="widget-header" class="bold-text">
          ${preview}
          <span>${this.title}</span>
        </div>

        <gscape-button 
          id="toggle-panel-button"
          size="s" 
          type="subtle"
          @click=${this.hide}
          title="Close"
        > 
          <span slot="icon">${ui.icons.close}</span>
        </gscape-button>
      </div>

      <div class="dialog-body">
        ${this.result ? queryResultTemplate(this.result) : null }
        ${this.isLoading ? getLoadingSpinner() : null }
      </div>
    </div>
    `
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
    super.firstUpdated(_changedProperties)
    this.hide()
  }
}

customElements.define('sparqling-preview-dialog', SparqlingQueryResults)