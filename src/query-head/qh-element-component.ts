import { UI } from 'grapholscape';
import { css, html } from 'lit';
import { Filter, Function, GroupByElement, HeadElement, VarOrConstantConstantTypeEnum } from '../api/swagger';
import { getFiltersOnVariable } from '../model';
import { addFilter, crosshair, dragHandler, filter as filterIcon, functionIcon, rubbishBin, sigma, sortAscendingIcon, sortDescendingIcon, sortIcon } from '../widgets/assets/icons';
import { getElemWithOperatorStyle } from '../widgets/forms/elem-with-operator-style';
import { getElemWithOperatorList } from '../widgets/forms/elems-with-operator-list-template';
import { onDragEnd, onDragOver, onDragStart } from './drag-sorting';

const ALIAS_INPUT_ID = 'alias'

export default class HeadElementComponent extends UI.GscapeWidget implements HeadElement {
  private collapsible = true;

  public _id: string
  graphElementId: string
  alias: string
  function: Function
  variable: string
  entityType: string
  dataType: VarOrConstantConstantTypeEnum
  ordering: number
  public deleteButton: UI.GscapeWidget
  private toggleBodyButton: UI.GscapeButton
  public localizeButton: UI.GscapeButton
  public addFilterButton: UI.GscapeButton
  public addFunctionButton: any
  public orderByButton: any
  public addAggregationButton: any
  filters: { id: number, value: Filter }[]
  groupBy: GroupByElement
  having: Filter[]
  
  private ondragstart: (evt: any) => void
  private ondragover: (evt: any) => void
  private ondragleave: (evt: any) => void
  private ondragend: (evt: any) => void
  private ondrop: (evt: any) => any

  static get properties() {
    let props = super.properties

    let new_props = {
      alias: { attribute: false },
      graphElementId: { attribute: false },
      function: { attribute: false },
      _entityType: { type: String },
    }

    Object.assign(props, new_props)
    return props
  }

  static get styles() {
    let super_styles = super.styles as any
    let colors = super_styles[1]

    return [
      super_styles[0],
      css`
        :host {
          display:block;
          height: fit-content;
          margin:5px 2.5px 5px 0;
          padding: 5px;
          position: relative;
          opacity:1;
          border: none;
          transition: all 0.5s;
        }

        :host(.dragged) {
          opacity: 0.2;
          border: solid 2px var(--theme-gscape-secondary, ${colors.secondary});
        }

        input {
          font-size: inherit;
          text-align: center;
          padding:2px;
          border-radius: 4px;
          border: solid 1px var(--theme-gscape-shadows, ${colors.shadows});
          color: inherit;
          font-weight: bold;
          width:100%;
          box-sizing: border-box;
          background-color: var(--theme-gscape-primary, ${colors.primary});
        }

        .input-wrapper, select {
          margin:5px 0;
        }

        #drag-handler {
          display: none;
          cursor: grab;
        }

        #field-head, #field-head-input-action-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        #field-head-input-action-wrapper {
          flex-direction: column;
          flex-grow:2;
        }

        #field-head-input-action-wrapper > input {
          margin: 0;
          background-color: inherit;
          border: none;
        }

        #field-head-input-action-wrapper > input:hover {
          border: solid 1px var(--theme-gscape-shadows, ${colors.shadows});
        }

        #field-head-input-action-wrapper:hover > #actions {
          display: flex;
        }

        #field-head-input-action-wrapper:hover > #state-tray {
          display: none;
        }

        #field-head:hover > #drag-handler {
          display: block;
        }

        #field-head-input-action-wrapper > input:focus {
          background-color: var(--theme-gscape-primary, ${colors.primary});
        }

        gscape-button {
          position:initial;
          width: fit-content;
          --gscape-icon-size: 20px;
          background: inherit;
        }

        #actions {
          display: none;
          align-items: center;
          gap: 10px;
        }

        .danger:hover {
          color: var(--theme-gscape-error, ${colors.error});
        }

        .filters-function-list {
          display:flex;
          flex-direction: column;
          gap: 20px;
          padding: 10px 5px;
        }

        .section {
          padding: 5px;
          margin: 10px 0;
        }

        .section > .title {
          font-weight: bold;
        }

        #drag-handler {
          height: 20px;
          width: 20px;
        }

        #state-tray {
          display: flex;
        }
        #state-tray > svg {
          height: calc(var(--gscape-icon-size) - 6px);
          width: calc(var(--gscape-icon-size) - 6px);
        }
      `,
      getElemWithOperatorStyle(),
    ]
  }

