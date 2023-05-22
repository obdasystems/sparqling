import { Stylesheet } from "cytoscape"
import { ColoursNames, DefaultThemesEnum, GrapholscapeTheme } from "grapholscape"
import { EntityTypeEnum } from "../../api/swagger"

const { DataProperty, Class, ObjectProperty, InverseObjectProperty, Annotation } = EntityTypeEnum

export default (theme: GrapholscapeTheme) => {
  return [
    {
      selector: '*',
      style: {
        'color': theme.getColour(ColoursNames.label),
        'border-width': '1px',
        'font-size': '8px',
      }
    },
    {
      selector: `node[type = "${Class}"][!isSuggestion]`,
      style: {
        'shape': 'round-rectangle',
        'background-color': theme.getColour(ColoursNames.class),
        'border-color': theme.getColour(ColoursNames.class_contrast),
        'text-halign': 'center',
        'text-valign': 'center',
        'width': 60,
        'height': 30
      },
    },
    {
      selector: 'edge[!isSuggestion]',
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
        'text-max-width': '60px',
        'label': 'data(displayed_name)',
      },
    },

    {
      selector: `edge[type = "${DataProperty}"]`,
      style: {
        'curve-style': 'straight',
        'target-arrow-shape': 'none',
        'line-color': theme.getColour(ColoursNames.data_property_contrast),
      },
    },

    {
      selector: `node[type = "${DataProperty}"][!isSuggestion]`,
      style: {
        'shape': 'ellipse',
        'height': 10,
        'width': 10,
        'background-color': theme.getColour(ColoursNames.data_property),
        'border-color': theme.getColour(ColoursNames.data_property_contrast),
      },
    },

    {
      selector: `edge[type = "${ObjectProperty}"], edge[type = "${InverseObjectProperty}"]`,
      style: {
        'line-color': theme.getColour(ColoursNames.object_property_contrast),
        'target-arrow-color': theme.getColour(ColoursNames.object_property_contrast),
        'source-arrow-color': theme.getColour(ColoursNames.object_property_contrast),
        'text-max-width': '60px'
      }
    },

    {
      selector: `node[type = "${Annotation}"]`,
      style: {
        'shape': 'ellipse',
        'height': 10,
        'width': 10,
        'background-color': theme.id === DefaultThemesEnum.GRAPHOL ? theme.getColour(ColoursNames.data_property) : '#EDCF9A',
        'border-color': theme.id === DefaultThemesEnum.GRAPHOL ? theme.getColour(ColoursNames.data_property_contrast) : '#DC8D00',
      }
    },

    {
      selector: `edge[type = "${Annotation}"]`,
      style: {
        'curve-style': 'straight',
        'target-arrow-shape': 'none',
        'line-color': theme.id === DefaultThemesEnum.GRAPHOL ? theme.getColour(ColoursNames.data_property_contrast) : '#DC8D00',
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
      selector: '.cdnd-drop-target[!isSuggestion]',
      style: {
        'background-color': theme.getColour(ColoursNames.bg_inset),
        'border-style': 'dashed',
        'border-color': theme.getColour(ColoursNames.accent_muted),
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

    {
      selector: ':active',
      style: {
        'overlay-opacity': 0.2,
        'overlay-padding': '4px',
        'overlay-color': theme.getColour(ColoursNames.accent_muted)
      }
    },

    //-----------------------------------------------------------
    // selected selector always last
    {
      selector: '.sparqling-selected',
      style: {
        'underlay-color': theme.getColour(ColoursNames.accent),
        'underlay-padding': '2.5px',
        'underlay-opacity': 1,
      }
    },
  ] as Stylesheet[]
}