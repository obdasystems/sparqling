import { UI } from 'grapholscape'
import { css, html } from 'lit'
import { FilterWithID, getFilterListTemplate } from './filter-list-template'
import { getElemWithOperatorStyle } from '../elem-with-operator-style'

export default class FilterListDialog extends UI.GscapeWidget {
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
    let colors = super_styles[1]
    return [
      super_styles[0],
      css`
        :host {
          position: absolute;
          top: 30%;
          left: 50%;
        }

        gscape-dialog {
          width: fit-content;
        }

        .dialog-body {
          display:flex;
          flex-direction: column;
          gap: 20px;
          padding: 10px 5px;
          border: solid 1px var(--theme-gscape-borders);
          border-radius: 6px;
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
      <gscape-dialog title="Defined Filters for ${this.variable}">
        <div class="dialog-body">
          ${getFilterListTemplate(this.filterList, this.editFilterCallback, this.deleteFilterCallback)}
        </div>
      </gscape-dialog>
    `
  }

  show() {
    super.show()
    this.innerDialog.show()
  }

  hide() {
    super.hide()
    this.innerDialog.hide()
  }

  onEdit(callback: (filterId: number) => void) {
    this.editFilterCallback = callback
  }

  onDelete(callback: (filterId: number) => void) {
    this.deleteFilterCallback = callback
  }

  private get innerDialog() { return (this as any).shadowRoot.querySelector('gscape-dialog') }
}


customElements.define('sparqling-filter-list', FilterListDialog as any)