  constructor(headElement: HeadElement) {
    super()

    this.headElement = headElement
    this.deleteButton = new UI.GscapeButton(rubbishBin, 'Delete Field')
    this.deleteButton.onClick = () => { }
    this.deleteButton.classList.add('danger')
    this.toggleBodyButton = new UI.GscapeButton(UI.icons.triangle_down, 'Show More', UI.icons.triangle_up)
    this.toggleBodyButton.onClick = () => (this as any).toggleBody()
    this.toggleBodyButton.style.boxShadow = 'none'

    this.localizeButton = new UI.GscapeButton(crosshair, 'Find in Query Graph')
    this.localizeButton.onClick = () => this.localizeCallback(this._id)

    this.addFilterButton = new UI.GscapeButton(addFilter, 'Add Filter')
    this.addFilterButton.onClick = () => this.addFilterCallback(this._id)

    this.addFunctionButton = new UI.GscapeButton(functionIcon, 'Add Function')
    this.addFunctionButton.onClick = () => this.addFunctionCallback(this._id)

    this.orderByButton = new UI.GscapeButton(null, 'Order By')
    this.orderByButton.onClick = () => this.orderByCallback(this._id)

    this.addAggregationButton = new UI.GscapeButton(sigma, 'Add Aggregation Function')
    this.addAggregationButton.onClick = () => this.addAggregationCallback(this._id)

    this.ondragstart = (evt) => onDragStart(evt)
    this.ondragover = (evt) => onDragOver(evt)
    this.ondragend = (evt) => onDragEnd(evt)
    this.ondrop = (evt) => evt.preventDefault()
  }

  render() {
    if (this.ordering > 0) {
      this.orderByButton.icon = sortAscendingIcon
      this.orderByButton.highlighted = true
    } else if (this.ordering < 0) {
      this.orderByButton.icon = sortDescendingIcon
      this.orderByButton.highlighted = true
    } else {
      this.orderByButton.icon = sortIcon
      this.orderByButton.highlighted = false
    }
    return html`
      <div>
        <div id="field-head">
          <div
            id="drag-handler"
            draggable="true"
          >
            ${dragHandler}
          </div>
          <div id="field-head-input-action-wrapper">
            <input
              id="${ALIAS_INPUT_ID}"
              @focusout="${this.handleInputChange}"
              placeholder="${this.alias || this.graphElementId}"
              value="${this.alias || this.graphElementId}"
              title="Rename Field"
            />
            ${this.hasAnythingInBody || this.ordering
              ? html`
                <div id="state-tray">
                  ${this.filters?.length > 0 ? filterIcon : null}
                  ${this.function ? functionIcon : null}
                  ${this.ordering > 0 ? sortAscendingIcon : null}
                  ${this.ordering < 0 ? sortDescendingIcon : null}
                  ${this.groupBy ? sigma : null}
                </div>
              `
              : null
            }
            <div id="actions">
              ${this.localizeButton}
              ${this.deleteButton}
              ${this.addFilterButton}
              ${!this.function ? this.addFunctionButton : null}
              ${this.orderByButton}
              ${!this.groupBy ? this.addAggregationButton : null}
            </div>
          </div>
          ${this.hasAnythingInBody ? this.toggleBodyButton : null}
        </div>
        <div id="field-body" class="widget-body hide">
          ${this.groupBy
            ? html`
              <div class="section">
                <div class="section-header">Aggregation</div>
                <div class="filters-function-list">
                  ${getElemWithOperatorList([this.groupBy])}
                </div>
                <span class="title">Having</span>
                <div class="filters-function-list">
                  ${getElemWithOperatorList(this.having)}
                </div>
              </div>
            `
            : null
          }

          ${this.function 
            ? html`
              <div class="section">
                <div class="section-header">Function</div>
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
                <div class="section-header">Filters</div>
                <div class="filters-function-list">
                  ${getElemWithOperatorList(this.filters, this.editFilterCallback, this.deleteFilterCallback)}
                </div>
              </div>
            `
            : null}
          <!-- ******************  SORT  ****************** -->
          <div class="section" style="text-align: center; margin-bottom:0">
            ${this.getSelect('sort', 'sort-select', 'sort', { asc: 'Ascending', desc: 'Descending' })}
          </div>
        </div>
      </div>
    `
  }

  set headElement(newElement: HeadElement) {
    if (this._id === newElement.id) return
    this._id = newElement.id
    this.alias = newElement.alias
    this.graphElementId = newElement.graphElementId
    this.entityType = newElement['entityType']
    this.dataType = newElement['dataType'] || 'Type'
    this.function = newElement.function
    this.ordering = newElement.ordering
    this.groupBy = newElement.groupBy
    this.having = newElement.having

    let types = {
      'class': 'concept',
      'objectProperty': 'role',
      'dataProperty': 'attribute'
    }
    let self = this as any
    self.style.backgroundColor = `var(--theme-gscape-${types[this.entityType]})`
    this.filters = getFiltersOnVariable(newElement.graphElementId)
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

  handleInputChange(evt: FocusEvent) {
    let target = evt.currentTarget as HTMLInputElement
    if (this.alias !== target.value && target.value.length > 0 && target.value !== this.graphElementId) {
      this.renameCallback(this._id, target.value)
    } else {
      target.value = this.alias || this.graphElementId
    }
  }

  private renameCallback = (headElemntID: string, alias: string) => { }
  public onRename(callback: (headElemntID: string, alias: string) => void) { this.renameCallback = callback }

  private localizeCallback = (headElementId: string) => { }
  public onLocalize(callback: (headElementId: string) => void) { this.localizeCallback = callback }

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

  private orderByCallback = (headElementId: string) => { }
  public onOrderByChange(callback: (headElementId: string) => void) {
    this.orderByCallback = callback
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
}

customElements.define('head-element', HeadElementComponent as any)