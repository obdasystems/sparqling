import { UI } from 'grapholscape'
import { html, css } from 'lit'
import { HeadElement } from '../api/swagger/models'
import { tableEye } from '../widgets/icons'
import HeadElementComponent from './qh-element-component'

const { GscapeWidget } = UI
/**
 * Widget extending base grapholscape widget which uses Lit-element inside
 */
export default class QueryHeadWidget extends GscapeWidget {
  public collapsible: boolean
  public draggable: boolean
  private headSlottedWidget: Element
  public headElements: HeadElement[] = []
  private deleteElementCallback: (headElementId: number) => void
  private renameElementCallback: (headElemId: number, alias: string) => void

  static get properties() {

    let result = super.properties
    result.headElements = { attribute: false }
    return result
  }

  shadowRoot: any

  static get styles() {
    let super_styles = super.styles as any
    let colors = super_styles[1]

    return [
      super_styles[0],
      css`
        :host {
          width: fit-content;
          max-width: calc(50% - 59px);
          position: absolute;
          left: 10px;
          top: 100%;
          transform: translate(0, calc(-100% - 10px));
          background: transparent;
          box-shadow: none;
        }

        :host(:hover){
          box-shadow: none;
        }

        gscape-head {
          --title-text-align: 'left';
          background-color: var(--theme-gscape-primary, ${colors.primary});
          box-shadow: 0 2px 4px 0 var(--theme-gscape-shadows, ${colors.shadows});
          border-radius: 8px;
        }

        .widget-body {
          margin:0;
          border-top: none;
          border-radius: inherit;
          border-bottom-left-radius:0;
          border-bottom-right-radius:0;
          overflow-y: scroll;
        }

        #elems-wrapper {
          display: flex;
          flex-direction: column;
        }

        #buttons-tray > * {
          position: initial;
        }

        #buttons-tray {
          display: flex;
          align-items: center;
          justify-content: end;
          gap:10px;
          flex-grow: 3;
          padding: 0 10px;
        }

        #buttons-tray > gscape-button {
          --gscape-icon-size: 20px;
        }
      `
    ]
  }

  constructor(headSlottedWidget?: Element) {
    super()
    this.collapsible = true
    this.draggable = true
    this.headSlottedWidget = headSlottedWidget
  }

  render() {
    return html`
      <div class="widget-body">
        <div id="elems-wrapper">
          ${this.headElements.map((headElement, i) => {
            let headElemComponent = new HeadElementComponent(headElement)
            if (i === 0) headElemComponent.deleteButton.enabled = false

            return headElemComponent
          })}
        </div>
      </div>
      <gscape-head title="Query Head">
        <div id="buttons-tray">
          ${this.headSlottedWidget}
        </div>
      </gscape-head>
    `
  }

  updated() {
    // register callbacks for all head elements
    this.shadowRoot.querySelectorAll('head-element').forEach((element: HeadElementComponent) => {
      element.deleteButton.onClick = () => this.deleteElementCallback(element._id)
      element.onRename(this.renameElementCallback)
    });
  }

  firstUpdated() {
    super.firstUpdated()

    let self = this as any
    self.header.left_icon = tableEye
    super.makeDraggableHeadTitle()
  }

  /**
   * Delete a HeadElement
   * @param callback callback receiving the ID of the headElement to delete
   */
  onDelete(callback: (headElemId: number) => void) {
    this.deleteElementCallback = callback
  }

  onRename(callback: (headElemId: number, alias: string) => void) {
    this.renameElementCallback = callback
  }

  //createRenderRoot() { return this as any }
}

customElements.define('query-head', QueryHeadWidget as any)