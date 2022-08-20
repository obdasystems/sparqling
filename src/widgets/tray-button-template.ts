import { html, SVGTemplateResult } from "lit";

export default function getTrayButtonTemplate(
  title: string,
  icon: SVGTemplateResult,
  alternateIcon?: SVGTemplateResult,
  id?: string,
  clickHandler = (e: MouseEvent) => { }
) {
  return html`
    <gscape-button
      id=${id}
      size="s"
      type="subtle"
      title=${title}
      @click=${clickHandler}
    >
      <span slot="icon">${icon}</span>
      ${alternateIcon
        ? html`<span slot="alt-icon">${alternateIcon}</span>`
        : null
      }
    </gscape-button>
  `
}