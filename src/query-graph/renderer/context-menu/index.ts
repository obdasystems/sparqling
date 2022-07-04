import cy from "../cy"
import tippy from "tippy.js"
import ContextMenuWidget from "./cxt-menu-widget"
import * as commands from "./commands"
import { EntityTypeEnum } from "../../../api/swagger"

// A dummy element must be passed as tippy only accepts dom element(s) as the target
// https://atomiks.github.io/tippyjs/v6/constructor/#target-types
const dummyDomElement = document.createElement('div')
const cxtMenuWidget = new ContextMenuWidget()
export const cxtMenu = tippy(dummyDomElement, {
  trigger: 'manual', // mandatory, we cause the tippy to show programmatically.
  allowHTML: true,
  interactive: true,
  arrow: true,
  appendTo: () => cy.container()?.parentElement as any,
  placement: "bottom",
  // content prop can be used when the target is a single element https://atomiks.github.io/tippyjs/v6/constructor/#prop
  content: () => cxtMenuWidget as any,
})

function attachCxtMenuToElement(ref: HTMLElement) {
  cxtMenu.setProps({ getReferenceClientRect: ref.getBoundingClientRect })
}

cy.on('cxttap', `node, edge[type = "${EntityTypeEnum.ObjectProperty}"], edge[type = "${EntityTypeEnum.InverseObjectProperty}"]`, e => {
  attachCxtMenuToElement(e.target.popperRef())
  cxtMenuWidget.commands = commands.getCommandsForElement(e.target)
  cxtMenu.show()
})

cxtMenuWidget.onCommandRun = () => cxtMenu.hide()

export * from './commands'