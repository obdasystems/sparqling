import { GrapholTypesEnum, ui } from 'grapholscape'
import { css, html, LitElement, PropertyValueMap } from 'lit'
import { Branch, EntityTypeEnum, Highlights } from '../api/swagger'
import { lightbulb, placeItem } from './assets/icons'
import sparqlingWidgetStyle from './sparqling-widget-style'
import getTrayButtonTemplate from './tray-button-template'

export default class HighlightsList extends ui.DropPanelMixin(ui.BaseMixin(LitElement)) {
  class: string
  private _allHighlights?: Highlights
  private highlights?: Highlights
  private entityFilters?: ui.IEntityFilters
  title = 'Suggestions'

  private _onSuggestionLocalization = (element: string) => { }
  private _onSuggestionAddToQuery = (entityIri: string, entityType: EntityTypeEnum, relatedClassIri?: string) => { }

  static properties = {
    class: { type: String, attribute: false},
    highlights: { type: Object, attribute: false }
  }

  static styles = [
    ui.baseStyle,
    ui.entityListItemStyle,
    sparqlingWidgetStyle,
    css`
      :host {
        position:initial;
        pointer-events:initial;
        margin-top: 60px;
        max-height: 55%;
      }

      .gscape-panel {
        max-height: unset;
        overflow-y: clip;
      }

      .content-wrapper {
        display: flex;
        flex-direction: column;
        scrollbar-width: inherit;
        height: 100%;
      }

      .list {
        overflow: hidden auto;
        scrollbar-width: inherit;
        max-height: 100%;
        padding: 0 8px 8px 8px;
        position: relative;
        box-sizing: border-box;
      }

      details.entity-list-item > .summary-body {
        padding: 4px 8px;
      }

      details {
        white-space: nowrap;
      }

      div.entity-list-item {
        display: flex;
        align-items: center;
        gap: 2px;
        padding: 0 8px;
      }

      div.entity-list-item > .entity-name {
        flex-grow: 2;
      }

      div.entity-list-item > .entity-icon {
        line-height: 0;
      }

      div.entity-list-item > .actions {
        display: none;
      }

      div.entity-list-item:hover > .actions {
        display: unset;
      }

      .blank-slate {
        margin: 0 auto;
      }

      .ellipsed .actions, .ellipsed .entity-icon {
        overflow-x: unset
      }
    `
  ]

  constructor() {
    super()

    // Should not be necessary the '| Event' and casting to SearchEvent custom Event
    this.addEventListener('onsearch', (evt: ui.SearchEvent| Event) => {
      const searchedText = (evt as ui.SearchEvent).detail.searchText
      if (this.highlights && searchedText.length > 2) {
        const isAmatch = (value1: string, value2: string) => value1.toLowerCase().includes(value2.toLowerCase())

        this.highlights.classes = this.highlights.classes?.filter(classIri => 
          isAmatch(classIri, searchedText)
        )
        this.highlights.dataProperties = this.highlights.dataProperties?.filter(dataPropertyIri => 
          isAmatch(dataPropertyIri, searchedText)
        )
        this.highlights.objectProperties = this.highlights.objectProperties?.filter(branch => 
          branch.objectPropertyIRI ? isAmatch(branch.objectPropertyIRI, searchedText) : false 
        )
        
        this.requestUpdate()
      } else {
        this.setHighlights()
      }
    })

    this.addEventListener('onentityfilterchange', (e: ui.EntityFilterEvent | Event) => {
      this.entityFilters = (e as ui.EntityFilterEvent).detail
      this.setHighlights()
    })
  }

  render() {
    return html`
      ${this.isPanelClosed()
        ? html`
          <div>
            <gscape-button 
              id="toggle-panel-button"
              @click=${this.togglePanel}
              label=${this.title}
            > 
              <span slot="icon">${lightbulb}</span>
              <span slot="trailing-icon">${ui.icons.plus}</span>
            </gscape-button>
          </div>
        `
        : html`
          <div class="gscape-panel" id="drop-panel">
            <div class="top-bar">
              <div id="widget-header" class="bold-text">
                ${lightbulb}
                <span>${this.title}</span>
              </div>

              <gscape-button 
                id="toggle-panel-button"
                size="s" 
                type="subtle"
                @click=${this.togglePanel}
              > 
                <span slot="icon">${ui.icons.minus}</span>
              </gscape-button>
            </div>
            <div class="content-wrapper">
              <gscape-entity-search></gscape-entity-search>
              <div class="list">
                ${this.highlights
                  ? html`
                    ${this.dataProperties.map((dataPropertyIri) => this.getEntitySuggestionTemplate(dataPropertyIri, EntityTypeEnum.DataProperty))}
                    ${this.objectProperties.map(objectPropertyHighlight => this.getObjectPropertySuggestionTemplate(objectPropertyHighlight))}
                    ${this.classes.map((classIri) => this.getEntitySuggestionTemplate(classIri, EntityTypeEnum.Class))}
                  `
                  : html`
                    <div class="blank-slate">
                      ${ui.icons.searchOff}
                      <div class="header">No suggestions available</div>
                      <div class="description">Add elements to the query and we will provide you next steps suggestions</div>
                    </div>
                  `
                }

                ${this.highlights && this.objectProperties.length === 0 && this.dataProperties.length === 0 && this.classes.length === 0
                  ? ui.emptySearchBlankState
                  : null
                }
              </div>
            </div>
          </div>
        `
      }
    `
  }

