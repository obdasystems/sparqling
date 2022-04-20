import { SingularElementReturnValue } from "cytoscape"

export const klayLayoutOpt = {
  nodeDimensionsIncludeLabels: true,
  name: 'klay',
  fit: true, // Whether to fit
  klay: {
    direction: 'RIGHT',
    spacing: 60,
    layoutHierarchy: true,
    fixedAlignment: 'BALANCED',
    nodeLayering: 'INTERACTIVE',
  }
}

export function radialLayoutOpt(node: SingularElementReturnValue) {
  const p = node.position()
  const radius = Math.sqrt((Math.pow(node.width() / 2, 2) + Math.pow(node.height() / 2, 2))) + 20
  return {
    name: 'circle',
    avoidOverlap: true,
    fit:false,
    boundingBox: {
      x1: p.x - 2,
      x2: p.x + 2,
      y1: p.y - 2,
      y2: p.y + 2
    },
    startAngle: - Math.PI / 2,
    radius: radius,
    nodeDimensionsIncludeLabels: true,
  }
}

export function gridLayoutOpt(node: SingularElementReturnValue) {
  const p = node.position()
  return {
    name: 'grid',
    condense: true,
    padding: 10,
    fit: false,
    cols: 2,
    boundingBox: {
      x1: p.x - 20,
      x2: p.x + 20,
      y1: p.y - 20,
      y2: p.y + 20
    },
  } 
}