import tippy, { Props } from "tippy.js"
import ContextMenuWidget, { Command } from "./cxt-menu-widget"

export const cxtMenuWidget = new ContextMenuWidget()

export const cxtMenu = tippy(document.createElement('div'))

export function getCxtMenuProps(): Partial<Props> {
  return {
    trigger: 'manual', // mandatory, we cause the tippy to show programmatically.
    allowHTML: true,
    interactive: true,
    placement: "bottom",
    appendTo: document.querySelector('.gscape-ui') || undefined,
    // content prop can be used when the target is a single element https://atomiks.github.io/tippyjs/v6/constructor/#prop
    content: cxtMenuWidget,
    hideOnClick: true,
    offset: [0, 0],
  }
}

export function attachCxtMenuTo(element: HTMLElement, commands: Command[]) {
  cxtMenu.setProps(getCxtMenuProps())
  cxtMenu.setProps({ getReferenceClientRect: () => element.getBoundingClientRect() } )
  cxtMenuWidget.commands = commands
  cxtMenu.show()
}

cxtMenuWidget.onCommandRun = () => cxtMenu.hide()