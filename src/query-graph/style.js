import { EntityTypeEnum } from "../api/swagger/models"

const { DataProperty } = EntityTypeEnum
export default [
  {
    selector: 'node',
    style: {
      'text-halign': 'center',
      'text-valign': 'bottom',
    }
  },  
  {
    selector: 'edge',
    style: {
      'line-style': 'solid',
      'target-arrow-shape': 'triangle',
      'target-arrow-fill': 'filled',
      'curve-style': 'straight',
      'text-rotation': 'autorotate',
      'text-margin-y': -10,
      
    }
  },

  {
    selector: '[displayed_name]',
    style: {
      'text-wrap': 'wrap',
      'text-max-width': '50px',
      'text-overflow-wrap': 'anywhere',
      'label': 'data(displayed_name)',
      'font-size': '8px'
    }
  },
  
  {
    selector: `edge[type = "${DataProperty}"]`,
    style: {
      'width': 1,
      'curve-style': 'haystack'
    }
  },

  {
    selector: `node[type = "${DataProperty}"]`,
    style: {
      'height': 10,
      'width': 10
    }
  }
]