import { ui } from "grapholscape";
import { css, html, LitElement, PropertyValueMap } from "lit";
import { QueryResult } from "../main";
import { preview } from "./assets/icons";
import { getLoadingSpinner, loadingSpinnerStyle } from "./loading-spinner";
import { queryResultTemplate, queryResultTemplateStyle } from "./query-result-template";
import sparqlingWidgetStyle from "./sparqling-widget-style";

export default class SparqlingQueryResults extends ui.ModalMixin(ui.BaseMixin(LitElement)) {
  result?: QueryResult
  isLoading = false
  title = 'Query Results Preview'
  allowSearch: boolean
  examplesSearchValue?: string
  private searchExamplesCallback = () => { }

  static properties = {
    result: { attribute: false },
    isLoading: { attribute: false, type: Boolean },
    allowSearch: { type: Boolean},
    exampleSearchValue: { type: String }
  }

  static styles = [
    ui.baseStyle,
    loadingSpinnerStyle,
    sparqlingWidgetStyle,
    queryResultTemplateStyle,
    css`
      .gscape-panel {
        position: absolute;
        top: 100px;
        left: 50%;
        transform: translate(-50%, 0);
        min-width: 200px;
        max-width: 800px;
        height: unset;
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

      .danger {
        color: var(--gscape-color-danger);
        padding: 8px;
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
        ${!this.result && !this.isLoading ? html`<div class="danger">Select Endpoint</div>` : null }
        ${this.result
          ? html`
            ${this.allowSearch 
              ? html`
                <input id="search-examples-input" placeholder="Search Examples" type="text" value=${this.examplesSearchValue} />
              `
              : null
            }
            ${queryResultTemplate(this.result)}
          `
          : null
        }
        ${this.isLoading ? getLoadingSpinner() : null }
      </div>
    </div>
    `
  }

  onSearchExamples(callback: () => void) {
    this.searchExamplesCallback = callback
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
    super.firstUpdated(_changedProperties)
    this.hide()
  }

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (this.allowSearch && this.searchExamplesInput) {
      this.searchExamplesInput.onchange = () => {
        this.examplesSearchValue = this.searchExamplesInput.value
      }

      this.searchExamplesInput.onkeyup = (e) => {
        if (e.key === 'Enter')
          this.searchExamplesCallback()
      }
    }
  }

  private get searchExamplesInput() {
    return this.shadowRoot?.querySelector('#search-examples-input') as HTMLInputElement
  }
}

customElements.define('sparqling-preview-dialog', SparqlingQueryResults)