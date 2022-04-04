import { UI } from 'grapholscape'
import { html, css } from 'lit'
import { rdfLogo } from '../widgets/assets/icons'
import cy from './renderer/cy'

const { GscapeWidget, GscapeHeader } = UI
/**
 * Widget extending base grapholscape widget which uses Lit-element inside
 */
export default class QueryGraphWidget extends (GscapeWidget as any) {
  public collapsible : boolean
  public draggable: boolean
  private bgpContainer: HTMLElement

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
          height: 300px;
          margin:0;
          border-top: none;
          border-bottom: 1px solid var(--theme-gscape-shadows, ${colors.shadows});
          border-radius: inherit;
          border-bottom-left-radius:0;
          border-bottom-right-radius:0;
        }
      `
    ]
  }

  constructor(bgpContainer: HTMLElement) {
    super()
    this.bgpContainer = bgpContainer
    this.collapsible = true
    this.draggable = true
    this.header = new GscapeHeader('Query Graph', rdfLogo as any)

    //super.makeDraggable()
  }

  render() {
    return html`
      <div class="widget-body">${this.bgpContainer}</div>
      ${this.header}
    `
  }

  firstUpdated() {
    super.firstUpdated()
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

  //createRenderRoot() { return this as any }
}

customElements.define('query-graph', QueryGraphWidget as any)