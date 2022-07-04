
let sortChangedCallback: (headElementId: string, newIndex: number) => void
let dragging: HTMLElement
const dropIndicator = document.createElement('hr')
dropIndicator.style.width = '90%'
dropIndicator.style.opacity = '0.5'

export function onDragStart(event: DragEvent) {
  dragging = getDraggedComponent(event.target)
  dragging.classList.add('dragged')
  event.dataTransfer?.setData('text/plain', '')
}

export function onDragOver(event: DragEvent) {
  event.preventDefault()
  let target = getDraggedComponent(event.target)
  const bounding = target.getBoundingClientRect()
  const offset = bounding.y + (bounding.height / 2)
  if (event.clientY - offset > 0) {
    target.parentNode.insertBefore(dropIndicator, target.nextSibling)
  } else {
    target.parentNode.insertBefore(dropIndicator, target)
  }
}

export function onDragLeave(event: DragEvent) {
  dropIndicator.remove()
}

export function onDragEnd(event: DragEvent) {
  event.preventDefault()
  document.ondrop = null
  const elemsWrapper = dropIndicator.parentNode
  if (elemsWrapper) {
    elemsWrapper.replaceChild(dragging, dropIndicator)
    setTimeout(() => dragging.classList.remove('dragged'), 100)
    const draggedElemNewIndex = getDraggedElemNewIndex()
    if (draggedElemNewIndex)
      sortChangedCallback((dragging as any)._id, draggedElemNewIndex)
  } else {
    dropIndicator.remove()
  }
}

export function allowDrop(event) {
  event.preventDefault()
}

export function onElementSortChange(callback: (headElementId: string, newIndex: number) => void) {
  sortChangedCallback = callback
}

function getDraggedComponent(originalTarget) {
  while (originalTarget.nodeName !== 'HEAD-ELEMENT' && originalTarget.nodeName !== 'body') {
    originalTarget = originalTarget.parentNode
  }

  return originalTarget.nodeName === 'HEAD-ELEMENT' ? originalTarget : null
}


function getDraggedElemNewIndex() {
  const elemsWrapper = dragging.parentNode
  if (elemsWrapper) {
    let count = 0
    for (const child of elemsWrapper.children) {
      if (child === dragging) {
        return count
      }
      count += 1
    }
  }

  return null
}