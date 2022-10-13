import { ui } from "grapholscape"
import { css, html, LitElement, PropertyValueMap } from "lit"
import { isLoading } from "../model"
import { getLoadingSpinner, loadingSpinnerStyle } from "./loading-spinner"

export default class LoadingDialog extends ui.BaseMixin(LitElement) {

  static styles = [
    loadingSpinnerStyle,
    ui.baseStyle,
    css`
      :host {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 100;
      }

      .lds-ring {
        width: 30px;
        height: 30px;
      }

      .lds-ring div {
        width: 26px;
        height: 26px;
      }

      .spinner {
        display: flex;
        padding: 8px;
        justify-content: center;
      }
    `
  ]

  render() {
    return html`
      <div class="gscape-panel">
        <div class="header">Sparqling is loading...</div>
        <div class="spinner">${getLoadingSpinner()}</div>
      </div>
    `
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    this.hide()
  }
}

customElements.define('sparqling-loading-dialog', LoadingDialog)