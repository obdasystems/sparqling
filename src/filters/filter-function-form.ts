import { html, css } from 'lit'
import { UI } from 'grapholscape'
import { FilterExpressionOperatorEnum, FunctionNameEnum, VarOrConstant } from '../api/swagger'
import { FilterOrFunctionWidget } from '../util/filter-function-interface'

export default class FilterForm extends UI.GscapeWidget implements FilterOrFunctionWidget {

  static get properties() {
    let props = super.properties
    // props.class = { attribute: false }
    // props.highlights = { attribute: false }

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
        }
      `
    ]
  }

  constructor() {
    super()
  }
  operator: FilterExpressionOperatorEnum
  parameters: VarOrConstant[]
  hasMultipleInputs: boolean = false


  render() {
    return html`
    <gscape-dialog title="">
      <div>
      
      </div>
    </gscape-dialog>
  `
  }

  firstUpdated() {
    super.firstUpdated()

    let self = this as any
    // self.header.left_icon = 'lightbulbQuestion'
    self.header.invertIcons()
  }
}

customElements.define('sparqling-filter-function-form', FilterForm as any)