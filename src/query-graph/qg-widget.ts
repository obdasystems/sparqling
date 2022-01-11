import { UI } from 'grapholscape'
import { html, css, CSSResult } from 'lit'
import { bgpContainer } from '../get-container'

const { GscapeWidget } = UI
/**
 * Widget extending base grapholscape widget which uses Lit-element inside
 */
export default class QueryGraphWidget extends GscapeWidget {
  collapsible = true
  private bgpContainer: HTMLElement

  static get styles() {
    let super_styles = super.styles as any
    let colors = super_styles[1]

    return [
      super_styles[0],
      css`
        :host {
          height: 300px;
          width: 600px;
          position: relative;
        }
      `
    ]
  }

  constructor(bgpContainer: HTMLElement) {
    super()
    this.bgpContainer = bgpContainer
  }

  render() {
    return html`${this.bgpContainer}`
  }

  //createRenderRoot() { return this as any }
}

customElements.define('query-graph', QueryGraphWidget as any)