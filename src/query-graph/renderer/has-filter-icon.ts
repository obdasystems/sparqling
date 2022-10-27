import { NodeSingular } from "cytoscape"
import tippy, { sticky } from "tippy.js"
import { tippyContainer } from "../../util/get-container"
import { filter } from "../../widgets/assets/icons"
import { cy } from "./cy"

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

export function addHasFilterIcon(node: NodeSingular) {
  const dummyDomElement = document.createElement('div')
  if (tippyContainer) {
    node.scratch('tippy', tippy(dummyDomElement, {
      content: hasFilterIcon,
      trigger: 'manual',
      hideOnClick: false,
      allowHTML: true,
      getReferenceClientRect: (node as any).popperRef().getBoundingClientRect,
      sticky: "reference",
      appendTo: tippyContainer,
      placement: "right",
      plugins: [sticky],
      offset: [0, 0]
    }))


    node.scratch().tippy.show()
  }
}

export function removeHasFilterIcon(node: NodeSingular) {
  node.scratch().tippy?.destroy()
  node.removeScratch('tippy')
}

export function shouldHaveFilterIcon(node: NodeSingular) {
  return node?.data().hasFilters && !node.scratch().tippy
}

export function addOrRemoveFilterIcon(node: NodeSingular) {
  if (shouldHaveFilterIcon(node)) {
    addHasFilterIcon(node)
  } else if (!node?.data().hasFilters) {
    removeHasFilterIcon(node)
  }
}

// export function refreshHasFilterIcons() {
//   const container = cy.container()
//   if (!container) return

//   cy.nodes().forEach(node => {
//     if (node.scratch().tippy) {
//       container.firstElementChild?.appendChild(node.scratch().tippy.popper)
//     }
//   })
// }