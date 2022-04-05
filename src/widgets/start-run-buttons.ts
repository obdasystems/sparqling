import { html, css } from 'lit'
import { UI } from 'grapholscape'
import { playOutlined, sparqlingIcon } from './assets/icons'

export default class SparqlingStartRunButtons extends (UI.GscapeWidget as any) {
  isEnabled: boolean = true
  style: any
  startSparqlingButton: any
  runQueryButton: any
  isSparqlingRunning: boolean = false
  isLoading: boolean = false

  private _onSparqlingStartCallback = () => { }
  private _onSparqlingStopCallback = () => { }
  private _onQueryRunCallback = () => { }

  static get properties() {
    const superProps = super.properties
    
    const newProps = {
      isSparqlingRunning: { type: Boolean, attribute: false },
      isLoading: { type: Boolean }
    }

    Object.assign(superProps, newProps)
    return superProps
  }

  static get styles() {
    let super_styles = super.styles
    let colors = super_styles[1] as any

    return [
      super_styles[0],
      css`
        :host {
          order: 7;
          display:inline-block;
          position: initial;
          margin-top:10px;
        }

        #hr {
          height:1px;
          width:90%;
          margin: 0 auto;
          background-color: var(--theme-gscape-borders, ${colors.borders})
        }

        .lds-ripple {
          position: relative;
          width: var(--gscape-icon-size);
          height: var(--gscape-icon-size);
          padding: calc(var(--gscape-icon-size) * 0.2);
        }
        .lds-ripple div {
          position: absolute;
          border: 4px solid var(--theme-gscape-secondary);
          opacity: 1;
          border-radius: 50%;
          animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
        }
        .lds-ripple div:nth-child(2) {
          animation-delay: -0.5s;
        }
        @keyframes lds-ripple {
          0% {
            top: calc(var(--gscape-icon-size) / 2);
            left: calc(var(--gscape-icon-size) / 2);
            width: 0;
            height: 0;
            opacity: 1;
          }
          100% {
            top: 0px;
            left: 0px;
            width: var(--gscape-icon-size);
            height: var(--gscape-icon-size);
            opacity: 0;
          }
        }
      `,
    ]
  }

  constructor() {
    super()

    this.startSparqlingButton = new UI.GscapeButton(sparqlingIcon, 'Start/Stop Sparqling')
    this.startSparqlingButton.onClick = () => this.handleStartButtonCLick()
    this.startSparqlingButton.style.position = 'inherit'
    this.startSparqlingButton.classList.add('flat')
    this.startSparqlingButton.asSwitch = true
    this.startSparqlingButton.enabled = false

    this.runQueryButton = new UI.GscapeButton(playOutlined, 'Run Query')
    this.runQueryButton.disbaled = true
    this.runQueryButton.style.position = 'inherit'
    this.runQueryButton.classList.add('flat')
    this.runQueryButton.onClick = () => this._onQueryRunCallback()
    this.runQueryButton.enabled = false
  }

  render() {
    return html`
      ${this.runQueryButton}
      <div id="hr"></div>
      ${this.isLoading 
        ? html`<div class="lds-ripple"><div></div><div></div></div>` 
        : this.startSparqlingButton
      }
    `
  }

  show() {
    if (this.isEnabled) this.style.display = 'inline-block'
  }

  onSparqlingStart(callback) {
    this._onSparqlingStartCallback = callback
  }

  onSparqlingStop(callback) {
    this._onSparqlingStopCallback = callback
  }

  onQueryRun(callback) {
    this._onQueryRunCallback = callback
  }

  handleStartButtonCLick() {
    this.isSparqlingRunning ? this._onSparqlingStopCallback() : this._onSparqlingStartCallback()
  }

  startLoadingAnimation() {
    this.isLoading = true
  }

  stopLoadingAnimation() {
    this.isLoading = false
  }
}

customElements.define('sparqling-start-run-buttons', SparqlingStartRunButtons as any)