import { StylesheetStyle } from "cytoscape"
import { ColoursNames, GrapholscapeTheme, Shape } from "grapholscape"

export default (theme: GrapholscapeTheme) => [
  {
    selector: 'node[shape = "ellipse"], .bubble',
    style: { 'underlay-shape': 'ellipse' }
  },
  {
    selector: '.sparqling-selected',
    style: {
      'underlay-color': theme.getColour(ColoursNames.accent),
      'underlay-padding': '4px',
      'underlay-shape': (node) => node.style('shape') === Shape.ELLIPSE ? Shape.ELLIPSE : Shape.ROUND_RECTANGLE,
      'underlay-opacity': 1,
    }
  },
  {
    selector: '.highlighted',
    style: {
      'underlay-color': theme.colours["sparqling-highlight"] || theme.getColour(ColoursNames.success_muted),
      'underlay-padding': '8px',
      'underlay-opacity': 1,
      'underlay-shape': (node) => node.style('shape') === Shape.ELLIPSE ? Shape.ELLIPSE : Shape.ROUND_RECTANGLE,
      'border-opacity': 1,
    }
  },
  {
    selector: '.faded',
    style: {
      'opacity': 0.25,
    }
  }
] as StylesheetStyle[]