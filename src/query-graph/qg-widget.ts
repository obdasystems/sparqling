import { ui } from 'grapholscape'
import { html, css, LitElement, SVGTemplateResult } from 'lit'
import { countStarToggle } from '../widgets'
import { code, dbClick, rdfLogo, refresh } from '../widgets/assets/icons'
import { emptyGraphMsg, emptyGraphTipMsg, tipWhatIsQueryGraph } from '../widgets/assets/texts'
import distinctToggle from '../widgets/distinct-toggle'
import limitInput from '../widgets/limit'
import offsetInput from '../widgets/offset'
import sparqlignWidgetStyle from '../widgets/sparqling-widget-style'
import getTrayButtonTemplate from '../widgets/tray-button-template'
import cy from './renderer/cy'

/**
 * Widget extending base grapholscape widget which uses Lit-element inside
 */
export default class QueryGraphWidget extends ui.BaseMixin(ui.DropPanelMixin(LitElement)) {
  private bgpContainer: HTMLElement
  private _isBGPEmpty: boolean = true
  
  onQueryClear = () => { }
  onSparqlButtonClick = () => { }
  title = 'Query Graph'

  static properties = {
    _isBGPEmpty: { attribute: false, type: Boolean }
  }

  static styles = [
    ui.baseStyle,
    sparqlignWidgetStyle,
    css`
      :host {
        width: calc(50%);
        height: 30%;
        position: absolute;
        left: 50%;
        top: 100%;
        transform: translate(-50%, calc(-100% - 10px));
      }
      
      .tip {
        border-bottom: dotted 2px;
        cursor: help;
      }

      .tip: hover {
        color:inherit;
      }

      .input-elem {
        color: inherit;
        padding: 5px;
        border: none;
        border-bottom: solid 1px var(--gscape-color-border-default);
        max-width: 50px;
      }
    `
  ]

  constructor(bgpContainer: HTMLElement) {
    super()
    this.bgpContainer = bgpContainer
  }

  render() {
    return html`
      ${this.isPanelClosed()
        ? html`
          <div class="top-bar traslated-down">
            <gscape-button 
              id="toggle-panel-button"
              @click=${this.togglePanel}
              label=${this.title}
            > 
              <span slot="icon">${rdfLogo}</span>
              <span slot="trailing-icon">${ui.icons.plus}</span>
            </gscape-button>
          </div>
        `
        : html`
          <div class="gscape-panel" id="drop-panel">
            <div class="top-bar">
              <div id="widget-header" class="bold-text">
                ${rdfLogo}
                <span>${this.title}</span>
              </div>

              <div id="buttons-tray">

                ${limitInput}
                ${offsetInput}
                ${distinctToggle}
                ${countStarToggle}

                ${getTrayButtonTemplate('Sparql', code, undefined, 'sparql-code-btn', this.onSparqlButtonClick)}
                ${getTrayButtonTemplate('Clear Query', refresh, undefined, 'clear-query-btn', this.onQueryClear)}
              </div>

              <gscape-button 
                id="toggle-panel-button"
                size="s" 
                type="subtle"
                @click=${this.togglePanel}
              > 
                <span slot="icon">${ui.icons.minus}</span>
              </gscape-button>
            </div>


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
    `
  }

  togglePanel = () => {
    super.togglePanel()

    this.requestUpdate()
    if (this.isPanelClosed()) {
      this.style.height = 'fit-content'
    } else {
      this.style.height = '30%'
    }
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

  get clearQueryButton() {
    return this.shadowRoot?.querySelector('#clear-query-btn') as ui.GscapeButton
  }

  //createRenderRoot() { return this as any }
}

customElements.define('query-graph', QueryGraphWidget as any)