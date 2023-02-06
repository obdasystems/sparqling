import { ui } from "grapholscape";
import { css, CSSResultGroup, html, LitElement, PropertyDeclarations } from "lit";

type RegexFlag = {
  value: string,
  description: string,
}

export const regexFlags: RegexFlag[] = [
  {
    value: 'i',
    description: 'Case insensitive'
  },
  {
    value: 'm',
    description: 'Multiline'
  },
  {
    value: 's',
    description: 'Single line (dotall)'
  },
  {
    value: 'q',
    description: 'No metacharacters'
  }
]

export default class RegexFlagSelection extends ui.DropPanelMixin(LitElement) {

  flags: RegexFlag[] = []
  selectedFlags: Set<string> = new Set()

  static properties: PropertyDeclarations = {
    flags: { type: Array, attribute: 'flags' },
    selectedFlags: { type: Object, attribute: false }
  }

  static styles: CSSResultGroup = [
    ui.baseStyle,
    css`
      :host {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .drop-down {
        position: absolute;
        z-index: 10;
        top: calc(100% + 4px);
        white-space: nowrap;
      }

      @keyframes drop-down {
        from {opacity: 0; top: -20%;}
        to {opacity: 1; top: calc(100% + 4px);}
      }
    `
  ]

  render() {
    return html`
      <gscape-button @click="${this.togglePanel}"
        label="${this.selectedFlags.size > 0 ? this.selectedFlagsString : 'Flags'}" size=${ui.SizeEnum.S}>
        <span slot='trailing-icon'>${ui.icons.arrowDown}</span>
      </gscape-button>
      
      <div class="gscape-panel drop-down hide" id="drop-panel">
        ${this.flags.map((flag) => {
          const label = `${flag.value} - ${flag.description}`
          return html`
            <gscape-action-list-item 
              @mousedown=${this.handleOptionClick}
              value=${flag.value} label=${label}
              ?selected=${this.selectedFlags.has(flag.value)}>
            </gscape-action-list-item>
          `
        })}
      </div>
    `
  }

  handleOptionClick(e: MouseEvent) {
    const target = e.currentTarget as HTMLOptionElement | null
  
    if (target) {
      const flagValue = target.getAttribute('value')
      if (!flagValue) return

      const eventOptions = {
        bubbles: true,
        composed: true,
        detail: {
          flagValue: flagValue
        }
      }

      if (this.selectedFlags?.has(flagValue)) {
        this.selectedFlags.delete(flagValue)
        this.dispatchEvent(new CustomEvent('regexflagadd', eventOptions))
      } else {
        this.selectedFlags.add(flagValue)
        this.dispatchEvent(new CustomEvent('regexflagadd', eventOptions))
      }

      this.requestUpdate()
    }
  }

  private get selectedFlagsString() {
    return `Flags: ${Array.from(this.selectedFlags).join(' ')}`
  }
}

customElements.define('sparqling-regex-flag-select', RegexFlagSelection)