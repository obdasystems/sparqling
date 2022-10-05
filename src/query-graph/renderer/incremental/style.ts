import { ColoursNames, GrapholscapeTheme, GrapholTypesEnum } from "grapholscape"
import { Stylesheet } from "cytoscape"

export default function getIncrementalStyle(theme: GrapholscapeTheme) {
  return [
    {
      selector: '[?isSuggestion][displayedName]',
      style: {
        'label': 'data(displayedName)',
        'border-width': 1,
      }
    },
    {
      selector: '.faded',
      style: {
        'opacity': 0.4,
      }
    },
    {
      selector: `node[?isSuggestion][type = "${GrapholTypesEnum.CLASS}"]`,
      style: {
        'width': 60,
        'height': 60,
        'background-color': theme.getColour(ColoursNames.class),
        'border-color': theme.getColour(ColoursNames.class_contrast),
        'text-margin-x': 0,
        'text-margin-y': 0,
        'text-valign': 'center',
        'text-halign': 'center',
      }
    },

    {
      selector: `node[?isSuggestion][type = "${GrapholTypesEnum.DATA_PROPERTY}"]`,
      style: {
        'width': 10,
        'height': 10,
        'background-color': theme.getColour(ColoursNames.data_property),
        'border-color': theme.getColour(ColoursNames.data_property_contrast),
      }
    },

    {
      selector: `edge[type = "${GrapholTypesEnum.DATA_PROPERTY}"]`,
      style: {
        'line-style': 'solid',
        'target-arrow-shape': 'none',
        'line-color': theme.getColour(ColoursNames.data_property_contrast),
      }
    },

  ] as Stylesheet[]
}