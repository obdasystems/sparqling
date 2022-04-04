import { UI } from 'grapholscape'
import { html, css } from 'lit'
import { copyContent } from './assets/icons'
import { emptyQueryMsg } from './assets/texts'

export default class SparqlDialog extends UI.GscapeDialog {
  _text: string = emptyQueryMsg()
  copyButton: UI.GscapeButton = new UI.GscapeButton(copyContent, "Copy Query")
  isVisible: any

  static get styles() {
    let super_styles = super.styles as any
    let colors = super_styles[1]

    return [
      super_styles[0],
      css`
        :host {
          top:50%;
          left:50%;
          transform: translate(-50%, -50%);
        }

        .sparql-code {
          white-space: pre;
          padding: 10px 20px;
          cursor: copy;
          font-family: mono;
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
          padding: 0 20px;
        }

        #buttons-tray > gscape-button {
          --gscape-icon-size: 20px;
        }
      `,
    ]
  }

  constructor() {
    super()
    this.copyButton.onClick = () => this.copyQuery()
  }

  render() {
    return html`
      <gscape-head title="SPARQL" class="drag-handler">
        <div id="buttons-tray">
          ${this.copyButton}
        </div>
      </gscape-head>
      <div class="widget-body">
        <div class="sparql-code" title="Click to copy query" @click=${this.copyQuery}>${this.text.trim()}</div>
      </div>
    `
  }

  copyQuery() {
    navigator.clipboard.writeText(this.text).then(_ => {
      console.log('query copied successfully')
    })
  }

  show() {
    super.show()
  }

  hide() {
    super.hide()
  }

  set text(text) {
    this._text = text 
  }

  get text() { return this._text}
}


customElements.define('sparqling-sparql-dialog', SparqlDialog as any)