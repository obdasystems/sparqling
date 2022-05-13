import { UI } from 'grapholscape'
import { css, html } from 'lit'
import { filterMultiple } from '../../assets/icons'
import { getElemWithOperatorStyle } from '../elem-with-operator-style'
import { FilterWithID, getElemWithOperatorList } from '../elems-with-operator-list-template'

export default class FilterListDialog extends (UI.GscapeDialog as any) {
  public filterList: FilterWithID[] = []
  public variable: string
  private editFilterCallback: (filterId: number) => void = () => {}
  private deleteFilterCallback: (filterId: number) => void = () => {}

  static get properties() {
    let props = super.properties
    props.filterList = { attribute: false }
    props.variable = { attribute: false }
    return props
  }

  static get styles() {
    let super_styles = super.styles
    let colors = UI.GscapeWidget.styles[1]
    return [
      super_styles[0],
      css`
        :host {
          position: absolute;
          top: 30%;
          left: 50%;
          transform: translate(-50%, 0)
        }

        .dialog-body {
          display:flex;
          flex-direction: column;
          gap: 20px;
          padding: 10px 5px;
        }

        gscape-button {
          position: initial;
        }

        .danger:hover {
          color: var(--theme-gscape-error, ${colors.error});
        }
      `,
      getElemWithOperatorStyle()
    ]
  }

  constructor() {
    super()
  }

  render() {
    return html`
      <gscape-head title="Defined Filters for ${this.variable}" class="drag-handler"></gscape-head>
      <div class="dialog-body">
        ${getElemWithOperatorList(this.filterList, this.editFilterCallback, this.deleteFilterCallback)}
      </div>
    `
  }

  firstUpdated() {
    super.firstUpdated()
    this.header.left_icon = filterMultiple
  }

  show() {
    super.show()
  }

  hide() {
    super.hide()
  }

  onEdit(callback: (filterId: number) => void) {
    this.editFilterCallback = callback
  }

  onDelete(callback: (filterId: number) => void) {
    this.deleteFilterCallback = callback
  }

}


customElements.define('sparqling-filter-list', FilterListDialog as any)