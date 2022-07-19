import { ui } from 'grapholscape'
import { html, css, LitElement } from 'lit'
import { dbClick, rdfLogo } from '../widgets/assets/icons'
import { emptyGraphMsg, emptyGraphTipMsg, tipWhatIsQueryGraph } from '../widgets/assets/texts'
import cy from './renderer/cy'

/**
 * Widget extending base grapholscape widget which uses Lit-element inside
 */
export default class QueryGraphWidget extends ui.BaseMixin(ui.DropPanelMixin(LitElement)) {
  private bgpContainer: HTMLElement
  private _isBGPEmpty: boolean = true
  title = 'Query Graph'

  static properties = {
    _isBGPEmpty: { attribute: false, type: Boolean }
  }

  static styles = [
    ui.baseStyle,
    css`
      :host {
        width: calc(50%);
        height: 30%;
        position: absolute;
        left: 50%;
        top: 100%;
        transform: translate(-50%, calc(-100% - 10px));
      }

      .gscape-panel {
        width: unset;
        max-width: unset;
        height: 100%;
        box-sizing: border-box;
        overflow: unset;
        padding-top: 27px;
      }

      .blank-slate {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: unset;
        width: 100%;
        box-sizing: border-box;
      }
      
      .tip {
        border-bottom: dotted 2px;
        cursor: help;
      }

      .tip: hover {
        color:inherit;
      }

      #buttons-tray > * {
        position: initial;
      }

      #buttons-tray {
        display: flex;
        align-items: center;
        justify-content: end;
        gap:10px;
        flex-grow: 3;
        padding: 0 10px;
      }

      #buttons-tray > gscape-button {
        --gscape-icon-size: 20px;
      }

      #buttons-tray > input {
        max-width:50px;
      }

      .input-elem {
        color: inherit;
        padding: 5px;
        border: none;
        border-bottom: solid 1px var(--gscape-color-border-default);
        max-width: 50px;
      }

      .top-bar {
        font-size: 12px;
        display: flex;
        flex-direction: row;
        line-height: 1;
        position: absolute;
        top: 1px;
        right: 1px;
        z-index: 2;
        
        align-items: center;
        justify-content: space-between;
        gap: 4px;
        box-sizing: border-box;
        width: calc(100% - 2px);
        border-top-left-radius: var(--gscape-border-radius);
        border-top-right-radius: var(--gscape-border-radius);
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 0px;
        background: var(--gscape-color-bg-inset);
      }

      .top-bar.traslated-down {
        top: unset;
        right: unset;
        bottom: 0;
        left: 50%;
        transform: translate(-50%);
        width: fit-content;
        height: fit-content;
      }

      #widget-header {
        margin-left: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
    `
  ]

  constructor(bgpContainer: HTMLElement, headSlottedWidgets?: Element[]) {
    super()
    this.bgpContainer = bgpContainer
    //super.makeDraggable()
  }

  render() {
    return html`
      <div class="top-bar ${this.isPanelClosed() ? 'traslated-down' : null }">
        ${!this.isPanelClosed()
          ? html`
            <div id="widget-header" class="bold-text">
              ${rdfLogo}
              <span>${this.title}</span>
            </div>
          `
          : null
        }
        <gscape-button 
          id="toggle-panel-button"
          size="${this.isPanelClosed() ? 'm' : 's'}" 
          type="${this.isPanelClosed() ? '' : 'subtle'}"
          @click=${this.togglePanel}
          label = "${this.isPanelClosed() ? this.title : ''}"
        > 
          ${this.isPanelClosed()
            ? html`
                <span slot="icon">${rdfLogo}</span>
                <span slot="trailing-icon">${ui.icons.plus}</span>
              `
            : html`<span slot="icon">${ui.icons.minus}</span>`
          }
        </gscape-button>
      </div>


      <div class="gscape-panel" id="drop-panel">
        ${this.isBGPEmpty
        ? html`
            <div class="blank-slate">
              ${dbClick}
              <div class="header">${emptyGraphMsg()}</div>
              <div class="tip description" title="${emptyGraphTipMsg()}">${tipWhatIsQueryGraph()}</div>
            </div>
          `
        : this.bgpContainer}
      </div>
    `
  }

  togglePanel = () => {
    super.togglePanel()

    this.requestUpdate()
  }

  firstUpdated() {
  //   super.firstUpdated()
  //   this.header.left_icon = rdfLogo
  //   this.header.invertIcons()
  //   super.makeDraggableHeadTitle()
    this.hide()
  }

  createRenderRoot() {
    const root = super.createRenderRoot()
    root.addEventListener('mouseover', e => {
      /**
       * --- HACKY --- 
       * Allow events not involving buttons to work on cytoscape when it's in a shadow dom.
       * They don't work due to shadow dom event's retargeting
       * Cytoscape listen to events on window object. When the event reach window due to bubbling,
       * cytoscape handler for mouse movement handles it but event target appear to be the 
       * custom component and not the canvas due to retargeting, therefore listeners are not triggered.
       * workaround found here: https://github.com/cytoscape/cytoscape.js/issues/2081
       */
      try {
        (cy as any).renderer().hoverData.capture = true
      } catch { }
    })
    return root
  }

  blur() { }

  set isBGPEmpty(value: boolean) {
    this._isBGPEmpty = value
  }

  get isBGPEmpty() {
    return this._isBGPEmpty
  }

  set graphContainerHeight(value: number) {
    this.bgpContainer.style.height = `${value + 40}px`
  }

  set graphContainerWidth(value: number) {
    this.bgpContainer.style.width = `${value + 40}px`
  }

  //createRenderRoot() { return this as any }
}

customElements.define('query-graph', QueryGraphWidget as any)