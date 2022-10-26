import { ui } from 'grapholscape'
import { css, html, LitElement } from 'lit'
import * as model from '../model'
import { MastroEndpoint } from '../model'
import { description, mastroEndpointIcon, playOutlined, preview } from './assets/icons'
import sparqlingIcon from './assets/sparqling-icon'
import { getLoadingSpinner, loadingSpinnerStyle } from './loading-spinner'

export default class SparqlingStartRunButtons extends ui.BaseMixin(ui.DropPanelMixin(LitElement)) {
  private isLoading: boolean = false

  public startSparqlingButton: any
  public runQueryButton: any
  public canQueryRun: boolean = false
  public endpoints: MastroEndpoint[] = []
  public selectedEndpointName?: string

  private _onSparqlingStartCallback = () => { }
  private _onSparqlingStopCallback = () => { }
  private _onQueryRunCallback = () => { }
  private _onQuerySaveCallback = () => { }
  private _onShowSettingsCallback = () => { }
  private _onEndpointChangeCallback = (newEndpointName: string) => { }
  private _onShowResults = () => { }

  static properties = {
    canQueryRun: { type: Boolean, attribute: false },
    isLoading: { type: Boolean, attribute: false },
    endpoints: { type: Object, attribute: false },
    selectedEndpointName: { type: String, attribute: false }
  }

  static styles = [
    ui.GscapeButtonStyle,
    ui.baseStyle,
    loadingSpinnerStyle,
    css`
      :host {
        order: 8;
        position: relative;
      }

      #drop-panel {
        bottom: unset;
        top: 0px;
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
            ?disabled=${!this.selectedEndpointName}
            @click="${this._onQueryRunCallback}"
            type="subtle"
            title="Send query to SPARQL endpoint"
          >
            <span slot="icon">${playOutlined}</span>
          </gscape-button>

          <div class="hr"></div>

          <gscape-button
            @click="${this._onQuerySaveCallback}"
            type="subtle"
            title="Save query in catalog"
          >
            <span slot="icon">${ui.icons.save}</span>
          </gscape-button>

          <div class="hr"></div>

          <gscape-button
            @click="${this._onShowResults}"
            type="subtle"
            title="Show results drawer"
          >
            <span slot="icon">${preview}</span>
          </gscape-button>

          <div class="hr"></div>

          <gscape-button
            @click="${this._onShowSettingsCallback}"
            type="subtle"
            title="Edit query metadata"
          >
            <span slot="icon">${description}</span>
          </gscape-button>

          <div class="hr"></div>

          <gscape-button
            @click=${this.togglePanel}
            type="subtle"
            title="Select Mastro Endpoint"
          >
            <span slot="icon">${mastroEndpointIcon}</span>
          </gscape-button>

          <div class="hr"></div>

          <div class="gscape-panel gscape-panel-in-tray drop-left hide" id="drop-panel">
            <div class="header">Endpoint Selector</div>
            <div class="content-wrapper">
              ${this.endpoints.map(endpoint => {
          return html`
                  <gscape-action-list-item
                    @click=${this.handleEndpointClick}
                    label="${endpoint.name}"
                    ?selected = "${this.selectedEndpointName === endpoint.name}"
                  >
                  </gscape-action-list-item>
                `
        })}

              ${this.endpoints.length === 0
            ? html`
                  <div class="blank-slate">
                    ${ui.icons.searchOff}
                    <div class="header">No endpoint available</div>
                  </div>
                `
            : null
          }
            </div>
          </div>
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

  onQuerySave(callback: () => void) {
    this._onQuerySaveCallback = callback
  }

  onShowSettings(callback: () => void) {
    this._onShowSettingsCallback = callback
  }

  onEndpointChange(callback: (newEndpointName: string) => void) {
    this._onEndpointChangeCallback = callback
  }

  onShowResults(callback: () => void) {
    this._onShowResults = callback
  }

  requestEndpointSelection() {
    return new Promise<MastroEndpoint>((resolve, reject) => {
      const oldEndpointChangeCallback = this._onEndpointChangeCallback
      this.openPanel()

      // change callback to fulfill the request's promise with the new endpoint
      this.onEndpointChange((newEndpointName) => {
        const endpoint = this.endpoints.find(e => e.name === newEndpointName)
        if (endpoint) {
          resolve(endpoint)
        } else {
          reject()
        }

        oldEndpointChangeCallback(newEndpointName)
        this._onEndpointChangeCallback = oldEndpointChangeCallback // reset callback to previous one
      })
    })
  }

  private handleEndpointClick(e: { currentTarget: { label: string | undefined } }) {
    if (e.currentTarget.label && e.currentTarget.label !== this.selectedEndpointName)
      this._onEndpointChangeCallback(e.currentTarget.label)
  }

  private handleStartButtonCLick() {
    if (model.isFullPageActive())
      return

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