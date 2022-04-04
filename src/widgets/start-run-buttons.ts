import { html, css } from 'lit'
import { UI } from 'grapholscape'
import { sparqlingIcon } from './assets/icons'

export default class SparqlingStartRunButtons extends UI.GscapeWidget {
  isEnabled: boolean = true
  style: any
  startSparqlingButton: UI.GscapeButton
  runQueryButton: UI.GscapeButton
  isSparqlingRunning: boolean = false

  private _onSparqlingStartCallback = () => { }
  private _onSparqlingStopCallback = () => { }
  private _onQueryRunCallback = () => { }

  static get properties() {
    return {
      isSparqlingRunning: { type: Boolean, attribute: false }
    }
  }

  static get styles() {
    let super_styles = super.styles
    let colors = super_styles[1]

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
      `,
    ]
  }

  constructor() {
    super()

    this.startSparqlingButton = new UI.GscapeButton(sparqlingIcon, 'Select Renderer')
    this.startSparqlingButton.onClick = () => this.handleStartButtonCLick()
    this.startSparqlingButton.style.position = 'inherit'
    this.startSparqlingButton.classList.add('flat')
    this.startSparqlingButton.asSwitch = true

    this.runQueryButton = new UI.GscapeButton(null, 'Run Query')
    this.runQueryButton.disbaled = true
    this.runQueryButton.style.position = 'inherit'
    this.runQueryButton.classList.add('flat')
    this.runQueryButton.onClick = () => this._onQueryRunCallback()
  }

  render() {
    return html`
      <!-- 
      ${this.runQueryButton}
      <div id="hr"></div>
      -->
      ${this.startSparqlingButton}
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
    console.log('click')
    this.isSparqlingRunning ? this._onSparqlingStopCallback() : this._onSparqlingStartCallback()
  }
}

customElements.define('sparqling-start-run-buttons', SparqlingStartRunButtons as any)