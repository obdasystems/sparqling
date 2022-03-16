import cy from "../cy"
import tippy from "tippy.js"
import ContextMenuWidget from "./cxt-menu-widget"
import getGscape from "../../../ontology-graph/get-gscape"
import * as commands from "./commands"

// A dummy element must be passed as tippy only accepts dom element(s) as the target
// https://atomiks.github.io/tippyjs/v6/constructor/#target-types
const dummyDomElement = document.createElement('div')
const cxtMenuWidget = new ContextMenuWidget()
export const cxtMenu = tippy(dummyDomElement, {
  trigger: 'manual', // mandatory, we cause the tippy to show programmatically.
  allowHTML: true,
  interactive: true,
  arrow: true,
  appendTo: () => getGscape().container,
  // your own custom props
  // content prop can be used when the target is a single element https://atomiks.github.io/tippyjs/v6/constructor/#prop
  content: () => cxtMenuWidget as any,
})
let shouldCxtMenuHide = true

function attachCxtMenuToElement(ref: HTMLElement) {
  cxtMenu.setProps({ getReferenceClientRect: ref.getBoundingClientRect })
}

cy.on('mouseover', 'node', e => {
  attachCxtMenuToElement(e.target.popperRef())
  cxtMenuWidget.commands = commands.getCommandsForElement(e.target)
  cxtMenu.show()
});

(cxtMenuWidget as any).onmouseout = () => {
  shouldCxtMenuHide = true
  cxtMenu.hide()
};
(cxtMenuWidget as any).onmouseover = () => shouldCxtMenuHide = false

cy.on('mouseout', 'node', e => {
  setTimeout( () => {
    if (shouldCxtMenuHide) {
      cxtMenu.hide()
    }
  }, 50)
})

export * from './commands'