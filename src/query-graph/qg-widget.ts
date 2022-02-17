import { UI } from 'grapholscape'
import { html, css } from 'lit'
import { rdfLogo } from '../widgets/assets/icons'

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
  }

  //createRenderRoot() { return this as any }
}

customElements.define('query-graph', QueryGraphWidget as any)