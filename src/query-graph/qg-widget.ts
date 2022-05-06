import { UI } from 'grapholscape'
import { html, css } from 'lit'
import { dbClick, rdfLogo } from '../widgets/assets/icons'
import { emptyGraphMsg, emptyGraphTipMsg, tipWhatIsQueryGraph } from '../widgets/assets/texts'
import cy from './renderer/cy'

const { GscapeWidget, GscapeHeader } = UI
/**
 * Widget extending base grapholscape widget which uses Lit-element inside
 */
export default class QueryGraphWidget extends (GscapeWidget as any) {
  public collapsible : boolean
  public draggable: boolean
  private bgpContainer: HTMLElement
  private _isBGPEmpty: boolean = true
  private headSlottedWidgets: Element[]

  static get properties() {
    const props = super.properties

    props._isBGPEmpty = { attribute: false, type: Boolean }

    return props
  }

  static get styles() {
    let super_styles = super.styles as any
    let colors = super_styles[1]

    return [
      super_styles[0],
      css`
        :host {
          width: calc(50%);
          position: absolute;
          left: 50%;
          top: 100%;
          transform: translate(-50%, calc(-100% - 10px));
        }

        .widget-body {
          min-height: 50px;
          margin:0;
          border-top: none;
          border-radius: inherit;
          border-bottom-left-radius:0;
          border-bottom-right-radius:0;
        }

        #empty-graph {
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          text-align: center;
        }

        #empty-graph > .icon {
          --gscape-icon-size: 60px;
        }

        #empty-graph-msg {
          font-weight: bold;
        }

        .tip {
          font-size: 90%;
          color: var(--theme-gscape-shadows, ${colors.shadows});
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
          border-bottom: solid 1px;
          max-width: 50px;
        }
      `
    ]
  }

  constructor(bgpContainer: HTMLElement, headSlottedWidgets?: Element[]) {
    super()
    this.bgpContainer = bgpContainer
    this.collapsible = true
    this.draggable = true
    this.headSlottedWidgets = headSlottedWidgets
    //super.makeDraggable()
  }

  render() {
    return html`
      <div class="widget-body">
        ${this.isBGPEmpty
          ? html`
            <div id="empty-graph">
              <div class="icon">${dbClick}</div>
              <div id="empty-graph-msg">${emptyGraphMsg()}</div>
              <div class="tip" title="${emptyGraphTipMsg()}">${tipWhatIsQueryGraph()}</div>
            </div>
          `
          : this.bgpContainer}
      </div>

      <gscape-head title="Query Graph">
        <div id="buttons-tray">
          ${this.headSlottedWidgets}
        </div>
      </gscape-head>
    `
  }

  firstUpdated() {
    super.firstUpdated()
    this.header.left_icon = rdfLogo
    this.header.invertIcons()
    super.makeDraggableHeadTitle()
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
      } catch {}
    })
    return root
  }

  blur() {}

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