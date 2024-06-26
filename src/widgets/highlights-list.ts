import { TypesEnum, ui } from 'grapholscape'
import { LitElement, PropertyValueMap, css, html } from 'lit'
import { crosshair, lightbulb } from './assets/icons'
import { emptyUnfoldingEntityTooltip } from './assets/texts'
import sparqlingWidgetStyle from './sparqling-widget-style'
import { isFullPageActive } from '../model'

export type ViewHighlights = {
  classes: ui.EntityViewData[],
  dataProperties: ui.EntityViewData[],
  objectProperties: ui.ViewObjectProperty[],
}

export default class HighlightsList extends ui.DropPanelMixin(ui.BaseMixin(LitElement)) {
  class: string
  private _allHighlights?: ViewHighlights
  private shownIRIs?: {
    classes: string[],
    dataProperties: string[],
    objectProperties: string[],
  }
  private entityFilters?: ui.IEntityFilters
  title = 'Suggestions'
  loading: boolean = false

  protected isDefaultClosed: boolean = false

  private _onSuggestionLocalization = (element: string) => { }
  private _onSuggestionAddToQuery = (entityIri: string, entityType: TypesEnum, relatedClassIri?: string) => { }
  private _onAddLabel = () => { }
  private _onAddComment = () => { }
  private _onFindPathsClick = () => { }

  static properties = {
    class: { type: String, attribute: false },
    allHighlights: { type: Object, attribute: false }
  }

  static styles = [
    ui.baseStyle,
    ui.entityListItemStyle,
    ui.contentSpinnerStyle,
    sparqlingWidgetStyle,
    css`
      :host {
        position:initial;
        pointer-events:initial;
        max-height: 55%;
      }

      .gscape-panel {
        max-height: unset;
        overflow-y: clip;
      }

      .content-wrapper {
        overflow: auto;
      }

      .list {
        overflow: hidden auto;
        scrollbar-width: inherit;
        max-height: 100%;
        padding: 0 8px 8px 8px;
        position: relative;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
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

      gscape-entity-list-item {
        --custom-min-height: 26.5px;
      }

      gscape-entity-list-item > .actions {
        display: none;
      }

      gscape-entity-list-item:hover > .actions {
        display: unset;
      }

      .blank-slate {
        margin: 0 auto;
      }

      .ellipsed .actions, .ellipsed .entity-icon {
        overflow-x: unset
      }

      .disabled {
        opacity: 0.5

      }
    `
  ]

