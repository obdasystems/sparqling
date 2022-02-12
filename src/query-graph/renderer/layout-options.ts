import { SingularElementReturnValue } from "cytoscape"
import { EntityTypeEnum } from "../../api/swagger"

export const klayLayoutOpt = {
  nodeDimensionsIncludeLabels: true,
  name: 'klay',
  fit: false, // Whether to fit
  klay: {
    direction: 'RIGHT',
    spacing: 60,
    layoutHierarchy: true,
    fixedAlignment: 'BALANCED'
  }
}

export function radialLayoutOpt(node: SingularElementReturnValue) {
  const p = node.position()
  return {
    name: 'concentric',
    avoidOverlap: true,
    fit:false,
    concentric: (node) => {
      if (node.data('type') === EntityTypeEnum.Class) {
        return 2 // higher value means center
      } else {
        return 1 // lower value means outside center
      }
    },
    boundingBox: {
      x1: p.x - 2,
      x2: p.x + 2,
      y1: p.y - 2,
      y2: p.y + 2
    },
    levelWidth: () => { return 1 },
  }
}