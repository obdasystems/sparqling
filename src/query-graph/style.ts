import { Stylesheet } from "cytoscape"
import { Theme } from "grapholscape"
import { EntityTypeEnum } from "../api/swagger/models"

// TODO: fix colors for black/white theme
const { DataProperty, Class, ObjectProperty } = EntityTypeEnum
export default (theme: Theme) => { return [
  {
    selector: '*',
    style: {
      'color': theme.label_color,
      'border-width': '1px',
    }
  },
  {
    selector: `node[type = "${Class}"]`,
    style: {
      'shape': 'round-rectangle',
      'background-color': theme.concept,
      'border-color': theme.concept_dark,
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
      'curve-style': 'haystack',
      'line-color': theme.attribute_dark,
    },
  },

  {
    selector: `node[type = "${DataProperty}"]`,
    style: {
      'shape': 'ellipse',
      'height': 10,
      'width': 10,
      'background-color': theme.attribute,
      'border-color': theme.attribute_dark,
    },
  },

  {
    selector: `edge[type = "${ObjectProperty}"]`,
    style: {
      'line-color': theme.role_dark,
      'target-arrow-color': theme.role_dark,
      'text-max-width': '60px'
    }
  },

  {
    selector: '.cdnd-drop-target',
    style: {
      'border-style': 'dashed',
      'border-color': theme.secondary,
      'shape': 'round-rectangle',
      'label': 'Release to join these classes',
      'font-size': '12px',
    }
  },

  //-----------------------------------------------------------
  // selected selector always last
  {
    selector: ':selected',
    style: {
      'overlay-color': theme.secondary,
      'overlay-opacity': 0.2,
      'z-index': '100'
    }
  }
] as Stylesheet[]
}