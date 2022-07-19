import { Stylesheet } from "cytoscape"
import { GrapholscapeTheme } from "grapholscape"
import { EntityTypeEnum } from "../../api/swagger"

const { DataProperty, Class, ObjectProperty, InverseObjectProperty } = EntityTypeEnum

export default (theme: GrapholscapeTheme) => {
  return [
    {
      selector: '*',
      style: {
        'color': theme.colours.label,
        'border-width': '1px',
      }
    },
    {
      selector: `node[type = "${Class}"]`,
      style: {
        'shape': 'round-rectangle',
        'background-color': theme.colours.class,
        'border-color': theme.colours["class-contrast"],
        'text-halign': 'center',
        'text-valign': 'center',
        'width': '60px',
      },
    },
    {
      selector: 'edge',
      style: {
        'line-style': 'solid',
        'target-arrow-shape': 'triangle',
        'target-arrow-fill': 'filled',
        'curve-style': 'bezier',
        'text-rotation': 'autorotate',
        'text-margin-y': -10,
        'width': 2,
      },
    },

    {
      selector: '[displayed_name]',
      style: {
        'text-wrap': 'wrap',
        'text-max-width': '50px',
        'text-overflow-wrap': 'anywhere',
        'label': 'data(displayed_name)',
        'font-size': '8px'
      },
    },

    {
      selector: `edge[type = "${DataProperty}"]`,
      style: {
        'curve-style': 'straight',
        'target-arrow-shape': 'none',
        'line-color': theme.colours["data-property"],
      },
    },

    {
      selector: `node[type = "${DataProperty}"]`,
      style: {
        'shape': 'ellipse',
        'height': 10,
        'width': 10,
        'background-color': theme.colours["data-property"],
        'border-color': theme.colours["data-property-contrast"],
      },
    },

    {
      selector: `edge[type = "${ObjectProperty}"], edge[type = "${InverseObjectProperty}"]`,
      style: {
        'line-color': theme.colours["object-property-contrast"],
        'target-arrow-color': theme.colours["object-property-contrast"],
        'source-arrow-color': theme.colours["object-property-contrast"],
        'text-max-width': '60px'
      }
    },

    {
      selector: `edge[type = "${InverseObjectProperty}"]`,
      style: {
        'target-arrow-shape': 'none',
        'source-arrow-shape': 'triangle',
        'source-arrow-fill': 'filled',
      }
    },

    {
      selector: '.cdnd-drop-target',
      style: {
        'background-color': theme.colours["bg-inset"],
        'border-style': 'dashed',
        'border-color': theme.colours["accent-muted"],
        'shape': 'round-rectangle',
        'label': 'Release to join these classes',
        'font-size': '12px',
      }
    },

    {
      selector: '[?optional]',
      style: {
        'opacity': 0.8
      }
    },

    {
      selector: 'node[?optional]',
      style: {
        'border-style': 'dashed',
      }
    },

    {
      selector: 'edge[?optional]',
      style: {
        "line-style": 'dashed',
      }
    },

    {
      selector: '$node > node', // parent of a node, compound nodes
      style: {
        'label': '',
      }
    },

    //-----------------------------------------------------------
    // selected selector always last
    {
      selector: '.sparqling-selected',
      style: {
        'underlay-color': 'green',
        'underlay-padding': '10px',
        'underlay-opacity': 0.5,
      }
    },
  ] as Stylesheet[]
}