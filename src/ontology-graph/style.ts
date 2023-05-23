import { StylesheetStyle } from "cytoscape"
import { ColoursNames, GrapholscapeTheme, Shape } from "grapholscape"
import { HIGHLIGHT_CLASS, SPARQLING_SELECTED } from "../model"

export default (theme: GrapholscapeTheme) => [
  {
    selector: 'node[shape = "ellipse"], .bubble',
    style: { 'underlay-shape': 'ellipse' }
  },
  {
    selector: `.${HIGHLIGHT_CLASS}`,
    style: {
      'underlay-color': theme.colours["sparqling-highlight"] || theme.getColour(ColoursNames.success_muted),
      'underlay-padding': '8px',
      'underlay-opacity': 1,
      'underlay-shape': (node) => node.style('shape') === Shape.ELLIPSE ? Shape.ELLIPSE : Shape.ROUND_RECTANGLE,
      'border-opacity': 1,
    }
  },
  {
    selector: `.${SPARQLING_SELECTED}`,
    style: {
      "border-color": theme.getColour(ColoursNames.accent),
      "border-width": 8,
      padding: 4,
    }
  },
  {
    selector: '.faded',
    style: {
      'opacity': 0.25,
    }
  }
] as StylesheetStyle[]