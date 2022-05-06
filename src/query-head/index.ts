import { HeadElement } from "../api/swagger";
import { code, refresh } from "../widgets/assets/icons";
import QueryHeadWidget from "./qh-widget";
import { UI } from "grapholscape"
import * as model from '../model'

const qhWidget = new QueryHeadWidget()

export {qhWidget as widget}

export function onDelete(callback: (headElement: HeadElement) => void) {
  qhWidget.onDelete( headElementId => callback(model.getHeadElementByID(headElementId)))
}

export function onRename(callback: (headElement: string, alias: string) => void) {
  qhWidget.onRename( (headElementId: string, alias:string) => {
    callback(headElementId, alias)
  })
}

export function onLocalize(callback: (headElement: HeadElement) => void) {
  qhWidget.onLocalize( headElementId => callback(model.getHeadElementByID(headElementId)))
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

export function onOrderByChange(callback: (headElementId: string) => void) {
  qhWidget.onOrderByChange(headElementId => callback(headElementId))
}

export function onAddAggregation(callback: (headElementId: string) => void) {
  qhWidget.onAddAggregation(headElementId => callback(headElementId))
}

export { onElementSortChange } from './drag-sorting'