export const grapholscape = getGrapholscapeContainer()
export const bgpContainer = getBGPContainer()
export const leftColumnContainer = getLeftColumnContainer()
export const tippyContainer = getTippyContainer()

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
  container.style.bottom = '0'
  container.style.display = 'flex'
  container.style.flexDirection = 'column-reverse'
  container.style.justifyContent = 'space-between'
  container.style.gap = '30px'
  container.style.height = '100%'
  container.style.boxSizing = 'border-box'
  container.style.marginTop = '70px'
  container.style.pointerEvents = 'none'
  container.style.width = '20%'
  container.style.zIndex = '1'

  return container
}

function getTippyContainer(): HTMLDivElement {
  let container = document.createElement('div')
  return container
}