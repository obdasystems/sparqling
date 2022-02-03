import { UI } from 'grapholscape'
import { html, css } from 'lit'
import { HeadElement, ModelFunctionNameEnum, ModelFunction, VarOrConstantConstantTypeEnum, FilterExpressionOperatorEnum, Filter } from '../api/swagger/models';
import { del } from './icons'

const SECTIONS = {
  function: {
    name: 'Function',
    op: 'function-operator',
    type: 'function-type',
    value: 'function-value',
    options: ModelFunctionNameEnum,
  },
  filter: {
    name: 'Filter',
    op: 'filter-operator',
    type: 'filter-type',
    value: 'filter-value',
    options: FilterExpressionOperatorEnum,
  }
}

const ALIAS_INPUT_ID = 'alias'

export default class HeadElementComponent extends UI.GscapeWidget {
  public _id: number
  private graphElementId: string
  private alias: string
  private function: ModelFunction
  private variable: string
  private entityType: string
  private dataType: VarOrConstantConstantTypeEnum
  public deleteButton: UI.GscapeWidget

  static properties = {
    alias: { attribute: false },
    graphElementId: { attribute: false },
    function: { attribute: false },
    _entityType: { type: String },
  }

  static get styles() {
    let super_styles = super.styles as any
    let colors = super_styles[1]

    return [
      super_styles[0],
      css`
        :host {
          display:block;
          width: 250px;
          height: fit-content;
          margin:5px 2.5px;
          box-sizing: border-box;
          padding: 5px;
          padding-bottom: 34px;
          position: relative;
          align-self: end;
        }

        #field-name {
          padding: 5px;
          text-align: center;
          box-sizing: border-box;
          font-weight: bold;
          font-size: 16px;
        }

        .section {
          padding: 0;
          margin-bottom: 20px;
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
        }

        .input-wrapper, select {
          margin:5px 0;
        }

        #bottom-buttons-container {
          display: flex;
          justify-content:center;
          position: absolute;
          padding: 5px;
          width: 100%;
          box-sizing: border-box;
          left: 0;
          bottom: 0;
        }

        #bottom-buttons-container > * {
          position:initial;
          width: fit-content;
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
  }

  render() {
    return html`
      <div>
        <div class="section">
          ${this.getInput(ALIAS_INPUT_ID, this.alias || this.graphElementId)}
        </div>

        ${Object.keys(SECTIONS).map(k => {
          let section = SECTIONS[k]
          return html`
            <div class="section">
              <details>
                <summary><span class="section-title">${section.name}</span></summary>
                <div class="section-head">
                  ${this.getSelect(k, 'Operator', section.options)}
                  ${this.getSelect(section.type, this.dataType, VarOrConstantConstantTypeEnum)}
                </div>
                <div class="input-wrapper">
                  ${this.getInput(section.value)}
                </div>
              </details>
            </div>
          `
        })}
        
        <!-- ******************  SORT  ****************** -->
        <div class="section">
          ${this.getSelect('sort', 'sort', { asc: 'Ascending', desc: 'Descending' })}
        </div>

        <div id="bottom-buttons-container">
          ${this.deleteButton}
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
  }


  getInput(id: string, value?: string) {
    let placeholder = value || 'value'
    return html`
      <input 
        id="${id}"
        @focusout="${this.handleInputChange}"
        placeholder="${placeholder}" 
        value="${value}"
        />`
  }

  getSelect(name: string, defaultOpt: string, options: object) {
    const isDefaultAlreadySet = Object.values(options).includes(defaultOpt)
    return html`
      <select id="${name}-select" name="${name}">
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
    switch (target.id) {
      case ALIAS_INPUT_ID: {
        if (this.alias !== target.value && target.value.length > 0 && target.value !== this.graphElementId) {
          this.renameCallback(this._id, target.value)
        } else {
          target.value = this.alias || this.graphElementId
        }
        break
      }

      case SECTIONS.function.value: {
        // TODO: connect function value update callback
        break
      }

      case SECTIONS.filter.value: {
        // TODO: connect filter value update callback
        break
      }
    }
  }

  private renameCallback = (headElemID: number, alias: string) => {}
  public onRename(callback: (headElemID: number, alias: string) => void) { this.renameCallback = callback }
  public onFunctionSet(callback: (fun: ModelFunction) => void) { }
  public onFilterSet(callback: (filter: Filter) => void) { }
}

customElements.define('head-element', HeadElementComponent as any)