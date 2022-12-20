import { ColoursNames, toPNG, toSVG, ui } from 'grapholscape'
import { css, html, LitElement, PropertyValueMap } from 'lit'
import { getName, isFullPageActive } from '../model'
import { getGscape } from '../ontology-graph'
import { countStarToggle, cxtMenu } from '../widgets'
import { code, dbClick, kebab, rdfLogo, refresh } from '../widgets/assets/icons'
import { emptyGraphMsg, emptyGraphTipMsg, tipWhatIsQueryGraph } from '../widgets/assets/texts'
import distinctToggle from '../widgets/distinct-toggle'
import limitInput from '../widgets/limit'
import offsetInput from '../widgets/offset'
import sparqlignWidgetStyle from '../widgets/sparqling-widget-style'
import getTrayButtonTemplate from '../widgets/tray-button-template'
import { cy } from './renderer/'

/**
 * Widget extending base grapholscape widget which uses Lit-element inside
 */
export default class QueryGraphWidget extends ui.BaseMixin(ui.DropPanelMixin(LitElement)) {
  private bgpContainer: HTMLElement
  private _isBGPEmpty: boolean = true
  withoutBGP: boolean = false
  
  onQueryClear = () => { }
  onSparqlButtonClick = () => { }
  onFullScreenEnter = () => { }
  onCenterDiagram = () => { }

  title = 'Query Graph'

  static properties = {
    _isBGPEmpty: { attribute: false, type: Boolean },
    withoutBGP: { reflect: true, type: Boolean }
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

      :host([withoutBGP]) {
        height: unset;
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

      :host([withoutBGP]) > .gscape-panel {
        padding: 0;
        overflow: unset;
      }

      :host([withoutBGP]) > .gscape-panel > .top-bar {
        position: initial;
        border-radius: var(--gscape-border-radius);
      }

      .gscape-panel {
        max-height: unset;
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
                ${distinctToggle}
                ${countStarToggle}
                ${getTrayButtonTemplate('Clear Query', refresh, undefined, 'clear-query-btn', this.onQueryClear)}
                ${getTrayButtonTemplate('View SPARQL Code', code, undefined, 'sparql-code-btn', this.onSparqlButtonClick)}
                ${getTrayButtonTemplate('Center Query Graph', ui.icons.centerDiagram, undefined, 'center-btn', this.onCenterDiagram)}
                ${!isFullPageActive() ? getTrayButtonTemplate('Fullscreen', ui.icons.enterFullscreen, undefined, 'fullscreen-btn', this.onFullScreenEnter) : null}
                ${getTrayButtonTemplate('More actions', kebab, undefined, 'cxt-menu-action', this.showCxtMenu)}
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

            ${!this.withoutBGP
              ? html`
                ${this.isBGPEmpty
                  ? html`
                      <div class="blank-slate sparqling-blank-slate">
                        ${dbClick}
                        <div class="header">${emptyGraphMsg()}</div>
                        <div class="tip description" title="${emptyGraphTipMsg()}">${tipWhatIsQueryGraph()}</div>
                      </div>
                    `
                  : this.bgpContainer
                }
              `
              : null
            }
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

  protected updated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    /**
     * // BUG: when the BGP container gets removed from the widget and then later on
     * added back because of an insertion in the query, if we performed a cy.mount()
     * (i.e. coming back from incremental we need to mount cy on bgpContainer)
     * then the mount breaks somehow. Maybe some operations performed by lit-element
     * on the div conflicts with cytoscape's mounting operations.
     * 
     * TEMP FIX: wait for the update lifecycle to be completed and then mount again
     * being sure lit-element won't touch the container anymore until next clear query.
     */
    if (_changedProperties.has('_isBGPEmpty') || !this.isPanelClosed()) {
      const container = cy.container()
      if (container) {
        cy.mount(container)
        cy.resize();

        /**
         * Hacky: updateStyle is not public but it works, ty js.
         * If you don't call this, some edges and labels might be not visible until next style update
         * (i.e. user click)
         */ 
        (cy as any).updateStyle()
      }
    }
  }

  private showCxtMenu() {
    if (this.moreActionsButton) {
      cxtMenu.showFirst = 'elements'
      cxtMenu.attachTo(this.moreActionsButton, this.cxtMenuCommands, this.cxtMenuElements)
    }
  }

  private get moreActionsButton() {
    return this.shadowRoot?.querySelector('#cxt-menu-action') as ui.GscapeButton
  }

  get isBGPEmpty() {
    return this._isBGPEmpty
  }

  get clearQueryButton() {
    return this.shadowRoot?.querySelector('#clear-query-btn') as ui.GscapeButton
  }

  private cxtMenuCommands: ui.Command[] = [
    {
      content: 'Export as PNG',
      icon: ui.icons.save,
      select: () => toPNG(`query-graph-${getName()}`, cy, getGscape().theme.getColour(ColoursNames.bg_graph))
    },
    {
      content: 'Export as SVG',
      icon: ui.icons.save,
      select: () => toSVG(`query-graph-${getName()}`, cy, getGscape().theme.getColour(ColoursNames.bg_graph))
    }
  ]

  private get cxtMenuElements(): HTMLElement[] {
    return [
      limitInput,
      offsetInput,
    ]
  }
}

customElements.define('query-graph', QueryGraphWidget)