import { ui } from 'grapholscape';
import { css, html, LitElement } from 'lit';
import { EntityTypeEnum, Filter, Function, GroupByElement, HeadElement, VarOrConstantConstantTypeEnum } from '../api/swagger';
import { getFiltersOnVariable, isConfigEnabled } from '../model';
import { addFilter, crosshair, dragHandler, expandLess, expandMore, filter as filterIcon, functionIcon, kebab, rubbishBin, sigma, sortAscendingIcon, sortDescendingIcon, sortIcon } from '../widgets/assets/icons';
import { getElemWithOperatorStyle } from '../widgets/forms/elem-with-operator-style';
import { getElemWithOperatorList } from '../widgets/forms/elems-with-operator-list-template';
import sparqlingWidgetStyle from '../widgets/sparqling-widget-style';
import getTrayButtonTemplate from '../widgets/tray-button-template';
import { onDragEnd, onDragOver, onDragStart } from './drag-sorting';

const ALIAS_INPUT_ID = 'alias'

export type HeadElementCallback = (headElementId: string) => void
export type HeadElementRenameCallback = (headElementId: string, alias: string) => void

export default class HeadElementComponent extends ui.BaseMixin(ui.DropPanelMixin(LitElement)) implements HeadElement {
  public _id: string
  graphElementId: string
  alias: string
  function: Function
  variable: string
  entityType: string
  dataType: VarOrConstantConstantTypeEnum
  ordering: number
  public deleteButton: ui.GscapeButton
  private toggleBodyButton: ui.GscapeButton
  public localizeButton: ui.GscapeButton
  public addFilterButton: ui.GscapeButton
  public addFunctionButton: any
  public orderByButton: any
  public addAggregationButton: any
  filters: { id: number, value: Filter }[]
  groupBy: GroupByElement
  having: Filter[]

  showCxtMenu = () => { }
  onDelete: HeadElementCallback = () => { }
  onRename: HeadElementRenameCallback = () => { }
  onLocalize: HeadElementCallback = () => { }
  onOrderBy: HeadElementCallback = () => { }

  static properties = {
    alias: { attribute: false },
    graphElementId: { attribute: false },
    function: { attribute: false },
    _entityType: { type: String },
}

  static styles = [
    ui.baseStyle,
    getElemWithOperatorStyle(),
    sparqlingWidgetStyle,
    css`
      :host {
        display:block;
        height: fit-content;
        margin:5px 0;
        position: relative;
        opacity:1;
        border: none;
        transition: all 0.5s;
        border-left: solid 2px;
      }

      :host(.dragged) {
        opacity: 0.2;
        border: solid 2px var(--gscape-color-accent);
      }

      #alias-input {
        flex-grow: 2;
      }

      #alias-input > input {
        width: 100%;
      }

      #field-head{
        display: flex;
        align-items: center;
        gap: 2px;
        padding-left: 20px;
      }

      #drag-handler {
        cursor: grab;
        display: none;
        line-height: 0;
        position: absolute;
        left: 0;
      }

      :host(:hover) #drag-handler {
        display: inline-block;
      }

      #field-head:hover > #actions {
        display: flex;
      }

      #field-head:hover > #state-tray {
        display: none;
      }

      #field-head-input-action-wrapper:hover > #state-tray {
        display: none;
      }
      #field-head-input-action-wrapper > input:focus {
        background-color: blue;
      }

      #actions {
        align-items: center;
        display: none;
      }

      #actions > * {
        line-height: 0;
      }

      .danger:hover {
        color: var(--gscape-color-error);
      }

      .filters-function-list {
        display:flex;
        flex-direction: column;
        gap: 20px;
      }

      #state-tray {
        color: var(--gscape-color-accent);
        line-height: 0;
      }

      #state-tray > svg {
        height: 15px;
        width: 15px;
      }

      summary {
        list-style: none
      }

      #drop-panel {
        padding: 8px;
        padding-right: 0;
      }

      .section {
        margin: 8px 0;
      }
    `,
  ]

