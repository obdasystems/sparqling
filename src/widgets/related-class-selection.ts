import { html, css } from 'lit'
import ListSelectionDialog from './list-selection-dialog'

export default class RelatedClassSelection extends ListSelectionDialog {
  objProperty: string
  class: string

  static get properties() {
    let props = super.properties
    props.class = { attribute: false }
    props.objProperty = { attribute: false }

    return props
  }


  static get styles() {
    let super_styles = super.styles
    let colors = super_styles[1]
    return [
      super_styles[0],
      css`
        :host {
          min-width:100px;
          transform: translate(-100%, -50%);
        }

        .widget-body {
          padding:0;
          display:flex;
        }

        #left-panel {
          display:flex;
          align-items:center;
          padding:10px;
        }

        .class {
          padding: 10px 20px;
          border-radius: 6px;
          background-color: var(--theme-gscape-concept, ${colors.concept});
          border: solid 2px var(--theme-gscape-concept-dark, ${colors.concept_dark});
        }

        .arrow {
          margin: 10px;
          display: flex;
          align-items: center;
        }

        .arrow-tail, .arrow-body {
          height:8px;
          background-color: var(--theme-gscape-role-dark, ${colors.role_dark});
        }

        .arrow-tail {
          width: 20px;
          border-top-left-radius: 3px;
          border-bottom-left-radius: 3px;
          border-top-right-radius: 0px;
          border-bottom-right-radius:0px;
        }

        .arrow-body {
          width: 15px;
        }

        .arrow-head {
          width: 0; 
          height: 0; 
          border-top: 15px solid transparent;
          border-bottom: 15px solid transparent;
          border-left: 15px solid var(--theme-gscape-role-dark, ${colors.role_dark});
          border-right: 0;
          background-color: initial;
        }

        .obj-property {
          padding: 5px;
        }

        .list {
          display:flex;
          flex-direction: column;
          justify-content: center;
          max-height: 100px;
          overflow: auto;
          overflow-x: hidden;
        }

        .list-item {
          cursor:pointer;
          padding:5px 20px;
        }

        .list-item:last-of-type {
          border-radius: inherit;
        }

        .gscape-panel-title {
          padding-top:10px;
        }
        .
      `
    ]
  }

  constructor(buildItemString?: (item: any) => string) {
    super(buildItemString)

    this.class = ''
    this.objProperty = ''
  }

  render() {
    return html`
    <div class="gscape-panel-title">Add Object Property</div>
    <div class="widget-body">
      <div id="left-panel">
        <span class="text class">${this.class}</span>
        <span class="arrow">
          <span class="arrow-tail"></span>
          <span class="text obj-property">${this.objProperty}</span>
          <span class="arrow-body"></span>
          <span class="arrow-head"></span>
        </span>
      </div>
      <div id="right-panel" class="list">
        ${this.list.map((classItem, i) => {
          return html`<span index="${i}" @click=${this.handleSelection} class="list-item highlight">${this.buildItemString(classItem)}</span>`
        })}
      </div>
    </div>
    `
  }
}

customElements.define('sparqling-related-classes', RelatedClassSelection as any)