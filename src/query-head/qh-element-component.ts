import { UI } from 'grapholscape'
import { html, css } from 'lit'
import { HeadElement, ModelFunctionNameEnum, ModelFunction, VarOrConstantConstantTypeEnum, FilterExpressionOperatorEnum } from '../api/swagger/models';
import { del } from './icons'

export default class HeadElementComponent extends UI.GscapeWidget {
  public _id: number
  private graphElementId: string
  private alias: string
  private function: ModelFunction
  private variable: string
  private entityType: string;
  public deleteButton: UI.GscapeWidget
  private input = (value = 'value') => html`<input placeholder="${value}"></input>`

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
          margin:5px 2.5px;
          box-sizing: border-box;
          padding: 5px;
          position: initial;
        }

        #field-name {
          padding: 10px;
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

        #bottom-buttons-container {
          display: flex;
          justify-content:center;
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

        .input-wrapper {
          margin:5px;
        }
      `
    ]
  }

  constructor(headElement: HeadElement) {
    super()

    this.headElement = headElement
    this.deleteButton = new UI.GscapeButton(del, 'Delete Field')
    this.deleteButton.onClick = () => {}
  }

  render() {
    return html`
      <div>
        <div id="field-name" contenteditable="true">${this.graphElementId}</div>
        
        <!-- ******************  FILTER  ****************** -->
        <div class="section">
          <div class="section-title">Filter</div>
          <div class="section-head">            
            ${this.getSelect('function', 'Operator', FilterExpressionOperatorEnum)}
            ${this.getSelect('filter-value-type', 'Type', VarOrConstantConstantTypeEnum)}
          </div>
          <div class="input-wrapper">
            ${this.input()}
          </div>
        </div>
        
        <!-- ******************  FUNCTION  ****************** -->
        <div class="section">
          <div class="section-title">Function</div>
          <div class="section-head">
            ${this.getSelect('function', 'Operator', ModelFunctionNameEnum)}
            ${this.getSelect('function-value-type', 'Type', VarOrConstantConstantTypeEnum)}            
          </div>
          <div class="input-wrapper">
            ${this.input()}
          </div>
        </div>
        
        <!-- ******************  SORT  ****************** -->
        <div class="section">
          ${this.getSelect('sort', 'sort', {asc: 'Ascending', desc: 'Descending'})}
        </div>

        <div id="bottom-buttons-container">
          ${this.deleteButton}
        </div>
      </div>
    `
  }

  set headElement(newElement: HeadElement) {
    this.alias = newElement.alias
    this.graphElementId = newElement.graphElementId
    this._id = newElement.id
    this.entityType = newElement['entityType']
    let types = {
      'class': 'concept',
      'objectProperty': 'role',
      'dataProperty': 'attribute'
    }
    let self = this as any
    self.style.backgroundColor = `var(--theme-gscape-${types[this.entityType]})`
  }
  
  getSelect(name: string, defaultOpt: string, options: object) {
    return html`
      <select id="${name}-select" name="${name}">
        <option selected>${defaultOpt}</option>
        ${Object.keys(options).map( operator => {
          return html`<option value="${operator}">${options[operator]}</option>`
        })}
      </select>`
  }
}

customElements.define('head-element', HeadElementComponent as any)