import { ui } from "grapholscape";
import { css, html, LitElement, PropertyValueMap } from "lit";
import { error } from "./assets/icons";
import sparqlingWidgetStyle from "./sparqling-widget-style";

export default class ErrorsDialog extends ui.BaseMixin(LitElement) {

  errorText: string = ''

  static properties = {
    errorText: { attribute: false, type: String }
  }

  static styles = [
    ui.baseStyle,
    sparqlingWidgetStyle,
    css`
      :host {
        position: absolute;
        top: 100px;
        left: 50%;
        transform: translate(-50%, 0)
      }

      .dialog-body {
        display: flex;
        flex-direction: column;
        gap: 30px;
        align-items: center;
        min-width: 350px;
        max-width: 450px;
        padding: 16px 8px;
        background: var(--gscape-color-danger-subtle);
      }

      .dialog-body, #widget-header {
        color: var(--gscape-color-danger);
      }
    `
  ]

  render() {
    return html`
      <div class="gscape-panel">
        <div class="top-bar">
          <div id="widget-header" class="bold-text">
            ${error}
            <span>Error</span>
          </div>

          <gscape-button 
            id="toggle-panel-button"
            size="s" 
            type="subtle"
            @click=${this.hide}
          > 
            <span slot="icon">${ui.icons.close}</span>
          </gscape-button>
        </div>

        <div class="dialog-body">
          ${this.errorText}
        </div>
      </div>
    `
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.firstUpdated(_changedProperties)
    this.hide()
  }

}

customElements.define('error-dialog', ErrorsDialog)