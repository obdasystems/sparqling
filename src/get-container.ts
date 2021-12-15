export const grapholscape = getGrapholscapeContainer()
export const sparqlingQueryGraph = getQueryGraphContainer()
export const sparqlingQueryHead = getQueryHeadContainer()

function getGrapholscapeContainer(): HTMLDivElement {
  let container: HTMLDivElement = document.createElement('div')
  container.setAttribute('id', 'grapholscape')
  container.style.position = 'relative'
  container.style.height = '50%'
  return container
}

function getQueryGraphContainer(): HTMLDivElement {
  let container: HTMLDivElement = document.createElement('div')
  container.setAttribute('id', 'sparqling-query-graph')
  container.style.position = 'relative'
  container.style.height = '50%'
  container.style.width = '50%'
  return container
}

function getQueryHeadContainer(): HTMLDivElement {
  let container: HTMLDivElement = document.createElement('div')
  container.setAttribute('id', 'sparqling-query-head')
  container.style.position = 'relative'
  container.style.height = '50%'
  container.style.width = '50%'
  return container
}