  constructor(headElement: HeadElement) {
    super()

    this.headElement = headElement

    this.ondragstart = (evt) => onDragStart(evt)
    this.ondragover = (evt) => onDragOver(evt)
    this.ondragend = (evt) => onDragEnd(evt)
    this.ondrop = (evt) => evt.preventDefault()
  }

  render() {
    return html`
      <div>
        <div id="field-head">
          <div id="drag-handler" draggable="true">
            ${dragHandler}
          </div>
          <div id="alias-input">
            <input
              id="${ALIAS_INPUT_ID}"
              @focusout="${this.handleInputChange}"
              @keyup=${this.checkAliasValidity}
              placeholder="${this.alias || this.graphElementId}"
              value="${this.alias || this.graphElementId}"
              title="Rename Field"
              pattern="^[A-Za-z][A-Za-z0-9_]*$"
            />
          </div>
          <div id="actions">
            ${getTrayButtonTemplate('Show in graphs', crosshair, undefined, 'localize-action', () => this.onLocalize(this._id))}
            ${getTrayButtonTemplate('Order results ascending/descending', this.orderIcon, undefined, 'sort-action', () => this.onOrderBy(this._id))}
            ${getTrayButtonTemplate('More actions', kebab, undefined, 'cxt-menu-action', () => this.showCxtMenu())}
          </div>
          ${this.hasAnythingInBody || this.ordering !== 0
            ? html`
              <div id="state-tray">
                ${this.function ? functionIcon : null}
                ${this.ordering && this.ordering !== 0 ? this.orderIcon : null}
                ${this.filters?.length > 0 ? filterIcon : null}
                ${this.groupBy ? sigma : null}
              </div>
            `
            : null
          }
          ${this.hasAnythingInBody
            ? html`
              <div id="toggle-panel">
                ${getTrayButtonTemplate('Expand', expandMore, expandLess, 'expand-action', this.togglePanel)}
              </div>
            `
            : null
          }
        </div>
        <div id="drop-panel" class="hide">
          ${this.groupBy
            ? html`
              <div class="section">
                <div class="section-header bold-text">Aggregation</div>
                <div class="filters-function-list">
                  ${getElemWithOperatorList([this.groupBy])}
                </div>
                ${this.having 
                  ? html`
                    <span class="title">Having</span>
                    <div class="filters-function-list">
                      ${getElemWithOperatorList(this.having)}
                    </div>
                  `
                  : null
                }
              </div>
            `
            : null
          }

          ${this.function 
            ? html`
              <div class="section">
                <div class="section-header bold-text">Function</div>
                <div class="filters-function-list">
                  ${getElemWithOperatorList([this.function])}
                </div>
              </div>
            `
            : null
          }
          
          ${this.filters?.length > 0
            ? html`
              <div class="section">
                <div class="section-header bold-text">Filters</div>
                <div class="filters-function-list">
                  ${getElemWithOperatorList(this.filters, this.editFilterCallback, this.deleteFilterCallback)}
                </div>
              </div>
            `
            : null}
        </div>
      </div>
    `
  }

  set headElement(newElement: HeadElement) {
    if (this._id === newElement.id) return

    if (newElement.id)
      this._id = newElement.id

    if (newElement.alias)
      this.alias = newElement.alias

    if (newElement.graphElementId)
      this.graphElementId = newElement.graphElementId

    this.entityType = newElement['entityType']
    this.dataType = newElement['dataType'] || 'Type'

    if (newElement.function)
      this.function = newElement.function

    if (newElement.ordering)
     this.ordering = newElement.ordering

    if (newElement.groupBy)
      this.groupBy = newElement.groupBy

    if (newElement.having)
      this.having = newElement.having

    if (this.entityType === EntityTypeEnum.Annotation) {
      this.style.borderColor = '#F46036'
    } else {
      let types = {
        'class': 'class',
        'objectProperty': 'object-property',
        'dataProperty': 'data-property',
      }

      this.style.borderColor = `var(--gscape-color-${types[this.entityType]}-contrast)`
    }

    if (newElement.graphElementId) {
      const filtersOnVariable = getFiltersOnVariable(newElement.graphElementId)
      if (filtersOnVariable)
        this.filters = filtersOnVariable  
    }
  }

