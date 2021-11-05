import GrapholScape from 'grapholscape'

export default function useGrapholscape(file) {
  document.getElementById('home').style.display = 'none';
  grapholscape_container.style.display = 'block';

  let g = new GrapholScape(file, grapholscape_container).then( grapholscape => grapholscape.showDiagram(0))
}
