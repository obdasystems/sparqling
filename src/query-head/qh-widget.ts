import { UI } from 'grapholscape'
import { html, css, CSSResult } from 'lit'
import { HeadElement } from '../api/swagger/models'
import HeadElementComponent, {default as QHElementComponent} from './qh-element-component'

const { GscapeWidget, GscapeHeader } = UI
/**
 * Widget extending base grapholscape widget which uses Lit-element inside
 */
export default class QueryHeadWidget extends GscapeWidget {
  public collapsible : boolean
  public draggable: boolean
  private headSlottedWidget: Element
  public headElements: HeadElement[] = []
  private deleteElementCallback: (headElementId: number) => void

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
          width: 800px;
          position: absolute;
          bottom: 10px;
          right: 54px;
        }

        .widget-body {
          height: 300px;
          margin:0;
          border-top: none;
          border-bottom: 1px solid var(--theme-gscape-shadows, ${colors.shadows});
          border-radius: inherit;
          border-bottom-left-radius:0;
          border-bottom-right-radius:0;

          display: flex;
        }
      `
    ]
  }

  constructor(headSlottedWidget?: Element) {
    super()
    this.collapsible = true
    // this.draggable = true
    this.headSlottedWidget = headSlottedWidget

    super.makeDraggable()
  }

  render() {
    console.log('rendering head')
    return html`
      <div class="widget-body">
        ${this.headElements.map( headElement => new QHElementComponent(headElement))}
      </div>
      <gscape-head>
        ${this.headSlottedWidget}
      </gscape-head>
    `
  }

  updated() {
    // register callbacks for all head elements
    this.shadowRoot.querySelectorAll('head-element').forEach((element: HeadElementComponent) => {
      element.deleteButton.onClick = () => this.deleteElementCallback(element._id)
      // bind all other interaction callbacks
    });
  }

  firstUpdated() {
    super.firstUpdated()
    
    let self = this as any
    self.header.invertIcons()
    // super.makeDraggableHeadTitle()
  }

  /**
   * Delete a HeadElement
   * @param callback callback receiving the ID of the headElement to delete
   */
  onDelete(callback: (headElemId:number) => void) {
    this.deleteElementCallback = callback
  }

  //createRenderRoot() { return this as any }
}

customElements.define('query-head', QueryHeadWidget as any)