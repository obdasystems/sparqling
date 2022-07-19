import { ui } from "grapholscape"
import { css, html, LitElement } from "lit"
import { Command } from "./commands"

export default class ContextMenuWidget extends ui.BaseMixin(LitElement) {
  commands: Command[] = []
  onCommandRun: () => void

  static properties = {
    commands: { attribute: false }
  }

  static styles = [
    ui.baseStyle,
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

  render() {
    return html`
    <div class="gscape-panel">
      ${this.commands.map((command, id) => {
        return html`
          <div class="command-entry actionable" command-id="${id}" @click=${this.handleCommandClick}>
            <span class="command-icon">${command.icon}</span>
            <span class="command-text">${command.content}</span>
          <div>
        `
      })}
    </div>
    `
  }

  private handleCommandClick(e: any) {
    this.commands[e.currentTarget.getAttribute('command-id')].select()
    this.onCommandRun()
  }
}

customElements.define('query-graph-cxt-menu', (ContextMenuWidget as any))