  constructor() {
    super()

    // Should not be necessary the '| Event' and casting to SearchEvent custom Event
    this.addEventListener('onsearch', (evt: ui.SearchEvent| Event) => {
      const searchedText = (evt as ui.SearchEvent).detail.searchText
      if (this.shownIRIs && searchedText.length > 2) {
        const isAmatch = (value1: string, value2: string) => value1.toLowerCase().includes(value2.toLowerCase())

        const checkEntity = (e: ui.EntityViewData) => {
          return isAmatch(e.value.iri.remainder, searchedText) ||
          e.value.getLabels().some(label => isAmatch(label.lexicalForm, searchedText))
        }

        if (!this.entityFilters || this.entityFilters.areAllFiltersDisabled ||
            this.entityFilters[TypesEnum.CLASS]) {

          this.shownIRIs.classes = this.allHighlights?.classes
          ?.filter(c => checkEntity(c))
          .map(e => e.value.iri.fullIri) || []
        }

        if (!this.entityFilters || this.entityFilters.areAllFiltersDisabled ||
            this.entityFilters[TypesEnum.DATA_PROPERTY]) {

          this.shownIRIs.dataProperties = this.allHighlights?.dataProperties
            ?.filter(dp => checkEntity(dp))
            .map(e => e.value.iri.fullIri) || []
        }


        if (!this.entityFilters || this.entityFilters.areAllFiltersDisabled ||
            this.entityFilters[TypesEnum.OBJECT_PROPERTY]) {

          this.shownIRIs.objectProperties = this.allHighlights?.objectProperties
            ?.filter(op => checkEntity(op))
            .map(e => e.value.iri.fullIri) || []
        }
        
        
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
        : null
      }

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

        <gscape-entity-search
          class=0
          data-property=0
          object-property=0
        ></gscape-entity-search>

        <div class="content-wrapper">
          <div class="list">
            ${this.loading
              ? html`<div style="align-self: center">${ui.getContentSpinner()}</div>`
              : this.hasAnyHighlights
                ? html`

                  <details open="">
                    <summary class="actionable" style="padding: 8px">Annotations</summary>

                    <gscape-action-list-item
                      label = 'Label'
                      @click=${this._onAddLabel}
                    >
                      <span slot="icon">${ui.icons.labelIcon}</span>
                    </gscape-action-list-item>

                    <gscape-action-list-item
                      label = 'Comment'
                      @click=${this._onAddComment}
                    >
                      <span slot="icon">${ui.icons.commentIcon}</span>
                    </gscape-action-list-item>
                  </details>

                  <div class="find-paths" style="margin: 4px auto">
                    <gscape-button 
                      size="s"
                      label="Find a path"
                      title="Get shortest paths suggestions to reach a class of interest from your current state"
                      @click=${this._onFindPathsClick}
                    >
                      ${ui.getIconSlot('icon', ui.icons.pathIcon)}
                    </gscape-button>
                  </div>

                  <div class="hr" style="flex-shrink: 0; margin: 8px auto"></div>

                  ${this.dataProperties.map(dp => this.getEntitySuggestionTemplate(dp))}
                  ${this.objectProperties.map(op => this.getObjectPropertySuggestionTemplate(op))}
                  ${this.classes.map(c => this.getEntitySuggestionTemplate(c))}

                  ${this.shownIRIs && this.objectProperties.length === 0 && this.dataProperties.length === 0 && this.classes.length === 0
                    ? ui.emptySearchBlankState
                    : null
                  }
                `
                : html`
                  <div class="blank-slate">
                    ${ui.icons.searchOff}
                    <div class="header">No suggestions available</div>
                    <div class="description">Add elements to the query and we will provide you next steps suggestions</div>
                  </div>
                `
            }
          </div>
        </div>
      </div>
    `
  }

  private getObjectPropertySuggestionTemplate(objectProperty: ui.ViewObjectProperty) {
    return html`
      <gscape-entity-list-item
        displayedname=${objectProperty.displayedName}
        iri=${objectProperty.value.iri.fullIri}
        .types=${objectProperty.value.types}
        ?asaccordion=${true}
        ?disabled=${objectProperty.disabled}
        direct=${objectProperty.direct}
        title=${!objectProperty.disabled ? objectProperty.displayedName : emptyUnfoldingEntityTooltip()}
      >
        <div slot="accordion-body">
          ${objectProperty.connectedClasses.map(connectedClass => this.getEntitySuggestionTemplate(
            connectedClass, 
            (e) => this.handleAddToQueryClick(
              e, 
              connectedClass.value.iri.fullIri,
              objectProperty.value.types,
              objectProperty.value.iri.fullIri
            ),
            objectProperty.disabled
            ))}
        </div>

        ${!objectProperty.direct
          ? html`
            <span slot="trailing-element" class="chip" style="line-height: 1">Inverse</span>
          `
          : null
        }

        ${!isFullPageActive()
          ? html`
            <div slot="trailing-element" class="actions">
              <gscape-button
                  title="Show in graphs"
                  size="s"
                  type="subtle"
                  @click=${(e: MouseEvent) => {
                    this.handleSuggestionLocalization(e, objectProperty.value.iri.fullIri)
                  }}
                >
                  <span slot='icon' class="slotted-icon">${crosshair}</span>
                </gscape-button>
            </div>
          `
          : null
        }
        
      </gscape-entity-list-item>
    `
  }

  private getEntitySuggestionTemplate(entity: ui.EntityViewData, customCallback?: (e: MouseEvent) => void, forceDisabled = false) {
    const disabled = forceDisabled || entity.disabled === true
    return html`
      <gscape-entity-list-item
        displayedname=${entity.displayedName}
        iri=${entity.value.iri}
        .types=${entity.value.types}
        actionable
        ?disabled=${disabled}
        title=${!entity.disabled ? entity.displayedName : emptyUnfoldingEntityTooltip()}
        @click=${(e: MouseEvent) => {
          if (customCallback)
            customCallback(e)
          else
            this.handleAddToQueryClick(e, entity.value.iri.fullIri, entity.value.types)
        }}
      >
        <div slot="trailing-element" class="actions">
          ${!isFullPageActive()
            ? html`
              <gscape-button
                title="Show in graphs"
                size="s"
                type="subtle"
                @click=${(e: MouseEvent) => {
                  this.handleSuggestionLocalization(e, entity.value.iri.fullIri)
                }}
              >
                <span slot='icon' class="slotted-icon">${crosshair}</span>
              </gscape-button>
            `
            : null
          }
        </div>
      </gscape-entity-list-item>
    `
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.firstUpdated(_changedProperties)
    this.hide()
  }

  private handleSuggestionLocalization(e: MouseEvent, entityIri: string) {
    e.stopPropagation()
    e.preventDefault()
    if (entityIri)
      this._onSuggestionLocalization(entityIri)
  }

  private handleAddToQueryClick(e: MouseEvent, entityIri: string, entityType: TypesEnum[], objectPropertyIri?: string) {
    e.preventDefault()
    if (objectPropertyIri) { // if it's from object property, then the entityIri is the relatedClass iri
      this._onSuggestionAddToQuery(objectPropertyIri, TypesEnum.OBJECT_PROPERTY, entityIri)
    } else {
      this._onSuggestionAddToQuery(entityIri, Array.from(entityType)[0])
    }
  }

  togglePanel = () => {
    super.togglePanel()

    this.requestUpdate()
  }

  onSuggestionLocalization(callback: (iri: string ) => void) {
    this._onSuggestionLocalization = callback
  }

  onSuggestionAddToQuery(callback: (entityIri:string, entityType: TypesEnum, relatedClass?: string) => void) {
    this._onSuggestionAddToQuery = callback
  }

  onAddLabel(callback: () => void) {
    this._onAddLabel = callback
  }

  onAddComment(callback: () => void) {
    this._onAddComment = callback
  }

  onFindPathsClick(callback: () => void) {
    this._onFindPathsClick = callback
  }

  private get objectProperties() {
    return this.allHighlights?.objectProperties?.sort((a,b) => {
      return a.displayedName.localeCompare(b.displayedName)
    }).filter(op => !this.shownIRIs || this.shownIRIs?.objectProperties.includes(op.value.iri.fullIri)) || []
  }

  private get classes() {
    return this.allHighlights?.classes?.sort((a,b) => {
      return a.displayedName.localeCompare(b.displayedName)
    }).filter(c => !this.shownIRIs || this.shownIRIs?.classes.includes(c.value.iri.fullIri)) || []
  }

  private get dataProperties() {
    return this.allHighlights?.dataProperties?.sort((a,b) => {
      return a.displayedName.localeCompare(b.displayedName)
    }).filter(dp => !this.shownIRIs || this.shownIRIs?.dataProperties.includes(dp.value.iri.fullIri)) || []
  }

  set allHighlights(highlights: ViewHighlights | undefined) {
    this._allHighlights = highlights
    this.setHighlights()
  }

  get allHighlights() {
    return this._allHighlights
  }

  private setHighlights() {
    
    this.shownIRIs = {
      classes: this.allHighlights?.classes.map(e => e.value.iri.fullIri) || [],
      dataProperties: this.allHighlights?.dataProperties.map(e => e.value.iri.fullIri) || [],
      objectProperties: this.allHighlights?.objectProperties.map(e => e.value.iri.fullIri) || [],
    }

    if (this.shownIRIs && this.entityFilters && !this.entityFilters.areAllFiltersDisabled) {
      let count = 0
      if (!this.entityFilters[TypesEnum.CLASS]) {
        this.shownIRIs.classes = []
        count += 1
      }

      if (!this.entityFilters[TypesEnum.OBJECT_PROPERTY]) {
        this.shownIRIs.objectProperties = []
        count += 1
      }

      if (!this.entityFilters[TypesEnum.DATA_PROPERTY]) {
        this.shownIRIs.dataProperties = []
        count += 1
      }

      // if count = 3 then highlights empty, this will show the blank-slate
      if (count === 3) {
        this.shownIRIs = undefined
      }
    }

    this.requestUpdate()
  }

  private get hasAnyHighlights() {
    if (this.allHighlights)
      return this.allHighlights.classes.length > 0 ||
        this.allHighlights.dataProperties.length > 0 ||
        this.allHighlights.objectProperties.length > 0
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