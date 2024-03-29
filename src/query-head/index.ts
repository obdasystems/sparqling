import { HeadElement } from "../api/swagger"
import * as model from '../model'
import { HeadElementCallback, HeadElementRenameCallback } from "./qh-element-component"
import QueryHeadWidget from "./qh-widget"

const qhWidget = new QueryHeadWidget()

export { onElementSortChange } from './drag-sorting'
export { qhWidget as widget }

export function onDelete(callback: (headElement: HeadElement) => void) {
  qhWidget.onDelete( headElementId => {
    const headElement = model.getHeadElementByID(headElementId)
    if (headElement) callback(headElement)
  })
}

export function onRename(callback: HeadElementRenameCallback) {
  qhWidget.onRename( (headElementId: string, alias:string) => {
    callback(headElementId, alias)
  })
}

export function onLocalize(callback: (headElement: HeadElement) => void) {
  qhWidget.onLocalize( headElementId => {
    const headElement = model.getHeadElementByID(headElementId) 
    if (headElement) callback(headElement)
  })
}



export function render(newHead: HeadElement[]) {
  if (!newHead) return

  qhWidget.headElements = newHead
}


export function onAddFilter(callback: (headElementId: string) => void) {
  qhWidget.onAddFilter((headElementId) => {
    callback(headElementId)
  })
}

export function onEditFilter(callback: (filterId: number) => void) {
  qhWidget.onEditFilter(filterId => callback(filterId))
}

export function onDeleteFilter(callback: (filterId: number) => void) {
  qhWidget.onDeleteFilter(filterId => callback(filterId))
}

export function onAddFunction(callback: (headElementId: string) => void) {
  qhWidget.onAddFunction(headElementId => callback(headElementId))
}

export function onOrderByChange(callback: HeadElementCallback) {
  qhWidget.onOrderByChange(headElementId => callback(headElementId))
}

export function onAddAggregation(callback: (headElementId: string) => void) {
  qhWidget.onAddAggregation(headElementId => callback(headElementId))
}

export function onHighlightVariable(callback: HeadElementCallback) {
  qhWidget.onHighlightVariable(headElementId => callback(headElementId))
}

export function onResetHighlightOnVariable(callback: HeadElementCallback) {
  qhWidget.onResetHighlightOnVariable(headElemenId => callback(headElemenId))
}

