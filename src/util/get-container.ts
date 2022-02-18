export const grapholscape = getGrapholscapeContainer()
export const bgpContainer = getBGPContainer()
export const leftColumnContainer = getLeftColumnContainer()

function getGrapholscapeContainer(): HTMLDivElement {
  let container: HTMLDivElement = document.createElement('div')
  container.setAttribute('id', 'grapholscape')
  container.style.position = 'relative'
  container.style.height = '100%'
  return container
}

function getBGPContainer(): HTMLDivElement {
  let container: HTMLDivElement = document.createElement('div')
  container.setAttribute('id', 'sparqling-query-graph')
  container.style.position = 'relative'
  container.style.height = '100%'
  container.style.width = '100%'
  return container
}

function getLeftColumnContainer(): HTMLDivElement {
  let container: HTMLDivElement = document.createElement('div')
  container.setAttribute('id', 'sparqling-left-column')
  container.style.position = 'absolute'
  container.style.left = '10px'
  container.style.top = '100%'
  container.style.transform = 'translate(0, calc(-100% - 10px))'
  container.style.display = 'flex'
  container.style.flexDirection = 'column'
  container.style.justifyContent = 'space-between'
  container.style.gap = '30px'
  container.style.height = 'calc(-80px + 100%)'
  container.style.pointerEvents = 'none'

  return container
}