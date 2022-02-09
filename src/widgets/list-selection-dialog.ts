import { UI } from 'grapholscape'
import { html, css } from 'lit'
import { defaultSelectDialogTitle } from './assets/texts'

export default class ListSelectionDialog extends UI.GscapeWidget {
  list: any[]
  title: string
  buildItemString: (item: any) => string
  selectionCallback: (item:any) => void
  closeCallback: () => void

  static get properties() {
    let props = super.properties
    props.list = { attribute: false }
    props.title = { attribute: false }

    return props
  }
  

  static get styles() {
    let super_styles = super.styles
    let colors = super_styles[1]
    
    return [
      super_styles[0],
      css`
        :host {
          position:inherit;
        }

        .list-item {
          cursor:pointer;
          padding:5px 10px;
        }

        .list-item:last-of-type {
          border-radius: inherit;
        }

        gscape-dialog > .widget-body {
          padding: 0;
        }
      `
    ]
  }

  constructor(buildItemString?: (item:any) => string) {
    super()
    
    this.list = []
    this.title = defaultSelectDialogTitle()
    this.buildItemString = buildItemString || function (item:any) {return item}
  }

  render() {
    return html`
    <gscape-dialog title="${this.title}">
      <div>
      ${this.list.map( (item, i) => {
        return html`
          <div class="list-item highlight" index="${i}" @click=${this.handleSelection}>
            <span>${this.buildItemString(item)}</span>
          </div>
        `
      })}
      </div>
    </gscape-dialog>
  `
  }

  onSelection(callback: (item: any) => void) {
    this.selectionCallback = callback
  }

  onClose(callback: () => void) {
    this.closeCallback = callback
  }

  handleSelection(e: MouseEvent) {
    e.preventDefault()
    this.selectionCallback(this.list[(e.currentTarget as HTMLElement).getAttribute('index')])
  }
  
  hide() {super.hide()}
  show() {
    super.show();
    (this as any).shadowRoot.querySelector('gscape-dialog').show()
  }
}

customElements.define('list-selection-dialog', ListSelectionDialog as any)