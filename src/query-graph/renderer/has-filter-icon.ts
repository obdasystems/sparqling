import { NodeCollection } from "cytoscape"
import tippy, { sticky } from "tippy.js"
import { filter } from "../../widgets/assets/icons"
import cy from "./cy"

const hasFilterIcon = `
  <div style="
    color: var(--gscape-color-accent);
    background: var(--gscape-color-accent-subtle);
    border: solid 1px;
    line-height: 0;
    padding: 2px 4px;
    margin: 0 8px;
    border-radius: 12px;"
  >
    ${filter.strings.join('').replace(/20px/g, '15px',)}
  </div>`

export function addHasFilterIcon(node: NodeCollection) {
  const dummyDomElement = document.createElement('div')
  const container = cy.container()
  if (container?.firstElementChild) {
    node['tippy'] = tippy(dummyDomElement, {
      content: hasFilterIcon,
      trigger: 'manuaul',
      hideOnClick: false,
      allowHTML: true,
      getReferenceClientRect: (node as any).popperRef().getBoundingClientRect,
      sticky: "reference",
      appendTo: container.firstElementChild,
      placement: "right",
      plugins: [ sticky ],
      offset: [0,0]
    })

    
    node['tippy'].show()
  }
}

export function removeHasFilterIcon(node: NodeCollection) {
  node['tippy']?.destroy()
  node['tippy'] = null
}

export function shouldHaveFilterIcon(node: NodeCollection) {
  return node?.data().hasFilters && !node['tippy']
}

export function addOrRemoveFilterIcon(node: NodeCollection) {
  if (shouldHaveFilterIcon(node)) {
    addHasFilterIcon(node)
  } else if (!node?.data().hasFilters) {
    removeHasFilterIcon(node)
  }
}