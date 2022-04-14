import { UI } from 'grapholscape'
import { css, html } from 'lit'
import { HeadElement } from '../api/swagger'
import { asterisk, tableEye } from '../widgets/assets/icons'
import { emptyHeadMsg, emptyHeadTipMsg, tipWhy } from '../widgets/assets/texts'
import { allowDrop } from './drag-sorting'
import HeadElementComponent from './qh-element-component'

const { GscapeWidget } = UI
/**
 * Widget extending base grapholscape widget which uses Lit-element inside
 */
export default class QueryHeadWidget extends GscapeWidget {
  public collapsible: boolean
  private headSlottedWidgets: Element[]
  public headElements: HeadElement[] = []
  private deleteElementCallback: (headElementId: string) => void
  private renameElementCallback: (headElemntId: string, alias: string) => void
  private localizeElementCallback: (headElementId: string) => void
  private addFilterCallback: (headElementId: string) => void
  private editFilterCallback: (filterId: number) => void
  private deleteFilterCallback: (filterId: number) => void
  private addFunctionCallback: (headElementId: string) => void
  private orderByChangeCallback: (headElementId: string) => void
  private addAggregationCallback: (headElementId: string) => void

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
          position:initial;
          width: 300px;
          background: transparent;
          box-shadow: none;
          pointer-events:initial;
        }

        :host(:hover){
          box-shadow: none;
        }

        gscape-head {
          --title-text-align: 'left';
          border-radius: 8px;
        }

        gscape-head, #empty-head {
          background-color: var(--theme-gscape-primary, ${colors.primary});
          box-shadow: 0 2px 4px 0 var(--theme-gscape-shadows, ${colors.shadows});
        }

        .widget-body {
          margin:0;
          border-top: none;
          border-radius: inherit;
          border-bottom-left-radius:0;
          border-bottom-right-radius:0;
          max-height:350px;
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

        #empty-head {
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          text-align: center;
        }

        #empty-head > .icon {
          --gscape-icon-size: 60px;
        }

        #empty-head-msg {
          font-weight: bold;
        }

        .tip {
          font-size: 90%;
          color: var(--theme-gscape-shadows, ${colors.shadows});
          border-bottom: dotted 2px;
          cursor: help;
        }

        .tip: hover {
          color:inherit;
        }
      `
    ]
  }

  constructor(headSlottedWidget?: Element[]) {
    super()
    this.collapsible = true
    this.headSlottedWidgets = headSlottedWidget
  }

  render() {
    return html`
      <div class="widget-body">
      ${this.headElements.length === 0
        ? html`
          <div id="empty-head">
            <div class="icon">${asterisk}</div>
            <div id="empty-head-msg">${emptyHeadMsg()}</div>
            <div class="tip" title="${emptyHeadTipMsg()}">${tipWhy()}</div>
          </div>
          `
        : html`
          <div style="overflow-y:scroll; max-height:inherit; scrollbar-width: inherit;">
            <div id="elems-wrapper" @dragover=${allowDrop} @drop=${allowDrop}>
              ${this.headElements.map(headElement => new HeadElementComponent(headElement))}
            </div>
          </div>
          `
      }
      </div>
      <gscape-head title="Query Head">
        <div id="buttons-tray">
          ${this.headSlottedWidgets}
        </div>
      </gscape-head>
    `
  }

  updated() {
    // register callbacks for all head elements
    this.shadowRoot.querySelectorAll('head-element').forEach((element: HeadElementComponent) => {
      element.deleteButton.onClick = () => this.deleteElementCallback(element._id)
      element.onRename(this.renameElementCallback)
      element.onLocalize(this.localizeElementCallback)
      element.onAddFilter(this.addFilterCallback)
      element.onEditFilter(this.editFilterCallback)
      element.onDeleteFilter(this.deleteFilterCallback)
      element.onAddFunction(this.addFunctionCallback)
      element.onOrderByChange(this.orderByChangeCallback)
      element.onAddAggregation(this.addAggregationCallback)
    });
  }

  firstUpdated() {
    super.firstUpdated()

    let self = this as any
    self.header.left_icon = tableEye
    this.hide()
  }

  /**
   * Register callback to execute on delete of a HeadElement
   * @param callback callback receiving the ID of the HeadElement to delete
   */
  onDelete(callback: (headElemId: string) => void) {
    this.deleteElementCallback = callback
  }

  /**
   * Register callback to execute on rename of a HeadElement (Set alias)
   * @param callback callback receiving the ID of the headElement to rename
   */
  onRename(callback: (headElemId: string, alias: string) => void) {
    this.renameElementCallback = callback
  }

  /**
   * Register callback to execute on localization of a HeadElement
   * @param callback callback receiving the ID of the HeadElement to localize
   */
  onLocalize(callback: (headElemId: string) => void) {
    this.localizeElementCallback = callback
  }

  onAddFilter(callback: (headElementId: string) => void) {
    this.addFilterCallback = callback
  }

  onEditFilter(callback: (filterId: number) => void) {
    this.editFilterCallback = callback
  }

  onDeleteFilter(callback: (filterId: number) => void) {
    this.deleteFilterCallback = callback
  }

  onAddFunction(callback: (headElementId: string) => void) {
    this.addFunctionCallback = callback
  }

  onOrderByChange(callback: (headElementId: string) => void) {
    this.orderByChangeCallback = callback
  }

  onAddAggregation(callback: (headElementId: string) => void) {
    this.addAggregationCallback = callback
  }


  blur() {
    // do not call super.blur() cause it will collapse query-head body.
    // This because each click on cytoscape background calls document.activeElement.blur(), 
    // so if any input field has focus, query-head will be the activeElement and will be
    // blurred at each tap. this way we only blur the input elements.
    this.shadowRoot.querySelectorAll('head-element').forEach(headElementComponent => {
      headElementComponent.shadowRoot.querySelectorAll('input').forEach(inputElement => inputElement.blur())
    })
  }

  hide() {
    super.hide()
  }

  show() {
    super.show()
  }

  //createRenderRoot() { return this as any }
}

customElements.define('query-head', QueryHeadWidget as any)