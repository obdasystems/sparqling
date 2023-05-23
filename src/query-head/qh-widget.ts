import { ui } from 'grapholscape'
import { css, html, LitElement } from 'lit'
import { HeadElement } from '../api/swagger'
import { getConfig, isConfigEnabled, isCountStarActive } from '../model'
import { cxtMenu } from '../widgets'
import { asterisk, code, counter, kebab, preview, tableEye } from '../widgets/assets/icons'
import { countStarMsg, emptyHeadMsg, emptyHeadTipMsg, tipWhy } from '../widgets/assets/texts'
import sparqlingWidgetStyle from '../widgets/sparqling-widget-style'
import getTrayButtonTemplate from '../widgets/tray-button-template'
import { allowDrop } from './drag-sorting'
import HeadElementComponent, { HeadElementCallback, HeadElementRenameCallback } from './qh-element-component'

export default class QueryHeadWidget extends ui.BaseMixin(ui.DropPanelMixin(LitElement)) {
  public title = 'Query Columns'
  public headElements: HeadElement[] = []
  private deleteElementCallback: HeadElementCallback
  private renameElementCallback: HeadElementRenameCallback
  private localizeElementCallback: HeadElementCallback
  private addFilterCallback: HeadElementCallback
  private editFilterCallback: (filterId: number) => void
  private deleteFilterCallback: (filterId: number) => void
  private addFunctionCallback: HeadElementCallback
  private orderByChangeCallback: HeadElementCallback
  private addAggregationCallback: HeadElementCallback
  private highlightVariableCallback: HeadElementCallback
  private resetHighlightCallback: HeadElementCallback
  
  static properties = {
    headElements: { type: Object, attribute: false },
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
        pointer-events: none;
      }

      #elems-wrapper {
        display: flex;
        height:inherit;
        flex-direction: column;
        overflow: hidden scroll;
        scrollbar-width: inherit;
        padding: 4px 8px;
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

      .top-bar.traslated-down {
        bottom: 10px;
      }

      .gscape-panel {
        max-height: unset;
      }
    `
  ]

  render() {
    this.title = getConfig('queryHeadWidgetTitle') || 'Query Columns'
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
        : null
      }

      <div class="gscape-panel" id="drop-panel" style="width: 100%; overflow-y:clip">
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
          <div class="blank-slate sparqling-blank-slate">
            ${counter}
            <div class="header">${countStarMsg()}</div>
          </div>
        `
        : this.headElements.length === 0
          ? html`
            <div class="blank-slate sparqling-blank-slate">
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

  updated() {
    // register callbacks for all head elements
    this.shadowRoot?.querySelectorAll('head-element').forEach((element: Element) => {
      const headElementComponent = element as HeadElementComponent
      headElementComponent.onDelete = this.deleteElementCallback
      headElementComponent.onRename = this.renameElementCallback
      headElementComponent.onLocalize = this.localizeElementCallback
      headElementComponent.onAddFilter(this.addFilterCallback)
      headElementComponent.onEditFilter(this.editFilterCallback)
      headElementComponent.onDeleteFilter(this.deleteFilterCallback)
      headElementComponent.onAddFunction(this.addFunctionCallback)
      headElementComponent.onOrderBy = this.orderByChangeCallback
      headElementComponent.onAddAggregation(this.addAggregationCallback)
      headElementComponent.showCxtMenu = () => {
        if (headElementComponent.moreActionsButton) {
          cxtMenu.attachTo(headElementComponent.moreActionsButton, headElementComponent.cxtMenuCommands)
          // attachCxtMenuTo(headElementComponent.moreActionsButton, headElementComponent.cxtMenuCommands)
        }
      }
      headElementComponent.onmouseover = () => this.highlightVariableCallback(headElementComponent._id)
      headElementComponent.onmouseout = () => this.resetHighlightCallback(headElementComponent._id)
    });
  }

  /**
   * Register callback to execute on delete of a HeadElement
   * @param callback callback receiving the ID of the HeadElement to delete
   */
  onDelete(callback: HeadElementCallback) {
    this.deleteElementCallback = callback
  }

  /**
   * Register callback to execute on rename of a HeadElement (Set alias)
   * @param callback callback receiving the ID of the headElement to rename
   */
  onRename(callback: HeadElementRenameCallback) {
    this.renameElementCallback = callback
  }

  /**
   * Register callback to execute on localization of a HeadElement
   * @param callback callback receiving the ID of the HeadElement to localize
   */
  onLocalize(callback: HeadElementCallback) {
    this.localizeElementCallback = callback
  }

  onAddFilter(callback: HeadElementCallback) {
    this.addFilterCallback = callback
  }

  onEditFilter(callback: (filterId: number) => void) {
    this.editFilterCallback = callback
  }

  onDeleteFilter(callback: (filterId: number) => void) {
    this.deleteFilterCallback = callback
  }

  onAddFunction(callback: HeadElementCallback) {
    this.addFunctionCallback = callback
  }

  onOrderByChange(callback: HeadElementCallback) {
    this.orderByChangeCallback = callback
  }

  onAddAggregation(callback: HeadElementCallback) {
    this.addAggregationCallback = callback
  }

  onHighlightVariable(callback: HeadElementCallback) {
    this.highlightVariableCallback = callback
  }

  onResetHighlightOnVariable(callback: HeadElementCallback) {
    this.resetHighlightCallback = callback
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