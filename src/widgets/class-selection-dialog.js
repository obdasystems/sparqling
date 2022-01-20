import { UI } from 'grapholscape'
import { html, css } from 'lit'

const { GscapeWidget, GscapeHeader } = UI

export default class ClassSelectionDialog extends GscapeWidget {
  
  static properties = {
    classes: {type: Array, attribute: false}
  }
  
  static get styles() {
    let super_styles = super.styles
    let colors = super_styles[1]

    return [
      super_styles[0],
      css`
        :host {
          position:absolute;
          width: 20%;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        
        .widget-body {
          overflow:auto;
          max-height: 200px;
        }

        .list-item {
          cursor:pointer;
          padding:5px 10px;
        }

        .list-item:last-of-type {
          border-radius: inherit;
        }
      `
    ]
  }

  constructor() {
    super()
    this.hiddenDefault = true
    this.draggable = true
    this.classes = []
    this.selectionCallback = (iri) => {}
    this.header = new GscapeHeader('Select a class')
  }

  render() {
    return html`
      ${this.header}
      <div class="widget-body">
      ${this.classes.map( (classItem, i) => {
        return html`
          <div class="list-item highlight" index="${i}" @click=${this.handleSelection}>
            <span>${classItem}</span>
          </div>
        `
      })}
      </div>
    `
  }

  onSelection(callback) {
    this.selectionCallback = callback
  }

  handleSelection(e) {
    e.preventDefault()
    this.selectionCallback(this.classes[e.currentTarget.getAttribute('index')])
  }

  show() { super.show() }
  hide() { super.hide() }
}

customElements.define('class-selection-dialog', ClassSelectionDialog)