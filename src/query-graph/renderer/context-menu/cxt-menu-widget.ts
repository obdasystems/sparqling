import { UI } from "grapholscape"
import { css, html } from "lit"
import { Command } from "./commands"

export default class ContextMenuWidget extends UI.GscapeWidget {
  commands: Command[] = []
  onCommandRun: () => void

  static get properties() {
    const props = super.properties
    props.commands = { attribute: false }
    return props
  }
  static get styles() {
    let super_styles = super.styles as any
    let colors = super_styles[1]

    return [
      super_styles[0],
      css`
        :host {
          position: initial;
          display: flex;
          flex-direction: column;
          padding: 5px 0;
        }

        .command-entry {
          white-space: nowrap;
          cursor: pointer;
          padding: 5px 10px;

          display: flex;
          gap: 10px;
          align-items: center;
        }

        .command-icon {
          width: 19px;
          height: 19px;
        }

        .command-text {
          position: relative;
          top: 2px;
        }
      `
    ]
  }
  
  constructor() {
    super()
  }

  render() {
    return html`
      ${this.commands.map((command, id) => {
        return html`
          <div class="command-entry highlight" command-id="${id}" @click=${this.handleCommandClick}>
            <span class="command-icon">${command.icon}</span>
            <span class="command-text">${command.content}</span>
          <div>
        `
      })}
    `
  }

  private handleCommandClick(e: any) {
    this.commands[e.currentTarget.getAttribute('command-id')].select()
    this.onCommandRun()
  }
}

customElements.define('query-graph-cxt-menu', (ContextMenuWidget as any))