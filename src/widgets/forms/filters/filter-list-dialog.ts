import { ui } from 'grapholscape'
import { css, html, LitElement, PropertyValueMap } from 'lit'
import { filter, filterMultiple } from '../../assets/icons'
import sparqlingWidgetStyle from '../../sparqling-widget-style'
import { getElemWithOperatorStyle } from '../elem-with-operator-style'
import { FilterWithID, getElemWithOperatorList } from '../elems-with-operator-list-template'

export default class FilterListDialog extends ui.BaseMixin(LitElement) {
  public filterList?: FilterWithID[] = []
  public variable: string
  title = ' '

  private editFilterCallback: (filterId: number) => void = () => {}
  private deleteFilterCallback: (filterId: number) => void = () => {}

  static get properties() {
    const props = {
      filterList: { attribute: false },
      variable: { attribute: false },
    }
    return Object.assign(props, super.properties)
  }

  static get styles() {
    return [
      ui.baseStyle,
      sparqlingWidgetStyle,
      getElemWithOperatorStyle(),
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
          color: var(--theme-gscape-error);
        }
      `,
    ]
  }

  render() {
    this.title = `Defined Filters for ${this.variable}`
    return html`
      <div class="gscape-panel">
        <div class="top-bar">
          <div id="widget-header" class="bold-text">
            ${filter}
            <span>${this.title}</span>
          </div>

          <gscape-button 
            id="toggle-panel-button"
            size="s" 
            type="subtle"
            @click=${this.hide}
          > 
            <span slot="icon">${ui.icons.close}</span>
          </gscape-button>
        </div>

        <div class="dialog-body">
        ${this.filterList
          ? getElemWithOperatorList(this.filterList, this.editFilterCallback, this.deleteFilterCallback)
          : null}
        </div>
      </div>
    `
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.firstUpdated(_changedProperties)
    this.hide()
  }

  onEdit(callback: (filterId: number) => void) {
    this.editFilterCallback = callback
  }

  onDelete(callback: (filterId: number) => void) {
    this.deleteFilterCallback = callback
  }

}


customElements.define('sparqling-filter-list', FilterListDialog as any)