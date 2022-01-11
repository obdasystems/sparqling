import { UI } from 'grapholscape'
import { html, css, CSSResult } from 'lit'

const { GscapeWidget, GscapeHeader } = UI
/**
 * Widget extending base grapholscape widget which uses Lit-element inside
 */
export default class QueryGraphWidget extends GscapeWidget {
  private collapsible : boolean
  private draggable: boolean
  private header : typeof GscapeHeader
  private bgpContainer: HTMLElement

  static get styles() {
    let super_styles = super.styles as any
    let colors = super_styles[1]

    return [
      super_styles[0],
      css`
        :host {
          width: 800px;
          position: absolute;
          bottom: 60px;
          left: 10px;
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
    // this.draggable = true
    this.header = new GscapeHeader('Query Graph')

    super.makeDraggable()
  }

  render() {
    return html`
      <div class="widget-body hide">${this.bgpContainer}</div>
      ${this.header}
    `
  }

  firstUpdated() {
    super.firstUpdated()
    this.header.invertIcons()
    // super.makeDraggableHeadTitle()
  }

  //createRenderRoot() { return this as any }
}

customElements.define('query-graph', QueryGraphWidget as any)