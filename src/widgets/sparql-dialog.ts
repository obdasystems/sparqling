import { ui } from 'grapholscape'
import { html, css, LitElement, PropertyValueMap } from 'lit'
import { code, copyContent } from './assets/icons'
import { emptyQueryMsg } from './assets/texts'
import sparqlingWidgetStyle from './sparqling-widget-style'
import getTrayButtonTemplate from './tray-button-template'

export default class SparqlDialog extends ui.BaseMixin(LitElement) {
  text: string = emptyQueryMsg()
  //copyButton = new UI.GscapeButton(copyContent, "Copy Query")
  title = 'SPARQL'

  static styles = [
    ui.baseStyle,
    sparqlingWidgetStyle,
    css`
      :host {
        position: absolute;
        top: 100px;
        left: 50%;
        transform: translate(-50%, 0);
        min-width: 200px;
      }

      .sparql-code {
        white-space: pre;
        padding: 10px 20px;
        cursor: copy;
        font-family: monospace;
      }
    `
  ]

  static properties = {
    text: { type: String, attribute: false }
  }

  render() {
    return html`
      <div class="gscape-panel">
        <div class="top-bar">
          <div id="widget-header" class="bold-text">
            ${code}
            <span>${this.title}</span>
          </div>

          <div id="buttons-tray">
            ${getTrayButtonTemplate('Copy Query', copyContent, undefined, 'copyt-query-code-btn', this.copyQuery)}
          </div>

          <gscape-button 
            id="toggle-panel-button"
            size="s" 
            type="subtle"
            @click=${this.hide}
            title="Close"
          > 
            <span slot="icon">${ui.icons.close}</span>
          </gscape-button>
        </div>

        <div class="dialog-body">
          <div class="sparql-code" title="Click to copy query" @click=${this.copyQuery}>${this.text.trim()}</div>
        </div>
      </div>
    `
  }


  copyQuery() {
    navigator.clipboard.writeText(this.text).then(_ => {
      console.log('query copied successfully')
    })
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
    super.firstUpdated(_changedProperties)
    this.hide()
  }
}


customElements.define('sparqling-sparql-dialog', SparqlDialog as any)