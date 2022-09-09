import { html, css, LitElement } from 'lit'
import { playOutlined } from './assets/icons'
import sparqlingIcon from './assets/sparqling-icon'
import * as model from '../model'
import { ui } from 'grapholscape'
import { getLoadingSpinner, loadingSpinnerStyle } from './loading-spinner'

export default class SparqlingStartRunButtons extends ui.BaseMixin(LitElement) {
  private isLoading: boolean = false

  public startSparqlingButton: any
  public runQueryButton: any
  public canQueryRun: boolean = false

  private _onSparqlingStartCallback = () => { }
  private _onSparqlingStopCallback = () => { }
  private _onQueryRunCallback = () => { }

  static properties = {
    canQueryRun: { type: Boolean, attribute: false },
    isLoading: { type: Boolean, attribute: false },
  }

  static styles = [
    ui.GscapeButtonStyle,
    ui.baseStyle,
    loadingSpinnerStyle,
    css`
      :host {
        order: 8;
      }
    `,
  ]

  constructor() {
    super()
    this.classList.add(ui.BOTTOM_RIGHT_WIDGET_CLASS.toString())
  }

  render() {
    return html`
    ${this.canQueryRun
      ? html`
          <gscape-button
            @click="${this._onQueryRunCallback}"
            type="subtle"
            title="Send query to SPARQL endpoint"
          >
            <span slot="icon">${playOutlined}</span>
          </gscape-button>
          <div class="hr"></div>
        `
      : null
    }

    ${this.isLoading 
      ? getLoadingSpinner()
      : html`
        <gscape-button
          @click="${this.handleStartButtonCLick}" 
          type="subtle"
          title="Start/Stop Sparqling"
          ?active=${model.isSparqlingRunning()}
        >
          <span slot="icon">${sparqlingIcon}</span>
        </gscape-button>
      `
    }

    `
  }

  onSparqlingStart(callback: () => void) {
    this._onSparqlingStartCallback = callback
  }

  onSparqlingStop(callback: () => void) {
    this._onSparqlingStopCallback = callback
  }

  onQueryRun(callback: () => void) {
    this._onQueryRunCallback = callback
  }

  private handleStartButtonCLick() {
    model.isSparqlingRunning() ? this._onSparqlingStopCallback() : this._onSparqlingStartCallback()
  }

  startLoadingAnimation() {
    this.isLoading = true
  }

  stopLoadingAnimation() {
    this.isLoading = false
  }

  get startButton() {
    return this.shadowRoot?.querySelector('')
  }
}

customElements.define('sparqling-start-run-buttons', SparqlingStartRunButtons)