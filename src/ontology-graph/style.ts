import { Stylesheet, StylesheetStyle } from "cytoscape"

export default [
  {
    selector: 'node[shape = "ellipse"], .bubble',
    style: { 'underlay-shape': 'ellipse' }
  },
  {
    selector: '.sparqling-selected',
    style: {
      'underlay-color': 'green',
      'underlay-padding': '10px',
      'underlay-opacity': 0.5,
    }
  },
  {
    selector: '.highlighted',
    style: {
      'underlay-color': 'red',
      'underlay-padding': '10px',
      'underlay-opacity': 0.2,
    }
  },
  {
    selector: '.faded',
    style: {
      'opacity': 0.25,
    }
  }
] as StylesheetStyle[]