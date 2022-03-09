import { html, css } from 'lit'
import { Highlights } from '../api/swagger'
import { UI } from 'grapholscape'
import { lightbulbQuestion } from './assets/icons'

export default class HighlightsList extends UI.GscapeWidget {
  class: string
  highlights: Highlights
  collapsible = true
  private _onSuggestionSelection = (element: string) => { }


  static get properties() {
    let props = super.properties
    props.class = { attribute: false }
    props.highlights = { attribute: false }

    return props
  }


  static get styles() {
    let super_styles = super.styles
    let colors = super_styles[1]
    return [
      super_styles[0],
      css`
        :host {
          position:initial;
          pointer-events:initial;
        }

        .widget-body {
          max-height: 400px;
        }

        .gscape-panel-title {
          padding-top:10px;
        }

        .list {
          display:flex;
          flex-direction:column;
        }

        .list-item {
          padding:5px 10px;
          cursor: pointer;
        }

        details {
          margin: 5px;
          padding: 5px;
          border-radius: 6px;
        }

        summary {
          font-weight: bold;
          margin: 5px;
          cursor:pointer;
        }

        #classes-panel {
          background-color: var(--theme-gscape-concept, ${colors.concept});
        }

        #object-properties-panel {
          background-color: var(--theme-gscape-role, ${colors.role});
        }

        #data-properties-panel {
          background-color: var(--theme-gscape-attribute, ${colors.attribute});
        }
      `
    ]
  }

  constructor() {
    super()

    this.class = ''
  }

  render() {
    return html`
    <gscape-head title="Suggestions"></gscape-head>
    <div class="widget-body">
      <details id="object-properties-panel" open>
        <summary>Object Properties</summary>
        <div class="list">
          ${this.objectProperties.map((objectProperty, i) => {
            return html`
              <span index="${i}" @click=${this.handleObjectPropertySelection} class="list-item highlight">
                ${objectProperty.objectPropertyIRI}
              </span>`
          })}
        </div>
      </details>
      
      <details id="data-properties-panel" open>
        <summary>Data Properties</summary>
        <div id="data-properties-panel" class="list">
          ${this.dataProperties.map((dataProperty, i) => {
            return html`
              <span index="${i}" @click=${this.handleDataPropertySelection} class="list-item highlight">
                ${dataProperty}
              </span>`
          })}
        </div>
      </details>

      <details id="classes-panel">
        <summary>Classes</summary>
        <div class="list">
          ${this.classes.map((classItem, i) => {
            return html`
              <span index="${i}" @click=${this.handleClassSelection} class="list-item highlight">
                ${classItem}
              </span>`
          })}
        </div>
      </details>
    </div>
    `
  }

  firstUpdated() {
    super.firstUpdated()

    let self = this as any
    self.header.left_icon = lightbulbQuestion
    self.header.invertIcons()
  }

  handleClassSelection(e: any) {
    e.preventDefault()
    this._onSuggestionSelection(this.classes[e.target.getAttribute('index') as number])
  }

  handleObjectPropertySelection(e: any) {
    e.preventDefault()
    this._onSuggestionSelection(this.objectProperties[e.target.getAttribute('index') as number].objectPropertyIRI)
  }

  handleDataPropertySelection(e: any) {
    e.preventDefault()
    this._onSuggestionSelection(this.dataProperties[e.target.getAttribute('index') as number])
  }

  onSuggestionSelection(callback: (iri: string ) => void) {
    this._onSuggestionSelection = callback
  }

  private get objectProperties() {
    return this.highlights?.objectProperties || []
  }

  private get classes() {
    return this.highlights?.classes || []
  }

  private get dataProperties() {
    return this.highlights?.dataProperties || []
  }

  hide() { super.hide() }
  toggleBody() { super.toggleBody() }
  showBody() { super.showBody() }
  collapseBody() { super.collapseBody() }
}

customElements.define('sparqling-highlights-list', HighlightsList as any)