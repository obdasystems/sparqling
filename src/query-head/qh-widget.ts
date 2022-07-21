import { ui } from 'grapholscape'
import { css, html, LitElement } from 'lit'
import { HeadElement } from '../api/swagger'
import { isCountStarActive } from '../model'
import { attachCxtMenuTo } from '../widgets'
import { asterisk, counter, tableEye } from '../widgets/assets/icons'
import { countStarMsg, emptyHeadMsg, emptyHeadTipMsg, tipWhy } from '../widgets/assets/texts'
import sparqlingWidgetStyle from '../widgets/sparqling-widget-style'
import { allowDrop } from './drag-sorting'
import HeadElementComponent from './qh-element-component'

export default class QueryHeadWidget extends ui.BaseMixin(ui.DropPanelMixin(LitElement)) {
  title = 'Query Results'
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
  
  static properties = {
    headElements: { type: Object, attribute: false }
  }

  static styles = [
    ui.baseStyle,
    sparqlingWidgetStyle,
    css`
      :host {
        position:initial;
        min-height: 30%;
        margin-bottom: 10px;
        background: transparent;
        box-shadow: none;
        pointer-events:initial;
      }

      #elems-wrapper {
        display: flex;
        height:inherit;
        flex-direction: column;
        overflow: hidden scroll;
        scrollbar-width: inherit;
        padding: 4px 12px;
      }

      .blank-slate {
        max-width: unset;
      }

      .tip {
        font-size: 90%;
        border-bottom: dotted 2px;
        cursor: help;
      }

      .tip: hover {
        color:inherit;
      }
    `
  ]

  constructor() {
    super()
  }

  render() {
    return html`
      ${this.isPanelClosed()
        ? html`
          <div class="top-bar traslated-down">
            <gscape-button 
              id="toggle-panel-button"
              @click=${this.togglePanel}
              label=${this.title}
            > 
              <span slot="icon">${tableEye}</span>
              <span slot="trailing-icon">${ui.icons.plus}</span>
            </gscape-button>
          </div>
        `
        : html`
          <div class="gscape-panel" id="drop-panel" style="width: 100%; overflow-y:hidden">
            <div class="top-bar">
              <div id="widget-header" class="bold-text">
                ${tableEye}
                <span>${this.title}</span>
              </div>

              <gscape-button 
                id="toggle-panel-button"
                size="s" 
                type="subtle"
                @click=${this.togglePanel}
              > 
                <span slot="icon">${ui.icons.minus}</span>
              </gscape-button>
            </div>

          ${isCountStarActive()
            ? html`
              <div id="empty-head">
                <div class="icon">${counter}</div>
                <div id="empty-head-msg">${countStarMsg()}</div>
              </div>
            `
            : this.headElements.length === 0
              ? html`
                <div class="blank-slate">
                  ${asterisk}
                  <div class="header">${emptyHeadMsg()}</div>
                  <div class="tip description" title="${emptyHeadTipMsg()}">${tipWhy()}</div>
                </div>
              `
              : html`
                <div id="elems-wrapper" @dragover=${allowDrop} @drop=${allowDrop}>
                  ${this.headElements.map(headElement => new HeadElementComponent(headElement))}
                </div>
              `
          }
          </div>
        `
      }
    `
  }

  updated() {
    // register callbacks for all head elements
    this.shadowRoot?.querySelectorAll('head-element').forEach((element: Element) => {
      const headElementComponent = element as HeadElementComponent
      // headElementComponent.deleteButton.onclick = () => this.deleteElementCallback(headElementComponent._id)
      headElementComponent.onRename(this.renameElementCallback)
      headElementComponent.onLocalize(this.localizeElementCallback)
      headElementComponent.onAddFilter(this.addFilterCallback)
      headElementComponent.onEditFilter(this.editFilterCallback)
      headElementComponent.onDeleteFilter(this.deleteFilterCallback)
      headElementComponent.onAddFunction(this.addFunctionCallback)
      headElementComponent.onOrderByChange(this.orderByChangeCallback)
      headElementComponent.onAddAggregation(this.addAggregationCallback)
      headElementComponent.showCxtMenu = () => {
        if (headElementComponent.moreActionsButton) {
          attachCxtMenuTo(headElementComponent.moreActionsButton, headElementComponent.cxtMenuCommands)
        }
      }
    });
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
    this.shadowRoot?.querySelectorAll('head-element').forEach(headElementComponent => {
      headElementComponent.shadowRoot?.querySelectorAll('input').forEach(inputElement => inputElement.blur())
    })
  }

  togglePanel = () => {
    super.togglePanel()

    this.requestUpdate()
  }

  protected firstUpdated() {
    this.hide()
  }

  //createRenderRoot() { return this as any }
}

customElements.define('query-head', QueryHeadWidget as any)