  private getSelect(sectionName: string, name: string, defaultOpt: string, options: object) {
    const isDefaultAlreadySet = Object.values(options).includes(defaultOpt)
    return html`
      <select name="${name}" sectionName="${sectionName}">
        ${isDefaultAlreadySet ? null : html`<option selected>${defaultOpt}</option>`}
        ${Object.keys(options).map(key => {
      if (options[key] === defaultOpt)
        return html`<option value="${key}" selected>${options[key]}</option>`
      else
        return html`<option value="${key}">${options[key]}</option>`
    })}
          </select>
    `
  }

  private handleInputChange(evt: Event) {
    let target = evt.currentTarget as HTMLInputElement

    if (!target.checkValidity()) {
      target.reportValidity()
      return
    }

    if (this.alias && target.value === this.graphElementId) {
      target.setCustomValidity('Please use an alias different from variable name')
      target.reportValidity()
      return
    }

    if (this.alias !== target.value && target.value.length > 0 && target.value !== this.graphElementId) {
      this.onRename(this._id, target.value)
    } else {
      target.value = this.alias || this.graphElementId
    }
  }

  private checkAliasValidity(evt: KeyboardEvent) {
    const target = evt.currentTarget as HTMLInputElement

    target.setCustomValidity('')

    if (!target.checkValidity()) {
      target.setCustomValidity('Only letters, numbers and underscore')
      //target.value = target.value.substring(0, target.value.length - 1)
      target.reportValidity()
      return
    } else if (evt.key === "Enter" || evt.key === "Escape") {
      target.blur()
    }
  }

  public onFunctionSet(callback: (fun: Function) => void) { }

  private addFilterCallback = (headElementId: string) => { }
  public onAddFilter(callback: (headElementId: string) => void) {
    this.addFilterCallback = callback
  }

  private editFilterCallback = (filterId: number) => { }
  public onEditFilter(callback: (filterId: number) => void) {
    this.editFilterCallback = callback
  }

  private deleteFilterCallback = (filterId: number) => { }
  public onDeleteFilter(callback: (filterId: number) => void) {
    this.deleteFilterCallback = callback
  }

  private addFunctionCallback = (headElementId: string) => { }
  public onAddFunction(callback: (headElementId: string) => void) {
    this.addFunctionCallback = callback
  }

  private addAggregationCallback = (headElementId: string) => { }
  public onAddAggregation(callback: (headElementId: string) => void) {
    this.addAggregationCallback = callback
  }

  public get dragHandler() {
    return (this as any).shadowRoot.querySelector('#drag-handler')
  }

  private get hasAnythingInBody() {
    return this.filters?.length > 0 || this.function || this.groupBy
  }

  private get orderIcon() {
    if (this.ordering > 0) {
      return sortAscendingIcon
    } else if (this.ordering < 0) {
      return sortDescendingIcon
    } else {
      return sortIcon
    }
  }

  get moreActionsButton() {
    return this.shadowRoot?.querySelector('#cxt-menu-action') as HTMLElement
  }

  get cxtMenuCommands() {
    const result: ui.Command[] = []

    if (isConfigEnabled('filter'))
      result.push({
        content: 'Add Filter',
        icon: addFilter,
        select: () => this.addFilterCallback(this._id)
      })

    if (isConfigEnabled('function') && !this.function) {
      result.push({
        content: 'Add Function',
        icon: functionIcon,
        select: () => this.addFunctionCallback(this._id)
      })
    }

    if (isConfigEnabled('aggregation') && !this.groupBy) {
      result.push({
        content: 'Add Aggregation Function',
        icon: sigma,
        select: () => this.addAggregationCallback(this._id)
      })
    }

    result.push({
      content: 'Delete Field',
      icon: rubbishBin,
      select: () => this.onDelete(this._id)
    })

    return result
  }
}

customElements.define('head-element', HeadElementComponent as any)