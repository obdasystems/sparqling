import { ui } from 'grapholscape'
import { html, css, LitElement, PropertyValueMap } from 'lit'
import core from '../core'
import { isStandalone } from '../model'
import { code, copyContent, editSquare, ellipsis } from './assets/icons'
import { emptyQueryMsg } from './assets/texts'
import sparqlingWidgetStyle from './sparqling-widget-style'
import getTrayButtonTemplate from './tray-button-template'

export default class SparqlDialog extends ui.ModalMixin(ui.BaseMixin(LitElement)) {
  text: string = emptyQueryMsg()
  //copyButton = new UI.GscapeButton(copyContent, "Copy Query")
  title = 'SPARQL'

  private arePrefixesVisible: Boolean = false

  static styles = [
    ui.baseStyle,
    sparqlingWidgetStyle,
    css`
      .gscape-panel {
        position: absolute;
        top: 100px;
        left: 50%;
        transform: translate(-50%, 0);
        min-width: 200px;
        max-width: 80vw;
        max-height: calc(-100px + 80vh);
        height: unset;
      }

      .sparql-code-wrapper {
        display: flex;
        flex-direction: column;
        gap: 8px;
        cursor: copy;
        font-family: monospace;
        overflow: auto;
        padding: 10px 20px;
        scrollbar-width: inherit;
      }

      .sparql-code {
        white-space: pre;
      }
    `
  ]

  static properties = {
    text: { type: String, attribute: false },
    arePrefixesVisible: { type: Boolean, state: true },
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
            ${this.text !== emptyQueryMsg() && !isStandalone()
              ? html`
                ${getTrayButtonTemplate(
                  'Use query in SPARQL page',
                  editSquare, undefined, // icons
                  'advanced-mode-btn', 
                  core.redirectToSPARQLPage
                )}
              `
              : null
            }
            
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

        <div class="sparql-code-wrapper" title="Click to copy query" @click=${this.copyQuery}>
          ${this.text === emptyQueryMsg()
            ? html`<div class="sparql-code">${this.text.trim()}</div>`
            : html`
              ${this.arePrefixesVisible
                ? html`
                  <div class="sparql-code">${this.queryPrefixes}</div>
                `
                : null
              }
              <gscape-button type="subtle" title="Show Prefixes" size="s" @click="${this.togglePrefixes}">
                <span slot="icon">${ellipsis}</span>
              </gscape-button>
              <div class="sparql-code">${this.queryText}</div>
            `
      }
        </div>
      </div>
    `
  }

  private togglePrefixes() {
    this.arePrefixesVisible = !this.arePrefixesVisible
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

  private get queryPrefixes() {
    return this.text.substring(0, this.text.search('SELECT')).trim()
  }

  private get queryText() {
    return this.text.substring(this.text.search('SELECT')).trim()
  }
}


customElements.define('sparqling-sparql-dialog', SparqlDialog as any)