  private getObjectPropertySuggestionTemplate(objectPropertyHighlight: Branch) {
    return html`
      <details class="ellipsed entity-list-item" title=${objectPropertyHighlight.objectPropertyIRI}>
        <summary class="actionable" iri=${objectPropertyHighlight.objectPropertyIRI}>
          <span class="entity-icon">${ui.icons.objectPropertyIcon}</span>
          <span @click=${this.handleEntityNameClick} class="entity-name">
            ${objectPropertyHighlight.objectPropertyIRI}
          </span>
        </summary>

        <div class="summary-body">
          ${objectPropertyHighlight.relatedClasses?.map((relatedClass) => this.getEntitySuggestionTemplate(relatedClass, EntityTypeEnum.Class, objectPropertyHighlight.objectPropertyIRI))}
        </div>
      </details>
    `
  }

  private getEntitySuggestionTemplate(entityIri: string, entityType: EntityTypeEnum, objectPropertyIri?: string) {
    let entityIcon: { _$litType$: 2; strings: TemplateStringsArray; values: unknown[] }

    switch(entityType) {
      case EntityTypeEnum.Class:
        entityIcon = ui.icons.classIcon
        break

      case EntityTypeEnum.DataProperty:
        entityIcon = ui.icons.dataPropertyIcon
        break

      case EntityTypeEnum.ObjectProperty:
      case EntityTypeEnum.InverseObjectProperty:
        entityIcon = ui.icons.objectPropertyIcon
        break
    }
    
    return html`
      <div iri=${entityIri} entity-type="${entityType}" class="ellipsed entity-list-item">
        <span class="entity-icon">${entityIcon}</span>
        <span class="entity-name actionable" @click=${this.handleEntityNameClick}>${entityIri}</span>
        <span class="actions">
          ${getTrayButtonTemplate('Add to query', placeItem, undefined, 'add-to-query-action', (e) => {
            this.handleAddToQueryClick(e, objectPropertyIri)
          })}
        </span>
      </div>
    `
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.firstUpdated(_changedProperties)
    this.closePanel()
    this.requestUpdate()
    this.hide()
  }

  private handleEntityNameClick(e: MouseEvent) {
    console.log(e)
    e.preventDefault()
    const entityIri = (e.target as HTMLElement).parentElement?.getAttribute('iri')
    if (entityIri)
      this._onSuggestionLocalization(entityIri)
  }

  private handleAddToQueryClick(e: MouseEvent, objectPropertyIri?: string) {
    e.preventDefault()

    const entityIri = (e.currentTarget as HTMLElement).parentElement?.parentElement?.getAttribute('iri')
    const entityType = (e.currentTarget as HTMLElement).parentElement?.parentElement?.getAttribute('entity-type') as EntityTypeEnum

    if (entityIri && entityType) {
      if (objectPropertyIri) { // if it's from object property, then the entityIri is the relatedClass iri
        this._onSuggestionAddToQuery(objectPropertyIri, EntityTypeEnum.ObjectProperty, entityIri)
      } else {
        this._onSuggestionAddToQuery(entityIri, entityType)
      }

    }
  }

  togglePanel = () => {
    super.togglePanel()

    this.requestUpdate()
  }

  onSuggestionLocalization(callback: (iri: string ) => void) {
    this._onSuggestionLocalization = callback
  }

  onSuggestionAddToQuery(callback: (entityIri:string, entityType: EntityTypeEnum, relatedClass?: string) => void) {
    this._onSuggestionAddToQuery = callback
  }

  private get objectProperties() {
    return this.highlights?.objectProperties?.sort((a,b) => {
      if (a.objectPropertyIRI && b.objectPropertyIRI)
        return a.objectPropertyIRI.localeCompare(b.objectPropertyIRI)
      else
        return 0
    }) || []
  }

  private get classes() {
    return this.highlights?.classes?.sort((a,b) => a.localeCompare(b)) || []
  }

  private get dataProperties() {
    return this.highlights?.dataProperties?.sort((a,b) => a.localeCompare(b)) || []
  }

  set allHighlights(highlights: Highlights | undefined) {
    this._allHighlights = highlights
    this.setHighlights()
  }

  get allHighlights() {
    return this._allHighlights
  }

  private setHighlights() {
    if (this.allHighlights)
      this.highlights = JSON.parse(JSON.stringify(this.allHighlights))
    else 
      this.highlights = this.allHighlights

    if (this.highlights && this.entityFilters && !this.entityFilters.areAllFiltersDisabled) {
      let count = 0
      if (!this.entityFilters[GrapholTypesEnum.CLASS]) {
        this.highlights.classes = []
        count += 1
      }

      if (!this.entityFilters[GrapholTypesEnum.OBJECT_PROPERTY]) {
        this.highlights.objectProperties = []
        count += 1
      }

      if (!this.entityFilters[GrapholTypesEnum.DATA_PROPERTY]) {
        this.highlights.dataProperties = []
        count += 1
      }

      // if count = 3 then highlights empty, this will show the blank-slate
      if (count === 3) {
        this.highlights = undefined
      }
    }
  }

  private get searchEntityComponent() {
    return this.shadowRoot?.querySelector('gscape-entity-search') as ui.GscapeEntitySearch | undefined
  }

  blur() {
    // do not call super.blur() cause it will collapse highlights suggestions body.
    // This because each click on cytoscape background calls document.activeElement.blur(), 
    // so if any input field has focus, query-head will be the activeElement and will be
    // blurred at each tap. this way we only blur the input elements.
    this.shadowRoot?.querySelectorAll('input').forEach(inputElement => inputElement.blur())
  }
}

customElements.define('sparqling-highlights-list', HighlightsList)