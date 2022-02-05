import { UI } from 'grapholscape'
import { html, css } from 'lit'
import { HeadElement, ModelFunctionNameEnum, ModelFunction, VarOrConstantConstantTypeEnum, FilterExpressionOperatorEnum, Filter } from '../api/swagger/models';
import { del } from '../widgets/assets/icons'

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
  private collapsible = true;

  public _id: string
  private graphElementId: string
  private alias: string
  private function: ModelFunction
  private variable: string
  private entityType: string
  private dataType: VarOrConstantConstantTypeEnum
  public deleteButton: UI.GscapeWidget
  private toggleBodyButton: UI.GscapeButton

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
          margin:5px 2.5px 5px 0;
          padding: 5px;
          position: relative;
          align-self: end;
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

        #field-head {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        #field-head > input {
          margin: 0;
          background-color: inherit;
          border: none;
        }

        #field-head > input:hover {
          border: solid 1px var(--theme-gscape-shadows, ${colors.shadows});
        }

        #field-head > input:focus {
          background-color: var(--theme-gscape-primary, ${colors.primary});
        }

        #field-head > gscape-button {
          position:initial;
          width: fit-content;
          --gscape-icon-size: 20px;
        }

        .danger:hover {
          color: var(--theme-gscape-error, ${colors.error});
        }

        .flat-button {
          background: inherit;
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
    this.deleteButton.classList.add('flat-button')
    this.toggleBodyButton = new UI.GscapeButton(UI.triangle_down, 'Show More', UI.triangle_up)
    this.toggleBodyButton.onClick = () => (this as any).toggleBody()
    this.toggleBodyButton.classList.add('flat-button')
    this.toggleBodyButton.style.boxShadow = 'none'
  }

  render() {
    return html`
      <div>
        <div id="field-head">
          ${this.getInput(ALIAS_INPUT_ID, this.alias || this.graphElementId, 'Rename Field')}
          ${this.deleteButton}
          ${this.toggleBodyButton}
        </div>
        <div id="field-body" class="widget-body hide">
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
          <div class="section" style="text-align: center; margin-bottom:0">
            ${this.getSelect('sort', 'sort', { asc: 'Ascending', desc: 'Descending' })}
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
  }


  getInput(id: string, value?: string, titleText = '') {
    let placeholder = value || 'value'
    return html`
      <input 
        id="${id}"
        @focusout="${this.handleInputChange}"
        placeholder="${placeholder}" 
        value="${value}"
        title="${titleText}"
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

  private renameCallback = (headElemID: string, alias: string) => {}
  public onRename(callback: (headElemID: string, alias: string) => void) { this.renameCallback = callback }
  public onFunctionSet(callback: (fun: ModelFunction) => void) { }
  public onFilterSet(callback: (filter: Filter) => void) { }
}

customElements.define('head-element', HeadElementComponent as any)