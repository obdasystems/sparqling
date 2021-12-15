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
    selector: '[iri]',
    style: {
      'label': 'data(iri)',
      'font-size': '8px'
    }
  }, 
  
  {
    selector: 'edge[type = "dataProperty"]',
    style: {
      'width': 1,
      'curve-style': 'haystack'
    }
  },

  {
    selector: 'node[type = "dataProperty"]',
    style: {
      'height': 10,
      'width': 10
    }
  }
]