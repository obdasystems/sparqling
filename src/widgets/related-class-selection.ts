import { ui } from 'grapholscape'
import { css, html, LitElement, PropertyValueMap } from 'lit'
import EventPosition from '../util/event-position'

export default class RelatedClassSelection extends ui.BaseMixin(LitElement) {
  objProperty: string
  class?: string
  reverseArrow = false
  list: string[]
  onSelection = (listItem: string) => { }

  static properties = {
    class:{ attribute: false },
    objProperty:{ attribute: false },
  }


  static styles = [
    ui.baseStyle,
    css`
      :host {
        position: absolute;
        min-width: 100px;
        transform: translate(-100%, -50%);
      }

      .gscape-panel-body {
        display: flex;
        padding: 0px 0px 8px 8px;
      }

      .gscape-panel {
        max-width: unset;
        max-height: unset;
        padding:0
      }

      .header {
        text-align:center;
      }

      #left-panel {
        display:flex;
        align-items:center;
      }

      .class {
        padding: 10px 20px;
        border-radius: 6px;
        background-color: var(--gscape-color-class);
        border: solid 2px var(--gscape-color-class-contrast);
      }

      .arrow {
        margin: 10px;
        display: flex;
        align-items: center;
      }

      .arrow-reverse {
        margin: 10px;
        display: flex;
        align-items: center;
        flex-direction: row-reverse;
      }

      .arrow-tail, .arrow-body {
        height:8px;
        background-color: var(--gscape-color-object-property-contrast);
      }

      .arrow-tail {
        width: 20px;
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
        border-top-right-radius: 0px;
        border-bottom-right-radius:0px;
      }

      .arrow-reverse > .arrow-tail {
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
        border-top-left-radius: 0px;
        border-bottom-left-radius:0px;
      }

      .arrow-body {
        width: 15px;
      }

      .arrow-head {
        width: 0; 
          width: 0; 
        width: 0; 
          width: 0; 
        width: 0; 
        height: 0; 
          height: 0; 
        height: 0; 
          height: 0; 
        height: 0; 
        border-top: 15px solid transparent;
        border-bottom: 15px solid transparent;
        background-color: initial;
      }

      .arrow > .arrow-head {
        border-left: 15px solid var(--gscape-color-object-property-contrast);
        border-right: 0;
      }

      .arrow-reverse > .arrow-head {
        border-right: 15px solid var(--gscape-color-object-property-contrast);
        border-left: 0;
      }

      .obj-property {
        padding: 5px;
      }

      .list {
        display: flex;
        flex-direction: column;
        max-height: 200px;
        overflow: hidden auto;
        padding-right: 8px;
      }

      .gscape-panel-title {
        padding-top:10px;
      }
    `
  ]

  render() {
    return html`
      <div class="gscape-panel">
        <div class="header">Add Object Property</div>
        <div class="gscape-panel-body">
          <div id="left-panel">
            <span class="text class">${this.class}</span>
            <span class="arrow${this.reverse}">
              <span class="arrow-tail"></span>
              <span class="text obj-property">${this.objProperty}</span>
              <span class="arrow-body"></span>
              <span class="arrow-head"></span>
            </span>
          </div>
          <div id="right-panel" class="list">
            ${this.list?.map((classItem, i) => {
              return html`<span class="actionable" index="${i}" @click=${this.handleSelection}>${classItem}</span>`
            })}
          </div>
        </div>
      </div>
    `
  }

  private handleSelection(e: MouseEvent) {
    e.preventDefault()
    if (this.list) {
      const index = (e.currentTarget as HTMLElement).getAttribute('index')

      if (index !== null) {
        let listItem = this.list[index]
        this.onSelection(listItem)
      }
    }
  }

  showInPosition(position?: EventPosition) {
    this.show()
    if(position) {
      this.style.top = position.y + "px"
      this.style.left = position.x + "px"
    }
  }

  onmouseout = () => {
    this.hide()
  }

  private get reverse() {
    return this.reverseArrow ? '-reverse' : null
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.firstUpdated(_changedProperties)

    this.hide()
  }
}

customElements.define('sparqling-related-classes', RelatedClassSelection as any)