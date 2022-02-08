import { CollectionReturnValue } from "cytoscape"

export default function(elem: CollectionReturnValue, zoom?: number) {
  let cy = elem.cy()
  if (zoom) cy.zoom(zoom)
  let pos = elem.renderedPosition()
  let center = { x: cy.width() / 2, y: cy.height() / 2 }
  cy.panBy({ x: -(pos.x -= center.x), y: -(pos.y -= center.y)})
}