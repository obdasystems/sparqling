import { html, css, LitElement } from 'lit'
import { playOutlined } from './assets/icons'
import sparqlingIcon from './assets/sparqling-icon'
import * as model from '../model'
import { ui } from 'grapholscape'

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
    css`
      :host {
        order: 8;
      }

      .lds-ring {
        width: 20px;
        height: 20px;
      }

      .lds-ring div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 16px;
        height: 16px;
        margin: 2px;
        border: 2px solid var(--gscape-color-accent);
        border-radius: 50%;
        animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: var(--gscape-color-accent) transparent transparent transparent;
      }
      .lds-ring div:nth-child(1) {
        animation-delay: -0.45s;
      }
      .lds-ring div:nth-child(2) {
        animation-delay: -0.3s;
      }
      .lds-ring div:nth-child(3) {
        animation-delay: -0.15s;
      }
      @keyframes lds-ring {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
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
      ? html`<div class="lds-ring btn-m" title="Sparqling is loading"><div></div><div></div><div></div><div></div></div>` 
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