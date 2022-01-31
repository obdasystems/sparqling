import { UI } from 'grapholscape'
import { LitElement, html, css } from 'lit'
import { HeadElement, ModelFunctionNameEnum, ModelFunction, FilterExpressionOperatorEnum } from '../api/swagger/models';
import { del } from './icons'

export default class HeadElementComponent extends UI.GscapeWidget {
  public _id: number
  private graphElementId: string
  private alias: string
  private function: ModelFunction
  private variable: string
  public deleteButton: UI.GscapeWidget

  static properties = {
    alias: { attribute: false },
    graphElementId: { attribute: false },
    function: { attribute: false },
  }

  static get styles() {
    let super_styles = super.styles as any
    let colors = super_styles[1]

    return [
      super_styles[0],
      css`
        :host {
          display:block;
          width: 200px;
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

        .section-title {
          font-weight: bold;
        }

        #bottom-buttons-container {
          display: flex;
          justify-content:center;
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
          <div>
            <select id="function-select" name="function">
              <option value="foo" selected>Operator</option>
              ${Object.keys(FilterExpressionOperatorEnum).map( operator => {
                return html`<option value="${FilterExpressionOperatorEnum[operator]}">${FilterExpressionOperatorEnum[operator]}</option>`
              })}
            </select>

            <span contenteditable="true">Operand</span>
          </div>
        </div>
        
        <!-- ******************  FUNCTION  ****************** -->
        <div class="section">
          <div class="section-title">Function</div>
          <div>
            <select id="function-select" name="function">
              <option value="foo" selected>Operator</option>
              ${Object.keys(ModelFunctionNameEnum).map( operator => {
                return html`<option value="${ModelFunctionNameEnum[operator]}">${ModelFunctionNameEnum[operator]}</option>`
              })}
            </select>

            <span contenteditable="true">Operand</span>
          </div>
        </div>
        
        <!-- ******************  SORT  ****************** -->
        <div class="section">
          <select id="sort-select" name="sort">
            <option value="sort" selected>sort</option>
            <option value="asc">ascending</option>
            <option value="desc">descending</option>
          </select>
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
  }
}

customElements.define('head-element', HeadElementComponent as any)