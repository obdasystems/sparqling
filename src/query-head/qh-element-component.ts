import { UI } from 'grapholscape'
import { html, css } from 'lit'
import { HeadElement, Function, VarOrConstantConstantTypeEnum, Filter } from '../api/swagger';
import { getFiltersOnHeadElement } from '../query-body';
import { addFilter, crosshair, del } from '../widgets/assets/icons'

const ALIAS_INPUT_ID = 'alias'

export default class HeadElementComponent extends UI.GscapeWidget {
  private collapsible = true;

  public _id: string
  private graphElementId: string
  private alias: string
  private function: Function
  private variable: string
  private entityType: string
  private dataType: VarOrConstantConstantTypeEnum
  public deleteButton: UI.GscapeWidget
  private toggleBodyButton: UI.GscapeButton
  public localizeButton: UI.GscapeButton
  private addFilterButton: UI.GscapeButton
  private filters: {id: number, value: Filter}[]

  static get properties() {
    let props = super.properties

    let new_props = {
      alias: { attribute: false },
      graphElementId: { attribute: false },
      function: { attribute: false },
      _entityType: { type: String },
    }

    return Object.assign(new_props, props)
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
        }

        .widget-body {
          margin-top: 5px;
        }

        .section {
          padding: 0;
          margin: 10px 0;
        }

        .section-head {
          display:flex;
          gap:5px;
          justify-content: space-between;
          align-items: center;
        }

        .section-title {
          font-weight: bold;
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

        #field-head-input-action-wrapper > input:focus {
          background-color: var(--theme-gscape-primary, ${colors.primary});
        }

        #field-head-input-action-wrapper > input:focus + #actions {
          display: none;
        }

        #field-head gscape-button {
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

        summary:hover {
          cursor: pointer;
        }
      `
    ]
  }

  constructor(headElement: HeadElement) {
    super()

    this.headElement = headElement
    this.deleteButton = new UI.GscapeButton(del, 'Delete Field')
    this.deleteButton.onClick = () => { }
    this.deleteButton.classList.add('danger')
    this.toggleBodyButton = new UI.GscapeButton(UI.icons.triangle_down, 'Show More', UI.icons.triangle_up)
    this.toggleBodyButton.onClick = () => (this as any).toggleBody()
    this.toggleBodyButton.style.boxShadow = 'none'

    this.localizeButton = new UI.GscapeButton(crosshair, 'Find in Query Graph')
    this.localizeButton.onClick = () => this.localizeCallback(this._id)

    this.addFilterButton = new UI.GscapeButton(addFilter, 'Add Filter')
    this.addFilterButton.onClick = () => this.addFilterCallback(this._id)
  }

  render() {
    return html`
      <div>
        <div id="field-head">
          <div id="field-head-input-action-wrapper">
            <input
              id="${ALIAS_INPUT_ID}"
              @focusout="${this.handleInputChange}"
              placeholder="${this.alias || this.graphElementId}"
              value="${this.alias || this.graphElementId}"
              title="Rename Field"
            />
            <div id="actions">
              ${this.localizeButton}
              ${this.deleteButton}
              ${this.addFilterButton}
            </div>
          </div>
          ${this.toggleBodyButton}
        </div>
        <div id="field-body" class="widget-body hide">
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
    let types = {
      'class': 'concept',
      'objectProperty': 'role',
      'dataProperty': 'attribute'
    }
    let self = this as any
    self.style.backgroundColor = `var(--theme-gscape-${types[this.entityType]})`
    this.filters = getFiltersOnHeadElement(newElement)
  }

  private getSelect(sectionName:string, name: string, defaultOpt: string, options: object) {
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
}

customElements.define('head-element', HeadElementComponent as any)