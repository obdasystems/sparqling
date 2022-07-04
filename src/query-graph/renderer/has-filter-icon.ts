import { SingularData } from "cytoscape"
import { UI } from "grapholscape"
import tippy, { sticky } from "tippy.js"
import { filter } from "../../widgets/assets/icons"
import cy from "./cy"

export function addHasFilterIcon(node: SingularData) {
  const dummyDomElement = document.createElement('div')
  const icon = new UI.GscapeButton(filter, 'Has Filters Defined')
  icon.style.position = 'relative'

  const container = cy.container()
  if (container) {
    node['tippy'] = tippy(dummyDomElement, {
      content: icon,
      trigger: 'manuaul',
      hideOnClick: false,
      allowHTML: true,
      getReferenceClientRect: (node as any).popperRef().getBoundingClientRect,
      sticky: "reference",
      appendTo: container,
      placement: "right",
      plugins: [ sticky ]
    })

    
    node['tippy'].show()
  }
}

export function removeHasFilterIcon(node: SingularData) {
  node['tippy']?.destroy()
  node['tippy'] = null
}

export function shouldHaveFilterIcon(node: SingularData) {
  return node?.data().hasFilters && !node['tippy']
}

export function addOrRemoveFilterIcon(node: SingularData) {
  console.log(node.data().hasFilters)
  if (shouldHaveFilterIcon(node)) {
    addHasFilterIcon(node)
  } else if (!node?.data().hasFilters) {
    removeHasFilterIcon(node)
  }
}